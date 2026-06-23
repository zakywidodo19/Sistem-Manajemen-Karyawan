import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-4">
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
      </nav>
    </aside>
  );
}

export default Sidebar;