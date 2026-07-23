import { FiSearch } from "react-icons/fi";

function LeaveToolbar({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:w-80">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />

        <input
          type="text"
          placeholder="Cari Karyawan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full md:w-52 border rounded-lg px-4 py-2"
      >
        <option value="All">Semua Status..</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Disetujui</option>
        <option value="Rejected">Ditolak</option>
      </select>
    </div>
  );
}

export default LeaveToolbar;
