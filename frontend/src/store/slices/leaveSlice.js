import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  pagination: null,
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: "leave",

  initialState,

  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },

    setPagination: (state, action) => {
      state.pagination = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRequests,
  setPagination,
  setLoading,
  setError,
  clearError,
} = leaveSlice.actions;

export default leaveSlice.reducer;