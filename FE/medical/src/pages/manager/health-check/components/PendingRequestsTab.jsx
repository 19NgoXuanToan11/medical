import React, { useState } from "react";
import {
  FiRefreshCw,
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiActivity,
  FiCalendar,
} from "react-icons/fi";
import RequestCard from "./RequestCard";

const PendingRequestsTab = ({
  pendingRequests,
  fetchingData,
  error,
  onRefresh,
  onViewDetail,
  onApprovalAction,
  setSelectedRequest,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Yêu cầu chờ duyệt ({pendingRequests.length})
        </h3>
        <button
          onClick={onRefresh}
          disabled={fetchingData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw
            className={`w-4 h-4 ${fetchingData ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && <ErrorMessage error={error} />}

      {/* Loading state */}
      {fetchingData && <LoadingState />}

      {/* Search and Filter */}
      {!fetchingData && (
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {/* Equipment Priority Alert */}
      <EquipmentPriorityAlert pendingRequests={pendingRequests} />

      {/* Pending Requests List */}
      {!fetchingData && (
        <PendingRequestsList
          pendingRequests={pendingRequests}
          searchTerm={searchTerm}
          onViewDetail={onViewDetail}
          onApprovalAction={onApprovalAction}
          setSelectedRequest={setSelectedRequest}
          error={error}
        />
      )}
    </div>
  );
};

const ErrorMessage = ({ error }) => (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
    <div className="flex items-center gap-2">
      <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
      <span className="text-red-800 dark:text-red-200">{error}</span>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
    <div className="flex items-center justify-center">
      <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
      <span className="text-gray-600 dark:text-gray-300">
        Đang tải dữ liệu...
      </span>
    </div>
  </div>
);

const SearchAndFilter = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm yêu cầu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <select
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          onChange={(e) => {
            // Filter logic here if needed
          }}
        >
          <option value="all">Tất cả yêu cầu</option>
          <option value="equipment_issues">⚠️ Có vấn đề thiết bị</option>
          <option value="equipment_ready">✅ Thiết bị sẵn sàng</option>
        </select>
        <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center gap-2">
          <FiFilter className="h-4 w-4" />
          Bộ lọc
        </button>
      </div>
    </div>
  </div>
);

const EquipmentPriorityAlert = ({ pendingRequests }) => {
  const equipmentIssueCount = pendingRequests.filter(
    (req) => req.equipmentReport?.requiresAction
  ).length;

  if (equipmentIssueCount === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-red-200 dark:bg-red-800 rounded-full">
          <FiAlertTriangle className="h-5 w-5 text-red-800 dark:text-red-200" />
        </div>
        <h4 className="text-lg font-bold text-red-800 dark:text-red-200">
          🚨 CẦN XEM XÉT NGAY - THIẾU THIẾT BỊ
        </h4>
      </div>
      <p className="text-red-700 dark:text-red-300 font-medium mb-2">
        {equipmentIssueCount} yêu cầu khám sức khỏe bị thiếu thiết bị cần thiết.
        Vui lòng xem xét các yêu cầu này trước khi phê duyệt.
      </p>
      <div className="text-sm text-red-600 dark:text-red-400">
        💡 <strong>Gợi ý:</strong> Có thể phê duyệt có điều kiện hoặc tạm hoãn
        để chuẩn bị thiết bị
      </div>
    </div>
  );
};

const PendingRequestsList = ({
  pendingRequests,
  searchTerm,
  onViewDetail,
  onApprovalAction,
  setSelectedRequest,
  error,
}) => {
  const filteredRequests = pendingRequests
    .filter(
      (request) =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Sort: Equipment issues first, then by date
    .sort((a, b) => {
      // Equipment issues go first
      if (
        a.equipmentReport?.requiresAction &&
        !b.equipmentReport?.requiresAction
      )
        return -1;
      if (
        !a.equipmentReport?.requiresAction &&
        b.equipmentReport?.requiresAction
      )
        return 1;
      // Then sort by date (newest first)
      return new Date(b.requestDate) - new Date(a.requestDate);
    });

  if (filteredRequests.length === 0 && !error) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {filteredRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onViewDetail={onViewDetail}
          onApprovalAction={onApprovalAction}
          setSelectedRequest={setSelectedRequest}
          variant="pending"
        />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
    <FiActivity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Không có yêu cầu chờ duyệt
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      Tất cả yêu cầu kiểm tra sức khỏe đã được xử lý
    </p>
  </div>
);

export default PendingRequestsTab;
