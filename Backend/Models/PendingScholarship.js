const mongoose = require('mongoose');

const pendingScholarshipSchema = new mongoose.Schema({
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
    },
    submittedBy: {
        type: String,
        required: true // clerkId of partner
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("PendingScholarship", pendingScholarshipSchema);
