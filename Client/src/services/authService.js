import api from "./api";

// Authentication service
const authService = {
  // ✅ Register a new user
  register: async ({ username, email, password }) => {
    try {
      const response = await api.post("/Auth/Register", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  // ✅ Login existing user
  login: async ({ email, password }) => {
    try {
      const response = await api.post("/Auth/Login", { email, password });

      // ✅ Backend usually returns "token" or "jwt"
      const token = response.data?.token || response.data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("No token returned from backend");
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // ✅ Optional: get current logged-in user's info
  getProfile: async () => {
    try {
      const response = await api.get("/Auth/Profile");
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  // ✅ Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  },
};

export default authService;
