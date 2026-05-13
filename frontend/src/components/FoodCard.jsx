// ============================================
// FILE: frontend/src/components/FoodCard.jsx
// PURPOSE: Display a single food item as a card
// UPDATED: After clicking Add → shows "Added!" for 1 second
//          then automatically opens the cart sidebar
// ============================================

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./FoodCard.css";

const FoodCard = ({ food }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(food); // Add item to cart

    // Step 1: Show "Added!" with checkmark
    setAdded(true);

    // Step 2: After 1 second, reset button AND open cart sidebar
    setTimeout(() => {
      setAdded(false);
      setIsCartOpen(true); // ← This opens the cart popup
    }, 1000);
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
      </div>

      <div className="food-card-body">
        <h3 className="food-card-name">{food.name}</h3>
        <p className="food-card-desc">{food.description}</p>

        <div className="food-card-footer">
          <span className="food-card-price">Rs. {food.price}</span>

          <button
            className={`add-to-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check size={16} />
                Added!
              </>
            ) : (
              <>
                <Plus size={16} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;