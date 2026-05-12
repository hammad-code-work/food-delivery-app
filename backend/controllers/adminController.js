// ============================================
// FILE: backend/controllers/adminController.js
// PURPOSE: Handle admin login
// When admin submits email+password → check DB → return JWT token
// ============================================

const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs"); // For comparing hashed passwords
const jwt = require("jsonwebtoken"); // For creating tokens

// --------------------------------------------------
// FUNCTION: loginAdmin
// ROUTE: POST /api/admin/login
// ACCESS: Public (anyone can try to login)
// --------------------------------------------------
const loginAdmin = async (req, res) => {
  try {
    // Step 1: Get email and password from request body
    const { email, password } = req.body;

    // Step 2: Validate — both fields must be provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Step 3: Find admin in database by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 4: Compare submitted password with hashed password in DB
    // bcrypt.compare() returns true/false
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Step 5: Create a JWT token that lasts 7 days
    // This token is sent to frontend and stored in localStorage
    const token = jwt.sign(
      { id: admin._id, email: admin.email }, // Payload (data inside token)
      process.env.JWT_SECRET,               // Secret key from .env
      { expiresIn: "7d" }                   // Token expiry
    );

    // Step 6: Send success response with token
    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { loginAdmin };