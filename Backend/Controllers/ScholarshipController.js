const Scholarship = require("../Models/Scholarship");

exports.createScholarship = async (req, res) => {
    try {
        const scholarship = new Scholarship(req.body);
        await scholarship.save();
        res.status(201).json({
            message: "Scholarship created successfully",
            data: scholarship
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

exports.getScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find();
        res.status(200).json(scholarships);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
// GET Single Scholarship
exports.getScholarshipById = async (req, res) => {
    try {
        const id = req.params.id.trim(); 
        const scholarship = await Scholarship.findById(id);
        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }
        res.status(200).json(scholarship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE Scholarship
exports.updateScholarship = async (req, res) => {
    try {
        const updated = await Scholarship.findByIdAndUpdate(
            req.params.id.trim(),
            req.body,
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Scholarship
exports.deleteScholarship = async (req, res) => {
    try {
        await Scholarship.findByIdAndDelete(req.params.id.trim());
        res.status(200).json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//Filter Scholarship router
exports.filterScholarships = async (req, res) => {
    try {
        const { caste, income, gender, state, educationLevel, marks } = req.body;

        const scholarships = await Scholarship.find({
            caste:  { $in: [caste] },
            incomeLimit: { $gte: income },
            state: state,
           educationLevel: { $in: [educationLevel] },
            minMarks: { $lte: marks },
            $or: [
                { gender: gender },
                { gender: "Any" }
            ]
        });

        res.status(200).json(scholarships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
