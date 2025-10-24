const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacion.controller');
const { authenticateJWT } = require('../middlewares/auth');

router.get('/', authenticateJWT, notificacionController.getNotificaciones);
router.patch('/:id/leer', authenticateJWT, notificacionController.marcarLeida);
router.get('/contador', authenticateJWT, notificacionController.getContadorNoLeidas);

module.exports = router;
