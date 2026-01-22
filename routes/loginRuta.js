const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const { validateLogin } = require("../middlewares/validaciones");

router.get("/", loginController.form);
router.post("/", validateLogin, loginController.login);
router.get("/logout", loginController.logout);

module.exports = router;
