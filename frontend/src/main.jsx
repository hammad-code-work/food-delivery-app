// ============================================
// FILE: frontend/src/main.jsx
// PURPOSE: React entry point
// This is the FIRST file that runs in the browser
// It mounts the React app into the #root div in index.html
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";

// Import App (the root component with all routes)
import App from "./App.jsx";

// Import global CSS files — ORDER MATTERS
import "./index.css"; // Base styles, CSS variables, utilities (load FIRST)
import "./App.css";   // App-level layout styles

// Mount the React app into <div id="root"> in public/index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode helps catch bugs during development
  // It renders components twice in dev mode to detect side effects
  // Has NO effect in production builds
  <React.StrictMode>
    <App />
  </React.StrictMode>
);