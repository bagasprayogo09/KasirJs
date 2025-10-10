const express = require("express");
const {getDashboard} = require("../controllers/adminController");
const router = express.Router();

router.get("/dashboard", getDashboard);

module.exports = router;