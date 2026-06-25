import axiosInstance from "./axiosInstance";

export const getDepartments = async (token) => {
  const response = await axiosInstance.get(
    "/api/master/departments",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getPositions = async (token) => {
  const response = await axiosInstance.get(
    "/api/master/positions",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};