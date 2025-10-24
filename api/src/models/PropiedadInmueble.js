const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PropiedadInmueble = sequelize.define('Propiedad_inmueble', {
  id_propietario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_inmueble: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_persona: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Activo',
  },
});

module.exports = PropiedadInmueble;
