const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PersonaRol = sequelize.define('Personas_rol', {
  id_persona_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    { unique: true, fields: ['id_persona', 'id_rol'] },
  ],
});

module.exports = PersonaRol;
