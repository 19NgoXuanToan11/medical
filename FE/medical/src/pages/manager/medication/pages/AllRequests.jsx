import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import { transformRequestData, filterRequests } from "../utils/medicationUtils";
import MedicationRequestTable from "../components/MedicationRequestTable";
import MedicationDetailModal from "../components/MedicationDetailModal";

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  // Load all requests
  const loadAllRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getAllMedicationRequests();

      if (response.success) {
        console.log("Raw all requests API response:", response.data);

        const transformedRequests = transformRequestData(response.data);

        console.log("All transformed requests:", transformedRequests);
        setRequests(transformedRequests);
      } else {
        console.error("Error loading all requests:", response.message);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading all medication requests:", error);
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

      console.log("Assigning request:", { requestId, staffId, notes });

      const currentRequest = requests.find((req) => req.id === requestId);
      console.log("Current request data before assignment:", currentRequest);

      const response = await medicationService.updateMedicationRequestWithStaff(
        requestId,
        staffId,
        "approved",
        notes
      );

      console.log("Assignment response:", response);

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
          await loadAllRequests();
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
    loadAllRequests();
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    console.log("Opening modal for request:", request);
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Load data on mount
  useEffect(() => {
    loadAllRequests();
  }, []);

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
            Tất cả yêu cầu thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem tổng quan và quản lý tất cả các yêu cầu thuốc trong hệ thống
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

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
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Requests Table */}
      <MedicationRequestTable
        requests={filteredRequests}
        activeTab="all"
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

export default AllRequests;
