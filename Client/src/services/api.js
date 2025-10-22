import axios from "axios";

// ✅ Backend base URL (make sure your .NET API runs on this port)
const API_URL = "https://localhost:7289/api";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ❌ set to false because you are using localStorage, not cookies
});

// ✅ Request interceptor: Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
      } else if (status >= 500) {
        console.error("Server Error:", error.response.data);
      }
    } else if (error.request) {
      console.error("No response from server:", error.request);
    } else {
      console.error("Axios Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
