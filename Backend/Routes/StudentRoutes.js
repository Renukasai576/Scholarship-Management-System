const express = require("express");
const router = express.Router();
const Student = require("../Models/Student");

const requireAuth = require("../middleware/authMiddleware");

// ===============================
// Create or Update Student Profile
// POST /api/students
// ===============================
router.post("/", requireAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId; // Provided by Clerk

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

module.exports = router;