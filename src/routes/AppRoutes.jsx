import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeCreateModal from "../components/modals/EmployeeCreateModal"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="../components/modals/EmployeeCreateModal"
        element={
          <ProtectedRoute>
            <EmployeeCreateModal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
