const Application = require("../Models/Application");

// 🔥 APPLY OR UPDATE (BEST VERSION)
exports.applyScholarship = async (req, res) => {
  try {
    const studentId = req.auth.userId;
    const { scholarshipId, status } = req.body;

    const application = await Application.findOneAndUpdate(
      { studentId, scholarshipId },   // 🔥 prevents duplicates
      {
        studentId,
        scholarshipId,
        status: status || "applied"   // 🔥 handles both apply + selected
      },
      { upsert: true, new: true }
    );

    res.status(200).json(application);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔥 MERIT LIST (SELECTED ONLY)
// 🔥 MERIT LIST (WITH NAMES)
exports.getMeritList = async (req, res) => {
  try {
    const apps = await Application.find({ status: "selected" })
      .populate("scholarshipId")   // 🔥 fetch scholarship details
      .lean();

    const Student = require("../Models/Student");

    const result = await Promise.all(
      apps.map(async (app) => {
        const student = await Student.findOne({ clerkId: app.studentId });

        return {
          _id: app._id,
          studentName: student?.name || "Unknown",
          scholarshipName: app.scholarshipId?.name || "Unknown",
          status: app.status
        };
      })
    );

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};