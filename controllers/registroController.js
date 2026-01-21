const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/models");

const registroController = {
  form: (req, res) => {
    res.render("registro", { title: "Crear cuenta", error: null });
  },

  store: async (req, res) => {
    try {
      const { name, lastname, dni, email, password, password2, rol, terms } = req.body;

      if (!terms) {
        return res.render("registro", { title: "Crear cuenta", error: "Debes aceptar los términos." });
      }

     
if (password !== password2) {
  return res.render("registro", {
    title: "Crear cuenta",
    error: "Las contraseñas no coinciden.",
  });
}

const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
if (!passRegex.test(password)) {
  return res.render("registro", {
    title: "Crear cuenta",
    error: "La contraseña debe tener mínimo 8 caracteres e incluir letras y números.",
  });
}

      const existeEmail = await Usuario.findOne({ where: { email } });
      if (existeEmail) {
        return res.render("registro", { title: "Crear cuenta", error: "Ese correo ya está registrado." });
      }

      const existeDni = await Usuario.findOne({ where: { dni } });
      if (existeDni) {
        return res.render("registro", { title: "Crear cuenta", error: "Esa cédula ya está registrada." });
      }

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
