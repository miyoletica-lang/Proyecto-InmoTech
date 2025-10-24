const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cita = sequelize.define('Citas', {
  id_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_inmueble: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_servicio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_usuario_creador: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_cita: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  id_estado_cita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  id_agente_asignado: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  motivo_cancelacion: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  es_reagendada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  id_cita_original: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  fecha_confirmacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_cancelacion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  fecha_completada: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  indexes: [
    { fields: ['id_estado_cita', 'fecha_cita'] },
    { fields: ['id_inmueble', 'fecha_cita', 'hora_inicio', 'hora_fin'] },
  ],
});

module.exports = Cita;
