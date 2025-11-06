// src/services/orderService.js
import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/Orders/checkout", orderData);
    return response.data; 
  },

  getMyOrders: async () => {
    const response = await api.get("/Orders/my-orders");
    return response.data?.data || [];
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/Orders/${orderId}`);
    return response.data?.data;
  },

  cancelOrder: async (orderId) => {
    const response = await api.delete(`/Orders/${orderId}`);
    return response.data?.data;
  },

  getAllOrders: async () => {
    const response = await api.get("/Orders/all-orders");
    return response.data?.data || [];
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(
      `/Orders/${orderId}/status`,
      JSON.stringify(status),
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data?.data;
  },

  deleteOrder: async (orderId) => {
    const response = await api.delete(`/Orders/${orderId}`);
    return response.data?.data;
  },
};

export default orderService;
