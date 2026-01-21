const Categoria = require("./Categoria");
const Producto = require("./Producto");
const ProductImage = require("./ProductImage");
const Usuario = require("./Usuario");

const Carrito = require("./Carrito");
const CarritoItem = require("./CarritoItem");


Categoria.hasMany(Producto, { foreignKey: "categoriaId", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "categoriaId", as: "categoria" });


Producto.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Producto, { foreignKey: "productId", as: "productos" });


Carrito.belongsTo(Usuario, { as: "usuario", foreignKey: "usuarioId" });
Usuario.hasMany(Carrito, { as: "carritos", foreignKey: "usuarioId" });

Carrito.hasMany(CarritoItem, { as: "items", foreignKey: "carritoId" });
CarritoItem.belongsTo(Carrito, { as: "carrito", foreignKey: "carritoId" });

CarritoItem.belongsTo(Producto, { as: "producto", foreignKey: "productoId" });
Producto.hasMany(CarritoItem, { as: "carritoItems", foreignKey: "productoId" });

module.exports = { Categoria, Producto, ProductImage, Usuario, Carrito, CarritoItem };
