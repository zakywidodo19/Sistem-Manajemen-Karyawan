import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-7xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="text-3xl font-semibold mt-4">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-gray-500 mt-2">
          URL yang kamu akses tidak tersedia.
        </p>

        <Link
          to="/"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;