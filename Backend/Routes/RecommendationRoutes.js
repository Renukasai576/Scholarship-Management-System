const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");
const recommendationController = require("../Controllers/RecommendationController");

// ✅ Middleware to ensure user is authenticated
const authMiddleware = requireAuth();

// ========== Course Recommendation Routes ==========
// Get ML course recommendations based on student interests and skills
router.post("/", authMiddleware, recommendationController.getCourseRecommendations);

module.exports = router;
