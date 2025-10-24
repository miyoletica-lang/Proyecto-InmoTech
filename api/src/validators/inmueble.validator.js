const Joi = require('joi');

const createInmuebleSchema = Joi.object({
  registro_inmobiliario: Joi.string().min(5).max(50).required()
    .messages({
      'string.empty': 'El registro inmobiliario es requerido',
      'any.required': 'El registro inmobiliario es requerido',
    }),
  pais: Joi.string().min(2).max(50).required()
    .messages({
      'any.required': 'El país es requerido',
    }),
  departamento: Joi.string().min(2).max(50).required()
    .messages({
      'any.required': 'El departamento es requerido',
    }),
  ciudad: Joi.string().min(2).max(50).required()
    .messages({
      'any.required': 'La ciudad es requerida',
    }),
  direccion: Joi.string().min(5).max(100).required()
    .messages({
      'any.required': 'La dirección es requerida',
    }),
  categoria: Joi.string().max(50).allow('', null).optional(),
  precio_venta: Joi.number().positive().allow(null).optional(),
  area_construida: Joi.number().positive().allow(null).optional(),
  descripcion: Joi.string().max(2000).allow('', null).optional(),
  estado: Joi.string().valid('Disponible', 'Vendido', 'Alquilado', 'En proceso').optional(),
}).options({ stripUnknown: true });

const updateInmuebleSchema = Joi.object({
  pais: Joi.string().min(2).max(50).optional(),
  departamento: Joi.string().min(2).max(50).optional(),
  ciudad: Joi.string().min(2).max(50).optional(),
  direccion: Joi.string().min(5).max(100).optional(),
  categoria: Joi.string().max(50).allow('', null).optional(),
  precio_venta: Joi.number().positive().allow(null).optional(),
  area_construida: Joi.number().positive().allow(null).optional(),
  descripcion: Joi.string().max(2000).allow('', null).optional(),
  estado: Joi.string().valid('Disponible', 'Vendido', 'Alquilado', 'En proceso').optional(),
}).options({ stripUnknown: true });

module.exports = {
  createInmuebleSchema,
  updateInmuebleSchema,
};
