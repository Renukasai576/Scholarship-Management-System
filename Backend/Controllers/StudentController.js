const Student = require("../Models/Student");

// Create or Update student profile
exports.saveStudent = async (req, res) => {

  try {

    const clerkId = req.auth.userId;

    const student = await Student.findOneAndUpdate(
      { clerkId },
      { ...req.body, clerkId },
      { upsert: true, new: true }
    );

    res.status(200).json(student);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};