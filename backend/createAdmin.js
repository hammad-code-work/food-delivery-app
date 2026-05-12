// ============================================
// FILE: backend/createAdmin.js
// PURPOSE: One-time script to create the first admin account
// Run ONCE with: node createAdmin.js
// After that you can login with your admin credentials
// ============================================

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createAdmin = async () => {
  try {
    // Step 1: Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Step 2: Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists with email:", process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    // Step 3: Hash the password before saving
    // bcrypt.hash() encrypts the password — never save plain text passwords!
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Step 4: Create admin in database
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("🎉 Admin created successfully!");
    console.log("📧 Email:", process.env.ADMIN_EMAIL);
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD);
    console.log("\nYou can now login at: http://localhost:5173/admin/login");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();