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
  filterScholarships,
  submitScholarshipProposal,
  getPendingScholarships,
  approveScholarship
} = require("../Controllers/ScholarshipController");


// =======================
// PUBLIC ROUTES
// =======================

// Get all scholarships
router.get("/", getScholarships);


// =======================
// PARTNER ROUTES (MUST BE BEFORE ADMIN ROUTES)
// =======================

// Submit scholarship proposal (Partners only) - SPECIFIC ROUTE FIRST
router.post("/submit", requireAuth(), submitScholarshipProposal);


// =======================
// ADMIN ROUTES
// =======================

// Get pending scholarships (Admin only)
router.get("/admin/pending", requireAuth(), adminMiddleware, getPendingScholarships);

// Approve/Reject scholarship (Admin only)
router.put("/admin/approve/:id", requireAuth(), adminMiddleware, approveScholarship);

// Create scholarship (Admin only)
router.post("/", requireAuth(), adminMiddleware, createScholarship);

// Update scholarship (Admin only)
router.put("/:id", requireAuth(), adminMiddleware, updateScholarship);

// Delete scholarship (Admin only)
router.delete("/:id", requireAuth(), adminMiddleware, deleteScholarship);


// =======================
// STUDENT ROUTES
// =======================

// Filter scholarships (Student must be logged in)
router.post("/filter", requireAuth(), filterScholarships);


// =======================
// GET SINGLE SCHOLARSHIP (MUST BE LAST TO AVOID /:id CONFLICTS)
// =======================

// Get single scholarship
router.get("/:id", getScholarshipById);

module.exports = router;