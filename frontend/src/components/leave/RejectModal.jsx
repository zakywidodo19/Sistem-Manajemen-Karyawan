import { useState } from "react";

function RejectModal({
  isOpen,
  request,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  const handleSubmit = () => {
    onConfirm(request.id, rejectionReason);
    setRejectionReason("");
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Tolak Permohonan Cuti
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">
              Nama Karyawan
            </label>

            <p className="font-medium">
              {request.employeeName}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Jenis Cuti
            </label>

            <p>{request.type}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Alasan Ditolak
            </label>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Tuliskan Alasan Penolakan..."
              className="mt-2 w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={handleClose}
            className="px-5 py-2 border rounded-lg"
          >
            Batal
          </button>

          <button
            disabled={!rejectionReason.trim() || loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectModal;