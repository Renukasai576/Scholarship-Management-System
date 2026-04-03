const express = require("express");
const router = express.Router();
const { requireAuth } = require("@clerk/express");

const {
  applyScholarship,
  getMeritList
} = require("../Controllers/ApplicationController");

// APPLY + SELECT (same API)
router.post("/apply", requireAuth(), applyScholarship);

// MERIT LIST
router.get("/merit", requireAuth(), getMeritList);

module.exports = router;