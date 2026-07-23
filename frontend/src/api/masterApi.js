import axiosInstance from "./axiosInstance";

export const getDepartments = async () => {
  const response = await axiosInstance.get("/api/master/departments");

  return response.data;
};

export const getPositions = async () => {
  const response = await axiosInstance.get("/api/master/positions");

  return response.data;
};