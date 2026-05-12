// ============================================
// FILE: backend/routes/orderRoutes.js
// PURPOSE: Define API endpoints for orders
// Public: place order (no login)
// Protected: view orders, update status, delete (admin only)
// ============================================

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  placeOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

// PUBLIC ROUTE — Customer places an order (no login needed)
// Route: POST /api/orders
router.post("/", placeOrder);

// PROTECTED ROUTES — Admin only
// Route: GET /api/orders — View all orders
router.get("/", protect, getAllOrders);

// Route: PUT /api/orders/:id/status — Update order status
router.put("/:id/status", protect, updateOrderStatus);

// Route: DELETE /api/orders/:id — Delete an order
router.delete("/:id", protect, deleteOrder);

module.exports = router;