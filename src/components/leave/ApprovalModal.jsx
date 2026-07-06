import { useState } from "react";

function ApprovalModal({
  isOpen,
  request,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [approvalNotes, setApprovalNotes] = useState("Approved");
  const handleClose = () => {
  setApprovalNotes("Approved");
  onClose();
};
  const handleSubmit = () => {
    onConfirm(request.id, approvalNotes);
    setApprovalNotes("Approved");
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-6">Menyetujui Permohonan Cuti</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nama Karyawan</label>

            <p className="font-medium">{request.employeeName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Jenis Cuti</label>

            <p className="font-medium">{request.type}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Catatan Persetujuan</label>

            <textarea
              rows="4"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              className="mt-2 w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button onClick={handleClose} className="px-5 py-2 rounded-lg border">
            Batal
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
          >
            {loading ? "Approving..." : "Setujui"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalModal;
