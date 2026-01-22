const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Usuario } = require("../database/models");

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const recuperarController = {
  form: (req, res) => {
    res.render("recuperar", { title: "Recuperar contraseña", msg: null, error: null, link: null });
  },

  enviar: async (req, res) => {
    try {
      const email = (req.body.email || "").trim();

      if (!email || !email.includes("@")) {
        return res.render("recuperar", { title: "Recuperar contraseña", msg: null, error: "Ingresa un correo válido.", link: null });
      }

      const user = await Usuario.findOne({ where: { email } });

     
      if (!user) {
        return res.render("recuperar", {
          title: "Recuperar contraseña",
          msg: "Si el correo existe, te mostramos el link de recuperación (simulación).",
          error: null,
          link: null
        });
      }

      const token = crypto.randomBytes(24).toString("hex");
      const expira = addMinutes(new Date(), 20); // 20 min

      await user.update({
        resetToken: token,
        resetTokenExpira: expira,
      });

 
      const link = `/recuperarcontraseña/reset/${token}`;

      return res.render("recuperar", {
        title: "Recuperar contraseña",
        msg: "En un sistema real esto llegaría a tu correo. (simulación):",
        error: null,
        link,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error generando recuperación");
    }
  },

  resetForm: async (req, res) => {
    try {
      const token = req.params.token;

      const user = await Usuario.findOne({ where: { resetToken: token } });
      if (!user) return res.status(404).send("Token inválido");

      if (!user.resetTokenExpira || new Date(user.resetTokenExpira) < new Date()) {
        return res.status(400).send("Token expirado. Vuelve a solicitar recuperación.");
      }

      return res.render("resetPassword", { title: "Nueva contraseña", error: null, token });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error cargando reset");
    }
  },

  reset: async (req, res) => {
    try {
      const token = req.params.token;
      const { password, password2 } = req.body;

      const user = await Usuario.findOne({ where: { resetToken: token } });
      if (!user) return res.status(404).send("Token inválido");

      if (!user.resetTokenExpira || new Date(user.resetTokenExpira) < new Date()) {
        return res.status(400).send("Token expirado. Vuelve a solicitar recuperación.");
      }

      
      const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
      if (!passRegex.test(password)) {
        return res.render("resetPassword", { title: "Nueva contraseña", error: "Debe tener mínimo 8 caracteres, letras y números.", token });
      }
      if (password !== password2) {
        return res.render("resetPassword", { title: "Nueva contraseña", error: "Las contraseñas no coinciden.", token });
      }

      const hash = await bcrypt.hash(password, 10);

      await user.update({
        password: hash,
        resetToken: null,
        resetTokenExpira: null,
      });

      return res.redirect("/login");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error guardando nueva contraseña");
    }
  },
};

module.exports = recuperarController;
