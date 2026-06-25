import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

function Sidebar() {
   const dispatch = useDispatch();
  const navigate = useNavigate();

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  dispatch(logout());

  navigate("/login");
};
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4">
      <h2 className="text-xl font-bold mb-8">
        Employee App
      </h2>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-3 rounded-lg ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `p-3 rounded-lg ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-700"
            }`
          }
        >
          Employees
        </NavLink>
         <div className="mt-auto pt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-slate-700"
        >
          Keluar
        </button>
      </div>
      </nav>
    </aside>
  );
}

export default Sidebar;