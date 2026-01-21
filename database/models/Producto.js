//Creacion de modelos

const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const producto = sequelize.define(
  "producto",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    destacado: {
  type: DataTypes.BOOLEAN,
  allowNull: false,
  defaultValue: false
},
  },
  {
    tableName: "productos",
    timestamps: true,
  }
);

module.exports = producto;
