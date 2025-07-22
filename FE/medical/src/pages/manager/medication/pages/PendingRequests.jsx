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

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { loading, setLoading, loadAllStats } = useMedicationRequests();

  // Load all pending requests (manager can see all grades)
  const loadPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getPendingMedicationRequests();

      if (response.success) {
        const pendingOnly = filterByStatus(response.data, [
          "pending",
          "Pending",
          null,
          undefined,
        ]);
        const transformedRequests = transformRequestData(pendingOnly);

        // Force status to pending
        const pendingRequests = transformedRequests.map((req) => ({
          ...req,
          status: "pending",
        }));

        setRequests(pendingRequests);
      } else {
        console.error("Error loading pending requests:", response.message);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading pending medication requests:", error);
      setRequests([]);
    }
    setLoading(false);
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

  // Load data on mount
  useEffect(() => {
    loadPendingRequests();
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
            Yêu cầu chờ xử lý
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem xét và phê duyệt các yêu cầu cấp thuốc đang chờ xử lý
          </p>
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
        onViewDetail={handleViewDetail}
      />

      {/* Detail Modal */}
      <MedicationDetailModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={() => setShowDetailModal(false)}
        availableNurses={[]} // TODO: Load available nurses from API
        onAssignSuccess={() => {
          // Refresh data when assignment is successful
          loadPendingRequests();
          loadAllStats();
        }}
      />
    </div>
  );
};

export default PendingRequests;
