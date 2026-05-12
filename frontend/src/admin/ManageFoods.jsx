// ============================================
// FILE: frontend/src/admin/ManageFoods.jsx
// PURPOSE: Admin page to view, edit, and delete food items
// Shows all food items in a table/card list
// Admin can edit any field including image
// Admin can delete a food item permanently
// ============================================

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, X, Check, ImageIcon } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./ManageFoods.css";

const CATEGORIES = ["Burgers", "Pizza", "Biryani", "Drinks", "Desserts", "Sandwiches", "Wraps", "Other"];

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);          // All food items from API
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Which food is being edited (null = none)
  const [editForm, setEditForm] = useState({});     // Holds the edit form values
  const [editImage, setEditImage] = useState(null); // New image file (optional during edit)
  const [editImagePreview, setEditImagePreview] = useState(null); // Preview of new image
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Which item is pending delete

  // ---- Fetch all foods when page loads ----
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await api.get("/foods"); // GET /api/foods
      setFoods(response.data.foods);
    } catch (error) {
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  // ---- Start editing a food item ----
  // Fills the edit form with the current values of that item
  const handleEditStart = (food) => {
    setEditingId(food._id);
    setEditForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      isAvailable: food.isAvailable,
    });
    setEditImage(null);         // Reset any previously selected image
    setEditImagePreview(null);
  };

  // ---- Cancel editing ----
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
    setEditImage(null);
    setEditImagePreview(null);
  };

  // ---- Handle text input changes in the edit form ----
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      // Handle checkboxes separately (isAvailable toggle)
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---- Handle new image selection during edit ----
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  // ---- Save the edited food item ----
  const handleEditSave = async (foodId) => {
    try {
      // Use FormData to support optional image upload
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("category", editForm.category);
      formData.append("isAvailable", editForm.isAvailable);

      // Only attach image if admin selected a new one
      if (editImage) {
        formData.append("image", editImage);
      }

      // PUT /api/foods/:id
      await api.put(`/foods/${foodId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Food item updated!");
      setEditingId(null); // Close edit mode
      fetchFoods();        // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update food item");
    }
  };

  // ---- Delete a food item ----
  const handleDelete = async (foodId) => {
    try {
      // DELETE /api/foods/:id
      await api.delete(`/foods/${foodId}`);
      toast.success("Food item deleted!");
      setDeleteConfirmId(null); // Close confirmation
      fetchFoods();              // Refresh the list
    } catch (error) {
      toast.error("Failed to delete food item");
    }
  };

  // ---- Image URL helper ----
  const imageUrl = (filename) =>
    `${import.meta.env.VITE_API_URL}/uploads/${filename}`;

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
      <div className="admin-page-header">
        <h2>Manage Food Items</h2>
        <p>{foods.length} item{foods.length !== 1 ? "s" : ""} in the menu</p>
      </div>

      {/* Empty state */}
      {foods.length === 0 ? (
        <div className="manage-empty">
          <div style={{ fontSize: "3.5rem" }}>🍽️</div>
          <h3>No food items yet</h3>
          <p>Go to "Add Food Item" to create your first menu item.</p>
        </div>
      ) : (
        /* Food Items List */
        <div className="foods-list">
          {foods.map((food) => (
            <div key={food._id} className="food-manage-card">

              {/* ============================================
                  VIEW MODE — Normal display of food item
                  ============================================ */}
              {editingId !== food._id ? (
                <div className="food-card-view">

                  {/* Food Image */}
                  <div className="food-manage-img-wrap">
                    <img
                      src={imageUrl(food.image)}
                      alt={food.name}
                      className="food-manage-img"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80?text=Food";
                      }}
                    />
                  </div>

                  {/* Food Info */}
                  <div className="food-manage-info">
                    <div className="food-manage-top">
                      <h3 className="food-manage-name">{food.name}</h3>
                      {/* Availability badge */}
                      <span className={`availability-badge ${food.isAvailable ? "available" : "unavailable"}`}>
                        {food.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <p className="food-manage-desc">{food.description}</p>
                    <div className="food-manage-meta">
                      <span className="food-manage-price">Rs. {food.price}</span>
                      <span className="food-manage-category">{food.category}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="food-manage-actions">
                    {/* Edit Button */}
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditStart(food)}
                      title="Edit food item"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    {/* Delete Button — shows confirm prompt first */}
                    {deleteConfirmId === food._id ? (
                      /* Confirmation row */
                      <div className="delete-confirm">
                        <span>Sure?</span>
                        <button
                          className="action-btn confirm-delete-btn"
                          onClick={() => handleDelete(food._id)}
                        >
                          Yes, Delete
                        </button>
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="action-btn delete-btn"
                        onClick={() => setDeleteConfirmId(food._id)}
                        title="Delete food item"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>

              ) : (
                /* ============================================
                   EDIT MODE — Inline edit form for this item
                   ============================================ */
                <div className="food-card-edit">
                  <div className="edit-form-header">
                    <h4>Editing: {food.name}</h4>
                    {/* Cancel edit button */}
                    <button className="action-btn cancel-btn" onClick={handleEditCancel}>
                      <X size={15} /> Cancel
                    </button>
                  </div>

                  <div className="edit-form-grid">

                    {/* Name */}
                    <div className="form-group">
                      <label>Food Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        placeholder="Food name"
                      />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                      <label>Price (Rs.)</label>
                      <input
                        type="number"
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        min="1"
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Availability Toggle */}
                    <div className="form-group">
                      <label>Availability</label>
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={editForm.isAvailable}
                          onChange={handleEditChange}
                          className="toggle-checkbox"
                        />
                        <span className="toggle-text">
                          {editForm.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </label>
                    </div>

                    {/* Description — full width */}
                    <div className="form-group edit-full-width">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={2}
                      />
                    </div>

                    {/* Image Update — full width */}
                    <div className="form-group edit-full-width">
                      <label>
                        <ImageIcon size={13} style={{ display: "inline", marginRight: 5 }} />
                        Change Image (optional)
                      </label>
                      <div className="edit-image-row">
                        {/* Current or new preview */}
                        <img
                          src={editImagePreview || imageUrl(food.image)}
                          alt="preview"
                          className="edit-img-preview"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80?text=Food";
                          }}
                        />
                        {/* File input for new image */}
                        <label className="change-image-btn">
                          Choose New Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditImageChange}
                            style={{ display: "none" }}
                          />
                        </label>
                        {editImage && (
                          <small className="new-img-name">New: {editImage.name}</small>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    className="action-btn save-btn"
                    onClick={() => handleEditSave(food._id)}
                  >
                    <Check size={15} />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFoods;