import api from "./api";

const cartService = {
  getCart: async () => {
    const res = await api.get("/Cart");
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post("/Cart/add", { productId, quantity });
    return res.data;
  },
  updateCartItem: async (itemId, quantity) => {
    const res = await api.put(`/Cart/update/${itemId}`, { productId: 0, quantity });
    return res.data;
  },
  removeCartItem: async (itemId) => {
    const res = await api.delete(`/Cart/remove/${itemId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await api.delete("/Cart/clear");
    return res.data;
  },
};

export default cartService;
