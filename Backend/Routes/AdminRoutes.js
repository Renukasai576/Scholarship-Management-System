const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/authMiddleware"); // 🔥 ADD THIS
const adminMiddleware = require("../middleware/adminMiddleware");

const adminController = require("../Controllers/AdminController");

// 🔥 Apply BOTH middlewares
router.use(requireAuth, adminMiddleware);

router.get("/verify", adminController.verifyAdmin);
router.get("/dashboard", adminController.getDashboardStats);
router.get("/students", adminController.getAllStudents);
router.get("/scholarships", adminController.getAllScholarships);
router.get("/eligibility", adminController.getEligibilityStats);

module.exports = router;