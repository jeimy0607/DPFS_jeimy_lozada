const { DataTypes } = require("sequelize");
const { sequelize } = require("../conexion");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING(255), allowNull: false },
    alt: { type: DataTypes.STRING(150), allowNull: true },
    isMain: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    tableName: "product_images",
    timestamps: true,
  }
);

module.exports = ProductImage;
