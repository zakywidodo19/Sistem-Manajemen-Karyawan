import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const refreshClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginApi = async (payload) => {
  const response = await axiosInstance.post(
    "/api/auth/login",
    payload
  );

  return response.data;
};

export const refreshTokenApi = async (refreshToken) => {
  const response = await refreshClient.post(
    "/api/auth/refresh",
    {
      refreshToken,
    }
  );

  return response.data;
};