import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getDashboardStats } from "../../api/dashboardApi";
import { formatShortCurrency } from "../../utils/formatShortCurrency";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalEmployee: 0,
    activeEmployee: 0,
    inactiveEmployee: 0,
    totalSalary: 0,
    averageSalary: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        // Karena response.data kadang langsung mengembalikan object
        // pastikan kita mengambil objek yang benar dari data
        setStats(data.data || data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchDashboard();
    }
  }, [auth.token]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Karyawan</p>
              <h2 className="text-3xl font-bold mt-2">{stats.totalEmployee}</h2>
            </div>

            <FaUsers className="text-4xl text-blue-600" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500">Karyawan Aktif</p>
              <h2 className="text-3xl font-bold mt-2 text-green-600">
                {stats.activeEmployee}
              </h2>
            </div>

            <FaUserCheck className="text-4xl text-green-600" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500">Karyawan Non-Aktif</p>
              <h2 className="text-3xl font-bold mt-2 text-red-600">
                {stats.inactiveEmployee}
              </h2>
            </div>

            <FaUserTimes className="text-4xl text-red-600" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Gaji</p>
              <h2 className="text-2xl font-bold mt-2 text-purple-600">
                {formatShortCurrency(stats.totalSalary)}
              </h2>
            </div>

            <FaWallet className="text-4xl text-purple-600" />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500">Rata-rata Gaji</p>
              <h2 className="text-2xl font-bold mt-2 text-teal-600">
                {formatShortCurrency(stats.averageSalary)}
              </h2>
            </div>

            <FaMoneyBillWave className="text-4xl text-teal-600" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
