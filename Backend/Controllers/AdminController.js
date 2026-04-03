require("dotenv").config();
const Student = require("../Models/Student");
const Scholarship = require("../Models/Scholarship");

// ===============================
// Verify Admin Access
// ===============================
exports.verifyAdmin = async (req, res) => {
  try {
    res.status(200).json({
      message: "Admin verified successfully",
      admin: req.admin   // comes from middleware
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===============================
// Dashboard Stats
// ===============================
exports.getDashboardStats = async (req, res) => {
  try {
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
// ===============================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===============================
// Get All Scholarships
// ===============================
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEligibilityStats = async (req, res) => {
  try {
    const students = await Student.find();
    const scholarships = await Scholarship.find();

    const result = [];

    scholarships.forEach((sch) => {
      let count = 0;

      students.forEach((stu) => {
        if (
          sch.caste.includes(stu.caste) &&
          stu.income <= sch.incomeLimit &&
          (sch.gender === "Any" || sch.gender === stu.gender) &&
          sch.state === stu.state &&
          sch.educationLevel.includes(stu.educationLevel) &&
          stu.marks >= sch.minMarks
        ) {
          count++;
        }
      });

      result.push({
        scholarshipName: sch.name,
        eligibleStudents: count
      });
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};