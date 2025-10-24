const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notificacion = sequelize.define('Notificaciones', {
  id_notificacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_notificacion: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_cita: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_rol_destino: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  id_persona_destino: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      fields: ['leida', 'fecha_creacion'],
      where: { leida: false },
    },
  ],
});

module.exports = Notificacion;
