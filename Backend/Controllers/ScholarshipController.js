const Scholarship = require("../Models/Scholarship");
const Student = require("../Models/Student");
const PendingScholarship = require("../Models/PendingScholarship");
exports.createScholarship = async (req, res) => {
    try {
        console.log("🔥 createScholarship called (ADMIN ONLY)");
        
        // 🛑 REJECT if status or submittedBy fields present
        if (req.body.status || req.body.submittedBy) {
            return res.status(400).json({
                error: "Invalid request. Use /scholarships/submit for partner proposals."
            });
        }

        const scholarship = new Scholarship(req.body);
        await scholarship.save();
        console.log("✅ Saved to main Scholarship collection");
        res.status(201).json({
            message: "Scholarship created successfully",
            data: scholarship
        });
    } catch (error) {
        console.error("❌ Error in createScholarship:", error.message);
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
    const clerkId = req.auth.userId; // ✅ secure way

    const student = await Student.findOne({ clerkId });
    console.log("Student:", student);

    if (!student) {
      return res.status(404).json({
        message: "Profile not found. Please complete your profile first.",
        profileComplete: false
      });
    }

const scholarships = await Scholarship.find({
  caste: { $in: [student.caste] },
  incomeLimit: { $gte: student.income },
  state: student.state,
  minMarks: { $lte: student.marks },
  $or: [
    { gender: student.gender },
    { gender: "Any" }
  ],
  educationLevel: student.educationLevel  
});
console.log("Scholarships:", scholarships);
    res.status(200).json({
      profileComplete: true,
      student: student.name,
      eligibleScholarships: scholarships,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PARTNER: Submit scholarship proposal
exports.submitScholarshipProposal = async (req, res) => {
  try {
    console.log("🔥 submitScholarshipProposal called");
    const clerkId = req.auth.userId;
    console.log("Partner clerkId:", clerkId);
    
    if (!PendingScholarship) {
      console.error("❌ PendingScholarship model not loaded!");
      return res.status(500).json({ error: "Server error: PendingScholarship model missing" });
    }

    const scholarshipData = {
      name: req.body.name,
      provider: req.body.provider,
      link: req.body.link,
      state: req.body.state,
      incomeLimit: req.body.incomeLimit,
      minMarks: req.body.minMarks,
      deadline: req.body.deadline,
      gender: req.body.gender || "Any",
      caste: req.body.caste,
      educationLevel: req.body.educationLevel,
      submittedBy: clerkId
    };

    console.log("Creating PendingScholarship with data:", scholarshipData.name);
    const pending = new PendingScholarship(scholarshipData);
    const saved = await pending.save();
    
    console.log("✅ Saved to PendingScholarship collection:", saved._id);
    console.log("Collection name:", pending.constructor.collection.name);

    res.status(201).json({
      message: "Scholarship proposal submitted successfully. Awaiting admin approval.",
      data: saved
    });
  } catch (error) {
    console.error("❌ Error in submitScholarshipProposal:", error.message);
    console.error("Stack:", error.stack);
    res.status(400).json({
      error: error.message
    });
  }
};

// ADMIN: Get pending scholarships
exports.getPendingScholarships = async (req, res) => {
  try {
    const pendingScholarships = await PendingScholarship.find({});
    res.status(200).json(pendingScholarships);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ADMIN: Approve/Reject scholarship
exports.approveScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const pending = await PendingScholarship.findById(id);
    if (!pending) {
      return res.status(404).json({ message: "Pending scholarship not found" });
    }

    if (action === "approve") {
      // Save to main Scholarship database
      const scholarshipData = pending.toObject();
      delete scholarshipData._id;
      const approved = new Scholarship(scholarshipData);
      await approved.save();

      // Delete from pending
      await PendingScholarship.findByIdAndDelete(id);

      res.status(200).json({
        message: "Scholarship approved and added to database successfully",
        data: approved
      });
    } else {
      // Reject - just delete from pending
      await PendingScholarship.findByIdAndDelete(id);

      res.status(200).json({
        message: "Scholarship rejected and removed"
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};