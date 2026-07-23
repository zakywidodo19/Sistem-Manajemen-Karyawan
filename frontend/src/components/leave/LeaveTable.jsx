import BaseTable from "../common/BaseTable";
import LeaveStatusBadge from "./LeaveStatusBadge";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { formatDateIndonesia } from "../../utils/formatDate";

const columns = [
  { key: "no", title: "No" },
  { key: "employeeName", title: "Nama Karyawan" },
  { key: "type", title: "Jenis Cuti" },
  { key: "startDate", title: "Tanggal Mulai" },
  { key: "endDate", title: "Tanggal Selesai" },
  { key: "duration", title: "Durasi" },
  { key: "status", title: "Status" },
  {
    key: "action",
    title: "Aksi",
    className: "p-4 text-center",
  },
];

function LeaveTable({
  requests,
  pagination,
  loading = false,
  onDetail,
  onApprove,
  onReject,
}) {
  return (
    <BaseTable
      columns={columns}
      data={requests}
      loading={loading}
      emptyMessage="Tidak ada permintaan cuti yang ditemukan."
      renderRow={(request, index) => (
        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
          <td className="p-4">
            {(pagination?.page - 1) * pagination?.limit + index + 1}
          </td>

          <td className="p-4">{request.employeeName}</td>

          <td className="p-4">{request.type}</td>

          <td className="p-4">{formatDateIndonesia(request.startDate)}</td>

          <td className="p-4">{formatDateIndonesia(request.endDate)}</td>

          <td className="p-4">{request.durationDays} Hari</td>

          <td className="p-4">
            <LeaveStatusBadge status={request.status} />
          </td>

          <td className="p-4">
            <div className="flex justify-center gap-2">
              <button
                onClick={() => onDetail(request)}
                className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition"
                title="Detail"
              >
                <FiEye size={18} />
              </button>

              {request.status === "Pending" && (
                <>
                  <button
                    onClick={() => onApprove(request)}
                    className="p-2 rounded bg-green-500 hover:bg-green-600 text-white transition"
                    title="Setujui"
                  >
                    <FiCheck size={18} />
                  </button>

                  <button
                    onClick={() => onReject(request)}
                    className="p-2 rounded bg-red-500 hover:bg-red-600 text-white transition"
                    title="Tolak"
                  >
                    <FiX size={18} />
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    />
  );
}

export default LeaveTable;
