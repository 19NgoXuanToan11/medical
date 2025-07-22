import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import {
  transformRequestData,
  filterRequests,
  filterByStatus,
} from "../utils/medicationUtils";
import MedicationRequestTable from "../components/MedicationRequestTable";
import MedicationDetailModal from "../components/MedicationDetailModal";

const AssignedRequests = () => {
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

  // Load assigned requests filtered by nurse's assigned grades
  const loadAssignedRequests = async () => {
    setLoading(true);
    try {
      // Use new API that automatically filters by nurse's assigned grades
      const response = await medicationService.getMyAssignedMedicationRequests(
        "assigned"
      );

      if (response.success) {
        const transformedRequests = transformRequestData(response.data);

        // Force status to assigned and add additional assignment data
        const assignedRequests = transformedRequests.map((req) => ({
          ...req,
          status: "assigned",
        }));

        setRequests(assignedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      setRequests([]);
    }
    setLoading(false);
  };

  // Handle complete request
  const handleCompleteRequest = async (request, notes = "") => {
    try {
      if (!request) {
        alert("Không tìm thấy yêu cầu!");
        return;
      }

      const staffId = request.staffId || request.staff?.staffId;

      if (!staffId) {
        alert("Không tìm thấy thông tin nhân viên!");
        return;
      }

      const response = await medicationService.completeMedicationRequest(
        request.id,
        staffId,
        notes
      );

      if (response.success) {
        // Send notification to parent
        await sendParentNotification(request.id, "completed", notes, request);

        alert("Yêu cầu đã được hoàn thành thành công!");

        // Reload stats and data
        await loadAllStats();
        setTimeout(async () => {
          await loadAssignedRequests();
        }, 1000);
      } else {
        alert(response.message || "Có lỗi xảy ra khi hoàn thành yêu cầu!");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi hoàn thành yêu cầu thuốc!");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadAllStats();
    loadAssignedRequests();
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Load data on mount
  useEffect(() => {
    loadAssignedRequests();
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
            Yêu cầu đã giao nhiệm vụ
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi và hoàn thành các yêu cầu đã được giao cho nhân viên y tế
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors duration-200"
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
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Requests Table */}
      <MedicationRequestTable
        requests={filteredRequests}
        activeTab="assigned"
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        showActionDropdown={showActionDropdown}
        toggleActionDropdown={toggleActionDropdown}
        onViewDetail={handleViewDetail}
        onAssignRequest={() => {}}
        onCompleteRequest={handleCompleteRequest}
      />

      {/* Detail Modal */}
      <MedicationDetailModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={() => setShowDetailModal(false)}
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        onAssignRequest={() => {}}
        onCompleteRequest={handleCompleteRequest}
      />
    </div>
  );
};

export default AssignedRequests;
