import api from "./api";

const userService = {
  getAllUsers: async () => {
    const response = await api.get("/admin/users"); 
    return response.data; 
  },

  toggleUserBlock: async (id) => {
    const response = await api.put(`/admin/users/toggle-block/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default userService;
