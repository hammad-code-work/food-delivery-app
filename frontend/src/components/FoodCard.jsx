// ============================================
// FILE: frontend/src/components/FoodCard.jsx
// UPDATED: Button stays green with quantity controls
//          if item is already in cart
// ============================================

import React from "react";
import { Plus, Check, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./FoodCard.css";

const FoodCard = ({ food }) => {
  const { addToCart, increaseQuantity, decreaseQuantity, cartItems, setIsCartOpen } = useCart();

  // Check if this food item is already in the cart
  const cartItem = cartItems.find((item) => item._id === food._id);
  const isInCart = !!cartItem;          // true if item exists in cart
  const quantity = cartItem?.quantity || 0; // how many are in cart

  // First time adding to cart
  const handleAdd = () => {
    addToCart(food);
    // Open cart after adding
    setTimeout(() => {
      setIsCartOpen(true);
    }, 800);
  };

  const imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${food.image}`;

  return (
    <div className="food-card">
      <div className="food-card-image-wrap">
        <img
          src={imageUrl}
          alt={food.name}
          className="food-card-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=Food";
          }}
        />
        <span className="food-card-category">{food.category}</span>

        {/* Show green "In Cart" badge on image if item is in cart */}
        {isInCart && (
          <span className="in-cart-badge">
            <Check size={11} /> In Cart
          </span>
        )}
      </div>

      <div className="food-card-body">
        <h3 className="food-card-name">{food.name}</h3>
        <p className="food-card-desc">{food.description}</p>

        <div className="food-card-footer">
          <span className="food-card-price">Rs. {food.price}</span>

          {/* ---- If item NOT in cart: show Add button ---- */}
          {!isInCart ? (
            <button className="add-to-cart-btn" onClick={handleAdd}>
              <Plus size={16} />
              Add
            </button>
          ) : (
            /* ---- If item IS in cart: show green quantity controls ---- */
            <div className="qty-controls">
              {/* Minus button — decrease quantity */}
              <button
                className="qty-control-btn"
                onClick={() => decreaseQuantity(food._id)}
                title="Remove one"
              >
                <Minus size={14} />
              </button>

              {/* Show current quantity in green */}
              <span className="qty-display">
                <Check size={12} />
                {quantity}
              </span>

              {/* Plus button — add more */}
              <button
                className="qty-control-btn"
                onClick={() => increaseQuantity(food._id)}
                title="Add one more"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;