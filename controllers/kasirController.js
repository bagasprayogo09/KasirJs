const response = require("../responses");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

//lihat produk
exports.getProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) return response(500, null, "Produk tidak terpanggil", res);
    return response(200, products, "Success", res);
  });
};

//buat produl
exports.buatTransaksi = (req, res) => {
  const kasir_id = req.user.id;
  const { total_amount } = req.body;

  if (!total_amount) {
    return response(400, null, "total_amount wajib diisi", res);
  }

  Transaction.create({ kasir_id, total_amount }, (err, results) => {
    if (err) return response(500, null, "Transaksi tidak bisa dibuat", res);

    const newTransaksi = {
      id: results.insertId,
      kasir_id,
      total_amount,
    };

    return response(200, newTransaksi, "Transaksi telah dibuat", res);
  });
};
