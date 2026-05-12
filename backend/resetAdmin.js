// ============================================
// FILE: backend/resetAdmin.js
// PURPOSE: Reset/recreate the admin account with fresh password
// Run with: node resetAdmin.js
// Use this if you get "invalid credentials" on login
// ============================================

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const resetAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete any existing admin account
    await Admin.deleteMany({});
    console.log("🗑️  Old admin account removed");

    // Hash the new password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create fresh admin account
    await Admin.create({
      email: "admin@foodapp.com",
      password: hashedPassword,
    });

    console.log("🎉 Admin account reset successfully!");
    console.log("📧 Email:    admin@foodapp.com");
    console.log("🔑 Password: admin123");
    console.log("\nNow login at: http://localhost:5173/admin/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetAdmin();