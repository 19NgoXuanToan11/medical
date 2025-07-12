import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiXCircle, FiFileText } from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import {
  transformRequestData,
  filterRequests,
  filterByStatus,
} from "../utils/medicationUtils";
import MedicationRequestTable from "../components/MedicationRequestTable";
import MedicationDetailModal from "../components/MedicationDetailModal";

const RejectedRequests = () => {
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

  // Load rejected requests
  const loadRejectedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getRejectedMedicationRequests();

      if (response.success) {
        console.log("Raw rejected API response:", response.data);

        const rejectedOnly = filterByStatus(response.data, [
          "Rejected",
          "rejected",
          "Từ chối",
        ]);
        console.log("Filtered rejected requests:", rejectedOnly);

        const transformedRequests = transformRequestData(rejectedOnly);

        // Force status to rejected and add additional rejection data
        const rejectedRequests = transformedRequests.map((req) => ({
          ...req,
          status: "rejected",
        }));

        console.log("Transformed rejected requests:", rejectedRequests);
        setRequests(rejectedRequests);
      } else {
        console.error("Error loading rejected requests:", response.message);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading rejected medication requests:", error);
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
    loadRejectedRequests();
    loadAllStats();
  };

  // Handle resubmit request
  const handleResubmitRequest = async (request) => {
    const reason = window.prompt(
      `Lý do gửi lại yêu cầu thuốc cho ${request.studentName}:`
    );

    if (reason && reason.trim()) {
      try {
        const response = await medicationService.resubmitMedicationRequest(
          request.id,
          {
            resubmitReason: reason.trim(),
            resubmitDate: new Date().toISOString(),
            originalRequestId: request.id,
          }
        );

        if (response.success) {
          alert("Yêu cầu đã được gửi lại thành công!");
          loadRejectedRequests();
          loadAllStats();
        } else {
          alert("Không thể gửi lại yêu cầu: " + response.message);
        }
      } catch (error) {
        console.error("Error resubmitting request:", error);
        alert("Đã xảy ra lỗi khi gửi lại yêu cầu");
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadRejectedRequests();
  }, []);

  // Filter requests based on search and date
  const filteredRequests = filterRequests(requests, searchTerm, filterDate);

  // Calculate statistics
  const today = new Date().toISOString().split("T")[0];
  const todayRejected = filteredRequests.filter(
    (req) =>
      req.rejectedDate &&
      new Date(req.rejectedDate).toISOString().split("T")[0] === today
  ).length;

  const thisWeekRejected = filteredRequests.filter((req) => {
    if (!req.rejectedDate) return false;
    const rejectedDate = new Date(req.rejectedDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return rejectedDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiXCircle className="h-5 w-5 mr-2 text-red-500" />
            Yêu cầu thuốc từ chối
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các yêu cầu thuốc đã bị từ chối
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiXCircle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng từ chối
              </p>
              <p className="text-2xl font-bold text-red-600">
                {filteredRequests.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiFileText className="h-8 w-8 text-orange-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hôm nay
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {todayRejected}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiRefreshCw className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tuần này
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {thisWeekRejected}
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

      {/* Rejection Reasons Summary */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Lý do từ chối phổ biến
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            "Thông tin không đầy đủ",
            "Thuốc không phù hợp",
            "Liều lượng không chính xác",
            "Cần tư vấn bác sĩ",
            "Thuốc hết hạn",
            "Khác",
          ].map((reason) => {
            const count = filteredRequests.filter(
              (req) => req.rejectionReason === reason
            ).length;
            return (
              <div
                key={reason}
                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-neutral-700 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {reason}
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requests Table */}
      <MedicationRequestTable
        requests={filteredRequests}
        activeTab="rejected"
        availableNurses={availableNurses}
        selectedNurse={selectedNurse}
        setSelectedNurse={setSelectedNurse}
        showActionDropdown={showActionDropdown}
        toggleActionDropdown={toggleActionDropdown}
        onViewDetail={handleViewDetail}
        onAssignRequest={() => {}}
        onCompleteRequest={() => {}}
        onResubmitRequest={handleResubmitRequest}
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

export default RejectedRequests;
