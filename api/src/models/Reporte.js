const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reporte = sequelize.define('Reportes', {
  id_reporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_inmueble: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo_reporte: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.STRING(20),
    defaultValue: 'Media',
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'Pendiente',
  },
  id_persona_reporta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Reporte;
