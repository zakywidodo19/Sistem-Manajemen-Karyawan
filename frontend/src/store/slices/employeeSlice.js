import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: [],
  pagination: null,
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,

  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
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

export const { setEmployees, setPagination, setLoading, setError, clearError } =
  employeeSlice.actions;

export default employeeSlice.reducer;
