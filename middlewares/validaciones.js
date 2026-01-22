const { body } = require("express-validator");
const path = require("path");
const { Usuario } = require("../database/models");

const allowedImg = [".jpg", ".jpeg", ".png", ".webp"];

const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener mínimo 2 caracteres."),

  body("lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener mínimo 2 caracteres."),

   body("dni")
    .notEmpty().withMessage("La cédula es obligatoria")
    .isNumeric().withMessage("La cédula debe contener solo números")
    .isLength({ min: 6, max: 12 }).withMessage("La cédula debe tener entre 6 y 12 dígitos"),


  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ser un correo válido.")
    .bail()
    .custom(async (value) => {
      const existe = await Usuario.findOne({ where: { email: value } });
      if (existe) throw new Error("Ese correo ya está registrado.");
      return true;
    }),

  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres.")
    .bail()
    .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .withMessage("La contraseña debe contener letras y números."),

  body("password2").custom((val, { req }) => {
    if (val !== req.body.password) throw new Error("Las contraseñas no coinciden.");
    return true;
  }),

  
  body("foto").custom((value, { req }) => {
    if (!req.file) return true;
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedImg.includes(ext)) {
      throw new Error("La foto debe ser JPG, PNG o WEBP.");
    }
    return true;
  }),
];

const validateLogin = [
  body("email").trim().isEmail().withMessage("Correo inválido."),
  body("password").notEmpty().withMessage("La contraseña es obligatoria."),
];

const validateProduct = [
  body("nombre")
    .trim()
    .isLength({ min: 5 })
    .withMessage("El nombre debe tener mínimo 5 caracteres."),

  body("descripcion")
    .trim()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener mínimo 20 caracteres."),

  body("precio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser válido (>= 0)."),

  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser 0 o mayor."),

  body("categoriaId")
    .isInt()
    .withMessage("Debes seleccionar una categoría."),

  
  body("imagenes").custom((value, { req }) => {
    if (!req.files || req.files.length === 0) return true;
    for (const f of req.files) {
      const ext = path.extname(f.originalname).toLowerCase();
      if (!allowedImg.includes(ext)) {
        throw new Error("Las imágenes deben ser JPG, PNG o WEBP.");
      }
    }
    return true;
  }),
];

module.exports = { validateRegister, validateLogin, validateProduct };

