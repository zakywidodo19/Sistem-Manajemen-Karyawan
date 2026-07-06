import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import BaseTable from "../common/BaseTable";

const columns = [
  { key: "no", title: "No" },
  { key: "employeeCode", title: "Kode Karyawan" },
  { key: "fullName", title: "Nama Lengkap" },
  { key: "gender", title: "Jenis Kelamin" },
  { key: "department", title: "Divisi" },
  { key: "position", title: "Posisi" },
  { key: "status", title: "Status" },
  { key: "salary", title: "Gaji" },
  {
    key: "action",
    title: "Aksi",
    className: "p-4 text-center",
  },
];

const EmployeeTable = ({
  employees,
  pagination,
  loading = false,
  onDelete,
  onEdit,
  onDetail,
}) => {
  return (
    <BaseTable
      columns={columns}
      data={employees}
      loading={loading}
      emptyMessage="Data karyawan tidak ditemukan"
      renderRow={(employee, index) => (
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

          <td className="p-4 text-sm text-gray-700">
            {employee.fullName}
          </td>

          <td className="p-4 text-sm text-gray-700">
            {employee.gender}
          </td>

          <td className="p-4 text-sm text-gray-700">
            {employee.department}
          </td>

          <td className="p-4 text-sm text-gray-700">
            {employee.position}
          </td>

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
                className="bg-gray-700 text-white"
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
      )}
    />
  );
};

export default EmployeeTable;