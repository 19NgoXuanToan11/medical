import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiAlertTriangle,
  FiRepeat,
  FiTrendingDown,
} from "react-icons/fi";
import { useRequestResults } from "../hooks/useRequestResults";
import {
  transformRequestResultData,
  filterRequestResults,
  filterByStatus,
} from "../utils/requestResultUtils";
import RequestResultTable from "../components/RequestResultTable";
import RequestResultDetailModal from "../components/RequestResultDetailModal";

const FailedAdministrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    loading,
    results,
    refreshData,
    loadFailedAdministrations,
    createReRequest,
  } = useRequestResults();

  // Load failed administrations on mount
  useEffect(() => {
    loadFailedAdministrations();
  }, []);

  // Transform and filter results
  const transformedResults = transformRequestResultData(results);
  const failedResults = filterByStatus(transformedResults, ["failed"]);
  const filteredResults = filterRequestResults(
    failedResults,
    searchTerm,
    filterDate,
    ""
  );

  // Handle create re-request
  const handleCreateReRequest = async (result) => {
    const reason = window.prompt(
      `Lý do tạo yêu cầu lại cho thuốc ${result.medicineName}:`
    );

    if (reason && reason.trim()) {
      const response = await createReRequest(result.resultId, {
        reRequestReason: reason.trim(),
        requestId: result.requestId,
      });

      if (response.success) {
        alert(response.message);
        setShowDetailModal(false);
        // Reload failed data
        loadFailedAdministrations();
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
    loadFailedAdministrations();
  };

  // Calculate statistics
  const today = new Date().toISOString().split("T")[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayFailed = filteredResults.filter(
    (result) =>
      result.lastAttemptTime &&
      new Date(result.lastAttemptTime).toISOString().split("T")[0] === today
  ).length;

  const multipleFailures = filteredResults.filter(
    (result) => result.failedAttempts > 1
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 dark:border-red-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
            Cấp thuốc thất bại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các lần cấp thuốc không thành công và cần xử lý
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
          Kiểm tra lại
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">
                Tổng thất bại
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">
                {filteredResults.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiTrendingDown className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Hôm nay
              </p>
              <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                {todayFailed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiRepeat className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Thất bại nhiều lần
              </p>
              <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {multipleFailures}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for failures */}
      {filteredResults.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Cần xử lý {filteredResults.length} trường hợp thất bại
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Vui lòng xem xét các lý do thất bại và tạo yêu cầu lại nếu cần
                thiết.
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày thất bại
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Hiển thị {filteredResults.length} trường hợp thất bại
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
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Critical Failures Alert */}
      {filteredResults.some((result) => result.failedAttempts >= 3) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                ⚠️ Có trường hợp thất bại nghiêm trọng
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Một số trường hợp đã thất bại 3 lần trở lên. Cần liên hệ phụ
                huynh hoặc báo cáo lên cấp trên.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <RequestResultTable
        results={filteredResults}
        activeTab="failed"
        onViewDetail={handleViewDetail}
        onCreateReRequest={handleCreateReRequest}
      />

      {/* Detail Modal */}
      <RequestResultDetailModal
        result={selectedResult}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onCreateReRequest={handleCreateReRequest}
      />

      {/* Empty State */}
      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Không có trường hợp thất bại nào
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterDate
              ? "Không tìm thấy trường hợp thất bại nào với bộ lọc hiện tại."
              : "Tuyệt vời! Hiện tại không có trường hợp cấp thuốc thất bại nào."}
          </p>
        </div>
      )}
    </div>
  );
};

export default FailedAdministrations;
