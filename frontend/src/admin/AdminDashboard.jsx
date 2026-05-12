// ============================================
// FILE: frontend/src/admin/AdminDashboard.jsx
// PURPOSE: Admin panel layout with sidebar navigation
// All admin pages (AddFood, ManageFoods, ManageOrders) render inside this
// Checks if admin is logged in — redirects to login if not
// ============================================

import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, PlusCircle, ClipboardList,
  LogOut, Menu, X, Zap
} from "lucide-react";
import toast from "react-hot-toast";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar toggle

  // Check if admin is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // No token = not logged in, redirect to login
      navigate("/admin/login");
    }
  }, [navigate]);

  // Logout: clear token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully!");
    navigate("/admin/login");
  };

  // Sidebar navigation links
  const navItems = [
    {
      to: "/admin/dashboard",       // URL path
      icon: <LayoutDashboard size={18} />,
      label: "Dashboard",
      end: true, // Only exact match for active state
    },
    {
      to: "/admin/dashboard/add-food",
      icon: <PlusCircle size={18} />,
      label: "Add Food Item",
    },
    {
      to: "/admin/dashboard/manage-foods",
      icon: <UtensilsCrossed size={18} />,
      label: "Manage Foods",
    },
    {
      to: "/admin/dashboard/orders",
      icon: <ClipboardList size={18} />,
      label: "Manage Orders",
    },
  ];

  return (
    <div className="admin-layout">

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ---- LEFT SIDEBAR ---- */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Zap size={18} />
            </div>
            <div>
              <div className="sidebar-brand">FoodRush</div>
              <div className="sidebar-role">Admin Panel</div>
            </div>
          </div>
          {/* Close button for mobile */}
          <button className="sidebar-close hide-desktop" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)} // Close on mobile after click
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button at bottom */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ---- RIGHT: Main Content ---- */}
      <div className="admin-main">

        {/* Top Bar */}
        <header className="admin-topbar">
          {/* Hamburger for mobile */}
          <button
            className="sidebar-toggle hide-desktop"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-title">Restaurant Admin</div>
          <div className="topbar-admin-tag">
            <div className="admin-dot" />
            Admin
          </div>
        </header>

        {/* Page Content — child routes render here */}
        <main className="admin-content">
          <Outlet />
          {/* Outlet is a React Router v6 feature — renders the matched child route */}
        </main>
      </div>
    </div>
  );
};

// ---- Dashboard Home (Stats Overview) ----
// This shows when admin is on /admin/dashboard exactly
export const DashboardHome = () => {
  const [stats, setStats] = useState({ foods: 0, orders: 0, pending: 0 });

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        const { default: api } = await import("../utils/api");
        const [foodsRes, ordersRes] = await Promise.all([
          api.get("/foods"),
          api.get("/orders"),
        ]);
        const orders = ordersRes.data.orders;
        setStats({
          foods: foodsRes.data.foods.length,
          orders: orders.length,
          pending: orders.filter((o) => o.status === "pending").length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Food Items", value: stats.foods, icon: "🍔", color: "#ff4500" },
    { label: "Total Orders", value: stats.orders, icon: "📦", color: "#3b82f6" },
    { label: "Pending Orders", value: stats.pending, icon: "⏳", color: "#f59e0b" },
    { label: "Status", value: "Live", icon: "🟢", color: "#22c55e" },
  ];

  return (
    <div className="dashboard-home">
      <div className="admin-page-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-cards">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-card-icon">{card.icon}</div>
            <div className="stat-card-info">
              <div className="stat-card-value" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="stat-card-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-links">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <a href="/admin/dashboard/add-food" className="quick-action-card">
            <span>➕</span>
            <span>Add New Food Item</span>
          </a>
          <a href="/admin/dashboard/orders" className="quick-action-card">
            <span>📋</span>
            <span>View All Orders</span>
          </a>
          <a href="/" target="_blank" rel="noreferrer" className="quick-action-card">
            <span>👀</span>
            <span>View Customer Site</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;