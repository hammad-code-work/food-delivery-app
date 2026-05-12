// ============================================
// FILE: backend/controllers/orderController.js
// PURPOSE: Handle order placement and management
// Customer places order → Admin views & updates status
// ============================================

const Order = require("../models/Order");

// --------------------------------------------------
// FUNCTION: placeOrder
// ROUTE: POST /api/orders
// ACCESS: Public (no login needed for customers)
// --------------------------------------------------
const placeOrder = async (req, res) => {
  try {
    // Step 1: Get order data from request body
    const { customer, items, totalPrice, notes } = req.body;

    // Step 2: Validate required fields
    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({ message: "Please fill all customer details" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Invalid total price" });
    }

    // Step 3: Create a new order in database
    const newOrder = await Order.create({
      customer,
      items,
      totalPrice,
      notes: notes || "",
      status: "pending", // All orders start as pending
    });

    // Step 4: Send success response
    res.status(201).json({
      message: "Order placed successfully! We will contact you soon.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// --------------------------------------------------
// FUNCTION: getAllOrders
// ROUTE: GET /api/orders
// ACCESS: Admin only (protected)
// --------------------------------------------------
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders, newest first
    // .populate("items.food") fills in food details from Food collection
    const orders = await Order.find()
      .populate("items.food", "name image") // Get food name and image
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// --------------------------------------------------
// FUNCTION: updateOrderStatus
// ROUTE: PUT /api/orders/:id/status
// ACCESS: Admin only (protected)
// --------------------------------------------------
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated!", order: updatedOrder });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// --------------------------------------------------
// FUNCTION: deleteOrder
// ROUTE: DELETE /api/orders/:id
// ACCESS: Admin only (protected)
// --------------------------------------------------
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

module.exports = { placeOrder, getAllOrders, updateOrderStatus, deleteOrder };