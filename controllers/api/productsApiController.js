const db = require('../../database/models');

const productsApiController = {
  list: async (req, res) => {
    try {
      const products = await db.Producto.findAll({
        where: { activo: true },
        include: [{ association: 'categoria' }, { association: 'images' }],
        order: [['id', 'DESC']],
      });

      res.json({
        count: products.length,
        products: products.map((product) => {
          const images = product.images || [];
          const mainImg = images.find((i) => i.isMain) || images[0] || null;

          return {
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            stock: product.stock,
            destacado: product.destacado,
            categoria: product.categoria
              ? {
                  id: product.categoria.id,
                  nombre: product.categoria.nombre,
                }
              : null,
            imagen: mainImg ? mainImg.image : null,
            detail: `http://localhost:3000/api/products/${product.id}`,
          };
        }),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  detail: async (req, res) => {
    try {
      const product = await db.Producto.findByPk(req.params.id, {
        include: [{ association: 'categoria' }, { association: 'images' }],
      });

      if (!product || product.activo === false) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({
        id: product.id,
        nombre: product.nombre,
        slug: product.slug,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        destacado: product.destacado,
        activo: product.activo,
        categoria: product.categoria
          ? {
              id: product.categoria.id,
              nombre: product.categoria.nombre,
            }
          : null,
        images: product.images,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener producto' });
    }
  },
};

module.exports = productsApiController;
