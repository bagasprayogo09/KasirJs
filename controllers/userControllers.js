const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const response = require("../responses");
require("dotenv").config();


const SECRET_KEY = process.env.SECRET_KEY;

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validasi input
    if (!name || !email || !password || !role) {
      return response(400, null, "Semua field harus diisi", res);
    }

    // Enkripsi password
    const hashed = bcrypt.hashSync(password, 10);

    // Simpan ke database
    User.create({ name, email, password: hashed, role }, (err) => {
      if (err) {
        console.error("Database error:", err);
        return response(500, null, "Gagal register", res);
      }

      return response(200, null, "Register berhasil", res);
    });
  } catch (error) {
    console.error("Error di blok try:", error);
    return response(500, null, "Terjadi kesalahan internal server", res);
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validasi input
    if (!email || !password) {
      return response(400, null, "Email dan password harus diisi", res);
    }

    // cari user berdasarkan email
    User.findByEmail(email, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return response(500, null, "Terjadi kesalahan pada server", res);
      }

      if (results.length === 0) {
        return response(404, null, "User tidak ditemukan", res);
      }

      const user = results[0];

      // validasi password
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        return response(401, null, "Password salah", res);
      }

      // token JWT
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
    });
  } catch (error) {
    console.error("Error di blok try:", error);
    return response(500, null, "Terjadi kesalahan internal server", res);
  }
};



// LOGOUT
exports.logout = (req, res) => {
  // logout cukup hapus token di sisi client
  return response(200, null, "Logout berhasil (hapus token di sisi client)", res);
};
