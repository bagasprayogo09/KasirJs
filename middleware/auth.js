require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    // kalau expired, jwt bakal lempar error: TokenExpiredError
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token kadaluarsa, silakan login ulang" });
    }
    return res.status(403).json({ message: "Token tidak sah" });
  }
};
