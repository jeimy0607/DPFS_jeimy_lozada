const { Op } = require('sequelize');
const { Producto, Categoria, ProductImage } = require('../database/models');

const buscarController = {
  search: async (req, res) => {
    try {
      const q = (req.query.q || '').trim();

      if (!q) {
        return res.render('buscador', {
          title: 'Buscador',
          q: '',
          resultados: [],
        });
      }

      const productos = await Producto.findAll({
        where: {
          activo: true,
          [Op.or]: [
            { nombre: { [Op.like]: `%${q}%` } },
            { descripcion: { [Op.like]: `%${q}%` } },
            { '$categoria.nombre$': { [Op.like]: `%${q}%` } },
          ],
        },
        include: [
          { model: Categoria, as: 'categoria', required: false },
          { model: ProductImage, as: 'images' },
        ],
        order: [['id', 'DESC']],
      });

      const resultados = productos.map((p) => {
        const images = p.images || [];
        const mainImg = images.find((i) => i.isMain) || images[0] || null;
        return { ...p.toJSON(), mainImg };
      });

      return res.render('buscador', {
        title: 'Buscador',
        q,
        resultados,
      });
    } catch (error) {
      console.error('Error en búsqueda:', error);
      res.status(500).send('Error en el buscador');
    }
  },
};

module.exports = buscarController;
