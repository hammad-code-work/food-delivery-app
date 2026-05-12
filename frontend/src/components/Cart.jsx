// ============================================
// FILE: frontend/src/components/Cart.jsx
// PURPOSE: Slide-out cart panel (right side)
// Shows cart items, quantity controls, total, and checkout button
// ============================================

import React from "react";
import { X, Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  // Close cart and go to checkout page
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  // Image URL helper
  const imageUrl = (filename) =>
    `${import.meta.env.VITE_API_URL}/uploads/${filename}`;

  return (
    <>
      {/* Dark overlay behind cart — click to close */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      )}

      {/* Cart Sidebar Panel */}
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>

        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={20} />
            <h3>Your Cart</h3>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List or Empty State */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <h4>Your cart is empty</h4>
              <p>Add some delicious food to get started!</p>
              <button
                className="btn-primary"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Show each cart item */
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                {/* Item Image */}
                <img
                  src={imageUrl(item.image)}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/60?text=Food";
                  }}
                />

                {/* Item Details */}
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">Rs. {item.price}</span>

                  {/* Quantity Controls */}
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="cart-item-right">
                  <span className="cart-item-subtotal">
                    Rs. {item.price * item.quantity}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer — only show if cart has items */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Order summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className="text-primary">Free</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>Rs. {cartTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;