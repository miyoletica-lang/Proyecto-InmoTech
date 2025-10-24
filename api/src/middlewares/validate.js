const logger = require('../utils/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validación fallida:', { errors, body: req.body });

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors,
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
