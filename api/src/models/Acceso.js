const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Acceso = sequelize.define('Acceso', {
  id_acceso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  contrasena: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Acceso;
