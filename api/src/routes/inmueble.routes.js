const express = require('express');
const router = express.Router();
const inmuebleController = require('../controllers/inmueble.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const { createInmuebleSchema, updateInmuebleSchema } = require('../validators/inmueble.validator');

router.post('/', authenticateJWT, validate(createInmuebleSchema), inmuebleController.createInmueble);
router.get('/', inmuebleController.getInmuebles);
router.get('/:id', inmuebleController.getInmuebleById);
router.get('/:id/disponibilidad', inmuebleController.getDisponibilidad);
router.patch(
  '/:id',
  authenticateJWT,
  authorizeRoles('Propietario', 'Empleado', 'Administrador', 'Super Administrador'),
  validate(updateInmuebleSchema),
  inmuebleController.updateInmueble
);

module.exports = router;
