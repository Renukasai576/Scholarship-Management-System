const axios = require("axios");

exports.getCourseRecommendations = async (req, res) => {
  try {
    // 👤 Student data from frontend
    const { interests, skills, goal } = req.body;

    // 🤖 Send to Python ML service
    const response = await axios.post("https://scholarship-management-system-4.onrender.com/course-recommend", {
      interests: interests,
      skills: skills,
      goal: goal
    });

    // 📤 Send ML result back to frontend
    res.json(response.data);

  } catch (err) {
    console.error("Recommendation error:", err.message);
    res.status(500).json({ error: "Course recommendation failed" });
  }
};
