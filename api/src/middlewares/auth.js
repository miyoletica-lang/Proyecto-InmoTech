const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TOKEN_EXPIRED') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado',
          code: 'TOKEN_EXPIRED',
        });
      }

      logger.warn('Token inválido:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Token inválido',
      });
    }
  } catch (error) {
    logger.error('Error en authenticateJWT:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al autenticar',
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: sin roles asignados',
      });
    }

    const hasRole = req.user.roles.some((userRole) =>
      roles.includes(userRole)
    );

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: permisos insuficientes',
        requiredRoles: roles,
      });
    }

    next();
  };
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
  } catch (error) {
  }

  next();
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  optionalAuth,
};
