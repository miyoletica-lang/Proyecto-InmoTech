const { Persona, Cita, Inmueble, ServicioCita, EstadoCita, Rol, Notificacion } = require('../models');
const { sequelize } = require('../config/database');
const { formatPhoneNumber, buildFullName } = require('../utils/helpers');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class CitaService {
  async createCita(data, usuarioCreador = null) {
    const transaction = await sequelize.transaction();

    try {
      const {
        tipo_documento,
        numero_documento,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        correo,
        telefono,
        id_inmueble,
        id_servicio,
        fecha_cita,
        hora_inicio,
        hora_fin,
        observaciones,
      } = data;

      const inmueble = await Inmueble.findByPk(id_inmueble);
      if (!inmueble) {
        throw { statusCode: 404, message: 'Inmueble no encontrado' };
      }

      const [persona, created] = await Persona.findOrCreate({
        where: {
          tipo_documento,
          numero_documento,
        },
        defaults: {
          tipo_documento,
          numero_documento,
          primer_nombre,
          segundo_nombre: segundo_nombre || null,
          primer_apellido,
          segundo_apellido: segundo_apellido || null,
          correo,
          telefono: formatPhoneNumber(telefono),
          tiene_cuenta: false,
          estado: true,
        },
        transaction,
      });

      if (!created) {
        await persona.update(
          {
            primer_nombre,
            segundo_nombre: segundo_nombre || null,
            primer_apellido,
            segundo_apellido: segundo_apellido || null,
            correo,
            telefono: formatPhoneNumber(telefono),
          },
          { transaction }
        );
      }

      const citasConflicto = await Cita.findAll({
        where: {
          id_inmueble,
          fecha_cita,
          id_estado_cita: {
            [Op.notIn]: await this._getEstadosFinalesIds(),
          },
          [Op.or]: [
            {
              hora_inicio: {
                [Op.lt]: hora_fin,
              },
              hora_fin: {
                [Op.gt]: hora_inicio,
              },
            },
          ],
        },
        transaction,
      });

      if (citasConflicto.length > 0) {
        throw {
          statusCode: 409,
          message: 'Ya existe una cita en ese horario para este inmueble',
        };
      }

      let servicioId = id_servicio;
      if (!servicioId) {
        const servicioDefault = await ServicioCita.findOne({
          where: { nombre_servicio: 'Visita a Propiedad' },
        });
        servicioId = servicioDefault?.id_servicio || 1;
      }

      const estadoSolicitada = await EstadoCita.findOne({
        where: { nombre_estado: 'Solicitada' },
      });

      const cita = await Cita.create(
        {
          id_persona: persona.id_persona,
          id_inmueble,
          id_servicio: servicioId,
          id_usuario_creador: usuarioCreador?.id_persona || null,
          fecha_cita,
          hora_inicio,
          hora_fin,
          id_estado_cita: estadoSolicitada?.id_estado_cita || 1,
          observaciones,
        },
        { transaction }
      );

      const rolesAdmin = await Rol.findAll({
        where: {
          nombre_rol: {
            [Op.in]: ['Super Administrador', 'Administrador', 'Empleado'],
          },
        },
      });

      const notificaciones = rolesAdmin.map((rol) => ({
        tipo_notificacion: 'nueva_cita',
        titulo: 'Nueva cita solicitada',
        mensaje: `${buildFullName(persona)} ha solicitado una cita para ${inmueble.direccion} el ${fecha_cita} a las ${hora_inicio}`,
        id_cita: cita.id_cita,
        id_rol_destino: rol.id_rol,
        leida: false,
      }));

      await Notificacion.bulkCreate(notificaciones, { transaction });

      await transaction.commit();

      logger.info(`Cita creada: ID ${cita.id_cita} por ${persona.correo}`);

      return await this.getCitaById(cita.id_cita);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al crear cita:', error);
      throw error;
    }
  }

  async getCitas(filters = {}) {
    try {
      const where = {};

      if (filters.estado) {
        const estado = await EstadoCita.findOne({
          where: { nombre_estado: filters.estado },
        });
        if (estado) {
          where.id_estado_cita = estado.id_estado_cita;
        }
      }

      if (filters.fecha) {
        where.fecha_cita = filters.fecha;
      }

      if (filters.agente) {
        where.id_agente_asignado = filters.agente;
      }

      const citas = await Cita.findAll({
        where,
        include: [
          {
            model: Persona,
            as: 'cliente',
            attributes: ['id_persona', 'primer_nombre', 'primer_apellido', 'correo', 'telefono'],
          },
          {
            model: Inmueble,
            as: 'inmueble',
            attributes: ['id_inmueble', 'direccion', 'ciudad', 'categoria'],
          },
          {
            model: ServicioCita,
            as: 'servicio',
            attributes: ['id_servicio', 'nombre_servicio'],
          },
          {
            model: EstadoCita,
            as: 'estado',
            attributes: ['id_estado_cita', 'nombre_estado'],
          },
          {
            model: Persona,
            as: 'agente',
            attributes: ['id_persona', 'primer_nombre', 'primer_apellido'],
            required: false,
          },
        ],
        order: [['fecha_cita', 'DESC'], ['hora_inicio', 'DESC']],
      });

      return citas;
    } catch (error) {
      logger.error('Error al obtener citas:', error);
      throw error;
    }
  }

  async getCitaById(idCita) {
    try {
      const cita = await Cita.findByPk(idCita, {
        include: [
          {
            model: Persona,
            as: 'cliente',
          },
          {
            model: Inmueble,
            as: 'inmueble',
          },
          {
            model: ServicioCita,
            as: 'servicio',
          },
          {
            model: EstadoCita,
            as: 'estado',
          },
          {
            model: Persona,
            as: 'agente',
            required: false,
          },
          {
            model: Persona,
            as: 'creador',
            required: false,
          },
        ],
      });

      if (!cita) {
        throw { statusCode: 404, message: 'Cita no encontrada' };
      }

      return cita;
    } catch (error) {
      logger.error('Error al obtener cita:', error);
      throw error;
    }
  }

  async confirmarCita(idCita, agenteId) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(idCita, { transaction });

      if (!cita) {
        throw { statusCode: 404, message: 'Cita no encontrada' };
      }

      const estadoConfirmada = await EstadoCita.findOne({
        where: { nombre_estado: 'Confirmada' },
      });

      await cita.update(
        {
          id_estado_cita: estadoConfirmada.id_estado_cita,
          id_agente_asignado: agenteId,
          fecha_confirmacion: new Date(),
        },
        { transaction }
      );

      await Notificacion.update(
        { leida: true },
        {
          where: {
            id_cita: idCita,
            id_rol_destino: { [Op.not]: null },
          },
          transaction,
        }
      );

      await Notificacion.create(
        {
          tipo_notificacion: 'cita_confirmada',
          titulo: 'Cita confirmada',
          mensaje: `Su cita para el ${cita.fecha_cita} a las ${cita.hora_inicio} ha sido confirmada`,
          id_cita: idCita,
          id_persona_destino: cita.id_persona,
          leida: false,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Cita ${idCita} confirmada por agente ${agenteId}`);

      return await this.getCitaById(idCita);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al confirmar cita:', error);
      throw error;
    }
  }

  async cancelarCita(idCita, motivoCancelacion, usuarioId) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(idCita, { transaction });

      if (!cita) {
        throw { statusCode: 404, message: 'Cita no encontrada' };
      }

      const estadoCancelada = await EstadoCita.findOne({
        where: { nombre_estado: 'Cancelada' },
      });

      await cita.update(
        {
          id_estado_cita: estadoCancelada.id_estado_cita,
          motivo_cancelacion: motivoCancelacion,
          fecha_cancelacion: new Date(),
        },
        { transaction }
      );

      await Notificacion.create(
        {
          tipo_notificacion: 'cita_cancelada',
          titulo: 'Cita cancelada',
          mensaje: `La cita del ${cita.fecha_cita} a las ${cita.hora_inicio} ha sido cancelada. Motivo: ${motivoCancelacion}`,
          id_cita: idCita,
          id_persona_destino: cita.id_persona,
          leida: false,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Cita ${idCita} cancelada por usuario ${usuarioId}`);

      return await this.getCitaById(idCita);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al cancelar cita:', error);
      throw error;
    }
  }

  async reagendarCita(idCita, nuevaFecha, nuevaHoraInicio, nuevaHoraFin, observaciones) {
    const transaction = await sequelize.transaction();

    try {
      const citaOriginal = await Cita.findByPk(idCita, { transaction });

      if (!citaOriginal) {
        throw { statusCode: 404, message: 'Cita no encontrada' };
      }

      const citasConflicto = await Cita.findAll({
        where: {
          id_inmueble: citaOriginal.id_inmueble,
          fecha_cita: nuevaFecha,
          id_estado_cita: {
            [Op.notIn]: await this._getEstadosFinalesIds(),
          },
          id_cita: { [Op.ne]: idCita },
          [Op.or]: [
            {
              hora_inicio: {
                [Op.lt]: nuevaHoraFin,
              },
              hora_fin: {
                [Op.gt]: nuevaHoraInicio,
              },
            },
          ],
        },
        transaction,
      });

      if (citasConflicto.length > 0) {
        throw {
          statusCode: 409,
          message: 'Ya existe una cita en ese horario para este inmueble',
        };
      }

      const estadoReagendada = await EstadoCita.findOne({
        where: { nombre_estado: 'Reagendada' },
      });

      await citaOriginal.update(
        {
          id_estado_cita: estadoReagendada.id_estado_cita,
        },
        { transaction }
      );

      const estadoSolicitada = await EstadoCita.findOne({
        where: { nombre_estado: 'Solicitada' },
      });

      const nuevaCita = await Cita.create(
        {
          id_persona: citaOriginal.id_persona,
          id_inmueble: citaOriginal.id_inmueble,
          id_servicio: citaOriginal.id_servicio,
          id_usuario_creador: citaOriginal.id_usuario_creador,
          fecha_cita: nuevaFecha,
          hora_inicio: nuevaHoraInicio,
          hora_fin: nuevaHoraFin,
          id_estado_cita: estadoSolicitada.id_estado_cita,
          id_agente_asignado: citaOriginal.id_agente_asignado,
          observaciones,
          es_reagendada: true,
          id_cita_original: idCita,
        },
        { transaction }
      );

      await Notificacion.create(
        {
          tipo_notificacion: 'cita_reagendada',
          titulo: 'Cita reagendada',
          mensaje: `Su cita ha sido reagendada para el ${nuevaFecha} a las ${nuevaHoraInicio}`,
          id_cita: nuevaCita.id_cita,
          id_persona_destino: citaOriginal.id_persona,
          leida: false,
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Cita ${idCita} reagendada. Nueva cita: ${nuevaCita.id_cita}`);

      return await this.getCitaById(nuevaCita.id_cita);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al reagendar cita:', error);
      throw error;
    }
  }

  async completarCita(idCita) {
    const transaction = await sequelize.transaction();

    try {
      const cita = await Cita.findByPk(idCita, { transaction });

      if (!cita) {
        throw { statusCode: 404, message: 'Cita no encontrada' };
      }

      const estadoCompletada = await EstadoCita.findOne({
        where: { nombre_estado: 'Completada' },
      });

      await cita.update(
        {
          id_estado_cita: estadoCompletada.id_estado_cita,
          fecha_completada: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      logger.info(`Cita ${idCita} completada`);

      return await this.getCitaById(idCita);
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al completar cita:', error);
      throw error;
    }
  }

  async buscarPersona(tipoDocumento, numeroDocumento) {
    try {
      const persona = await Persona.findOne({
        where: {
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
        },
      });

      return persona;
    } catch (error) {
      logger.error('Error al buscar persona:', error);
      throw error;
    }
  }

  async _getEstadosFinalesIds() {
    const estados = await EstadoCita.findAll({
      where: {
        nombre_estado: {
          [Op.in]: ['Completada', 'Cancelada'],
        },
      },
    });

    return estados.map((e) => e.id_estado_cita);
  }
}

module.exports = new CitaService();
