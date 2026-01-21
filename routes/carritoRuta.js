var express = require('express');
var router = express.Router();
let carritoController = require('../controllers/carritoController');
const { requireAuth } = require("../middlewares/auth");

// ver carrito
router.get("/", requireAuth, carritoController.page);
router.get('/panel', requireAuth, carritoController.panel);
router.get("/page-partial", requireAuth, carritoController.pagePartial);

// agregar producto
router.post("/agregar/:id", requireAuth, carritoController.add);

// sumar/restar
router.post("/sumar/:id", requireAuth, carritoController.increase);
router.post("/restar/:id", requireAuth, carritoController.decrease);

// eliminar item completo
router.post("/eliminar/:id", requireAuth, carritoController.remove);


module.exports = router;