const Joi = require('joi');

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'any.required': 'El nombre es requerido',
    }),
  correo: Joi.string().email().required()
    .messages({
      'string.empty': 'El correo es requerido',
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido',
    }),
  telefono: Joi.string().min(7).max(20).required()
    .messages({
      'string.empty': 'El teléfono es requerido',
      'string.min': 'El teléfono debe tener al menos 7 caracteres',
      'any.required': 'El teléfono es requerido',
    }),
  password: Joi.string().min(8).max(50).required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe contener mayúsculas, minúsculas y números',
      'any.required': 'La contraseña es requerida',
    }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'Debe confirmar la contraseña',
    }),
  terminos: Joi.boolean().valid(true).required()
    .messages({
      'any.only': 'Debe aceptar los términos y condiciones',
      'any.required': 'Debe aceptar los términos y condiciones',
    }),
}).options({ stripUnknown: true });

const loginSchema = Joi.object({
  correo: Joi.string().email().required()
    .messages({
      'string.empty': 'El correo es requerido',
      'string.email': 'Debe ser un correo válido',
      'any.required': 'El correo es requerido',
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'La contraseña es requerida',
      'any.required': 'La contraseña es requerida',
    }),
}).options({ stripUnknown: true });

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
    .messages({
      'string.empty': 'El token de actualización es requerido',
      'any.required': 'El token de actualización es requerido',
    }),
}).options({ stripUnknown: true });

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
};
