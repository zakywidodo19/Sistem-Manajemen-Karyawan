import axiosInstance from "./axiosInstance";

export const getEmployees = async (
  page = 1,
  token,
  search = "",
  department = "",
  position = "",
) => {
  const response = await axiosInstance.get(
    `/api/employees?page=${page}&search=${search}&department=${department}&position=${position}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getEmployeeById = async (id, token) => {
  const response = await axiosInstance.get(`/api/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createEmployee = async (payload, token) => {
  const response = await axiosInstance.post("/api/employees", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateEmployee = async (id, payload, token) => {
  const response = await axiosInstance.put(`/api/employees/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteEmployee = async (id, token) => {
  const response = await axiosInstance.delete(`/api/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const detailEmployee = async (id, token) => {
  const response = await axiosInstance.get(`/api/employees/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
