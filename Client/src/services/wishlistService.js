import api from "./api";

const wishlistService = {
  getAll: async () => {
    const res = await api.get("/Wishlist");
    return res.data;
  },
  add: async (productId) => {
    const res = await api.post("/Wishlist/add", { productId });
    return res.data;
  },
  remove: async (productId) => {
    const res = await api.delete(`/Wishlist/${productId}`);
    return res.data;
  },
};

export default wishlistService;
