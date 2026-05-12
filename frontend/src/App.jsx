// ============================================
// FILE: frontend/src/App.jsx
// PURPOSE: Main app component — sets up all routes
// UPDATED: Footer added to CustomerLayout
// ============================================

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---- Context ----
import { CartProvider } from "./context/CartContext";

// ---- Shared Components ----
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Footer from "./components/Footer"; // ← NEW

// ---- Customer Pages ----
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";

// ---- Admin Pages ----
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard, { DashboardHome } from "./admin/AdminDashboard";
import AddFood from "./admin/AddFood";
import ManageFoods from "./admin/ManageFoods";
import ManageOrders from "./admin/ManageOrders";

// ============================================
// CustomerLayout: Navbar + Cart + Page + Footer
// Admin pages do NOT use this layout
// ============================================
const CustomerLayout = ({ children }) => {
  return (
    <>
      {/* Top navigation bar */}
      <Navbar />

      {/* Slide-out cart sidebar */}
      <Cart />

      {/* Page content */}
      <main>{children}</main>

      {/* Footer — shows on every customer page */}
      <Footer />
    </>
  );
};

// ============================================
// PrivateRoute: Protects admin routes
// If no token → redirect to /admin/login
// ============================================
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

// ============================================
// App — Root component
// ============================================
const App = () => {
  return (
    <CartProvider>
      <Router>

        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />

        <Routes>

          {/* ---- CUSTOMER ROUTES ---- */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <Home />
              </CustomerLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <CustomerLayout>
                <Checkout />
              </CustomerLayout>
            }
          />

          {/* ---- ADMIN ROUTES ---- */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="add-food" element={<AddFood />} />
            <Route path="manage-foods" element={<ManageFoods />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>

          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;