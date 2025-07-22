import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiInfo } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import { useAuth } from "../../../../utils/auth/AuthContext";
import {
  transformRequestData,
  filterRequests,
  filterByStatus,
} from "../utils/medicationUtils";
import MedicationRequestTable from "../components/MedicationRequestTable";
import MedicationDetailModal from "../components/MedicationDetailModal";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { user } = useAuth();
  const {
    loading,
    setLoading,
    availableNurses,
    selectedNurse,
    setSelectedNurse,
    showActionDropdown,
    toggleActionDropdown,
    sendParentNotification,
    loadAllStats,
  } = useMedicationRequests();

  // Load pending requests on mount
  useEffect(() => {
    loadPendingRequests();
  }, [user]);

  // Load pending requests filtered by nurse's assigned grades
  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      // Use new API that automatically filters by nurse's assigned grades
      const response = await medicationService.getMyAssignedMedicationRequests(
        "pending"
      );

      if (response.success) {
        const transformedRequests = transformRequestData(response.data);

        // Force status to pending
        const pendingRequests = transformedRequests.map((req) => ({
          ...req,
          status: "pending",
        }));

        setRequests(pendingRequests);
      } else {
        console.error(
          "Error loading assigned pending requests:",
          response.message
        );
        setRequests([]);
      }
    } catch (error) {
      console.error(
        "Error loading assigned pending medication requests:",
        error
      );
      setRequests([]);
    }
    setLoading(false);
  };

  // Handle assign request
  const handleAssignRequest = async (requestId, staffId, notes = "") => {
    try {
      if (!staffId) {
        alert("Vui lòng chọn nhân viên y tế!");
        return;
      }

      const currentRequest = requests.find((req) => req.id === requestId);

      const response = await medicationService.updateMedicationRequestWithStaff(
        requestId,
        staffId,
        "approved",
        notes
      );

      if (response.success) {
        // Send notification to parent
        if (currentRequest) {
          await sendParentNotification(
            requestId,
            "assigned",
            notes,
            currentRequest
          );
        }

        alert("Yêu cầu đã được giao nhiệm vụ thành công!");

        // Clear form states
        setSelectedNurse("");

        // Reload stats and data
        await loadAllStats();
        setTimeout(async () => {
          await loadPendingRequests();
        }, 1000);
      } else {
        alert(response.message || "Có lỗi xảy ra khi phê duyệt yêu cầu!");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Có lỗi xảy ra khi phê duyệt yêu cầu!");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadAllStats();
    loadPendingRequests();
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Load data when component mounts or nurseGrade changes
  useEffect(() => {
    if (nurseGrade) {
      loadPendingRequests();
    }
  }, [nurseGrade]);

  // Filter requests
  const filteredRequests = filterRequests(requests, searchTerm, filterDate);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Yêu cầu chờ xử lý
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem xét và phê duyệt các yêu cầu cấp thuốc đang chờ xử lý
          </p>
          {nurseGrade && (
            <div className="mt-2 flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  🏥 Bạn phụ trách: <strong>Khối {nurseGrade}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Nurse Assignment Info */}
      {nurseGrade && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-start">
            <FiInfo className="text-green-500 mr-2 mt-0.5" />
            <div className="text-sm text-green-700 dark:text-green-300">
              <p className="font-medium mb-1">
                📋 Nghiệp vụ mới - Phân công theo khối:
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  • Bạn chỉ thấy các yêu cầu thuốc của học sinh{" "}
                  <strong>Khối {nurseGrade}</strong>
                </li>
                <li>
                  • Hệ thống đã tự động lọc và hiển thị{" "}
                  {filteredRequests.length} yêu cầu thuộc khối của bạn
                </li>
                <li>
                  • Không cần phân công thủ công - hệ thống tự động phân công
                  theo khối
                </li>
                <li>
                  • Điều này đảm bảo mỗi nurse chỉ quản lý 1 khối để tối ưu chất
                  lượng chăm sóc
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 transition-colors duration-300">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh, thuốc hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Requests Table */}
      <MedicationRequestTable
        requests={filteredRequests}
        activeTab="pending"
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        showActionDropdown={showActionDropdown}
        toggleActionDropdown={toggleActionDropdown}
        onViewDetail={handleViewDetail}
        onAssignRequest={handleAssignRequest}
        onCompleteRequest={() => {}}
      />

      {/* Detail Modal */}
      <MedicationDetailModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={() => setShowDetailModal(false)}
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        onAssignRequest={handleAssignRequest}
        onCompleteRequest={() => {}}
      />
    </div>
  );
};

export default PendingRequests;
