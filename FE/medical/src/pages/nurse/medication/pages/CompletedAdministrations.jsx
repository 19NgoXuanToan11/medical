import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";
import { useRequestResults } from "../hooks/useRequestResults";
import {
  transformRequestResultData,
  filterRequestResults,
  filterByStatus,
} from "../utils/requestResultUtils";
import RequestResultTable from "../components/RequestResultTable";
import RequestResultDetailModal from "../components/RequestResultDetailModal";

const CompletedAdministrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { loading, results, refreshData, loadCompletedAdministrations } =
    useRequestResults();

  // Load completed administrations on mount
  useEffect(() => {
    loadCompletedAdministrations();
  }, []);

  // Transform and filter results
  const transformedResults = transformRequestResultData(results);
  const completedResults = filterByStatus(transformedResults, [
    "administered",
    "completed",
  ]);
  const filteredResults = filterRequestResults(
    completedResults,
    searchTerm,
    filterDate,
    ""
  );

  // Handle view detail
  const handleViewDetail = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadCompletedAdministrations();
  };

  // Calculate statistics
  const today = new Date().toISOString().split("T")[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);

  const todayCompleted = filteredResults.filter(
    (result) =>
      result.administeredTime &&
      new Date(result.administeredTime).toISOString().split("T")[0] === today
  ).length;

  const thisWeekCompleted = filteredResults.filter(
    (result) =>
      result.administeredTime && new Date(result.administeredTime) >= thisWeek
  ).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 dark:border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            Cấp thuốc đã hoàn thành
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các lần cấp thuốc đã được thực hiện thành công
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
          Cập nhật tiến độ
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Tổng cộng
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {filteredResults.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiCalendar className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Hôm nay
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {todayCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center">
            <FiTrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Tuần này
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {thisWeekCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {filteredResults.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Đã hoàn thành {filteredResults.length} lần cấp thuốc
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Công việc tuyệt vời! Các lần cấp thuốc đã được thực hiện thành
                công.
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày thực hiện
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Hiển thị {filteredResults.length} lần cấp thuốc đã hoàn thành
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
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Results Table */}
      <RequestResultTable
        results={filteredResults}
        activeTab="administered"
        onViewDetail={handleViewDetail}
      />

      {/* Detail Modal */}
      <RequestResultDetailModal
        result={selectedResult}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Empty State */}
      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiCheckCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Chưa có lần cấp thuốc nào hoàn thành
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || filterDate
              ? "Không tìm thấy lần cấp thuốc nào với bộ lọc hiện tại."
              : "Các lần cấp thuốc đã hoàn thành sẽ hiển thị ở đây."}
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedAdministrations;
