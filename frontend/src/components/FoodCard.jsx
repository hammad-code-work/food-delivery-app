// ============================================
// FILE: frontend/src/components/FoodCard.jsx
// PURPOSE: Display a single food item as a card
// Shows image, name, category, price, and Add to Cart button
// ============================================

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./FoodCard.css";

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false); // Show "Added!" feedback

  // When user clicks "Add to Cart"
  const handleAddToCart = () => {
    addToCart(food); // Add to global cart state

    // Show a checkmark for 1.5 seconds to confirm
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Build the image URL — images are served from backend uploads folder
  const imageUrl = `${import.meta.env.VITE_API_URL}/uploads/${food.image}`;

  return (
    <div className="food-card">
      {/* Food Image */}
      <div className="food-card-image-wrap">
        <img
          src={imageUrl}
          alt={food.name}
          className="food-card-image"
          onError={(e) => {
            // Show placeholder if image fails to load
            e.target.src = "https://via.placeholder.com/300x200?text=Food";
          }}
        />
        {/* Category pill on top of image */}
        <span className="food-card-category">{food.category}</span>
      </div>

      {/* Food Info */}
      <div className="food-card-body">
        <h3 className="food-card-name">{food.name}</h3>
        <p className="food-card-desc">{food.description}</p>

        {/* Price + Add to Cart */}
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