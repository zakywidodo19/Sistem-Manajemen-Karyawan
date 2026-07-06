import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { detailEmployee } from "../../api/employeeApi";
import { FaSpinner } from "react-icons/fa";
import { formatDateIndonesia } from "../../utils/formatDate";

const EmployeeDetailModal = ({ employee, onClose }) => {
  const auth = useSelector((state) => state.auth);

  const [employeeDetail, setEmployeeDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        setLoading(true);

        const response = await detailEmployee(employee.id);
        setEmployeeDetail(response.data || response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    

    if (employee?.id && auth.token) {
      fetchEmployeeDetail();
    }
  }, [employee, auth.token]);
  if (loading) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl flex flex-col items-center gap-3">
        <FaSpinner className="text-3xl animate-spin text-blue-600" />
        <p className="text-gray-600">Memuat data karyawan...</p>
      </div>
    </div>
  );
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Detail Karyawan
          </h2>

          <button
            onClick={onClose}
            className="text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Data Karyawan */}
        <h3 className="text-lg font-semibold border-b pb-2 mb-4">
          Data Karyawan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-600">
              Kode Karyawan
            </label>
            <p>{employeeDetail?.employeeCode}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Nama Lengkap
            </label>
            <p>{employee.fullName}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Email
            </label>
            <p>{employee.email}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Nomor HP
            </label>
            <p>{employee.phoneNumber}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Jenis Kelamin
            </label>
            <p>{employee.gender}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Tanggal Lahir
            </label>
            <p>{formatDateIndonesia(employee.birthDate)}</p>
          </div>
        </div>

        {/* Informasi Pekerjaan */}
        <h3 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
          Informasi Pekerjaan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-600">
              Department
            </label>
            <p>{employee.department}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Posisi
            </label>
            <p>{employee.position}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Tanggal Bergabung
            </label>
            <p>{formatDateIndonesia(employee.joinDate)}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Gaji
            </label>
            <p>
              Rp{" "}
              {Number(employee.salary || 0).toLocaleString(
                "id-ID"
              )}
            </p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Status
            </label>
            <p>{employee.status}</p>
          </div>
        </div>

        {/* Alamat */}
        <h3 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
          Alamat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-600">
              Jalan
            </label>
            <p>{employee.address?.street || "-"}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Kota
            </label>
            <p>{employee.address?.city || "-"}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Provinsi
            </label>
            <p>{employee.address?.province || "-"}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Kode Pos
            </label>
            <p>{employee.address?.postalCode || "-"}</p>
          </div>
        </div>

        {/* Kontak Darurat */}
        <h3 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
          Kontak Darurat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-gray-600">
              Nama Kontak
            </label>
            <p>{employee.emergencyContact?.name || "-"}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Hubungan
            </label>
            <p>{employee.emergencyContact?.relationship || "-"}</p>
          </div>

          <div>
            <label className="font-medium text-gray-600">
              Nomor HP
            </label>
            <p>
              {employee.emergencyContact?.phoneNumber || "-"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;