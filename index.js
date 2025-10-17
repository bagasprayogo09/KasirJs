require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const kasirRoutes = require("./routes/kasirRoutes");
const auth = require("./middleware/auth");
require("./config/db");

const app = express();
app.use(bodyParser.json());

// ✅ Route bebas (login & register)
app.use("/api/user", userRoutes);

// ✅ Semua route di bawah ini wajib token
app.use(auth);

app.use("/api/produk", auth ,productsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kasir", auth ,kasirRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
