const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  apellido: { type: DataTypes.STRING(100), allowNull: false },
  dni: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.ENUM("admin", "comprador"), allowNull: false, defaultValue: "comprador" },
  foto: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: "usuarios",
  timestamps: true,
});

module.exports = Usuario;

