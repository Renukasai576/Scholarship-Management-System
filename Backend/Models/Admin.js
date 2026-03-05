const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["superadmin", "admin"],
    default: "admin"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);