const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers"); // pastikan file ini ada
const { registerValidator, loginValidator } = require("../validator/userValidator");
const { validateRequest } = require("../middleware/validateRequest");

// route register
router.post("/register", registerValidator, validateRequest, userController.register);

// route login
router.post("/login", loginValidator, validateRequest, userController.login);

// route logout
router.post("/logout", userController.logout);

module.exports = router;
