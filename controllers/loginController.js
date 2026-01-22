
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { Usuario } = require("../database/models");

const loginController = {
  form: (req, res) => {
    res.render("login", {
      title: "Login",
      error: null,
      errors: null,
      old: null,
    });
  },

  login: async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.render("login", {
          title: "Login",
          error: null,
          errors: result.mapped(),
          old: req.body,
        });
      }

      const { email, password } = req.body;

      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.render("login", {
          title: "Login",
          error: "Credenciales inválidas.",
          errors: null,
          old: req.body,
        });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.render("login", {
          title: "Login",
          error: "Credenciales inválidas.",
          errors: null,
          old: req.body,
        });
      }

      // ✅ 1) Guardas el usuario en sesión
      req.session.user = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        foto: user.foto,
      };

      // ✅ 2) IMPORTANTE: fuerzas a guardar la sesión antes de redirigir
      req.session.save(() => {
        if (user.rol === "admin") return res.redirect("/producto");
        return res.redirect("/");
      });
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
