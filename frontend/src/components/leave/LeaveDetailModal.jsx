import LeaveStatusBadge from "./LeaveStatusBadge";

function LeaveDetailModal({ isOpen, request, onClose }) {
  if (!isOpen || !request) return null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Detail Cuti</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-gray-500">Nama Karyawan</p>
            <p className="font-semibold">{request.employeeName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Jenis Cuti</p>
            <p>{request.type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tanggal Dimulai</p>
            <p>{formatDate(request.startDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tanggal Selesai</p>
            <p>{formatDate(request.endDate)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Durasi</p>
            <p>{request.durationDays} Hari</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <LeaveStatusBadge status={request.status} />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Alasan</p>

          <div className="border rounded-lg p-3 bg-gray-50">
            {request.reason || "-"}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-2">Catatan</p>

          <div className="border rounded-lg p-3 bg-gray-50">
            {request.notes || "-"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-6">
          <div>
            <p className="text-sm text-gray-500">Dibuat pada</p>

            <p>{formatDateTime(request.createdAt)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Disetujui oleh</p>

            <p>{request.approvedBy || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Approved At</p>

            <p>{formatDateTime(request.approvedAt)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Alasan Penolakan</p>

            <p>{request.rejectionReason || "-"}</p>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveDetailModal;
