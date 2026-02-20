require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/scholoholicDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const scholarshipRoutes = require("./Routes/ScholarshipRoutes");
app.use("/api/scholarships", scholarshipRoutes);
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
