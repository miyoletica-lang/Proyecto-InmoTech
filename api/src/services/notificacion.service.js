const { Notificacion, Cita, Rol, Persona } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class NotificacionService {
  async getNotificaciones(filters = {}) {
    try {
      const where = { leida: false };

      if (filters.idRol) {
        where.id_rol_destino = filters.idRol;
      }

      if (filters.idPersona) {
        where.id_persona_destino = filters.idPersona;
      }

      const notificaciones = await Notificacion.findAll({
        where,
        include: [
          {
            model: Cita,
            as: 'cita',
            required: false,
          },
        ],
        order: [['fecha_creacion', 'DESC']],
        limit: 50,
      });

      return notificaciones;
    } catch (error) {
      logger.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  async marcarLeida(idNotificacion) {
    try {
      const notificacion = await Notificacion.findByPk(idNotificacion);

      if (!notificacion) {
        throw { statusCode: 404, message: 'Notificación no encontrada' };
      }

      await notificacion.update({ leida: true });

      logger.info(`Notificación ${idNotificacion} marcada como leída`);

      return notificacion;
    } catch (error) {
      logger.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  async getContadorNoLeidas(idPersona = null, idRol = null) {
    try {
      const where = { leida: false };

      if (idPersona) {
        where.id_persona_destino = idPersona;
      }

      if (idRol) {
        where.id_rol_destino = idRol;
      }

      const count = await Notificacion.count({ where });

      return { count };
    } catch (error) {
      logger.error('Error al contar notificaciones:', error);
      throw error;
    }
  }
}

module.exports = new NotificacionService();
