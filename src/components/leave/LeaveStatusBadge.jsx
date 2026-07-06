function LeaveStatusBadge({ status }) {
  const statusStyle = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyle[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default LeaveStatusBadge;
