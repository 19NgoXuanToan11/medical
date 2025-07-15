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

  const { loading, setLoading, loadAllStats } = useMedicationRequests();

  // Load assigned requests
  const loadAssignedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getAssignedMedicationRequests();

      if (response.success) {
        console.log("Raw assigned API response:", response.data);

        const assignedOnly = filterByStatus(response.data, [
          "Assigned",
          "assigned",
        ]);
        console.log("Filtered assigned requests:", assignedOnly);

        const transformedRequests = transformRequestData(assignedOnly);

        // Force status to assigned and add additional assignment data
        const assignedRequests = transformedRequests.map((req) => ({
          ...req,
          status: "assigned",
        }));

        console.log("Transformed assigned requests:", assignedRequests);
        setRequests(assignedRequests);
      } else {
        console.error("Error loading assigned requests:", response.message);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned medication requests:", error);
      setRequests([]);
    }
    setLoading(false);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadAllStats();
    loadAssignedRequests();
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    console.log("Opening modal for request:", request);
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
        onViewDetail={handleViewDetail}
      />

      {/* Detail Modal */}
      <MedicationDetailModal
        show={showDetailModal}
        request={selectedRequest}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
};

export default AssignedRequests;
