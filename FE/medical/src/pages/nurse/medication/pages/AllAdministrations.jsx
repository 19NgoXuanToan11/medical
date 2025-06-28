import React, { useState, useEffect } from "react";
import { FiSearch, FiRefreshCw, FiFilter } from "react-icons/fi";
import { useRequestResults } from "../hooks/useRequestResults";
import {
  transformRequestResultData,
  filterRequestResults,
} from "../utils/requestResultUtils";
import RequestResultTable from "../components/RequestResultTable";
import RequestResultDetailModal from "../components/RequestResultDetailModal";

const AllAdministrations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    loading,
    results,
    refreshData,
    markAsAdministered,
    markAsFailed,
    createReRequest,
  } = useRequestResults();

  // Transform and filter results
  const transformedResults = transformRequestResultData(results);
  const filteredResults = filterRequestResults(
    transformedResults,
    searchTerm,
    filterDate,
    filterStatus
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
      });

      if (response.success) {
        alert(response.message);
        setShowDetailModal(false);
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
      } else {
        alert(response.message);
      }
    }
  };

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
    refreshData();
  };

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
            Tất cả kết quả uống thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem tổng quan và quản lý tất cả các kết quả uống thuốc trong hệ
            thống
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Tải lại dữ liệu
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Trạng thái
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ cấp thuốc</option>
              <option value="administered">Đã cấp thuốc</option>
              <option value="completed">Hoàn thành</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Hiển thị {filteredResults.length} kết quả
          {searchTerm && ` cho "${searchTerm}"`}
          {filterDate &&
            ` vào ngày ${new Date(filterDate).toLocaleDateString("vi-VN")}`}
          {filterStatus && ` với trạng thái "${filterStatus}"`}
        </span>
        {(searchTerm || filterDate || filterStatus) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterDate("");
              setFilterStatus("");
            }}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Results Table */}
      <RequestResultTable
        results={filteredResults}
        activeTab="all"
        onViewDetail={handleViewDetail}
        onMarkAsAdministered={handleMarkAsAdministered}
        onMarkAsFailed={handleMarkAsFailed}
        onCreateReRequest={handleCreateReRequest}
      />

      {/* Detail Modal */}
      <RequestResultDetailModal
        result={selectedResult}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onMarkAsAdministered={handleMarkAsAdministered}
        onMarkAsFailed={handleMarkAsFailed}
        onCreateReRequest={handleCreateReRequest}
      />
    </div>
  );
};

export default AllAdministrations;
