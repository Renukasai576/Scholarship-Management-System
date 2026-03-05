const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    caste: {
      type: String,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite error
module.exports =
  mongoose.models.Student || mongoose.model("Student", studentSchema);