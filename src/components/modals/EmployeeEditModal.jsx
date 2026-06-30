import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";

import { getDepartments, getPositions } from "../../api/masterApi";
import { updateEmployee } from "../../api/employeeApi";

const EmployeeEditeModal = ({ employee, onClose, onSuccess }) => {
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    employeeCode: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",

    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },

    department: "",
    position: "",
    joinDate: "",
    salary: "",
    status: "Active",

    emergencyContact: {
      name: "",
      relationship: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    if (employee) {
     setFormData({
        employeeCode: employee.employeeCode || "",
        fullName: employee.fullName || "",
        email: employee.email || "",
        phoneNumber: employee.phoneNumber || "",
        gender: employee.gender || "",
        birthDate: employee.birthDate || "",

        address: {
          street: employee.address?.street || "",
          city: employee.address?.city || "",
          province: employee.address?.province || "",
          postalCode: employee.address?.postalCode || "",
        },

        department: employee.department || "",
        position: employee.position || "",
        joinDate: employee.joinDate || "",
        salary: employee.salary || "",
        status: employee.status || "Active",

        emergencyContact: {
          name: employee.emergencyContact?.name || "",
          relationship: employee.emergencyContact?.relationship || "",
          phoneNumber: employee.emergencyContact?.phoneNumber || "",
        },
      });
    }
  }, [employee]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const deptResponse = await getDepartments();
        const posResponse = await getPositions();

        setDepartments(deptResponse.data);
        setPositions(posResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (auth.token) {
      fetchMasterData();
    }
  }, [auth.token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleDateChange = (date, name) => {
    if (!date) {
      setFormData({ ...formData, [name]: "" });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    setFormData({
      ...formData,
      [name]: `${year}-${month}-${day}`,
    });
    setErrors({ ...errors, [name]: "" });
  };
  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };
  const handleEmergencyChange = (e) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!formData.employeeCode.trim()) {
      validationErrors.employeeCode = "Kode karyawan wajib diisi";
    }

    if (!formData.fullName.trim()) {
      validationErrors.fullName = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      validationErrors.email = "Email wajib diisi";
    }

    if (!formData.phoneNumber.trim()) {
      validationErrors.phoneNumber = "Nomor HP wajib diisi";
    }

    if (!formData.gender) {
      validationErrors.gender = "Gender wajib dipilih";
    }

    if (!formData.department) {
      validationErrors.department = "Department wajib dipilih";
    }

    if (!formData.position) {
      validationErrors.position = "Position wajib dipilih";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...formData,
      salary: Number(formData.salary),
    };

    try {
      setSubmitting(true);
      console.log("PAYLOAD EDIT:", payload);

      await updateEmployee(employee.id, payload);

      toast.success("Karyawan berhasil diperbaharui");

      onSuccess();
    } catch (error) {
      console.log("ERROR RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message || "Gagal memperbaharui karyawan",
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Karyawan</h2>

          <button type="button" onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* DATA KARYAWAN */}
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">
            Data Karyawan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 font-medium">Kode Karyawan</label>

              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                placeholder="EMP0001"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Nama Lengkap</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@email.com"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Nomor HP</label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Pilih Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Tanggal Lahir</label>

              <div className="relative">
                <DatePicker
                  selected={formData.birthDate ? new Date(formData.birthDate + "T00:00:00") : null}
                  onChange={(date) => handleDateChange(date, "birthDate")}
                  dateFormat="dd MMMM yyyy"
                  locale={id}
                  placeholderText="Pilih Tanggal Lahir"
                  className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  wrapperClassName="w-full"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Pilih Department</option>

                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Position</label>

              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Pilih Position</option>

                {positions.map((position, index) => (
                  <option key={index} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Tanggal Bergabung</label>

              <div className="relative">
                <DatePicker
                  selected={formData.joinDate ? new Date(formData.joinDate + "T00:00:00") : null}
                  onChange={(date) => handleDateChange(date, "joinDate")}
                  dateFormat="dd MMMM yyyy"
                  locale={id}
                  placeholderText="Pilih Tanggal Bergabung"
                  className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  wrapperClassName="w-full"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Salary</label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Contoh: 8500000"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ALAMAT */}
          <h3 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
            Alamat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 font-medium">Jalan</label>

              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="Contoh: Jl. Sudirman No. 10"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Kota</label>

              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                placeholder="Contoh: Jakarta"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Provinsi</label>

              <input
                type="text"
                name="province"
                value={formData.address.province}
                onChange={handleAddressChange}
                placeholder="Contoh: DKI Jakarta"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Kode Pos</label>

              <input
                type="text"
                name="postalCode"
                value={formData.address.postalCode}
                onChange={handleAddressChange}
                placeholder="Contoh: 10220"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* KONTAK DARURAT */}
          <h3 className="text-lg font-semibold border-b pb-2 mt-8 mb-4">
            Kontak Darurat
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-1 font-medium">Nama Kontak</label>

              <input
                type="text"
                name="name"
                value={formData.emergencyContact.name}
                onChange={handleEmergencyChange}
                placeholder="Contoh: Jane Doe"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Hubungan</label>

              <input
                type="text"
                name="relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleEmergencyChange}
                placeholder="Contoh: Istri, Suami, Orang Tua"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Nomor HP Darurat</label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.emergencyContact.phoneNumber}
                onChange={handleEmergencyChange}
                placeholder="Contoh: 081298765432"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEditeModal;
