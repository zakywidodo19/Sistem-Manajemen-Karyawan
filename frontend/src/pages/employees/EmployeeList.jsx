import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmployees,
  setPagination,
  setLoading,
  setError,
} from "../../store/slices/employeeSlice";

import { getEmployees } from "../../api/employeeApi";
import EmployeeTable from "../../components/employee/EmployeeTable";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EmployeeCreateModal from "../../components/employee/EmployeeCreateModal";
import MainLayout from "../../layouts/MainLayout";
import EmployeeDeleteModal from "../../components/employee/EmployeeDeleteModal";
import EmployeeEditModal from "../../components/employee/EmployeeEditModal";
import EmployeeDetailModal from "../../components/employee/EmployeeDetailModal";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const auth = useSelector((state) => state.auth);

  const { employees, pagination, loading, error } = useSelector(
    (state) => state.employee,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleDetailClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const fetchEmployees = async () => {
    try {
      dispatch(setLoading(true));

      const response = await getEmployees(
        currentPage,
        limit,
        debouncedSearch,
        selectedStatus,
      );

      dispatch(setEmployees(response.data));
      dispatch(setPagination(response.pagination));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Gagal memuat data karyawan"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (auth.token) {
      fetchEmployees();
    }
  }, [auth.token, currentPage, limit, debouncedSearch, selectedStatus]);

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5">Manajemen Karyawan</h1>
        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari karyawan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 w-80"
            />

            {/* Filter Status */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-lg px-3 py-2 w-48"
            >
              <option value="">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Tambah Karyawan
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <EmployeeTable
              employees={employees}
              pagination={pagination}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
              onDetail={handleDetailClick}
            />
          )}
        </div>
        {pagination && (
          <div className="flex items-center justify-between mt-6">
            {/* Limit */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan</span>

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-2 py-1"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <span className="text-sm text-gray-600">data</span>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPage}
            </div>

            {/* Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border rounded-lg p-2 disabled:opacity-50 hover:bg-gray-100"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.totalPage}
                className="border rounded-lg p-2 disabled:opacity-50 hover:bg-gray-100"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}{" "}
      </div>
      {showCreateModal && (
        <EmployeeCreateModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchEmployees();
          }}
        />
      )}
      {showDeleteModal && (
        <EmployeeDeleteModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
            fetchEmployees();
          }}
        />
      )}
      {showEditModal && (
        <EmployeeEditModal
          employee={selectedEmployee}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
            fetchEmployees();
          }}
        />
      )}
      {showDetailModal && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </MainLayout>
  );
};

export default EmployeeList;
