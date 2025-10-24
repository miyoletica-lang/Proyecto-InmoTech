const inmuebleService = require('../services/inmueble.service');

class InmuebleController {
  async createInmueble(req, res, next) {
    try {
      const result = await inmuebleService.createInmueble(req.body, req.user.id_persona);

      res.status(201).json({
        success: true,
        message: 'Inmueble creado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInmuebles(req, res, next) {
    try {
      const filters = {
        ciudad: req.query.ciudad,
        precioMin: req.query.precioMin,
        precioMax: req.query.precioMax,
        areaMin: req.query.areaMin,
        areaMax: req.query.areaMax,
        categoria: req.query.categoria,
        estado: req.query.estado,
      };

      const result = await inmuebleService.getInmuebles(filters);

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

  async getInmuebleById(req, res, next) {
    try {
      const result = await inmuebleService.getInmuebleById(req.params.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateInmueble(req, res, next) {
    try {
      const result = await inmuebleService.updateInmueble(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Inmueble actualizado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDisponibilidad(req, res, next) {
    try {
      const { fecha } = req.query;

      if (!fecha) {
        return res.status(400).json({
          success: false,
          message: 'La fecha es requerida',
        });
      }

      const result = await inmuebleService.getDisponibilidad(req.params.id, fecha);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InmuebleController();
