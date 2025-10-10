const response = require("../responses");
const Product = require("../models/Product");

//TambaH Produk
exports.addProduct = (req, res) => {
    const {name, price, stock} = req.body;
    if (!name || !price || !stock) {
        return response(500, null, "Produk tidak terpanggil", res);
        
    }

    Product.create({name, price, stock}, (err) => {
        if (err) return response(500, null, "Gagal menambah produk", res);
        return response(201, null, "Berhasil menambah produk", res);
    });
};

//Lihat Produk
exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return response(500, null, "Gagal mengambil produk", res);

    return response(200, results, "Data produk berhasil diambil", res);
  });
};