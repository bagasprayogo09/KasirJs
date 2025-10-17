const response = require("../responses");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const TransactionItem = require("../models/Transactionitem");

// ============================================================
// GET: Semua Produk
// ============================================================
exports.getProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) return response(500, null, "Gagal mengambil data produk", res);
    return response(200, products, "Berhasil mengambil data produk", res);
  });
};

// ============================================================
// POST: Buat Transaksi
// ============================================================
exports.buatTransaksi = async (req, res) => {
  try {
    const kasir_id = req.user?.id;
    const { items } = req.body;

    // Validasi input
    if (!items || items.length === 0) {
      return response(400, null, "Daftar produk tidak boleh kosong", res);
    }

    // Ambil detail produk dan hitung subtotal
    const productsWithSubtotal = await Promise.all(
      items.map(async (item) => {
        const product = await getProductById(item.product_id);

        if (!product) {
          throw new Error(`Produk ID ${item.product_id} tidak ditemukan`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stok produk ${product.name} tidak cukup`);
        }

        return {
          ...item,
          price: product.price,
          subtotal: product.price * item.quantity,
          current_stock: product.stock,
        };
      })
    );

    // Hitung total transaksi
    const total_amount = productsWithSubtotal.reduce(
      (acc, p) => acc + p.subtotal,
      0
    );

    // Buat transaksi utama
    const transaction_id = await createTransaction({ kasir_id, total_amount });

    // Buat item transaksi
    const transactionItems = productsWithSubtotal.map((p) => ({
      transaction_id,
      product_id: p.product_id,
      quantity: p.quantity,
      subtotal: p.subtotal,
    }));

    await createTransactionItems(transactionItems);

    // Update stok produk
    await updateProductStocks(productsWithSubtotal);

    // Berhasil
    return response(
      200,
      { transaction_id, kasir_id, total_amount, items: transactionItems },
      "Transaksi berhasil dibuat dan stok diperbarui",
      res
    );
  } catch (error) {
    return response(400, null, error.message || "Terjadi kesalahan", res);
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Ambil produk by ID, dibungkus dalam Promise
function getProductById(product_id) {
  return new Promise((resolve, reject) => {
    Product.getById(product_id, (err, product) => {
      if (err) return reject(err);
      resolve(product);
    });
  });
}

// Buat transaksi utama
function createTransaction(data) {
  return new Promise((resolve, reject) => {
    Transaction.create(data, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

// Buat item transaksi
function createTransactionItems(items) {
  return new Promise((resolve, reject) => {
    TransactionItem.create(items, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Update stok produk satu per satu
async function updateProductStocks(products) {
  for (const p of products) {
    const newStock = p.current_stock - p.quantity;
    await new Promise((resolve, reject) => {
      Product.updateStock(p.product_id, newStock, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
