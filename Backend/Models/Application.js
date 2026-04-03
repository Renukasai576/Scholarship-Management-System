const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },

  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,  // 🔥 FIXED
    ref: "Scholarship",                    // 🔥 IMPORTANT
    required: true
  },

  status: {
    type: String,
    enum: ["applied", "selected"],
    default: "applied"
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);