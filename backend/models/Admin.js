// ============================================
// FILE: backend/models/Admin.js
// PURPOSE: Define the shape of Admin data in MongoDB
// Think of this like a "table definition" in SQL
// ============================================

const mongoose = require("mongoose");

// Define what fields an Admin document has in the database
const adminSchema = new mongoose.Schema(
  {
    // Admin's email — must be unique, no two admins with same email
    email: {
      type: String,
      required: true,  // Cannot be empty
      unique: true,    // No duplicates allowed
      lowercase: true, // Always save as lowercase
    },

    // Admin's password — will be stored as a hash (encrypted)
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the model
// mongoose.model("Admin", adminSchema) creates a "admins" collection in MongoDB
module.exports = mongoose.model("Admin", adminSchema);