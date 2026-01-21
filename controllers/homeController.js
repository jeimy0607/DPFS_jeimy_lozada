const productosDestacados = await Producto.findAll({
  where: {
    activo: true,
    destacado: true
  },
  include: [
    { model: ProductImage, as: "images" }
  ],
  limit: 8,
  order: [["id", "DESC"]]
});
