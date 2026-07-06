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
      <h2 className="text-xl font-bold mb-8">App Karyawan</h2>

      <div className="flex flex-col h-full">
        {/* Menu */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-slate-700"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-slate-700"
              }`
            }
          >
            Karyawan
          </NavLink>
          <NavLink
            to="/leave"
            className={({ isActive }) =>
              `p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-slate-700"
              }`
            }
          >
            Pengajuan Cuti
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
