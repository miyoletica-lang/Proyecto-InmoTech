const { Inmueble, PropiedadInmueble, Persona, Cita, EstadoCita, PersonaRol, Rol } = require('../models');
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class InmuebleService {
  async createInmueble(data, idPersona) {
    const transaction = await sequelize.transaction();

    try {
      const inmueble = await Inmueble.create(data, { transaction });

      await PropiedadInmueble.create(
        {
          id_inmueble: inmueble.id_inmueble,
          id_persona: idPersona,
          fecha_inicio: new Date(),
          estado: 'Activo',
        },
        { transaction }
      );

      const persona = await Persona.findByPk(idPersona, {
        include: [
          {
            model: Rol,
            as: 'roles',
            through: {
              where: { estado: true },
              attributes: [],
            },
          },
        ],
        transaction,
      });

      const esUsuario = persona.roles.some((rol) => rol.nombre_rol === 'Usuario');
      const esPropietario = persona.roles.some((rol) => rol.nombre_rol === 'Propietario');

      if (esUsuario && !esPropietario) {
        const rolPropietario = await Rol.findOne({
          where: { nombre_rol: 'Propietario' },
        });

        if (rolPropietario) {
          await PersonaRol.create(
            {
              id_persona: idPersona,
              id_rol: rolPropietario.id_rol,
              estado: true,
            },
            { transaction }
          );

          logger.info(`Usuario ${idPersona} promovido a Propietario`);
        }
      }

      await transaction.commit();

      logger.info(`Inmueble creado: ${inmueble.id_inmueble} por persona ${idPersona}`);

      return inmueble;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error al crear inmueble:', error);
      throw error;
    }
  }

  async getInmuebles(filters = {}) {
    try {
      const where = {};

      if (filters.ciudad) {
        where.ciudad = { [Op.like]: `%${filters.ciudad}%` };
      }

      if (filters.precioMin || filters.precioMax) {
        where.precio_venta = {};
        if (filters.precioMin) {
          where.precio_venta[Op.gte] = filters.precioMin;
        }
        if (filters.precioMax) {
          where.precio_venta[Op.lte] = filters.precioMax;
        }
      }

      if (filters.areaMin || filters.areaMax) {
        where.area_construida = {};
        if (filters.areaMin) {
          where.area_construida[Op.gte] = filters.areaMin;
        }
        if (filters.areaMax) {
          where.area_construida[Op.lte] = filters.areaMax;
        }
      }

      if (filters.categoria) {
        where.categoria = filters.categoria;
      }

      if (filters.estado) {
        where.estado = filters.estado;
      }

      const inmuebles = await Inmueble.findAll({
        where,
        order: [['fecha_registro', 'DESC']],
      });

      return inmuebles;
    } catch (error) {
      logger.error('Error al obtener inmuebles:', error);
      throw error;
    }
  }

  async getInmuebleById(idInmueble) {
    try {
      const inmueble = await Inmueble.findByPk(idInmueble, {
        include: [
          {
            model: PropiedadInmueble,
            as: 'propietarios',
            where: { estado: 'Activo' },
            required: false,
            include: [
              {
                model: Persona,
                as: 'persona',
                attributes: ['id_persona', 'primer_nombre', 'primer_apellido', 'correo', 'telefono'],
              },
            ],
          },
        ],
      });

      if (!inmueble) {
        throw { statusCode: 404, message: 'Inmueble no encontrado' };
      }

      return inmueble;
    } catch (error) {
      logger.error('Error al obtener inmueble:', error);
      throw error;
    }
  }

  async updateInmueble(idInmueble, data) {
    try {
      const inmueble = await Inmueble.findByPk(idInmueble);

      if (!inmueble) {
        throw { statusCode: 404, message: 'Inmueble no encontrado' };
      }

      await inmueble.update(data);

      logger.info(`Inmueble ${idInmueble} actualizado`);

      return inmueble;
    } catch (error) {
      logger.error('Error al actualizar inmueble:', error);
      throw error;
    }
  }

  async getDisponibilidad(idInmueble, fecha) {
    try {
      const inmueble = await Inmueble.findByPk(idInmueble);

      if (!inmueble) {
        throw { statusCode: 404, message: 'Inmueble no encontrado' };
      }

      const estadosOcupados = await EstadoCita.findAll({
        where: {
          nombre_estado: {
            [Op.notIn]: ['Completada', 'Cancelada'],
          },
        },
      });

      const idsEstadosOcupados = estadosOcupados.map((e) => e.id_estado_cita);

      const citasOcupadas = await Cita.findAll({
        where: {
          id_inmueble: idInmueble,
          fecha_cita: fecha,
          id_estado_cita: {
            [Op.in]: idsEstadosOcupados,
          },
        },
        order: [['hora_inicio', 'ASC']],
      });

      const horariosOcupados = citasOcupadas.map((cita) => ({
        hora_inicio: cita.hora_inicio,
        hora_fin: cita.hora_fin,
      }));

      return {
        fecha,
        horariosOcupados,
      };
    } catch (error) {
      logger.error('Error al obtener disponibilidad:', error);
      throw error;
    }
  }
}

module.exports = new InmuebleService();
