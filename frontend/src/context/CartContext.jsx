// ============================================
// FILE: frontend/src/context/CartContext.jsx
// PURPOSE: Global cart state management
// Any component can access cart data and functions
// Uses React Context API — no external library needed
// ============================================

import React, { createContext, useContext, useState, useEffect } from "react";

// Step 1: Create the Context (like a global store)
const CartContext = createContext();

// Step 2: Create the Provider component
// Wrap your app with this to give all children access to cart
export const CartProvider = ({ children }) => {
  // Cart items — stored in localStorage so they persist on refresh
  const [cartItems, setCartItems] = useState(() => {
    // Load saved cart from localStorage when app first loads
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Cart sidebar open/closed state
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ---- Cart Functions ----

  // Add item to cart
  // If item already in cart → increase quantity
  // If new item → add with quantity 1
  const addToCart = (food) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item._id === food._id);

      if (existingItem) {
        // Item exists — increase quantity
        return prev.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New item — add with quantity 1
        return [...prev, { ...food, quantity: 1 }];
      }
    });
  };

  // Remove item from cart completely
  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  };

  // Increase quantity of a specific item
  const increaseQuantity = (foodId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === foodId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity — if quantity becomes 0, remove item
  const decreaseQuantity = (foodId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === foodId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0) // Remove if quantity hits 0
    );
  };

  // Clear entire cart (after order is placed)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // Calculate total number of items in cart (sum of all quantities)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price of all items in cart
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Step 3: Provide all state and functions to children
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Step 4: Custom hook for easy access in any component
// Usage: const { cartItems, addToCart } = useCart();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};