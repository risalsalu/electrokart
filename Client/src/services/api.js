import axios from "axios";

const API_URL = "https://localhost:7289/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getCookie("AccessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);
    const originalRequest = error.config;
    const status = error.response.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/Auth/Refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = getCookie("RefreshToken");
        const res = await axios.post(
          `${API_URL}/Auth/Refresh`,
          { refreshToken: refresh },
          { withCredentials: true }
        );
        const newToken = res.data?.data?.accessToken || res.data?.accessToken;
        if (!newToken) throw new Error("No new access token received");
        document.cookie = `AccessToken=${newToken}; path=/; secure; SameSite=None`;
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        document.cookie = "AccessToken=; Max-Age=0; path=/; secure; SameSite=None";
        document.cookie = "RefreshToken=; Max-Age=0; path=/; secure; SameSite=None";
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
