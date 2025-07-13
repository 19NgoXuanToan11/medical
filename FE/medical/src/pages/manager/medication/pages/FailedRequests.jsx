import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import { transformRequestData, filterRequests } from "../utils/medicationUtils";
import MedicationRequestTable from "../components/MedicationRequestTable";
import MedicationDetailModal from "../components/MedicationDetailModal";

const FailedRequests = () => {
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
    loadAllStats,
  } = useMedicationRequests();

  // Load failed requests
  const loadFailedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getFailedMedicationRequests();

      if (response.success) {
        console.log("Failed API response:", response.data);

        const transformedRequests = transformRequestData(response.data);

        // Force status to failed and add additional failure data
        const failedRequests = transformedRequests.map((req) => ({
          ...req,
          status: "failed",
        }));

        console.log("Transformed failed requests:", failedRequests);
        setRequests(failedRequests);
      } else {
        console.error("Error loading failed requests:", response.message);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading failed medication requests:", error);
      setRequests([]);
    }
    setLoading(false);
  };

  // Handle view detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadFailedRequests();
    loadAllStats();
  };

  // Handle retry request
  const handleRetryRequest = async (request) => {
    const confirmed = window.confirm(
      `Bạn có muốn thử lại yêu cầu thuốc cho ${request.studentName}?`
    );

    if (confirmed) {
      try {
        const response = await medicationService.retryMedicationRequest(
          request.id,
          {
            retryReason: "Thử lại sau khi thất bại",
            retryDate: new Date().toISOString(),
          }
        );

        if (response.success) {
          alert("Yêu cầu đã được thử lại thành công!");
          loadFailedRequests();
          loadAllStats();
        } else {
          alert("Không thể thử lại yêu cầu: " + response.message);
        }
      } catch (error) {
        console.error("Error retrying request:", error);
        alert("Đã xảy ra lỗi khi thử lại yêu cầu");
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFailedRequests();
  }, []);

  // Filter requests based on search and date
  const filteredRequests = filterRequests(requests, searchTerm, filterDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Yêu cầu thuốc thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các yêu cầu thuốc đã thất bại trong quá trình xử lý
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiAlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng thất bại
              </p>
              <p className="text-2xl font-bold text-red-600">
                {filteredRequests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiRefreshCw className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Có thể thử lại
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  filteredRequests.filter(
                    (req) => !req.retryAttempts || req.retryAttempts < 3
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiSearch className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang hiển thị
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredRequests.length}
              </p>
            </div>
          </div>
        </div>
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
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-full"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Requests Table */}
      <MedicationRequestTable
        requests={filteredRequests}
        activeTab="failed"
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        showActionDropdown={showActionDropdown}
        toggleActionDropdown={toggleActionDropdown}
        onViewDetail={handleViewDetail}
        onAssignRequest={() => {}}
        onCompleteRequest={() => {}}
        onRetryRequest={handleRetryRequest}
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
        onCompleteRequest={() => {}}
      />
    </div>
  );
};

export default FailedRequests;
