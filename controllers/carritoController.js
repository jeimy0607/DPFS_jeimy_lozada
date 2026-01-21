const { Carrito, CarritoItem, Producto, ProductImage } = require("../database/models");

async function getOrCreateCart(usuarioId) {
  let cart = await Carrito.findOne({ where: { usuarioId, estado: "activo" } });
  if (!cart) cart = await Carrito.create({ usuarioId, estado: "activo" });
  return cart;
}

function isAjax(req) {
  return req.headers["x-requested-with"] === "XMLHttpRequest";
}

async function renderPanel(req, res) {
  const cart = await getOrCreateCart(req.session.user.id);

  const items = await CarritoItem.findAll({
    where: { carritoId: cart.id },
    include: [{
      model: Producto, as: "producto",
      include: [{ model: ProductImage, as: "images" }]
    }],
    order: [["id", "DESC"]],
  });

  const itemsConImg = items.map(it => {
    const p = it.producto;
    const images = p?.images || [];
    const mainImg = images.find(i => i.isMain) || images[0] || null;
    return { ...it.toJSON(), mainImg };
  });

  const total = itemsConImg.reduce((acc, it) => acc + (Number(it.producto.precio) * it.cantidad), 0);

  return res.render("partials/carritoPanel", {
    layout: false,
    items: itemsConImg,
    total
  });
}

const carritoController = {
  // Pagina completa
  page: async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.session.user.id);

    const items = await CarritoItem.findAll({
      where: { carritoId: cart.id },
      include: [{
        model: Producto, as: "producto",
        include: [{ model: ProductImage, as: "images" }]
      }],
      order: [["id", "DESC"]],
    });

    const itemsConImg = items.map(it => {
      const p = it.producto;
      const images = p?.images || [];
      const mainImg = images.find(i => i.isMain) || images[0] || null;
      return { ...it.toJSON(), mainImg };
    });

    const total = itemsConImg.reduce(
      (acc, it) => acc + (Number(it.producto.precio) * it.cantidad),
      0
    );

    return res.render("carrito", {
      title: "Carrito",
      items: itemsConImg,
      total
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error cargando carrito");
  }
},


  // Panel (parcial HTML)
  panel: async (req, res) => {
    try { return await renderPanel(req, res); }
    catch (e) { console.error(e); return res.status(500).send("Error panel"); }
  },

  // Agregar
  add: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const [item, created] = await CarritoItem.findOrCreate({
        where: { carritoId: cart.id, productoId },
        defaults: { cantidad: 1 }
      });

      if (!created) await item.update({ cantidad: item.cantidad + 1 });

      // ✅ si es AJAX, devolvemos el panel actualizado
      if (isAjax(req)) return await renderPanel(req, res);

      // si no es AJAX, vuelve al sitio
      return res.redirect("back");
    } catch (e) {
      console.error(e);
      return res.status(500).send("Error agregando");
    }
  },

  increase: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const item = await CarritoItem.findOne({ where: { carritoId: cart.id, productoId } });
      if (item) await item.update({ cantidad: item.cantidad + 1 });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect("/carrito");
    } catch (e) {
      console.error(e);
      return res.status(500).send("Error");
    }
  },

  decrease: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      const item = await CarritoItem.findOne({ where: { carritoId: cart.id, productoId } });
      if (!item) {
        if (isAjax(req)) return await renderPanel(req, res);
        return res.redirect("/carrito");
      }

      if (item.cantidad <= 1) await item.destroy();
      else await item.update({ cantidad: item.cantidad - 1 });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect("/carrito");
    } catch (e) {
      console.error(e);
      return res.status(500).send("Error");
    }
  },

  remove: async (req, res) => {
    try {
      const cart = await getOrCreateCart(req.session.user.id);
      const productoId = req.params.id;

      await CarritoItem.destroy({ where: { carritoId: cart.id, productoId } });

      if (isAjax(req)) return await renderPanel(req, res);
      return res.redirect("/carrito");
    } catch (e) {
      console.error(e);
      return res.status(500).send("Error");
    }
  },
  pagePartial: async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.session.user.id);

    const items = await CarritoItem.findAll({
      where: { carritoId: cart.id },
      include: [{
        model: Producto, as: "producto",
        include: [{ model: ProductImage, as: "images" }]
      }],
      order: [["id", "DESC"]],
    });

    const itemsConImg = items.map(it => {
      const p = it.producto;
      const images = p?.images || [];
      const mainImg = images.find(i => i.isMain) || images[0] || null;
      return { ...it.toJSON(), mainImg };
    });

    const total = itemsConImg.reduce((acc, it) => acc + (Number(it.producto.precio) * it.cantidad), 0);

    return res.render("partials/carritoPage", {
      layout: false,
      items: itemsConImg,
      total
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error");
  }
},
};

module.exports = carritoController;
