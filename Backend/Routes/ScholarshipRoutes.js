const requireAuth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const scholarshipController = require("../Controllers/ScholarshipController");

// ===============================
// CREATE Scholarship
// POST /api/scholarships
// ===============================
router.post("/", scholarshipController.createScholarship);

// ===============================
// GET All Scholarships
// GET /api/scholarships
// ===============================
router.get("/", scholarshipController.getScholarships);

// ===============================
// GET Single Scholarship by ID
// GET /api/scholarships/:id
// ===============================
router.get("/:id", scholarshipController.getScholarshipById);

// ===============================
// UPDATE Scholarship
// PUT /api/scholarships/:id
// ===============================
router.put("/:id", scholarshipController.updateScholarship);

// ===============================
// DELETE Scholarship
// DELETE /api/scholarships/:id
// ===============================
router.delete("/:id", scholarshipController.deleteScholarship);
// ===============================
// PARTIAL UPDATE Scholarship
// PATCH /api/scholarships/:id
// ===============================
router.patch("/:id", scholarshipController.updateScholarship);
//filter router
router.post("/filter", scholarshipController.filterScholarships);


module.exports = router;
