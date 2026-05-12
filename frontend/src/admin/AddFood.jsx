// ============================================
// FILE: frontend/src/admin/AddFood.jsx
// PURPOSE: Form for admin to add a new food item
// Fields: name, description, price, category, image
// Image is uploaded as file (multipart/form-data)
// ============================================

import React, { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import "./AddFood.css";

// Available food categories — must match what's in the frontend filter
const CATEGORIES = ["Burgers", "Pizza", "Biryani", "Drinks", "Desserts", "Sandwiches", "Wraps", "Other"];

const AddFood = () => {
  // Form fields state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);         // The actual file object
  const [imagePreview, setImagePreview] = useState(null);   // Preview URL for display
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Update form fields on change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      setImageFile(file);
      // Create a temporary URL to preview the image
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit the new food item to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select a food image");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    try {
      // FormData is needed to send files along with text data
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("image", imageFile); // Attach the image file

      // POST /api/foods (with multipart/form-data)
      await api.post("/foods", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Food item added successfully! 🎉");
      setSuccess(true);

      // Reset form after success
      setForm({ name: "", description: "", price: "", category: "" });
      setImageFile(null);
      setImagePreview(null);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Add food error:", error);
      toast.error(error.response?.data?.message || "Failed to add food item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <h2>Add New Food Item</h2>
        <p>Fill in the details below to add a new item to the menu</p>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="success-alert">
          <CheckCircle size={18} />
          Food item added successfully! It will now appear in the menu.
        </div>
      )}

      {/* Add Food Form */}
      <div className="admin-form-card">
        <form onSubmit={handleSubmit}>

          {/* Food Name */}
          <div className="form-group">
            <label htmlFor="name">Food Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Chicken Burger"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the food item..."
              required
              rows={3}
            />
          </div>

          {/* Price and Category side by side */}
          <div className="form-row">
            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price (Rs.) *</label>
              <input
                id="price"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g., 350"
                required
                min="1"
              />
            </div>

            {/* Category dropdown */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Food Image *</label>
            <div
              className="image-upload-box"
              onClick={() => document.getElementById("food-image").click()}
            >
              {imagePreview ? (
                /* Show preview if image is selected */
                <img src={imagePreview} alt="Preview" className="image-preview" />
              ) : (
                /* Show upload prompt otherwise */
                <div className="upload-prompt">
                  <Upload size={32} />
                  <span>Click to upload image</span>
                  <small>JPG, PNG, WebP — Max 5MB</small>
                </div>
              )}
            </div>
            {/* Hidden file input — triggered by clicking the box above */}
            <input
              id="food-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            {imageFile && (
              <small className="file-name">Selected: {imageFile.name}</small>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFood;