const { Reporte, Inmueble, Persona } = require('../models');
const logger = require('../utils/logger');

class ReporteService {
  async createReporte(data, idPersonaReporta) {
    try {
      const inmueble = await Inmueble.findByPk(data.id_inmueble);

      if (!inmueble) {
        throw { statusCode: 404, message: 'Inmueble no encontrado' };
      }

      const reporte = await Reporte.create({
        ...data,
        id_persona_reporta: idPersonaReporta,
      });

      logger.info(`Reporte creado: ${reporte.id_reporte} por persona ${idPersonaReporta}`);

      return await this.getReporteById(reporte.id_reporte);
    } catch (error) {
      logger.error('Error al crear reporte:', error);
      throw error;
    }
  }

  async getReportes(filters = {}) {
    try {
      const where = {};

      if (filters.estado) {
        where.estado = filters.estado;
      }

      if (filters.prioridad) {
        where.prioridad = filters.prioridad;
      }

      if (filters.tipo_reporte) {
        where.tipo_reporte = filters.tipo_reporte;
      }

      const reportes = await Reporte.findAll({
        where,
        include: [
          {
            model: Inmueble,
            as: 'inmueble',
            attributes: ['id_inmueble', 'direccion', 'ciudad'],
          },
          {
            model: Persona,
            as: 'persona_reporta',
            attributes: ['id_persona', 'primer_nombre', 'primer_apellido', 'correo'],
          },
        ],
        order: [['fecha_creacion', 'DESC']],
      });

      return reportes;
    } catch (error) {
      logger.error('Error al obtener reportes:', error);
      throw error;
    }
  }

  async getReporteById(idReporte) {
    try {
      const reporte = await Reporte.findByPk(idReporte, {
        include: [
          {
            model: Inmueble,
            as: 'inmueble',
          },
          {
            model: Persona,
            as: 'persona_reporta',
          },
        ],
      });

      if (!reporte) {
        throw { statusCode: 404, message: 'Reporte no encontrado' };
      }

      return reporte;
    } catch (error) {
      logger.error('Error al obtener reporte:', error);
      throw error;
    }
  }

  async updateReporte(idReporte, data) {
    try {
      const reporte = await Reporte.findByPk(idReporte);

      if (!reporte) {
        throw { statusCode: 404, message: 'Reporte no encontrado' };
      }

      await reporte.update(data);

      logger.info(`Reporte ${idReporte} actualizado`);

      return await this.getReporteById(idReporte);
    } catch (error) {
      logger.error('Error al actualizar reporte:', error);
      throw error;
    }
  }
}

module.exports = new ReporteService();
