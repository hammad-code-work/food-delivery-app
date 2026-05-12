// ============================================
// FILE: backend/routes/adminRoutes.js
// PURPOSE: Define API endpoints for admin authentication
// All routes here start with /api/admin/
// ============================================

const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

// Route: POST /api/admin/login
// Purpose: Admin login — returns JWT token on success
router.post("/login", loginAdmin);

module.exports = router;