const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Persona = sequelize.define('Personas', {
  id_persona: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_documento: {
    type: DataTypes.STRING(5),
    allowNull: false,
    validate: {
      isIn: [['CC', 'CE', 'NIT', 'Pasaporte', 'TI']],
    },
  },
  numero_documento: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  primer_nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  segundo_nombre: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  primer_apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  segundo_apellido: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  tiene_cuenta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    { fields: ['correo'] },
    { unique: true, fields: ['tipo_documento', 'numero_documento'] },
  ],
});

module.exports = Persona;
