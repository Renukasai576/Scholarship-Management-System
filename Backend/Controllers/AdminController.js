require("dotenv").config();
const Student = require("../Models/Student");
const Scholarship = require("../Models/Scholarship");

// ===============================
// Verify Admin Access
// GET /api/admin/verify
// ===============================
exports.verifyAdmin = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (userId !== process.env.ADMIN_CLERK_ID) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    res.status(200).json({
      message: "Admin verified successfully",
      adminId: userId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===============================
// Admin Dashboard Stats
// GET /api/admin/dashboard
// ===============================
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (userId !== process.env.ADMIN_CLERK_ID) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    const totalStudents = await Student.countDocuments();
    const totalScholarships = await Scholarship.countDocuments();

    res.status(200).json({
      totalStudents,
      totalScholarships
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===============================
// Get All Students
// GET /api/admin/students
// ===============================
exports.getAllStudents = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (userId !== process.env.ADMIN_CLERK_ID) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    const students = await Student.find();

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===============================
// Get All Scholarships
// GET /api/admin/scholarships
// ===============================
exports.getAllScholarships = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (userId !== process.env.ADMIN_CLERK_ID) {
      return res.status(403).json({
        message: "Access denied. Admins only."
      });
    }

    const scholarships = await Scholarship.find();

    res.status(200).json(scholarships);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};