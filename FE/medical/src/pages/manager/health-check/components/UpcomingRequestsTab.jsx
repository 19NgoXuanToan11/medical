import React, { useState } from "react";
import { FiRefreshCw, FiAlertTriangle, FiCalendar } from "react-icons/fi";
import RequestCard from "./RequestCard";
import HealthCheckCompletionModal from "./HealthCheckCompletionModal";

const UpcomingRequestsTab = ({
  upcomingRequests,
  fetchingData,
  error,
  onRefresh,
  onViewDetail,
}) => {
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleCompleteHealthCheck = (request) => {
    setSelectedRequest(request);
    setShowCompletionModal(true);
  };

  const handleCompletionSuccess = (result) => {
    // Refresh the data to update the list
    onRefresh?.();
  };
  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Lịch khám sắp tới ({upcomingRequests.length}) - CHỈ HIỂN THỊ LỊCH ĐÃ DUYỆT
        </h3>
        <div className="flex gap-2">
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
          <button
            onClick={() => onRefresh(true)}
            disabled={fetchingData}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiAlertTriangle className="w-4 h-4" />
            Force Refresh
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && <ErrorMessage error={error} />}

      {/* Loading state */}
      {fetchingData && <LoadingState />}

      {/* Upcoming Requests List */}
      {!fetchingData && (
        <UpcomingRequestsList
          upcomingRequests={upcomingRequests}
          onViewDetail={onViewDetail}
          onCompleteHealthCheck={handleCompleteHealthCheck}
          error={error}
        />
      )}

      {/* Health Check Completion Modal */}
      <HealthCheckCompletionModal
        showModal={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        selectedRequest={selectedRequest}
        onSuccess={handleCompletionSuccess}
      />
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

const UpcomingRequestsList = ({ upcomingRequests, onViewDetail, onCompleteHealthCheck, error }) => {
  const sortedRequests = upcomingRequests.sort((a, b) => {
    // Status order: active first, then Approved, then scheduled
    const statusOrder = { active: 1, Approved: 2, scheduled: 3 };
    const orderA = statusOrder[a.status] || 99;
    const orderB = statusOrder[b.status] || 99;
    if (orderA !== orderB) return orderA - orderB;
    // Then sort by date (newest first)
    return new Date(a.scheduledDate) - new Date(b.scheduledDate);
  });

  if (sortedRequests.length === 0 && !error) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {sortedRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onViewDetail={onViewDetail}
          showActions={true} // Show completion action for upcoming requests
          variant="upcoming"
          onCompleteHealthCheck={onCompleteHealthCheck}
        />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
    <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Không có lịch khám đã được duyệt
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Tab "Sắp tới" chỉ hiển thị những lịch khám có <strong>confirmStatus = "approved"</strong>
    </p>
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
      <p className="text-sm text-blue-800 dark:text-blue-200">
        💡 <strong>Lưu ý:</strong> Để có lịch khám ở đây, Manager cần duyệt các yêu cầu ở tab "Chờ duyệt" trước.
      </p>
    </div>
  </div>
);

export default UpcomingRequestsTab;
