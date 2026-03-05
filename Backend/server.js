require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { clerkMiddleware } = require("@clerk/express");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // 👈 VERY IMPORTANT

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/scholoholicDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes
const scholarshipRoutes = require("./Routes/ScholarshipRoutes");
app.use("/api/scholarships", scholarshipRoutes);

const studentRoutes = require("./Routes/StudentRoutes");
app.use("/api/students", studentRoutes);

// Test Route (optional)
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});