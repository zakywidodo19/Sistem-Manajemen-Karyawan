import axiosInstance from "./axiosInstance";

export const getLeaveRequests = async (
  page = 1,
  limit = 10,
  status = "",
  search = "",
) => {
  const response = await axiosInstance.get("/api/leave/requests", {
    params: {
      page,
      limit,
      status,
      search,
    },
  });

  return response.data;
};

export const approveLeave = async (id, approvalNotes = "Approved") => {
  const response = await axiosInstance.put(`/api/leave/${id}/approve`, {
    approvalNotes,
  });

  return response.data;
};
export const rejectLeave = async (id, rejectionReason) => {
  const response = await axiosInstance.put(`/api/leave/${id}/reject`, {
    rejectionReason,
  });

  return response.data;
};
export const createLeave = async (data) => {
  const response = await axiosInstance.post(
    "/api/leave/request",
    data
  );

  return response.data;
};
