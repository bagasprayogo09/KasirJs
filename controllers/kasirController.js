const response = require("../responses");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const TransactionItem = require("../models/Transactionitem");

//lihat produk
exports.getProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) return response(500, null, "Produk tidak terpanggil", res);
    return response(200, products, "Success", res);
  });
};
// buat transaksi dengan produk
exports.buatTransaksi = (req, res) => {
  const kasir_id = req.user.id;
  const { items } = req.body;
  // contoh body:
  // { "items": [{ "product_id": 1, "quantity": 2 }, { "product_id": 3, "quantity": 1 }] }

  if (!items || items.length === 0) {
    return response(400, null, "Daftar produk tidak boleh kosong", res);
  }

  // ambil data produk dan hitung subtotal
  const getProductPrices = items.map(item => new Promise((resolve, reject) => {
    Product.getById(item.product_id, (err, product) => {
      if (err || !product) return reject(`Produk ID ${item.product_id} tidak ditemukan`);
      if (product.stock < item.quantity) return reject(`Stok produk ${product.name} tidak cukup`);
      resolve({
        ...item,
        price: product.price,
        subtotal: product.price * item.quantity,
        current_stock: product.stock
      });
    });
  }));

  Promise.all(getProductPrices)
    .then(productsWithSubtotal => {
      const total_amount = productsWithSubtotal.reduce((acc, p) => acc + p.subtotal, 0);

      // Simpan transaksi utama
      Transaction.create({ kasir_id, total_amount }, (err, results) => {
        if (err) return response(500, null, "Transaksi gagal dibuat", res);

        const transaction_id = results.insertId;

        // Siapkan data untuk transaction_items
        const transactionItems = productsWithSubtotal.map(p => ({
          transaction_id,
          product_id: p.product_id,
          quantity: p.quantity,
          subtotal: p.subtotal
        }));

        // Simpan item transaksi
        TransactionItem.create(transactionItems, async (err2) => {
          if (err2) return response(500, null, "Gagal menyimpan item transaksi", res);

          // Kurangi stok produk
          for (const p of productsWithSubtotal) {
            const newStock = p.current_stock - p.quantity;
            await new Promise((resolve, reject) => {
              Product.updateStock(p.product_id, newStock, (err3) => {
                if (err3) reject(err3);
                else resolve();
              });
            });
          }

          return response(200, {
            transaction_id,
            kasir_id,
            total_amount,
            items: transactionItems
          }, "Transaksi berhasil dibuat dan stok diperbarui", res);
        });
      });
    })
    .catch(err => response(400, null, err, res));
};