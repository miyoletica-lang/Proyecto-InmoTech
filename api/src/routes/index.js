const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const citaRoutes = require('./cita.routes');
const inmuebleRoutes = require('./inmueble.routes');
const personaRoutes = require('./persona.routes');
const rolRoutes = require('./rol.routes');
const notificacionRoutes = require('./notificacion.routes');
const reporteRoutes = require('./reporte.routes');

router.use('/auth', authRoutes);
router.use('/citas', citaRoutes);
router.use('/inmuebles', inmuebleRoutes);
router.use('/personas', personaRoutes);
router.use('/roles', rolRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/reportes', reporteRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
