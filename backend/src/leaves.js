const leaves = [];

// Leave types dan default quota per tahun
const leaveTypes = {
  ANNUAL: { name: "Annual Leave", quota: 12 },
  SICK: { name: "Sick Leave", quota: 6 },
  PERSONAL: { name: "Personal Leave", quota: 3 },
  BEREAVEMENT: { name: "Bereavement Leave", quota: 3 },
};

// Leave status
const leaveStatus = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

// Initialize leave balance untuk setiap karyawan
function initializeLeaveBalance(employeeId, search = "") {
  const balance = {};
  Object.entries(leaveTypes).forEach(([key, value]) => {
    balance[key] = {
      type: value.name,
      quota: value.quota,
      used: 0,
      remaining: value.quota,
      search,
    };
  });
  return balance;
}

module.exports = {
  leaves,
  leaveTypes,
  leaveStatus,
  initializeLeaveBalance,
};
