import api from "./api";

const authService = {
  register: async ({ username, email, password }) => {
    const response = await api.post(
      "/Auth/Register",
      { username, email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  login: async ({ email, password }) => {
    const response = await api.post(
      "/Auth/Login",
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/Auth/Logout", {}, { withCredentials: true });
    return response.data;
  },

  refresh: async () => {
    const response = await api.post("/Auth/Refresh", {}, { withCredentials: true });
    return response.data;
  },
};

export default authService;
