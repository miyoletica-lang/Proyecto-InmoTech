const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rol.controller');
const validate = require('../middlewares/validate');
const { authenticateJWT, authorizeRoles } = require('../middlewares/auth');
const { createRolSchema, asignarRolSchema } = require('../validators/rol.validator');

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('Super Administrador'),
  validate(createRolSchema),
  rolController.createRol
);
router.get(
  '/',
  authenticateJWT,
  authorizeRoles('Administrador', 'Super Administrador'),
  rolController.getRoles
);
router.post(
  '/:idRol/asignar',
  authenticateJWT,
  authorizeRoles('Administrador', 'Super Administrador'),
  validate(asignarRolSchema),
  rolController.asignarRol
);

module.exports = router;
