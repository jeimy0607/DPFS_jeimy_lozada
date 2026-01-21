const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const CarritoItem = sequelize.define("CarritoItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  carritoId: { type: DataTypes.INTEGER, allowNull: false },
  productoId: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, { tableName: "carrito_items", timestamps: true });

module.exports = CarritoItem;