const notificacionService = require('../services/notificacion.service');

class NotificacionController {
  async getNotificaciones(req, res, next) {
    try {
      const filters = {
        idRol: req.query.idRol,
        idPersona: req.query.idPersona,
      };

      const result = await notificacionService.getNotificaciones(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async marcarLeida(req, res, next) {
    try {
      const result = await notificacionService.marcarLeida(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Notificación marcada como leída',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getContadorNoLeidas(req, res, next) {
    try {
      const idPersona = req.query.idPersona || req.user?.id_persona;
      const idRol = req.query.idRol;

      const result = await notificacionService.getContadorNoLeidas(idPersona, idRol);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificacionController();
