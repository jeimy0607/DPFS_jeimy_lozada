var express = require('express');
var router = express.Router();

let productoController = require('../controllers/productoController')
const { requireAdmin } = require("../middlewares/auth");
const { validateProduct } = require("../middlewares/validaciones");
const uploadProductImages = require("../middlewares/uploadProductImages");


router.get('/', productoController.index);


router.get('/detalleproducto/:id', productoController.show);

router.get('/crearproducto', requireAdmin, productoController.create);
router.post(
  "/crear",
  requireAdmin,
  uploadProductImages.array("imagenes", 6),
  validateProduct,
  productoController.store
);
router.get('/editarproducto/:id', requireAdmin, productoController.edit);
router.post('/actualizar/:id', requireAdmin, productoController.update);
router.post('/desactivar/:id', requireAdmin, productoController.deactivate);

router.get('/desactivados', requireAdmin, productoController.inactivos);
router.post('/activar/:id', requireAdmin, productoController.activate);
router.post('/destacado/:id', requireAdmin, productoController.toggleDestacado);



module.exports = router;