// ============================================
// FILE: backend/models/Food.js
// PURPOSE: Define the shape of Food Item data in MongoDB
// Each food item in the menu will follow this structure
// ============================================

const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    // Name of the food (e.g., "Chicken Burger")
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces from beginning/end
    },

    // Description of the food (e.g., "Crispy fried chicken with lettuce")
    description: {
      type: String,
      required: true,
    },

    // Price in your currency (e.g., 250 for Rs. 250)
    price: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },

    // Category helps filter items (e.g., "Burgers", "Pizza", "Drinks")
    category: {
      type: String,
      required: true,
    },

    // Filename of the uploaded image (stored in backend/uploads folder)
    image: {
      type: String,
      required: true,
    },

    // Whether this item is currently available for order
    isAvailable: {
      type: Boolean,
      default: true, // Available by default when added
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Food", foodSchema);