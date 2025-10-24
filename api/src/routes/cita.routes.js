const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT, authorizeRoles, optionalAuth } = require('../middlewares/auth');
const {
  createCitaSchema,
  confirmarCitaSchema,
  cancelarCitaSchema,
  reagendarCitaSchema,
} = require('../validators/cita.validator');
const { citasLimiter } = require('../middlewares/rateLimiter');

router.post('/', citasLimiter, optionalAuth, validate(createCitaSchema), citaController.createCita);
router.get('/', authenticateJWT, citaController.getCitas);
router.get('/buscar-persona', authenticateJWT, citaController.buscarPersona);
router.get('/:id', authenticateJWT, citaController.getCitaById);
router.post(
  '/:id/confirmar',
  authenticateJWT,
  authorizeRoles('Empleado', 'Administrador', 'Super Administrador'),
  validate(confirmarCitaSchema),
  citaController.confirmarCita
);
router.post(
  '/:id/cancelar',
  authenticateJWT,
  validate(cancelarCitaSchema),
  citaController.cancelarCita
);
router.post(
  '/:id/reagendar',
  authenticateJWT,
  validate(reagendarCitaSchema),
  citaController.reagendarCita
);
router.post(
  '/:id/completar',
  authenticateJWT,
  authorizeRoles('Empleado', 'Administrador', 'Super Administrador'),
  citaController.completarCita
);

module.exports = router;
