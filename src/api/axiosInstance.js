import axios from "axios";
import { toast } from "react-toastify";

import { store } from "../store";
import { logout } from "../store/slices/authSlice";

let isSessionExpired = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error) => Promise.reject(error),
);

// =======================
// Response Interceptor
// =======================
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isSessionExpired
    ) {
      isSessionExpired = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      store.dispatch(logout());

      toast.error("Sesi login telah berakhir. Silakan login kembali.");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
