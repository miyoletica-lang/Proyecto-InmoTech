const Joi = require('joi');

const updateProfileSchema = Joi.object({
  primer_nombre: Joi.string().min(2).max(50).optional(),
  segundo_nombre: Joi.string().max(50).allow('', null).optional(),
  primer_apellido: Joi.string().min(2).max(50).optional(),
  segundo_apellido: Joi.string().max(50).allow('', null).optional(),
  telefono: Joi.string().min(7).max(20).optional(),
}).options({ stripUnknown: true });

module.exports = {
  updateProfileSchema,
};
