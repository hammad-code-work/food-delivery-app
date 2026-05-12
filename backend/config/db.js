// ============================================
// FILE: backend/config/db.js
// PURPOSE: Connect our app to MongoDB database
// This runs once when server starts
// ============================================

const mongoose = require("mongoose");

// This function connects to MongoDB using the URL from .env file
const connectDB = async () => {
  try {
    // mongoose.connect() establishes the connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    // If connection fails, show error and stop the server
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit with failure code
  }
};

// Export so server.js can use it
module.exports = connectDB;