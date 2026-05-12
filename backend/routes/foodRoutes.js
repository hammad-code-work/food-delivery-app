// ============================================
// FILE: backend/routes/foodRoutes.js
// PURPOSE: Define API endpoints for food items
// Public routes: anyone can view foods
// Protected routes: only admin can add/edit/delete
// ============================================

const express = require("express");
const router = express.Router();
const multer = require("multer"); // For handling file uploads
const path = require("path");

// Import controller functions
const {
  getAllFoods,
  getFoodsByCategory,
  addFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

// Import auth middleware to protect admin routes
const { protect } = require("../middleware/authMiddleware");

// -----------------------------------------------
// MULTER CONFIGURATION — for image uploads
// Multer saves uploaded images to the uploads/ folder
// -----------------------------------------------
const storage = multer.diskStorage({
  // Where to save the file
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save in uploads folder
  },

  // What to name the file (we make it unique using timestamp)
  filename: (req, file, cb) => {
    // e.g., "food-1703123456789.jpg"
    const uniqueName = "food-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Only allow image files (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(file.mimetype);
  if (isValid) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject file
  }
};

// Create multer upload middleware (max 5MB per file)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// -----------------------------------------------
// ROUTES
// -----------------------------------------------

// PUBLIC ROUTES (no login required)
// Route: GET /api/foods — Get all food items
router.get("/", getAllFoods);

// Route: GET /api/foods/category/:category — Get foods by category
router.get("/category/:category", getFoodsByCategory);

// PROTECTED ROUTES (admin login required)
// Route: POST /api/foods — Add new food item (with image)
// protect runs first → if valid token → upload image → addFood
router.post("/", protect, upload.single("image"), addFood);

// Route: PUT /api/foods/:id — Update a food item
router.put("/:id", protect, upload.single("image"), updateFood);

// Route: DELETE /api/foods/:id — Delete a food item
router.delete("/:id", protect, deleteFood);

module.exports = router;