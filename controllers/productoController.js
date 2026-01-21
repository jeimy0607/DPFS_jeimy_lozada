const { Producto, Categoria, ProductImage } = require("../database/models");

let productoController = {
  // CATÁLOGO (tipo revista)
  index: async function (req, res) {
    try {

        const categoriaId = req.query.categoria;
        //Traer categorías
        const categorias = await Categoria.findAll({
        order: [["nombre", "ASC"]],
        });

        const where = { activo: true };
            if (categoriaId) {
            where.categoriaId = categoriaId;
        }


      const productos = await Producto.findAll({
  where, 
  include: [
    { model: Categoria, as: "categoria" },
    { model: ProductImage, as: "images" },
  ],
  order: [["id", "DESC"]],
});
      // Elegir imagen principal para mostrar en el catálogo
      const productosConMain = productos.map((p) => {
        const images = p.images || [];
        const mainImg = images.find((i) => i.isMain) || images[0] || null;

        return { ...p.toJSON(), mainImg };
      });

      return res.render("producto", {
        title: "Productos - Peletería Cuero y Color",
        productos: productosConMain,
        categorias,
        categoriaSeleccionada: categoriaId,
        ultimoProducto: req.session.ultimoProducto,
      });
    } catch (error) {
      console.error("Error cargando productos:", error);
      return res.status(500).send("Error cargando productos");
    }
  },

  // DETALLE del producto (por ID)
  show: async function (req, res) {
    try {
      const id = req.params.id;

      const producto = await Producto.findByPk(id, {
        include: [
          { model: Categoria, as: "categoria" },
          { model: ProductImage, as: "images" },
        ],
      });

      if (!producto || producto.activo === false) {
        return res.status(404).send("Producto no encontrado");
      }

      const images = producto.images || [];
      const mainImg = images.find((i) => i.isMain) || images[0] || null;
      const gallery = mainImg ? images.filter((i) => i.id !== mainImg.id) : images;

      return res.render("detalleProducto", {
        title: "Detalle de producto",
        producto: producto.toJSON(),
        mainImg,
        gallery,
      });
    } catch (error) {
      console.error("Error cargando detalle:", error);
      return res.status(500).send("Error cargando detalle");
    }
  },


  create: async function (req, res) {
  try {
    const categorias = await Categoria.findAll({ order: [["nombre", "ASC"]] });

    return res.render("crearProducto", {
      title: "Crear producto",
      categorias: categorias.map(c => c.toJSON()),
      error: null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error cargando formulario");
  }
},

  store: async function (req, res) {
  try {
    const { nombre, slug, descripcion, precio, stock, categoriaId } = req.body;

    
    if (!nombre || !slug || !precio || !categoriaId) {
      const categorias = await Categoria.findAll({ order: [["nombre", "ASC"]] });
      return res.render("crearProducto", {
        title: "Crear producto",
        categorias: categorias.map(c => c.toJSON()),
        error: "Faltan campos obligatorios."
      });
    }

    
    const nuevo = await Producto.create({
      nombre,
      slug,
      descripcion: descripcion || null,
      precio,
      stock: stock || 0,
      categoriaId,
      activo: true,
       destacado: req.body.destacado ? true : false
    });

    
    if (req.files && req.files.length) {
      const imgs = req.files.map((f, idx) => ({
        productId: nuevo.id,
        image: `/public/uploads/products/${f.filename}`, 
        alt: nombre,
        isMain: idx === 0 
      }));

      await ProductImage.bulkCreate(imgs);
    }

   
    req.session.ultimoProducto = { titulo: nombre };

    return res.redirect("/producto");
  } catch (error) {
    console.error("Error guardando producto:", error);

    
    const categorias = await Categoria.findAll({ order: [["nombre", "ASC"]] });
    return res.render("crearProducto", {
      title: "Crear producto",
      categorias: categorias.map(c => c.toJSON()),
      error: "No se pudo crear. Revisa que el slug no esté repetido."
    });
  }
},


  edit: async function (req, res) {
  try {
    const id = req.params.id;

    const producto = await Producto.findByPk(id);
    if (!producto) return res.status(404).send("Producto no encontrado");

    const categorias = await Categoria.findAll({ order: [["nombre", "ASC"]] });

    return res.render("editarProducto", {
      title: "Editar producto",
      producto: producto.toJSON(),
      categorias: categorias.map(c => c.toJSON()),
    });
  } catch (error) {
    console.error("Error edit:", error);
    return res.status(500).send("Error cargando edición");
  }
},

update: async function (req, res) {
  try {
    const id = req.params.id;
    const { nombre, slug, descripcion, precio, stock, categoriaId, activo } = req.body;

    await Producto.update(
      {
        nombre,
        slug,
        descripcion,
        precio,
        stock,
        categoriaId,
        activo: activo ? true : false,
        destacado: req.body.destacado ? true : false,
      },
      { where: { id } }
    );

    return res.redirect("/producto");
  } catch (error) {
    console.error("Error update:", error);
    return res.status(500).send("Error actualizando producto");
  }
},
deactivate: async function (req, res) {
  try {
    const id = req.params.id;

    await Producto.update(
      { activo: false },
      { where: { id } }
    );

    return res.redirect("/producto");
  } catch (error) {
    console.error("Error desactivando producto:", error);
    return res.status(500).send("Error desactivando producto");
  }
},

// LISTA productos desactivados
inactivos: async function (req, res) {
  try {
    const productos = await Producto.findAll({
      where: { activo: false },
      include: [
        { model: Categoria, as: "categoria" },
        { model: ProductImage, as: "images" },
      ],
      order: [["id", "DESC"]],
    });

    const productosConMain = productos.map((p) => {
      const images = p.images || [];
      const mainImg = images.find((i) => i.isMain) || images[0] || null;
      return { ...p.toJSON(), mainImg };
    });

    return res.render("productosDesactivados", {
      title: "Productos desactivados",
      productos: productosConMain,
    });
  } catch (error) {
    console.error("Error cargando desactivados:", error);
    return res.status(500).send("Error cargando desactivados");
  }
},

// ACTIVAR producto
activate: async function (req, res) {
  try {
    const id = req.params.id;

    await Producto.update({ activo: true }, { where: { id } });

    return res.redirect("/producto/desactivados");
  } catch (error) {
    console.error("Error activando producto:", error);
    return res.status(500).send("Error activando producto");
  }
},

toggleDestacado: async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.redirect("/producto");

    await producto.update({
      destacado: !producto.destacado
    });

    return res.redirect("/producto");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error cambiando destacado");
  }
},



};

module.exports = productoController;
