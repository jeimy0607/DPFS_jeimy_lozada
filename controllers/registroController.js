const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Usuario } = require("../database/models");

const registroController = {
  form: (req, res) => {
    res.render("registro", { title: "Crear cuenta", errors: null, old: null, error: null });
  },

  store: async (req, res) => {
    try {
      
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.render("registro", {
          title: "Crear cuenta",
          errors: result.mapped(), 
          old: req.body,         
          error: null              
        });
      }

      
      const { name, lastname, dni, email, password, rol } = req.body;

      const hash = await bcrypt.hash(password, 10);

      const fotoPath = req.file
        ? `/public/uploads/users/${req.file.filename}`
        : `/public/images/user.png`;

      const rolFinal = (rol === "admin") ? "admin" : "comprador";

      await Usuario.create({
        nombre: name,
        apellido: lastname,
        dni,
        email,
        password: hash,
        rol: rolFinal,
        foto: fotoPath,
      });

      return res.redirect("/login");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error registrando usuario");
    }
  },
};

module.exports = registroController;
