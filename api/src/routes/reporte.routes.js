const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporte.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const { createReporteSchema, updateReporteSchema } = require('../validators/reporte.validator');

router.post('/', authenticateJWT, validate(createReporteSchema), reporteController.createReporte);
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('Empleado', 'Administrador', 'Super Administrador'),
  reporteController.getReportes
);
router.get('/:id', authenticateJWT, reporteController.getReporteById);
router.patch(
  '/:id',
  authenticateJWT,
  authorizeRoles('Empleado', 'Administrador', 'Super Administrador'),
  validate(updateReporteSchema),
  reporteController.updateReporte
);

module.exports = router;
