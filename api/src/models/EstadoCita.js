const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EstadoCita = sequelize.define('Estados_cita', {
  id_estado_cita: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  orden: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  es_estado_final: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = EstadoCita;
