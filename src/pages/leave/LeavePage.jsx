import { useCallback, useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import LeaveTable from "../../components/leave/LeaveTable";
import {
  getLeaveRequests,
  approveLeave,
  rejectLeave,
} from "../../api/leaveApi";
import ApprovalModal from "../../components/leave/ApprovalModal";
import LeaveDetailModal from "../../components/leave/LeaveDetailModal";
import { toast } from "react-toastify";
import RejectModal from "../../components/leave/RejectModal";
import LeaveFormModal from "../../components/leave/LeaveFormModal";
import { FiPlus } from "react-icons/fi";
import LeaveToolbar from "../../components/leave/LeaveToolbar";
import Pagination from "../../components/common/Pagination";

function LeavePage() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeaveRequests = useCallback(async () => {
    try {
      setRefreshing(true);

      const response = await getLeaveRequests(
        page,
        10,
        statusFilter === "All" ? "" : statusFilter,
        debouncedSearch,
      );

      setRequests(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async (id, approvalNotes) => {
    try {
      setApproveLoading(true);

      await approveLeave(id, approvalNotes);

      toast.success("Permohonan cuti berhasil disetujui.");

      setShowApproveModal(false);
      setSelectedRequest(null);

      await fetchLeaveRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to approve leave request.",
      );
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (id, rejectionReason) => {
    try {
      setRejectLoading(true);

      await rejectLeave(id, rejectionReason);

      toast.success("Permohonan cuti berhasil ditolak.");

      setShowRejectModal(false);
      setSelectedRequest(null);

      await fetchLeaveRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject leave request.",
      );
    } finally {
      setRejectLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Cuti</h1>
            <p className="text-gray-500 mt-2">
              Mengelola permintaan cuti karyawan..
            </p>
          </div>

          <button
            onClick={() => setShowFormModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition"
          >
            <FiPlus size={18} />
            Ajukan Cuti
          </button>
        </div>

        <LeaveFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          onSuccess={fetchLeaveRequests}
        />

        <LeaveToolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <div className={refreshing ? "opacity-50 transition-opacity" : ""}>
          <LeaveTable
            requests={requests}
            pagination={pagination}
            onDetail={handleDetail}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        <Pagination
          page={page}
          limit={pagination?.limit || 10}
          totalData={pagination?.totalData || 0}
          totalPage={pagination?.totalPage || 1}
          onPageChange={setPage}
        />

        <ApprovalModal
          isOpen={showApproveModal}
          request={selectedRequest}
          loading={approveLoading}
          onClose={() => {
            setShowApproveModal(false);
            setSelectedRequest(null);
          }}
          onConfirm={handleConfirmApprove}
        />

        <LeaveDetailModal
          isOpen={showDetailModal}
          request={selectedRequest}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }}
        />

        <RejectModal
          isOpen={showRejectModal}
          request={selectedRequest}
          loading={rejectLoading}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedRequest(null);
          }}
          onConfirm={handleConfirmReject}
        />
      </div>
    </MainLayout>
  );
}

export default LeavePage;
