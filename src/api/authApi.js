import axiosInstance from "./axiosInstance";

export const loginApi = async (payload) => {
  const response = await axiosInstance.post(
    "/api/auth/login",
    payload
  );

  return response.data;
};