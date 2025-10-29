import api from "./api";

const paymentService = {
  initiatePayment: async ({ orderId, amount, currency = "INR", description = "" }) => {
    try {
      const payload = { orderId, amount, currency, description };
      const response = await api.post("/Payments/initiate", payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to initiate payment",
      };
    }
  },

  confirmPayment: async ({ paymentId, orderId }) => {
    try {
      const payload = { paymentId, orderId };
      const response = await api.post("/Payments/confirm", payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to confirm payment",
      };
    }
  },

  getPaymentByOrder: async (orderId) => {
    try {
      const response = await api.get(`/Payments/by-order/${orderId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch payment details",
      };
    }
  },
};

export default paymentService;
