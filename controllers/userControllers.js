const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const response = require("../responses");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

// ============================================================
// REGISTER USER
// ============================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return response(400, null, "Semua field harus diisi", res);
    }

    // Cek apakah email sudah digunakan
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return response(400, null, "Email sudah terdaftar", res);
    }

    // Hash password (pakai async)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await createUser({ name, email, password: hashedPassword, role });

    return response(201, null, "Registrasi berhasil", res);
  } catch (error) {
    console.error("Error REGISTER:", error);
    return response(500, null, "Terjadi kesalahan pada server", res);
  }
};

// ============================================================
// LOGIN USER
// ============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return response(400, null, "Email dan password harus diisi", res);
    }

    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return response(404, null, "User tidak ditemukan", res);
    }

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response(401, null, "Password salah", res);
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const data = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return response(200, data, "Login berhasil", res);
  } catch (error) {
    console.error("Error LOGIN:", error);
    return response(500, null, "Terjadi kesalahan pada server", res);
  }
};

// ============================================================
// LOGOUT USER
// ============================================================
exports.logout = (req, res) => {
  // Logout hanya perlu hapus token di sisi client
  return response(200, null, "Logout berhasil (hapus token di sisi client)", res);
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Dapatkan user berdasarkan email (Promise)
function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    User.findByEmail(email, (err, results) => {
      if (err) return reject(err);
      resolve(results?.[0] || null);
    });
  });
}

// Buat user baru (Promise)
function createUser(data) {
  return new Promise((resolve, reject) => {
    User.create(data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
