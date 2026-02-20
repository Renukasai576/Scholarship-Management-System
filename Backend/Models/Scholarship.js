const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    caste: {
        type: [String],
        required: true
    },
    incomeLimit: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Any"],
        default: "Any"
    },
    state: {
        type: String,
        required: true
    },
    educationLevel: {
        type: [String],
        required: true
    },
    minMarks: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Scholarship", scholarshipSchema);
