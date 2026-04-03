const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const userController = require("../Controllers/UserController");

// SET ROLE
router.post("/role", requireAuth(), userController.setRole);

// GET USER (FIXED)
router.get("/me", requireAuth(), userController.getMe);
module.exports = router;