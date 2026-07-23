import axios from "axios";
// import { toast } from "react-toastify";

import { store } from "../store";
import { logout } from "../store/slices/authSlice";

import { shouldRefreshToken } from "../utils/token";

// let isRefreshing = false;
// let failedQueue = [];


let rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
if (rawApiUrl && !rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://")) {
  rawApiUrl = `https://${rawApiUrl}`;
}
const API_URL = rawApiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// const processQueue = (error, token = null) => {
//   failedQueue.forEach((promise) => {
//     if (error) {
//       promise.reject(error);
//     } else {
//       promise.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// =======================
// Refresh Access Token
// =======================
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token tidak ditemukan");
  }

  const response = await axios.post(
    `${API_URL}/api/auth/refresh`,
    {
      refreshToken,
    },
    {
      timeout: 10000,
    }
  );

  const { token, refreshToken: newRefreshToken } = response.data.data;

  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", newRefreshToken);

  return token;
};

// =======================
// Request Interceptor
// =======================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// Response Interceptor
// =======================
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    const isRefreshRequest = config.url?.includes("/auth/refresh");
    const isLoginRequest = config.url?.includes("/auth/login");

    // Jangan refresh ketika login atau refresh
    if (
      token &&
      !isLoginRequest &&
      !isRefreshRequest &&
      shouldRefreshToken(token)
    ) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        store.dispatch(logout());

        return Promise.reject(error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;