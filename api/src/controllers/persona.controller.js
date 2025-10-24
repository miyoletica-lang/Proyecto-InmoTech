const personaService = require('../services/persona.service');

class PersonaController {
  async getProfile(req, res, next) {
    try {
      const result = await personaService.getProfile(req.user.id_persona);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await personaService.updateProfile(req.user.id_persona, req.body);

      res.status(200).json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async buscarPersona(req, res, next) {
    try {
      const { tipo_documento, numero_documento } = req.query;

      if (!tipo_documento || !numero_documento) {
        return res.status(400).json({
          success: false,
          message: 'tipo_documento y numero_documento son requeridos',
        });
      }

      const result = await personaService.buscarPersona(tipo_documento, numero_documento);

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

module.exports = new PersonaController();
