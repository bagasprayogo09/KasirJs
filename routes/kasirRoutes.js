const express = require("express");
const router = express.Router();
const kasirController = require("../controllers/kasirController");

router.get("/products",  kasirController.getProducts);
router.post("/transaksi",  kasirController.buatTransaksi);

module.exports = router;
