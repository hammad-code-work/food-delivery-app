// ============================================
// FILE: backend/models/Order.js
// PURPOSE: Define the shape of Order data in MongoDB
// Every time a customer places an order, it follows this structure
// ============================================

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Customer personal information (filled in checkout form)
    customer: {
      name: { type: String, required: true },       // Customer full name
      phone: { type: String, required: true },      // Contact number
      address: { type: String, required: true },    // Delivery address
    },

    // Array of items in the order
    // Each item references a Food document and stores quantity
    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId, // Links to Food model
          ref: "Food",                          // Reference collection name
          required: true,
        },
        name: { type: String, required: true },   // Food name at time of order
        price: { type: Number, required: true },  // Price at time of order
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    // Total price of the order (calculated on frontend, verified on backend)
    totalPrice: {
      type: Number,
      required: true,
    },

    // Current status of the order — admin can update this
    // Flow: pending → confirmed → preparing → out_for_delivery → delivered
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending", // All new orders start as "pending"
    },

    // Special instructions from customer (optional)
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Adds createdAt (when order was placed) and updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);