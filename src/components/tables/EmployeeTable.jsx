import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const EmployeeTable = ({
  employees,
  pagination,
  onDelete,
  onEdit,
  onDetail,
}) => {
  return (
    <div className="overflow-auto max-h-[600px] rounded-lg shadow-sm">
      <table className="w-full">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th className="p-4">No</th>
            <th className="p-4">Kode Karyawan</th>
            <th className="p-4">Nama Lengkap</th>
            <th className="p-4">Jenis Kelamin</th>
            <th className="p-4">Divisi</th>
            <th className="p-4">Posisi</th>
            <th className="p-4">Status</th>
            <th className="p-4">Gaji</th>
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {!employees.length ? (
            <tr>
              <td colSpan="9" className="p-8 text-center text-gray-500">
                Data karyawan tidak ditemukan
              </td>
            </tr>
          ) : employees.map((employee, index) => (
            <tr
              key={employee.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="p-4 text-sm text-gray-700">
                {(pagination?.page - 1) * pagination?.limit + index + 1}
              </td>
              <td className="p-4 text-sm text-gray-700 font-medium">
                {employee.employeeCode}
              </td>
              <td className="p-4 text-sm text-gray-700">{employee.fullName}</td>
              <td className="p-4 text-sm text-gray-700">{employee.gender}</td>
              <td className="p-4 text-sm text-gray-700">
                {employee.department}
              </td>
              <td className="p-4 text-sm text-gray-700">{employee.position}</td>
              <td className="p-4 text-sm">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-700">
                Rp {employee.salary.toLocaleString("id-ID")}
              </td>
              <td className="p-4 text-sm text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onDetail(employee)}
                    className="bg-blue-500 text-white"
                  >
                    <FiEye size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="text-yellow-500"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(employee)}
                    className="text-red-500"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
