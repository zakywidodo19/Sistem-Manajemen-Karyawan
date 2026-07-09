import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../../api/authApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = "Email wajib diisi";
    } else if (!email.includes("@")) {
      validationErrors.email = "Format email tidak valid";
    }

    if (!password.trim()) {
      validationErrors.password = "Password wajib diisi";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await loginApi({
        email,
        password,
      });
      if (response.status) {
        const userData = {
          token: response.data.token,

          user: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
          },
        };

        localStorage.setItem("token", response.data.token);

        localStorage.setItem("refreshToken", response.data.refreshToken);

        localStorage.setItem("user", JSON.stringify(userData.user));

        dispatch(loginSuccess(userData));

        toast.success("Login berhasil!");

        navigate("/");
      }
    } catch (error) {
      // 3. Tambahkan toastId agar toast salah password tidak duplikat/menumpuk
      toast.error(
        error.response?.data?.messages || "Email atau Password salah",
        {
          toastId: "login-error-toast",
        },
      );
    } finally {
      setIsLoading(false); // 4. Buka kembali kunci tombol setelah proses selesai
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-3 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded font-medium transition-colors ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
