require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const natural = require("natural");
const { Matrix, cosineSimilarity } = require("ml-matrix");

const app = express();

// ✅ CORS
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ BODY PARSER
app.use(express.json());

// ✅ FIXED CLERK (IMPORTANT)
app.use(clerkMiddleware()); // 🔥 THIS IS THE FIX

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ✅ Load Datasets
let courses_df = [];
let recommend_df = [];
let course_vectors = null;
let vectorizer = null;

function loadDatasets() {
  // Load courses
  const coursesPath = path.join(__dirname, "../ml_service/nptel_courses_dataset_updated.csv");
  console.log("Loading courses from:", coursesPath);
  courses_df = [];
  fs.createReadStream(coursesPath)
    .pipe(csv())
    .on("data", (data) => {
      courses_df.push(data);
    })
    .on("end", () => {
      console.log("Courses loaded:", courses_df.length);
      console.log("Sample course:", courses_df[0]);
      // Load recommendations
      const recommendPath = path.join(__dirname, "../ml_service/nptel_recommendations_dataset.csv");
      console.log("Loading recommendations from:", recommendPath);
      recommend_df = [];
      fs.createReadStream(recommendPath)
        .pipe(csv())
        .on("data", (data) => recommend_df.push(data))
        .on("end", () => {
          console.log("Recommendations loaded:", recommend_df.length);
          console.log("Sample recommendation:", recommend_df[0]);
          prepareRecommendationSystem();
        });
    });
}

function prepareRecommendationSystem() {
  // Calculate recommendation counts
  const recommend_counts = {};
  recommend_df.forEach(rec => {
    const courseId = rec.courseId;
    if (!recommend_counts[courseId]) {
      recommend_counts[courseId] = 0;
    }
    recommend_counts[courseId]++;
  });

  // Merge counts into courses
  courses_df.forEach(course => {
    course.recommendedBy = recommend_counts[course.courseId] || 0;
    course.rating = parseFloat(course.rating) || 0;
  });

  // Prepare TF-IDF for ML recommendations
  const TfIdf = natural.TfIdf;
  vectorizer = new TfIdf();

  courses_df.forEach(course => {
    const text = `${course.domain} ${course.skills} ${course.level}`;
    vectorizer.addDocument(text);
  });

  console.log("Recommendation system ready");
}

// Load datasets on startup
loadDatasets();

// ✅ ROUTES
app.use("/api/scholarships", require("./Routes/ScholarshipRoutes"));
app.use("/api/students", require("./Routes/StudentRoutes"));
app.use("/api", require("./Routes/stats"));
app.use("/api/applications", require("./Routes/ApplicationRoute"));
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/admin", require("./Routes/AdminRoutes"));
app.use("/api/support-tickets", require("./Routes/SupportTicketRoutes"));
app.use("/api/recommendations", require("./Routes/RecommendationRoutes"));

// ✅ DEBUG
app.get("/test-auth", (req, res) => {
  console.log("AUTH:", req.auth);
  res.json(req.auth);
});

// ✅ TEST
app.get("/api/top-nptel-courses", (req, res) => {
  console.log("API called, courses_df length:", courses_df.length);
  console.log("First course:", courses_df[0]);

  // Get top courses by recommendation count
  const topCourses = courses_df
    .sort((a, b) => parseInt(b.recommendedBy) - parseInt(a.recommendedBy))
    .slice(0, 3)
    .map(course => ({
      title: course.title,
      recommendedBy: parseInt(course.recommendedBy),
      link: course.link
    }));

  console.log("Top courses:", topCourses);
  res.json(topCourses);
});

// ✅ Personalized Recommendation API
app.post("/api/course-recommend", (req, res) => {
  const { interests, skills, goal } = req.body;

  if (!interests || !skills || !goal) {
    return res.status(400).json({ error: "Missing required fields: interests, skills, goal" });
  }

  // Create user text
  const user_text = `${interests} ${skills} ${goal}`;

  // Calculate TF-IDF for user
  const userTfIdf = new natural.TfIdf();
  userTfIdf.addDocument(user_text);

  // Calculate similarities
  const similarities = [];
  courses_df.forEach((course, index) => {
    let similarity = 0;
    userTfIdf.tfidfs(user_text.split(' '), (i, measure, term) => {
      // Simple cosine similarity approximation
      similarity += measure;
    });
    similarities.push({ course, similarity: similarity / user_text.split(' ').length });
  });

  // Add similarity scores to courses
  courses_df.forEach((course, index) => {
    course.similarity = similarities[index].similarity;
  });

  // Calculate hybrid scores
  const maxRecommended = Math.max(...courses_df.map(c => parseInt(c.recommendedBy) || 0));

  courses_df.forEach(course => {
    const similarityScore = course.similarity || 0;
    const popularityScore = maxRecommended > 0 ? (parseInt(course.recommendedBy) || 0) / maxRecommended : 0;
    const ratingScore = (parseFloat(course.rating) || 0) / 5.0;

    course.finalScore = (similarityScore * 0.7) + (popularityScore * 0.2) + (ratingScore * 0.1);
  });

  // Get top recommendations
  const recommendations = courses_df
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5)
    .map(course => ({
      title: course.title,
      domain: course.domain,
      level: course.level,
      rating: parseFloat(course.rating),
      recommendedBy: parseInt(course.recommendedBy),
      link: course.link,
      matchScore: Math.round(course.finalScore * 100),
      reasons: generateMatchReasons(course, { interests, skills, goal })
    }));

  res.json(recommendations);
});

function generateMatchReasons(course, userProfile) {
  const reasons = [];

  if (course.domain.toLowerCase().includes(userProfile.interests.toLowerCase())) {
    reasons.push(`Matches your ${userProfile.interests} interest`);
  }

  const courseSkills = course.skills.toLowerCase().split(' ');
  const userSkills = userProfile.skills.toLowerCase().split(' ');
  const matchingSkills = userSkills.filter(skill =>
    courseSkills.some(courseSkill => courseSkill.includes(skill) || skill.includes(courseSkill))
  );
  if (matchingSkills.length > 0) {
    reasons.push(`Uses your ${matchingSkills.join(', ')} skills`);
  }

  if (parseInt(course.recommendedBy) > 10) {
    reasons.push("Highly recommended by seniors");
  }

  if (parseFloat(course.rating) >= 4.5) {
    reasons.push("Excellent course rating");
  }

  return reasons;
}

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ START
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});