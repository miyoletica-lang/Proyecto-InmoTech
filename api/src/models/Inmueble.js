const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inmueble = sequelize.define('Inmuebles', {
  id_inmueble: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  registro_inmobiliario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  pais: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  departamento: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  precio_venta: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
  },
  area_construida: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(50),
    defaultValue: 'Disponible',
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Inmueble;
