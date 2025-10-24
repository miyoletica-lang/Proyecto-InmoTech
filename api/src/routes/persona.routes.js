const express = require('express');
const router = express.Router();
const personaController = require('../controllers/persona.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const { updateProfileSchema } = require('../validators/persona.validator');

router.get('/buscar', authenticateJWT, personaController.buscarPersona);
router.get('/me', authenticateJWT, personaController.getProfile);
router.patch('/me', authenticateJWT, validate(updateProfileSchema), personaController.updateProfile);

module.exports = router;
