import api from "./api";


const adminService = {
  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  toggleBlockUser: async (userId) => {
    const response = await api.put(`/admin/users/toggle-block/${userId}`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get("/Orders/all-orders");
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/Orders/${orderId}/status`, { status });
    return response.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/Orders/${orderId}`);
    return response.data;
  },

  getAllProducts: async () => {
    const response = await api.get("/Products");
    return response.data;
  },
};

export default adminService;
