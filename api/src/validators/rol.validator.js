const Joi = require('joi');

const createRolSchema = Joi.object({
  nombre_rol: Joi.string().min(3).max(50).required()
    .messages({
      'string.empty': 'El nombre del rol es requerido',
      'any.required': 'El nombre del rol es requerido',
    }),
  descripcion: Joi.string().max(200).allow('', null).optional(),
}).options({ stripUnknown: true });

const asignarRolSchema = Joi.object({
  id_persona: Joi.number().integer().positive().required()
    .messages({
      'any.required': 'El ID de la persona es requerido',
    }),
}).options({ stripUnknown: true });

module.exports = {
  createRolSchema,
  asignarRolSchema,
};
