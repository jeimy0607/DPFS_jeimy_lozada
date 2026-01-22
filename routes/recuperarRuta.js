


const express = require("express");
const router = express.Router();

const recuperarController = require("../controllers/recuperarController");

router.get("/", recuperarController.form);
router.post("/", recuperarController.enviar);

router.get("/reset/:token", recuperarController.resetForm);
router.post("/reset/:token", recuperarController.reset);

module.exports = router;
