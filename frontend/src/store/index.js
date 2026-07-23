import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import employeeReducer from "./slices/employeeSlice";
import themeReducer from "./slices/themeSlice";
import leaveReducer from "./slices/leaveSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    theme: themeReducer,
    leave: leaveReducer,
  },
});
