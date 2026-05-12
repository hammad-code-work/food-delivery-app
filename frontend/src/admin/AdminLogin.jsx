// ============================================
// FILE: frontend/src/admin/AdminLogin.jsx
// PURPOSE: Admin login page
// Admin enters email + password → gets JWT token → goes to dashboard
// ============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Lock, Mail, Eye, EyeOff } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [loading, setLoading] = useState(false);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      // POST /api/admin/login
      const response = await api.post("/admin/login", { email, password });

      // Save the token to localStorage
      // This token will be sent with every future admin request
      localStorage.setItem("adminToken", response.data.token);

      toast.success("Welcome back, Admin! 👋");
      navigate("/admin/dashboard"); // Go to admin dashboard
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-logo-icon">
            <Zap size={24} />
          </div>
          <h1>FoodRush</h1>
        </div>

        <div className="admin-login-header">
          <h2>Admin Login</h2>
          <p>Sign in to manage your restaurant</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="admin-login-form">

          {/* Email Field */}
          <div className="admin-form-group">
            <label>Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@foodapp.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {/* Toggle password visibility */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Hint for default credentials */}
        <p className="admin-login-hint">
          Default: admin@foodapp.com / admin123
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;