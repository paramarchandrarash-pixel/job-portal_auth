require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error.message);
  });

// Schema
const profileSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true
    },

    // Common fields
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },

    // Jobseeker fields
    name: {
      type: String,
      trim: true
    },
    skills: {
      type: String,
      trim: true
    },
    education: {
      type: String,
      trim: true
    },
    experience: {
      type: String,
      trim: true
    },
    resumeName: {
      type: String,
      trim: true
    },

    // Employer fields
    company: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      trim: true
    },
    desc: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    person: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Save profile route
app.post("/save-profile", async (req, res) => {
  try {
    const data = req.body;

    const newProfile = new Profile(data);
    await newProfile.save();

    console.log("Saved Data:", data);

    res.json({
      message: "Profile saved successfully ✅",
      data
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({
      message: "Failed to save profile ❌"
    });
  }
});

// Fetch all profiles route
app.get("/profiles", async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });

    res.json({
      message: "Profiles fetched successfully ✅",
      data: profiles
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({
      message: "Failed to fetch profiles ❌"
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});