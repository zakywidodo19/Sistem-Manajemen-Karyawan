import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/slices/themeSlice";
import { FaSun, FaMoon } from "react-icons/fa";

function Navbar() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="font-semibold text-lg">Sistem Manajemen Karyawan</h1>

      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {theme === "dark" ? (
    <FaSun className="text-yellow-400 text-lg" />
  ) : (
    <FaMoon className="text-gray-700 text-lg" />
  )}
      </button>
    </header>
  );
}

export default Navbar;
