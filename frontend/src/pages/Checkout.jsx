// ============================================
// FILE: frontend/src/pages/Checkout.jsx
// PURPOSE: Order form for customers
// Shows cart summary + form to collect name, phone, address
// Submits order to backend when form is filled
// ============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, MapPin, Phone, User, FileText } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Form state — stores what user types in each field
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);     // Loading state during API call
  const [orderSuccess, setOrderSuccess] = useState(false); // Show success message after order
  const [orderId, setOrderId] = useState("");

  // If cart is empty, redirect to home
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart-notice">
            <div style={{ fontSize: "4rem" }}>🛒</div>
            <h2>Your cart is empty!</h2>
            <p>Add some items to cart before checking out.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Browse Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Update form state when user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit order to backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate: all required fields must be filled
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all required fields!");
      return;
    }

    // Validate phone — must be at least 10 digits
    if (form.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data to send to backend
      const orderData = {
        customer: {
          name: form.name,
          phone: form.phone,
          address: form.address,
        },
        items: cartItems.map((item) => ({
          food: item._id,        // MongoDB ID of the food item
          name: item.name,       // Name at time of order
          price: item.price,     // Price at time of order
          quantity: item.quantity,
        })),
        totalPrice: cartTotal,
        notes: form.notes,
      };

      // POST /api/orders — send order to backend
      const response = await api.post("/orders", orderData);

      // Order placed successfully!
      setOrderId(response.data.order._id);
      setOrderSuccess(true);
      clearCart(); // Empty the cart after successful order
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // ---- Success Screen ----
  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">
              <CheckCircle size={60} color="var(--success)" />
            </div>
            <h2>Order Placed! 🎉</h2>
            <p>Your order has been received and is being prepared.</p>
            <div className="order-id-box">
              <span>Order ID:</span>
              <code>{orderId}</code>
            </div>
            <p className="success-info">
              Our team will call you at <strong>{form.phone}</strong> to confirm your order.
            </p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Order More Food
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Checkout Form ----
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">

          {/* ---- LEFT: Order Form ---- */}
          <div className="checkout-form-wrap">
            <div className="form-card">
              <div className="form-card-header">
                <MapPin size={20} />
                <h3>Delivery Details</h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={14} /> Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Ahmed Khan"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={14} /> Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="e.g., 03001234567"
                    required
                  />
                </div>

                {/* Delivery Address */}
                <div className="form-group">
                  <label htmlFor="address">
                    <MapPin size={14} /> Delivery Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House #, Street, Area, City"
                    rows={3}
                    required
                  />
                </div>

                {/* Special Notes (optional) */}
                <div className="form-group">
                  <label htmlFor="notes">
                    <FileText size={14} /> Special Instructions (optional)
                  </label>
                  <input
                    id="notes"
                    type="text"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="e.g., Less spicy, extra sauce..."
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" className="place-order-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="btn-spinner" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Place Order — Rs. {cartTotal}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ---- RIGHT: Order Summary ---- */}
          <div className="order-summary-wrap">
            <div className="form-card">
              <div className="form-card-header">
                <ShoppingBag size={20} />
                <h3>Order Summary</h3>
              </div>

              {/* List of items */}
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="summary-item-total">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotal}</span>
                </div>
                <div className="price-row">
                  <span>Delivery Fee</span>
                  <span className="text-primary">Free 🎉</span>
                </div>
                <div className="price-row price-total">
                  <span>Total</span>
                  <span>Rs. {cartTotal}</span>
                </div>
              </div>

              {/* Payment method note */}
              <div className="payment-note">
                <span>💵</span>
                <span>Cash on Delivery — Pay when your order arrives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;