import axios from "axios";

const API_URL = "https://localhost:7289/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
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
