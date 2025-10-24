import api from "./api";

const authService = {
  register: async ({ username, email, password }) => {
    try {
      const response = await api.post("/Auth/Register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Register error:", error.response?.data || error.message);
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const response = await api.post("/Auth/Login", { email, password });
      return response.data; 
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/Auth/Profile");
      return response.data; 
    } catch (error) {
      console.error("Get profile error:", error.response?.data || error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post("/Auth/Logout");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default authService;
