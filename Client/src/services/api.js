import axios from "axios";

const API_URL = "https://localhost:7289/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);
    const status = error.response.status;

    if (status === 401 && !originalRequest._retry && !originalRequest.url.includes("/Auth/Refresh")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const oldAccess = localStorage.getItem("accessToken");
        const refresh = getCookie("RefreshToken");
        const res = await axios.post(
          `${API_URL}/Auth/Refresh`,
          { accessToken: oldAccess, refreshToken: refresh },
          { withCredentials: true }
        );

        const newToken = res.data?.data?.accessToken || res.data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else throw new Error("No access token returned");
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        if (!window.location.pathname.includes("/login")) window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
