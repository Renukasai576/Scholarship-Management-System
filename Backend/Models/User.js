const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true   // 🔥 VERY IMPORTANT
  },
  role: {
    type: String,
    enum: ["student", "partner", "admin"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);