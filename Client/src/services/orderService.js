import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/Orders/checkout", orderData);
    return response.data?.data;
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
};

export default orderService;
