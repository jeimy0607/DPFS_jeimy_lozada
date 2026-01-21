const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const categoria = sequelize.define(
  "categoria",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  },
  {
    tableName: "categorias",
    timestamps: true,
  }
);

module.exports = categoria;
