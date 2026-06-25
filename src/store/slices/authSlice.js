import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const user = JSON.parse(
  localStorage.getItem("user")
);

const initialState = {
  token: token || null,
  user: user || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;

      state.user = action.payload.user;

      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;

      state.user = null;

      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
