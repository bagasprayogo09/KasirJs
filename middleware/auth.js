require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

// ============================================================
// Middleware: Autentikasi Token JWT
// ============================================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek apakah header Authorization ada dan valid
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "Token tidak ditemukan atau format tidak valid");
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 403, "Token sudah kadaluarsa, silakan login ulang");
    }
    return sendError(res, 403, "Token tidak sah atau rusak");
  }
};

// ============================================================
// Helper untuk response error
// ============================================================
function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = authenticateToken;
