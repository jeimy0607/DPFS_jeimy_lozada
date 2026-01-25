const { Carrito, CarritoItem, Producto, ProductImage } = require('../database/models');
const { sequelize } = require('../database/conexion');

async function getOrCreateCart(usuarioId) {
  let cart = await Carrito.findOne({ where: { usuarioId, estado: 'activo' } });
  if (!cart) cart = await Carrito.create({ usuarioId, estado: 'activo' });
  return cart;
}

function isAjax(req) {
  return req.headers['x-requested-with'] === 'XMLHttpRequest';
}

async function renderPanel(req, res) {
  const cart = await getOrCreateCart(req.session.user.id);

  const items = await CarritoItem.findAll({
    where: { carritoId: cart.id },
    include: [
      {
        model: Producto,
        as: 'producto',
        include: [{ model: ProductImage, as: 'images' }],
      },
    ],
    order: [['id', 'DESC']],
  });

  const itemsConImg = items.map((it) => {
    const p = it.producto;
    const images = p?.images || [];
    const mainImg = images.find((i) => i.isMain) || images[0] || null;
    return { ...it.toJSON(), mainImg };
  });

  const total = itemsConImg.reduce((acc, it) => acc + Number(it.producto.precio) * it.cantidad, 0);

  return res.render('partials/carritoPanel', {
    layout: false,
    items: itemsConImg,
    total,
  });
}

const carritoController = {
  page: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const stockError = req.query.stock
        ? 'No hay stock suficiente para completar la compra.'
        : null;

      const items = await CarritoItem.findAll({
        where: { carritoId: cart.id },
        include: [
          {
            model: Producto,
            as: 'producto',
            include: [{ model: ProductImage, as: 'images' }],
          },
        ],
        order: [['id', 'DESC']],
      });

      const itemsConImg = items.map((it) => {
        const p = it.producto;
        const images = p?.images || [];
        const mainImg = images.find((i) => i.isMain) || images[0] || null;
        return { ...it.toJSON(), mainImg };
      });

      const total = itemsConImg.reduce(
        (acc, it) => acc + Number(it.producto.precio) * it.cantidad,
        0
      );

      return res.render('carrito', {
        title: 'Carrito',
        items: itemsConImg,
        total,
        error: stockError,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error cargando carrito');
    }
  },

  panel: async (req, res) => {
    try {
      return await renderPanel(req, res);
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error panel');
    }
  },

  add: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const [item, created] = await CarritoItem.findOrCreate({
        where: { carritoId: cart.id, productoId },
        defaults: { cantidad: 1 },
      });

      if (!created) await item.update({ cantidad: item.cantidad + 1 });

      if (isAjax(req)) return await renderPanel(req, res);

      return res.redirect('back');
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error agregando');
    }
  },

  increase: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const item = await CarritoItem.findOne({ where: { carritoId: cart.id, productoId } });
      if (item) await item.update({ cantidad: item.cantidad + 1 });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect('/carrito');
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error');
    }
  },

  decrease: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const item = await CarritoItem.findOne({ where: { carritoId: cart.id, productoId } });
      if (!item) {
        if (isAjax(req)) return await renderPanel(req, res);
        return res.redirect('/carrito');
      }

      if (item.cantidad <= 1) await item.destroy();
      else await item.update({ cantidad: item.cantidad - 1 });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect('/carrito');
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error');
    }
  },

  remove: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      await CarritoItem.destroy({ where: { carritoId: cart.id, productoId } });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect('/carrito');
    } catch (e) {
      console.error(e);
      return res.status(500).send('Error');
    }
  },
  pagePartial: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);

      const items = await CarritoItem.findAll({
        where: { carritoId: cart.id },
        include: [
          {
            model: Producto,
            as: 'producto',
            include: [{ model: ProductImage, as: 'images' }],
          },
        ],
        order: [['id', 'DESC']],
      });

      const itemsConImg = items.map((it) => {
        const p = it.producto;
        const images = p?.images || [];
        const mainImg = images.find((i) => i.isMain) || images[0] || null;
        return { ...it.toJSON(), mainImg };
      });

      const total = itemsConImg.reduce(
        (acc, it) => acc + Number(it.producto.precio) * it.cantidad,
        0
      );

      return res.render('partials/carritoPage', {
        layout: false,
        items: itemsConImg,
        total,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send('Error');
    }
  },

  pagar: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const cart = await getOrCreateCart(req.session.user.id);

      const items = await CarritoItem.findAll({
        where: { carritoId: cart.id },
        include: [{ model: Producto, as: 'producto' }],
        transaction: t,
      });

      if (!items.length) {
        await t.rollback();
        return res.redirect('/carrito');
      }

      for (const it of items) {
        const p = it.producto;
        if (!p) {
          await t.rollback();
          return res.status(400).send('Producto no encontrado en el carrito');
        }
        if (p.stock < it.cantidad) {
          await t.rollback();

          return res.redirect('/carrito?stock=1');
        }
      }

      for (const it of items) {
        const p = it.producto;
        await p.update({ stock: p.stock - it.cantidad }, { transaction: t });
      }

      await cart.update({ estado: 'cerrado' }, { transaction: t });

      await Carrito.create(
        { usuarioId: req.session.user.id, estado: 'activo' },
        { transaction: t }
      );

      await t.commit();
      return res.redirect('/carrito/confirmacion');
    } catch (e) {
      await t.rollback();
      console.error(e);
      return res.status(500).send('Error al pagar');
    }
  },

  confirmacion: (req, res) => {
    return res.render('carritoConfirmacion', {
      title: 'Compra realizada',
    });
  },
};

module.exports = carritoController;
