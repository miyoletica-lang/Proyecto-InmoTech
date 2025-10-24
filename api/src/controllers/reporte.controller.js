const reporteService = require('../services/reporte.service');

class ReporteController {
  async createReporte(req, res, next) {
    try {
      const result = await reporteService.createReporte(req.body, req.user.id_persona);

      res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getReportes(req, res, next) {
    try {
      const filters = {
        estado: req.query.estado,
        prioridad: req.query.prioridad,
        tipo_reporte: req.query.tipo_reporte,
      };

      const result = await reporteService.getReportes(filters);

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          total: result.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getReporteById(req, res, next) {
    try {
      const result = await reporteService.getReporteById(req.params.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReporte(req, res, next) {
    try {
      const result = await reporteService.updateReporte(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Reporte actualizado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReporteController();
