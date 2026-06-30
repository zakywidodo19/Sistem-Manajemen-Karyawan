import axiosInstance from "./axiosInstance";

export const getEmployees = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
) => {
  const response = await axiosInstance.get(
    `/api/employees?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );

  return response.data;
};

export const createEmployee = async (payload) => {
  const response = await axiosInstance.post("/api/employees", payload);

  return response.data;
};

export const updateEmployee = async (id, payload) => {
  const response = await axiosInstance.put(`/api/employees/${id}`, payload);

  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/api/employees/${id}`);

  return response.data;
};

export const detailEmployee = async (id) => {
  const response = await axiosInstance.get(`/api/employees/${id}`);

  return response.data;
};
