const response = require("../responses");
const Product = require("../models/Product");

// ============================================================
// POST: Tambah Produk
// ============================================================
exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    // Validasi input
    if (!name || !price || !stock) {
      return response(400, null, "Nama, harga, dan stok wajib diisi", res);
    }

    // Pastikan harga & stok angka positif
    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      return response(400, null, "Harga dan stok harus berupa angka positif", res);
    }

    // Simpan ke database
    await createProduct({ name, price, stock });

    return response(201, null, "Produk berhasil ditambahkan", res);
  } catch (error) {
    return response(500, null, error.message || "Terjadi kesalahan saat menambah produk", res);
  }
};

// ============================================================
// GET: Lihat Semua Produk
// ============================================================
exports.getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    return response(200, products, "Data produk berhasil diambil", res);
  } catch (error) {
    return response(500, null, error.message || "Gagal mengambil produk", res);
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Buat produk (Promise-based)
function createProduct(data) {
  return new Promise((resolve, reject) => {
    Product.create(data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// Ambil semua produk (Promise-based)
function getAllProducts() {
  return new Promise((resolve, reject) => {
    Product.getAll((err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}
