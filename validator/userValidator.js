const { body } = require("express-validator");

exports.registerValidator = [
  body("name")
    .notEmpty().withMessage("Nama wajib diisi")
    .isLength({ min: 3 }).withMessage("Nama minimal 3 karakter"),

  body("email")
    .notEmpty().withMessage("Email wajib diisi")
    .isEmail().withMessage("Format email tidak valid"),

  body("password")
    .notEmpty().withMessage("Password wajib diisi")
    .isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),

  body("role")
    .optional()
    .isIn(["admin", "kasir"]).withMessage("Role harus admin atau kasir"),
];

exports.loginValidator = [
  body("email")
    .notEmpty().withMessage("Email wajib diisi")
    .isEmail().withMessage("Format email tidak valid"),

  body("password")
    .notEmpty().withMessage("Password wajib diisi"),
];
