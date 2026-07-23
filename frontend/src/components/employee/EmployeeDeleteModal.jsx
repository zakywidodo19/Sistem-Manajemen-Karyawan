import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { deleteEmployee } from "../../api/employeeApi";

const EmployeeDeleteModal = ({
  employee,
  onClose,
  onSuccess,
}) => {
  const auth = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteEmployee(employee.id);

      toast.success(
        "Karyawan berhasil dihapus"
      );

      onSuccess();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Gagal menghapus karyawan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">
          Hapus Karyawan
        </h2>

        <p className="mb-6">
          Apakah Anda yakin ingin
          menghapus
          <strong>
            {" "}
            {employee.fullName}
          </strong>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Batal
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            {loading
              ? "Menghapus..."
              : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDeleteModal;