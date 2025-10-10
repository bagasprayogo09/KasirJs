const { body } = require("express-validator");
const db = require("../config/db");

exports.productValidator = [
  body("name")
    .notEmpty()
    .withMessage("Nama produk tidak boleh kosong")
    .isLength({ max: 100 })
    .withMessage("Nama produk maksimal 100 karakter")
    .trim()
    .escape()
    .custom(async (value, { req }) => {
      const id = req.params.id;
      return new Promise((resolve, reject) => {
        let query;

        if (id) {
          // Cek nama produk selain milik sendiri (update)
          query = "SELECT id FROM products WHERE name = ? AND id != ?";
          db.query(query, [value, id], (err, results) => {
            if (err) return reject(new Error("Terjadi kesalahan server"));
            if (results.length > 0)
              return reject(new Error("Nama produk sudah digunakan"));
            resolve(true);
          });
        } else {
          // Cek nama produk duplikat (create)
          query = "SELECT id FROM products WHERE name = ?";
          db.query(query, [value], (err, results) => {
            if (err) return reject(new Error("Terjadi kesalahan server"));
            if (results.length > 0)
              return reject(new Error("Nama produk sudah ada"));
            resolve(true);
          });
        }
      });
    }),

  body("price")
    .notEmpty()
    .withMessage("Harga tidak boleh kosong")
    .isFloat({ gt: 0 })
    .withMessage("Harga harus berupa angka dan lebih dari 0"),

  body("stock")
    .optional() // boleh kosong karena default = 0
    .isInt({ min: 0 })
    .withMessage("Stok harus berupa angka dan minimal 0"),
];
