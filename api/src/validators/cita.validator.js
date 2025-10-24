const Joi = require('joi');

const createCitaSchema = Joi.object({
  tipo_documento: Joi.string().valid('CC', 'CE', 'NIT', 'Pasaporte', 'TI').required()
    .messages({
      'any.only': 'El tipo de documento debe ser CC, CE, NIT, Pasaporte o TI',
      'any.required': 'El tipo de documento es requerido',
    }),
  numero_documento: Joi.string().min(5).max(20).required()
    .messages({
      'string.empty': 'El número de documento es requerido',
      'any.required': 'El número de documento es requerido',
    }),
  primer_nombre: Joi.string().min(2).max(50).required()
    .messages({
      'string.empty': 'El primer nombre es requerido',
      'any.required': 'El primer nombre es requerido',
    }),
  segundo_nombre: Joi.string().max(50).allow('', null).optional(),
  primer_apellido: Joi.string().min(2).max(50).required()
    .messages({
      'string.empty': 'El primer apellido es requerido',
      'any.required': 'El primer apellido es requerido',
    }),
  segundo_apellido: Joi.string().max(50).allow('', null).optional(),
  correo: Joi.string().email().required()
    .messages({
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido',
    }),
  telefono: Joi.string().min(7).max(20).required()
    .messages({
      'any.required': 'El teléfono es requerido',
    }),
  id_inmueble: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'El ID del inmueble debe ser un número',
      'any.required': 'El inmueble es requerido',
    }),
  id_servicio: Joi.number().integer().positive().optional(),
  fecha_cita: Joi.date().iso().min('now').required()
    .messages({
      'date.min': 'La fecha de la cita no puede ser en el pasado',
      'any.required': 'La fecha de la cita es requerida',
    }),
  hora_inicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener formato HH:mm',
      'any.required': 'La hora de inicio es requerida',
    }),
  hora_fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
    .messages({
      'string.pattern.base': 'La hora de fin debe tener formato HH:mm',
      'any.required': 'La hora de fin es requerida',
    }),
  observaciones: Joi.string().max(1000).allow('', null).optional(),
}).options({ stripUnknown: true });

const confirmarCitaSchema = Joi.object({
  id_agente_asignado: Joi.number().integer().positive().optional(),
}).options({ stripUnknown: true });

const cancelarCitaSchema = Joi.object({
  motivo_cancelacion: Joi.string().min(10).max(500).required()
    .messages({
      'string.empty': 'El motivo de cancelación es requerido',
      'string.min': 'El motivo debe tener al menos 10 caracteres',
      'any.required': 'El motivo de cancelación es requerido',
    }),
}).options({ stripUnknown: true });

const reagendarCitaSchema = Joi.object({
  fecha_cita: Joi.date().iso().min('now').required()
    .messages({
      'date.min': 'La fecha de la cita no puede ser en el pasado',
      'any.required': 'La fecha de la cita es requerida',
    }),
  hora_inicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
    .messages({
      'string.pattern.base': 'La hora de inicio debe tener formato HH:mm',
      'any.required': 'La hora de inicio es requerida',
    }),
  hora_fin: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required()
    .messages({
      'string.pattern.base': 'La hora de fin debe tener formato HH:mm',
      'any.required': 'La hora de fin es requerida',
    }),
  observaciones: Joi.string().max(1000).allow('', null).optional(),
}).options({ stripUnknown: true });

const buscarPersonaSchema = Joi.object({
  tipo_documento: Joi.string().valid('CC', 'CE', 'NIT', 'Pasaporte', 'TI').required(),
  numero_documento: Joi.string().min(5).max(20).required(),
}).options({ stripUnknown: true });

module.exports = {
  createCitaSchema,
  confirmarCitaSchema,
  cancelarCitaSchema,
  reagendarCitaSchema,
  buscarPersonaSchema,
};
