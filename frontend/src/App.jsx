import { useEffect } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return <AppRoutes />;
}

export default App;