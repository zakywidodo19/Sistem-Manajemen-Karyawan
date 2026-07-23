import axios from "axios";
import { store } from "../store";
import { logout } from "../store/slices/authSlice";
import { shouldRefreshToken } from "../utils/token";

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

// =======================
// Refresh Access Token
// =======================
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token tidak ditemukan");
  }

  console.log("🔄 [Axios] Memanggil API /api/auth/refresh...");

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

  console.log("✅ [Axios] Access Token & Refresh Token berhasil diperbarui!");

  return token;
};

// =======================
// Request Interceptor
// =======================
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    const isRefreshRequest = config.url?.includes("/auth/refresh");
    const isLoginRequest = config.url?.includes("/auth/login");

    // Proactive Check: Jika token mendekati/sudah kedaluwarsa sebelum request dikirim
    if (
      token &&
      !isLoginRequest &&
      !isRefreshRequest &&
      shouldRefreshToken(token)
    ) {
      try {
        console.log("⏳ [Axios] Token hampir/sudah expired, melakukan refresh...");
        token = await refreshAccessToken();
      } catch (error) {
        console.error("❌ [Axios] Gagal refresh token sebelum request:", error);
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

// =======================
// Response Interceptor (Menangani 401 Unauthorized)
// =======================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;

      try {
        console.log("⚠️ [Axios] Menerima 401 Unauthorized, mencoba refresh token...");
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ [Axios] Refresh token gagal saat 401:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        store.dispatch(logout());

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;