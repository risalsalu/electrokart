// src/services/adminService.js
import api from "./api";

/**
 * Admin Dashboard API Service
 * Handles: dashboard stats, users, and order management
 */
const adminService = {
  // 🧭 Get overall dashboard summary (stats, revenue, counts, etc.)
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  // 👤 Get all users (for admin)
  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  // 🚫 Block or unblock a user
  toggleBlockUser: async (userId) => {
    const response = await api.put(`/admin/users/toggle-block/${userId}`);
    return response.data;
  },

  // ❌ Delete a user by ID
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // 📦 Get all orders (for admin)
  getAllOrders: async () => {
    const response = await api.get("/Orders/all-orders");
    return response.data;
  },

  // 🔄 Update order status (e.g., Pending → Shipped)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/Orders/${orderId}/status`, { status });
    return response.data;
  },

  // 🧾 Get single order details (optional)
  getOrderById: async (orderId) => {
    const response = await api.get(`/Orders/${orderId}`);
    return response.data;
  },

  // 🛍 Get all products (for overview)
  getAllProducts: async () => {
    const response = await api.get("/Products");
    return response.data;
  },
};

export default adminService;
