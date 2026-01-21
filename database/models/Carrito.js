const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const Carrito = sequelize.define("Carrito", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.ENUM("activo", "cerrado"), defaultValue: "activo" },
}, { tableName: "carritos", timestamps: true });

module.exports = Carrito;