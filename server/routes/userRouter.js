const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/isLoggedIn", authController.isLoggedIn);

module.exports = router;
