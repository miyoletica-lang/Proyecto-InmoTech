const citaService = require('../services/cita.service');

class CitaController {
  async createCita(req, res, next) {
    try {
      const result = await citaService.createCita(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCitas(req, res, next) {
    try {
      const filters = {
        estado: req.query.estado,
        fecha: req.query.fecha,
        agente: req.query.agente,
      };

      const result = await citaService.getCitas(filters);

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

  async getCitaById(req, res, next) {
    try {
      const result = await citaService.getCitaById(req.params.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmarCita(req, res, next) {
    try {
      const agenteId = req.body.id_agente_asignado || req.user.id_persona;
      const result = await citaService.confirmarCita(req.params.id, agenteId);

      res.status(200).json({
        success: true,
        message: 'Cita confirmada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelarCita(req, res, next) {
    try {
      const { motivo_cancelacion } = req.body;
      const result = await citaService.cancelarCita(
        req.params.id,
        motivo_cancelacion,
        req.user.id_persona
      );

      res.status(200).json({
        success: true,
        message: 'Cita cancelada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async reagendarCita(req, res, next) {
    try {
      const { fecha_cita, hora_inicio, hora_fin, observaciones } = req.body;
      const result = await citaService.reagendarCita(
        req.params.id,
        fecha_cita,
        hora_inicio,
        hora_fin,
        observaciones
      );

      res.status(200).json({
        success: true,
        message: 'Cita reagendada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async completarCita(req, res, next) {
    try {
      const result = await citaService.completarCita(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Cita completada exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPersona(req, res, next) {
    try {
      const { tipo_documento, numero_documento } = req.query;
      const result = await citaService.buscarPersona(tipo_documento, numero_documento);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Persona no encontrada',
        });
      }

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CitaController();
