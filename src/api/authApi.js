import axios from "axios";
import axiosInstance from "./axiosInstance";

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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