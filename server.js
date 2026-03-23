require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log("ENV CHECK:", process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL, {serverSelectionTimeoutMS: 60000})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Schema
const profileSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },

  // Common fields
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  // Employer fields
  companyName: {
    type: String,
  },
  companyType: {
    type: String,
  },

  // Jobseeker fields
  fullName: {
    type: String,
  },
  skills: {
    type: String,
  },
  resume: {
    type: String,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Save profile route
app.post("/api/profile", async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile saved successfully",
      data: newProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving profile",
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
