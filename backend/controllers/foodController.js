// ============================================
// FILE: backend/controllers/foodController.js
// PURPOSE: Handle all food item operations
// Add food, get all foods, update food, delete food
// ============================================

const Food = require("../models/Food");
const fs = require("fs"); // File system — used to delete image files
const path = require("path");

// --------------------------------------------------
// FUNCTION: getAllFoods
// ROUTE: GET /api/foods
// ACCESS: Public (customers can see food items)
// --------------------------------------------------
const getAllFoods = async (req, res) => {
  try {
    // Fetch all food items from database
    // Sort by newest first using -1 (descending order)
    const foods = await Food.find().sort({ createdAt: -1 });

    res.status(200).json({ foods });
  } catch (error) {
    console.error("Get Foods Error:", error);
    res.status(500).json({ message: "Failed to fetch food items" });
  }
};

// --------------------------------------------------
// FUNCTION: getFoodsByCategory
// ROUTE: GET /api/foods/category/:category
// ACCESS: Public
// --------------------------------------------------
const getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({ foods });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods by category" });
  }
};

// --------------------------------------------------
// FUNCTION: addFood
// ROUTE: POST /api/foods
// ACCESS: Admin only (protected)
// --------------------------------------------------
const addFood = async (req, res) => {
  try {
    // Step 1: Get form data from request body
    const { name, description, price, category } = req.body;

    // Step 2: Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a food image" });
    }

    // Step 3: Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 4: Create new food item in database
    // req.file.filename is the name multer gave to the uploaded image
    const newFood = await Food.create({
      name,
      description,
      price: parseFloat(price), // Convert string to number
      category,
      image: req.file.filename, // Just the filename, not full path
    });

    res.status(201).json({ message: "Food item added successfully!", food: newFood });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Failed to add food item" });
  }
};

// --------------------------------------------------
// FUNCTION: updateFood
// ROUTE: PUT /api/foods/:id
// ACCESS: Admin only (protected)
// --------------------------------------------------
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, isAvailable } = req.body;

    // Find the existing food item
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Build update object — only update provided fields
    const updateData = {
      name: name || food.name,
      description: description || food.description,
      price: price ? parseFloat(price) : food.price,
      category: category || food.category,
      isAvailable: isAvailable !== undefined ? isAvailable : food.isAvailable,
    };

    // If a new image was uploaded, update image and delete old one
    if (req.file) {
      // Delete old image file from uploads folder
      const oldImagePath = path.join(__dirname, "../uploads", food.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the file
      }
      updateData.image = req.file.filename; // Set new image filename
    }

    // Update the food document in database
    const updatedFood = await Food.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Food item updated!", food: updatedFood });
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ message: "Failed to update food item" });
  }
};

// --------------------------------------------------
// FUNCTION: deleteFood
// ROUTE: DELETE /api/foods/:id
// ACCESS: Admin only (protected)
// --------------------------------------------------
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the food item first to get the image filename
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Delete the image file from uploads folder
    const imagePath = path.join(__dirname, "../uploads", food.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Remove image from disk
    }

    // Delete the food document from database
    await Food.findByIdAndDelete(id);

    res.status(200).json({ message: "Food item deleted successfully!" });
  } catch (error) {
    console.error("Delete Food Error:", error);
    res.status(500).json({ message: "Failed to delete food item" });
  }
};

// Export all functions
module.exports = { getAllFoods, getFoodsByCategory, addFood, updateFood, deleteFood };