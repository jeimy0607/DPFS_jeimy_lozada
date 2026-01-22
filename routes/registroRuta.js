const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registroController");
const { validateRegister } = require("../middlewares/validaciones");
const uploadUserPhoto = require("../middlewares/uploadUserPhoto");

router.get("/", registroController.form);
router.post(
  "/",
  uploadUserPhoto.single("foto"),
  validateRegister,
  registroController.store
);

module.exports = router;
