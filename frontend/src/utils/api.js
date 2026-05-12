// ============================================
// FILE: frontend/src/utils/api.js
// PURPOSE: Configure Axios with base URL
// Instead of writing full URL every time, we set base URL once here
// Usage: import api from '../utils/api'
//        api.get('/foods') → calls http://localhost:5000/api/foods
// ============================================

import axios from "axios";

// Create an Axios instance with base URL from .env
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // baseURL will be: http://localhost:5000/api
});

// Request interceptor — runs before every API call
// Automatically adds the admin token to protected requests
api.interceptors.request.use((config) => {
  // Get token from localStorage (saved when admin logs in)
  const token = localStorage.getItem("adminToken");

  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;