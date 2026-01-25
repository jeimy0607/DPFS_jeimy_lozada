const express = require('express');
const router = express.Router();
const { Producto, ProductImage } = require('../database/models');

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: { activo: true, destacado: true },
      include: [{ model: ProductImage, as: 'images' }],
      order: [['id', 'DESC']],
      limit: 8,
    });

    const destacados = productos.map((p) => {
      const images = p.images || [];
      const mainImg = images.find((i) => i.isMain) || images[0] || null;
      return { ...p.toJSON(), mainImg };
    });

    return res.render('index', {
      title: 'Inicio',
      destacados,
    });
  } catch (error) {
    console.error('Error cargando destacados:', error);
    return res.render('index', {
      title: 'Inicio',
      destacados: [],
    });
  }
});

module.exports = router;
