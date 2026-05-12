// ============================================
// FILE: backend/server.js
// PURPOSE: Main entry point for the backend
// Sets up Express, connects to MongoDB, loads routes
// Run this file with: npm run dev
// ============================================

// Load environment variables from .env file
// Must be called before anything else uses process.env
require("dotenv").config();

const express = require("express");
const cors = require("cors");     // Allows frontend to talk to backend
const path = require("path");     // For serving static files (images)
const connectDB = require("./config/db");

// Step 1: Create Express app
const app = express();

// Step 2: Connect to MongoDB
connectDB();

// -----------------------------------------------
// MIDDLEWARE — Runs on every request
// -----------------------------------------------

// Allow requests from React frontend (localhost:5173 in development)
app.use(cors({
  origin: [
    "http://localhost:5173",   // Vite dev server
    "http://localhost:3000",   // CRA dev server (just in case)
  ],
  credentials: true,
}));

// Parse JSON bodies — needed to read req.body in controllers
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
// When frontend requests /uploads/food-123.jpg — Express serves the file
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// -----------------------------------------------
// ROUTES — Connect URL paths to route files
// -----------------------------------------------

// Admin login routes: /api/admin/login
app.use("/api/admin", require("./routes/adminRoutes"));

// Food item routes: /api/foods/
app.use("/api/foods", require("./routes/foodRoutes"));

// Order routes: /api/orders/
app.use("/api/orders", require("./routes/orderRoutes"));

// Default route — just to verify server is running
app.get("/", (req, res) => {
  res.json({ message: "🍕 Food Delivery API is running!" });
});

// -----------------------------------------------
// START SERVER
// -----------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});