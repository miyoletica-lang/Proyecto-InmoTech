const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ServicioCita = sequelize.define('Servicios_cita', {
  id_servicio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_servicio: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duracion_estimada: {
    type: DataTypes.INTEGER,
    defaultValue: 45,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ServicioCita;
