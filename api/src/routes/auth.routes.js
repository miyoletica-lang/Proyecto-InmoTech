const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT } = require('../middlewares/auth');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/auth.validator');
const { registerLimiter, loginLimiter } = require('../middlewares/rateLimiter');

router.post('/register', registerLimiter, validate(registerSchema), authController.register);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.get('/me', authenticateJWT, authController.getMe);

module.exports = router;
