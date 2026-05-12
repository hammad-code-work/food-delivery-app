// ============================================
// FILE: frontend/src/admin/ManageOrders.jsx
// PURPOSE: Admin page to view all customer orders
// Admin can see order details (customer info, items, total)
// Admin can update the order status step by step
// Admin can delete an order
// ============================================

import React, { useState, useEffect } from "react";
import { Trash2, ChevronDown, RefreshCw, Phone, MapPin, User, ShoppingBag } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./ManageOrders.css";

// Order status flow — in this exact order
// Each status has a label, color class, and next possible step
const ORDER_STATUSES = [
  { value: "pending",           label: "Pending",          next: "confirmed" },
  { value: "confirmed",         label: "Confirmed",        next: "preparing" },
  { value: "preparing",         label: "Preparing",        next: "out_for_delivery" },
  { value: "out_for_delivery",  label: "Out for Delivery", next: "delivered" },
  { value: "delivered",         label: "Delivered",        next: null }, // Final stage
  { value: "cancelled",         label: "Cancelled",        next: null }, // End stage
];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);        // All orders from API
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);    // Which order is expanded
  const [filterStatus, setFilterStatus] = useState("all"); // Filter by status
  const [updatingId, setUpdatingId] = useState(null);     // Which order is being updated
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fetch all orders when page loads
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders"); // GET /api/orders (admin protected)
      setOrders(response.data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ---- Update order status ----
  // Called when admin clicks "Mark as [next status]" or selects from dropdown
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId); // Show loading on that specific order

      // PUT /api/orders/:id/status
      await api.put(`/orders/${orderId}/status`, { status: newStatus });

      toast.success(`Order marked as "${newStatus.replace("_", " ")}"!`);
      fetchOrders(); // Refresh list
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // ---- Delete an order ----
  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}`); // DELETE /api/orders/:id
      toast.success("Order deleted!");
      setDeleteConfirmId(null);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  // ---- Toggle expand/collapse of order details ----
  const toggleExpand = (orderId) => {
    setExpandedId(expandedId === orderId ? null : orderId);
  };

  // ---- Filter orders by status ----
  const filteredOrders = orders.filter((order) =>
    filterStatus === "all" ? true : order.status === filterStatus
  );

  // ---- Helper: get status config by value ----
  const getStatusConfig = (statusValue) =>
    ORDER_STATUSES.find((s) => s.value === statusValue) || {};

  // ---- Helper: format date nicely ----
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---- Count orders by status (for filter badges) ----
  const countByStatus = (status) =>
    orders.filter((o) => o.status === status).length;

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="orders-header">
        <div className="admin-page-header" style={{ marginBottom: 0 }}>
          <h2>Manage Orders</h2>
          <p>{orders.length} total order{orders.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Refresh button */}
        <button className="refresh-btn" onClick={fetchOrders} title="Refresh orders">
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* ---- Status Filter Tabs ---- */}
      <div className="status-filter-tabs">
        {/* "All" tab */}
        <button
          className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All
          <span className="tab-count">{orders.length}</span>
        </button>

        {/* One tab per status */}
        {ORDER_STATUSES.map((s) => {
          const count = countByStatus(s.value);
          if (count === 0) return null; // Hide tabs with 0 orders
          return (
            <button
              key={s.value}
              className={`filter-tab ${filterStatus === s.value ? "active" : ""}`}
              onClick={() => setFilterStatus(s.value)}
            >
              {s.label}
              <span className="tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Orders List ---- */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <div style={{ fontSize: "3rem" }}>📭</div>
          <h3>No orders found</h3>
          <p>
            {filterStatus === "all"
              ? "No orders have been placed yet."
              : `No "${filterStatus}" orders right now.`}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const isExpanded = expandedId === order._id;
            const isUpdating = updatingId === order._id;

            return (
              <div key={order._id} className="order-card">

                {/* ---- ORDER CARD TOP ROW ---- */}
                <div
                  className="order-card-header"
                  onClick={() => toggleExpand(order._id)} // Click to expand
                >
                  {/* Left: Order ID + Date */}
                  <div className="order-id-section">
                    <div className="order-id">
                      #{order._id.slice(-6).toUpperCase()} {/* Show last 6 chars of ID */}
                    </div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>

                  {/* Middle: Customer name + item count */}
                  <div className="order-customer-brief">
                    <span className="order-customer-name">
                      <User size={13} />
                      {order.customer.name}
                    </span>
                    <span className="order-items-count">
                      <ShoppingBag size={13} />
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Right: Total + Status badge + Chevron */}
                  <div className="order-card-right">
                    <span className="order-total">Rs. {order.totalPrice}</span>

                    {/* Status badge — color changes by status */}
                    <span className={`status-badge status-${order.status}`}>
                      {statusConfig.label}
                    </span>

                    {/* Expand/collapse chevron */}
                    <ChevronDown
                      size={18}
                      className={`chevron-icon ${isExpanded ? "rotated" : ""}`}
                    />
                  </div>
                </div>

                {/* ---- EXPANDED ORDER DETAILS ---- */}
                {isExpanded && (
                  <div className="order-details">

                    {/* Two columns: customer info + items list */}
                    <div className="order-details-grid">

                      {/* Customer Info */}
                      <div className="order-customer-info">
                        <h4>Customer Details</h4>
                        <div className="customer-detail-row">
                          <User size={14} />
                          <span>{order.customer.name}</span>
                        </div>
                        <div className="customer-detail-row">
                          <Phone size={14} />
                          <a href={`tel:${order.customer.phone}`}>
                            {order.customer.phone}
                          </a>
                        </div>
                        <div className="customer-detail-row">
                          <MapPin size={14} />
                          <span>{order.customer.address}</span>
                        </div>
                        {/* Special notes (if any) */}
                        {order.notes && (
                          <div className="order-notes">
                            <strong>Note:</strong> {order.notes}
                          </div>
                        )}
                      </div>

                      {/* Ordered Items */}
                      <div className="order-items-list">
                        <h4>Ordered Items</h4>
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item-row">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-qty">× {item.quantity}</span>
                            <span className="order-item-price">
                              Rs. {item.price * item.quantity}
                            </span>
                          </div>
                        ))}

                        {/* Total */}
                        <div className="order-item-row order-total-row">
                          <span>Total</span>
                          <span></span>
                          <span className="order-grand-total">Rs. {order.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* ---- ORDER ACTIONS ---- */}
                    <div className="order-actions">

                      {/* Status update dropdown — admin can jump to any status */}
                      <div className="status-update-group">
                        <label>Update Status:</label>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          disabled={isUpdating}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quick "advance to next status" button */}
                      {statusConfig.next && (
                        <button
                          className="advance-btn"
                          onClick={() => handleStatusUpdate(order._id, statusConfig.next)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            "Updating..."
                          ) : (
                            `Mark as "${getStatusConfig(statusConfig.next).label}" →`
                          )}
                        </button>
                      )}

                      {/* Delete order button */}
                      {deleteConfirmId === order._id ? (
                        <div className="delete-confirm-row">
                          <span>Delete this order?</span>
                          <button
                            className="confirm-del-btn"
                            onClick={() => handleDelete(order._id)}
                          >
                            Yes, Delete
                          </button>
                          <button
                            className="cancel-del-btn"
                            onClick={() => setDeleteConfirmId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-order-btn"
                          onClick={() => setDeleteConfirmId(order._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageOrders;