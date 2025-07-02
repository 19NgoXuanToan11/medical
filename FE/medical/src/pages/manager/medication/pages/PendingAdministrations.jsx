import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiClock, FiAlertCircle } from "react-icons/fi";
import { useRequestResults } from "../hooks/useRequestResults";
import {
  transformRequestResultData,
  filterRequestResults,
  filterByStatus,
} from "../utils/requestResultUtils";
import RequestResultTable from "../components/RequestResultTable";
import RequestResultDetailModal from "../components/RequestResultDetailModal";

const PendingAdministrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    loading,
    results,
    refreshData,
    loadPendingAdministrations,
    markAsAdministered,
    markAsFailed,
  } = useRequestResults();

  // Load pending administrations on mount
  useEffect(() => {
    loadPendingAdministrations();
  }, []);

  // Transform and filter results
  const transformedResults = transformRequestResultData(results);
  const pendingResults = filterByStatus(transformedResults, ["pending"]);
  const filteredResults = filterRequestResults(
    pendingResults,
    searchTerm,
    filterDate,
    ""
  );

  // Handle mark as administered
  const handleMarkAsAdministered = async (result) => {
    const confirmed = window.confirm(
      `Xác nhận đã cấp thuốc ${result.medicineName} cho học sinh ${result.studentName}?`
    );

    if (confirmed) {
      const response = await markAsAdministered(result.resultId, {
        notes: `Đã cấp thuốc ${
          result.medicineName
        } - ${new Date().toLocaleString("vi-VN")}`,
        administeredFrequencies: `${result.currentDayCount + 1}/${
          result.timesPerDay || 1
        }`,
      });

      if (response.success) {
        alert(response.message);
        setShowDetailModal(false);
        // Reload pending data
        loadPendingAdministrations();
      } else {
        alert(response.message);
      }
    }
  };

  // Handle mark as failed
  const handleMarkAsFailed = async (result) => {
    const reason = window.prompt(
      `Lý do không thể cấp thuốc ${result.medicineName} cho học sinh ${result.studentName}:`
    );

    if (reason && reason.trim()) {
      const response = await markAsFailed(result.resultId, {
        failureReasons: reason.trim(),
        notes: `Thất bại: ${reason.trim()}`,
      });

      if (response.success) {
        alert(response.message);
        setShowDetailModal(false);
        // Reload pending data
        loadPendingAdministrations();
      } else {
        alert(response.message);
      }
    }
  };

  // Handle view detail
  const handleViewDetail = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadPendingAdministrations();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 dark:border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-2" />
            Nhiệm vụ cấp thuốc chờ thực hiện
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các nhiệm vụ cấp thuốc đang chờ được thực hiện
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
          Làm mới nhiệm vụ
        </button>
      </div>

      {/* Alert for urgent tasks */}
      {filteredResults.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Có {filteredResults.length} nhiệm vụ cấp thuốc chờ thực hiện
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Vui lòng kiểm tra và thực hiện các nhiệm vụ cấp thuốc để đảm bảo
                sức khỏe học sinh.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm theo tên học sinh, thuốc, mã học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày yêu cầu
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Hiển thị {filteredResults.length} nhiệm vụ chờ thực hiện
          {searchTerm && ` cho "${searchTerm}"`}
          {filterDate &&
            ` vào ngày ${new Date(filterDate).toLocaleDateString("vi-VN")}`}
        </span>
        {(searchTerm || filterDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
            }}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Priority Tasks (if any) */}
      {filteredResults.some((result) => {
        const currentTime = new Date();
        const submittedTime = new Date(result.submittedAt);
        const hoursDiff = (currentTime - submittedTime) / (1000 * 60 * 60);
        return hoursDiff > 2; // Tasks older than 2 hours
      }) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            ⚠️ Nhiệm vụ ưu tiên cao
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300">
            Có nhiệm vụ cấp thuốc đã chờ quá 2 giờ. Vui lòng ưu tiên thực hiện.
          </p>
        </div>
      )}

      {/* Results Table */}
      <RequestResultTable
        results={filteredResults}
        activeTab="pending"
        onViewDetail={handleViewDetail}
        onMarkAsAdministered={handleMarkAsAdministered}
        onMarkAsFailed={handleMarkAsFailed}
      />

      {/* Detail Modal */}
      <RequestResultDetailModal
        result={selectedResult}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMarkAsAdministered={handleMarkAsAdministered}
        onMarkAsFailed={handleMarkAsFailed}
      />

      {/* Empty State */}
      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiClock className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Không có nhiệm vụ chờ thực hiện
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterDate
              ? "Không tìm thấy nhiệm vụ nào với bộ lọc hiện tại."
              : "Tuyệt vời! Hiện tại không có nhiệm vụ cấp thuốc nào chờ thực hiện."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingAdministrations;
