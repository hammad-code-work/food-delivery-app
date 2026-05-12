// ============================================
// FILE: frontend/src/components/Navbar.jsx
// PURPOSE: Top navigation bar for customer pages
// UPDATED: Category clicks now filter menu AND scroll to it
// ============================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Zap } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Categories shown in navbar
  const categories = ["All", "Burgers", "Pizza", "Biryani", "Drinks", "Desserts"];

  // When a category is clicked:
  // 1. Navigate to home with ?category=X in URL
  // 2. Smoothly scroll down to the menu section
  const handleCategoryClick = (cat) => {
    setMenuOpen(false); // Close mobile menu if open

    // Navigate to home with category filter in URL
    const url = cat === "All" ? "/" : `/?category=${cat}`;
    navigate(url);

    // Small delay to let the page load/update, then scroll to menu
    setTimeout(() => {
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        menuSection.scrollIntoView({
          behavior: "smooth", // Smooth animated scroll
          block: "start",     // Scroll to top of menu section
        });
      }
    }, 100); // 100ms delay ensures the page has updated before scrolling
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Logo — clicking goes home */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Zap size={18} />
          </div>
          <span className="logo-text">FoodRush</span>
        </Link>

        {/* Desktop Category Buttons */}
        <div className="navbar-links hide-mobile">
          {categories.map((cat) => (
            <button
              key={cat}
              className="nav-link"
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cart + Hamburger */}
        <div className="navbar-actions">
          <button
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
            <span className="hide-mobile">My Cart</span>
          </button>

          <button
            className="hamburger hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {categories.map((cat) => (
            <button
              key={cat}
              className="mobile-nav-link"
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;