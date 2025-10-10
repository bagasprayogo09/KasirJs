const express = require("express");
const router = express.Router();
const {addProduct, getProducts} = require("../controllers/produkController");
const {productValidator} = require("../validator/productValidator");
const {validateRequest} = require("../middleware/validateRequest");

router.post("/add", productValidator, validateRequest ,addProduct);
router.get("/list", getProducts);

module.exports = router;