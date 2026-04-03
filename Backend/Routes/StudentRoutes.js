const express = require("express");
const router = express.Router();

const Student = require("../Models/Student");
const Admin = require("../Models/Admin");

const requireAuth = require("../middleware/authMiddleware");

// ===============================
// Middleware: Block Admin Access
// ===============================
const blockAdmin = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId;

    const admin = await Admin.findOne({ clerkId });

    if (admin) {
      return res.status(403).json({
        message: "Admins cannot access student features"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===============================
// Create or Update Student Profile
// POST /api/students
// ===============================
router.post("/", requireAuth, blockAdmin, async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const student = await Student.findOneAndUpdate(
      { clerkId },
      { ...req.body, clerkId },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Profile saved successfully",
      student
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// Get Logged-in Student Profile
// GET /api/students/me
// ===============================
router.get("/me", requireAuth, blockAdmin, async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const student = await Student.findOne({ clerkId });

    if (!student) {
      return res.status(404).json({
        message: "No profile found"
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;