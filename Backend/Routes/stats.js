const express = require("express");
const router = express.Router();

const Student = require("../Models/Student");
const Scholarship = require("../Models/Scholarship");

router.get("/stats", async (req, res) => {
  try {
    const users = await Student.countDocuments();
    const scholarships = await Scholarship.countDocuments();

    res.json({
      users,
      scholarships
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;