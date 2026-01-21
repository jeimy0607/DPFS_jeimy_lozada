

const bcrypt = require("bcryptjs");
const { Usuario } = require("../database/models");

const loginController = {
  form: (req, res) => {
    res.render("login", { title: "Login", error: null });
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.render("login", { title: "Login", error: "Credenciales inválidas." });
      }

      const ok = await bcrypt.compare(password, user.password);
if (!ok) {
  return res.render("login", { title: "Login", error: "Credenciales inválidas." });
}

req.session.user = {
  id: user.id,
  nombre: user.nombre,
  email: user.email,
  rol: user.rol,
  foto: user.foto,
};

if (user.rol === "admin") return res.redirect("/producto");
return res.redirect("/");

    } catch (err) {
      console.error(err);
      return res.status(500).send("Error en login");
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect("/"));
  },
};

module.exports = loginController;

