const db = require("../config/db");

const Product = {
    getAll: (callback) => {
        db.query("SELECT * FROM products", callback);
    },

    create: (data, callback) => {
        db.query(
            "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)",
            [data.name, data.price, data.stock],
            callback
        );
    },

    updateStock: (id, stock, callback) => {
        db.query("UPDATE products SET stock = ? WHERE id = ?", [stock, id], callback);
    },

    getById: (id, callback) => {
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
},


};

module.exports = Product;
