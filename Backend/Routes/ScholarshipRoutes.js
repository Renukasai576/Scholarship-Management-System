console.log("ScholarshipRoutes loaded");
const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createScholarship,
  getScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  filterScholarships
} = require("../Controllers/ScholarshipController");


// =======================
// PUBLIC ROUTES
// =======================

// Get all scholarships
router.get("/", getScholarships);

// Get single scholarship
router.get("/:id", getScholarshipById);


// =======================
// STUDENT ROUTES
// =======================

// Filter scholarships (Student must be logged in)
router.post("/filter", requireAuth(), filterScholarships);


// =======================
// ADMIN ROUTES
// =======================

// Create scholarship (Admin only)
router.post("/", requireAuth(), adminMiddleware, createScholarship);

// Update scholarship (Admin only)
router.put("/:id", requireAuth(), adminMiddleware, updateScholarship);

// Delete scholarship (Admin only)
router.delete("/:id", requireAuth(), adminMiddleware, deleteScholarship);

module.exports = router;