// ============================================
// FILE: frontend/src/pages/Home.jsx
// UPDATED: Search bar now shows live suggestion dropdown
//          as user types — shows matching food names from menu
// ============================================

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import FoodCard from "../components/FoodCard";
import api from "../utils/api";
import "./Home.css";

const CATEGORIES = ["All", "Burgers", "Pizza", "Biryani", "Drinks", "Desserts", "Sandwiches", "Wraps"];

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Dropdown suggestions list
  const [showSuggestions, setShowSuggestions] = useState(false); // Show/hide dropdown
  const [searchParams] = useSearchParams();

  // Ref to detect clicks outside the search box (to close dropdown)
  const searchRef = useRef(null);

  // Fetch all foods on mount
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await api.get("/foods");
        setFoods(response.data.foods);
        setFiltered(response.data.foods);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  // Close dropdown when user clicks anywhere outside the search box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When navbar URL changes → set category + scroll
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) {
      setActiveCategory(urlCategory);
      setTimeout(() => {
        document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      setActiveCategory("All");
    }
  }, [searchParams]);

  // Filter food grid whenever category or search changes
  useEffect(() => {
    let result = foods;
    if (activeCategory !== "All") {
      result = result.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFiltered(result);
  }, [activeCategory, searchQuery, foods]);

  // When user types → update query + build suggestion list
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      // Find foods whose NAME matches what user typed
      const matches = foods
        .filter((f) => f.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 6); // Show max 6 suggestions
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      // Empty input → hide suggestions
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (food) => {
    setSearchQuery(food.name);   // Fill search bar with food name
    setShowSuggestions(false);   // Hide dropdown
    // Scroll to menu so user can see the result
    setTimeout(() => {
      document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Clear search bar
  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleMenuCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  const handleHeroCategoryClick = (cat) => {
    setActiveCategory(cat);
    setTimeout(() => {
      document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Build image URL for suggestion thumbnails
  const imageUrl = (filename) =>
    `${import.meta.env.VITE_API_URL}/uploads/${filename}`;

  return (
    <div className="home-page">

      {/* SECTION 1 — Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">🚀 Fast Delivery in 30 mins</div>
            <h1 className="hero-title">
              Craving something<br />
              <span className="hero-highlight">delicious?</span>
            </h1>
            <p className="hero-subtitle">
              Order from the best restaurants near you. Fresh, hot, and delivered fast.
            </p>

            {/* ---- Search Bar with Suggestions Dropdown ---- */}
            {/* ref lets us detect clicks outside to close dropdown */}
            <div className="search-wrapper" ref={searchRef}>
              <div className="hero-search">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for food, burgers, pizza..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => {
                    // Re-show suggestions if there's already text
                    if (searchQuery.trim() && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="search-input"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button className="search-clear-btn" onClick={handleClearSearch}>
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((food) => (
                    <div
                      key={food._id}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(food)}
                      // onMouseDown instead of onClick — fires before onBlur
                    >
                      {/* Food thumbnail */}
                      <img
                        src={imageUrl(food.image)}
                        alt={food.name}
                        className="suggestion-img"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/36?text=F";
                        }}
                      />
                      {/* Food name + category */}
                      <div className="suggestion-info">
                        {/* Highlight the matching part of the name */}
                        <span className="suggestion-name">
                          {highlightMatch(food.name, searchQuery)}
                        </span>
                        <span className="suggestion-category">{food.category}</span>
                      </div>
                      {/* Price on the right */}
                      <span className="suggestion-price">Rs. {food.price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* No match state */}
              {showSuggestions && searchQuery.trim() && suggestions.length === 0 && (
                <div className="suggestions-dropdown">
                  <div className="suggestion-empty">
                    <Search size={16} />
                    No results for "<strong>{searchQuery}</strong>"
                  </div>
                </div>
              )}
            </div>

            {/* Hero category pills */}
            <div className="hero-categories">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <button
                  key={cat}
                  className={`hero-cat-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => handleHeroCategoryClick(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-emoji-grid">
              {["🍕", "🍔", "🍗", "🍜", "🌮", "🍣", "🥗", "🍩"].map((emoji, i) => (
                <div key={i} className="hero-emoji" style={{ animationDelay: `${i * 0.1}s` }}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Our Menu */}
      <section className="menu-section" id="menu-section">
        <div className="container">

          <div className="section-header">
            <div>
              <h2 className="section-title">Our Menu</h2>
              {activeCategory !== "All" && (
                <div className="active-filter-tag">
                  Showing: <strong>{activeCategory}</strong>
                  <button className="clear-filter-btn" onClick={() => setActiveCategory("All")}>
                    <X size={13} /> Clear
                  </button>
                </div>
              )}
            </div>
            <p className="section-subtitle">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="category-filter">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => handleMenuCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <div style={{ fontSize: "3rem" }}>🔍</div>
              <h3>No items found</h3>
              <p>Try a different category or search term</p>
              <button className="btn-primary" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                Show All Items
              </button>
            </div>
          ) : (
            <div className="food-grid">
              {filtered.map((food) => (
                <FoodCard key={food._id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// ---- Helper: bold the matching part of the food name ----
// e.g. searching "burg" in "Chicken Burger" → Chicken <b>Burg</b>er
const highlightMatch = (text, query) => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <strong className="highlight-match">{text.slice(index, index + query.length)}</strong>
      {text.slice(index + query.length)}
    </>
  );
};

export default Home;