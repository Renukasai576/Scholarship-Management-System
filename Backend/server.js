require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const app = express();

// ✅ CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ BODY PARSER
app.use(express.json());

// ✅ FIXED CLERK (IMPORTANT)
app.use(clerkMiddleware()); // 🔥 THIS IS THE FIX

// ✅ MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/scholoholicDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

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
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// ✅ START
app.listen(5001, () => {
  console.log("Server running on port 5001");
});