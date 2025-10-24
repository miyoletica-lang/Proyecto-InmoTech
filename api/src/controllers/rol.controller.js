const rolService = require('../services/rol.service');

class RolController {
  async createRol(req, res, next) {
    try {
      const result = await rolService.createRol(req.body);

      res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRoles(req, res, next) {
    try {
      const result = await rolService.getRoles();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async asignarRol(req, res, next) {
    try {
      const { id_persona } = req.body;
      const result = await rolService.asignarRol(req.params.idRol, id_persona);

      res.status(200).json({
        success: true,
        message: 'Rol asignado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RolController();
