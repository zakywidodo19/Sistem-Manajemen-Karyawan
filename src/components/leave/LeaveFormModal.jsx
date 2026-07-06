import { useEffect, useState } from "react";
import { createLeave } from "../../api/leaveApi";
import { getEmployees } from "../../api/employeeApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import "../../styles/datepicker.css"

function LeaveFormModal({ isOpen, onClose, onSuccess }) {
  const initialForm = {
    employeeId: "",
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees(1, 100);

      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to load employee list.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setFormData(initialForm);

    fetchEmployees();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, name) => {
    if (!date) {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      [name]: `${year}-${month}-${day}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason.trim()
    ) {
      toast.warning("Harap lengkapi semua kolom yang wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await createLeave({
        ...formData,
        employeeId: Number(formData.employeeId),
      });

      toast.success("Permohonan cuti berhasil dibuat.");

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal membuat permintaan cuti.",
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();

  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Buat Permohonan Cuti</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Employee */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Nama Karyawan
            </label>

            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Pilih Karyawan</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block mb-2 text-sm font-medium">Jenis Cuti</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option value="ANNUAL">Cuti Tahunan</option>
              <option value="SICK">Cuti Sakit</option>
              <option value="PERSONAL">Cuti Pribadi</option>
              <option value="BEREAVEMENT">Cuti Duka Cita</option>
            </select>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <DatePicker
                selected={
                  formData.startDate
                    ? new Date(formData.startDate + "T00:00:00")
                    : null
                }
                onChange={(date) => {
                  handleDateChange(date, "startDate");

                  if (
                    formData.endDate &&
                    date &&
                    new Date(formData.endDate) < date
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      startDate: prev.startDate,
                      endDate: "",
                    }));
                  }
                }}
                locale={id}
                dateFormat="dd MMMM yyyy"
                placeholderText="Pilih Tanggal Mulai"
                className="w-full border rounded-lg px-3 py-2 pr-10 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                wrapperClassName="w-full"
                minDate={today}
                maxDate={maxDate}
                showPopperArrow={false}
              />

              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <DatePicker
                selected={
                  formData.endDate
                    ? new Date(formData.endDate + "T00:00:00")
                    : null
                }
                onChange={(date) => handleDateChange(date, "endDate")}
                locale={id}
                dateFormat="dd MMMM yyyy"
                placeholderText="Pilih Tanggal Selesai"
                className="w-full border rounded-lg px-3 py-2 pr-10 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                wrapperClassName="w-full"
                minDate={
                  formData.startDate
                    ? new Date(formData.startDate + "T00:00:00")
                    : today
                }
                maxDate={maxDate}
                disabled={!formData.startDate}
                showPopperArrow={false}
              />

              <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block mb-2 text-sm font-medium">Alasan</label>

            <textarea
              rows={3}
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Masukkan alasan cuti..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-2 text-sm font-medium">Catatan</label>

            <textarea
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Catatan tambahan..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border rounded-lg px-5 py-2"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveFormModal;
