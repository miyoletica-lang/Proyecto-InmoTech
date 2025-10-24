const Joi = require('joi');

const createReporteSchema = Joi.object({
  id_inmueble: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'El inmueble es requerido',
    }),
  tipo_reporte: Joi.string().max(50).required()
    .messages({
      'any.required': 'El tipo de reporte es requerido',
    }),
  titulo: Joi.string().min(5).max(200).required()
    .messages({
      'any.required': 'El título es requerido',
    }),
  descripcion: Joi.string().min(10).max(2000).required()
    .messages({
      'string.min': 'La descripción debe tener al menos 10 caracteres',
      'any.required': 'La descripción es requerida',
    }),
  prioridad: Joi.string().valid('Baja', 'Media', 'Alta', 'Crítica').optional(),
}).options({ stripUnknown: true });

const updateReporteSchema = Joi.object({
  estado: Joi.string().valid('Pendiente', 'En progreso', 'Resuelto', 'Cerrado').optional(),
  prioridad: Joi.string().valid('Baja', 'Media', 'Alta', 'Crítica').optional(),
}).options({ stripUnknown: true });

module.exports = {
  createReporteSchema,
  updateReporteSchema,
};
