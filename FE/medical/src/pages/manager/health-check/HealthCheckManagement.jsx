import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBarChart,
  FiClock,
  FiCalendar,
  FiAlertTriangle,
} from "react-icons/fi";

// Custom hooks
import { useHealthCheckData } from "./hooks/useHealthCheckData";
import { useApprovalModal } from "./hooks/useApprovalModal";

// Components
import OverviewTab from "./components/OverviewTab";
import PendingRequestsTab from "./components/PendingRequestsTab";
import UpcomingRequestsTab from "./components/UpcomingRequestsTab";
import HealthCheckDetailModal from "./components/HealthCheckDetailModal";
import ApprovalModal from "./components/ApprovalModal";

const HealthCheckManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Custom hooks for data and modal management
  const {
    fetchingData,
    error,
    pendingRequests,
    upcomingRequests,
    healthCheckPrograms,
    stats,
    fetchHealthCheckSchedules,
    updateSchedule,
  } = useHealthCheckData();

  const {
    selectedRequest,
    setSelectedRequest,
    showDetailModal,
    setShowDetailModal,
    showApprovalModal,
    approvalAction,
    approvalNotes,
    setApprovalNotes,
    loading,
    handleViewDetail,
    handleApprovalAction,
    handleApprovalSubmit,
    resetModals,
  } = useApprovalModal();

  // Wrapper function for approval submit that uses the updateSchedule from hook
  const handleApprovalSubmitWrapper = () => {
    handleApprovalSubmit(updateSchedule);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Xét duyệt khám sức khỏe
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Xem xét và phê duyệt các yêu cầu khám sức khỏe từ y tá - Đặc
                biệt chú ý tình trạng thiết bị. Các yêu cầu đã xử lý sẽ hiển thị
                trạng thái "Đã duyệt" hoặc "Đã từ chối".
              </p>
            </div>
            {/* Equipment Summary Alert */}
            <div className="flex flex-col items-end gap-2">
              {pendingRequests.filter(
                (req) => req.equipmentReport?.requiresAction
              ).length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                  <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                    {
                      pendingRequests.filter(
                        (req) => req.equipmentReport?.requiresAction
                      ).length
                    }{" "}
                    yêu cầu thiếu thiết bị
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {pendingRequests.length} yêu cầu chờ xét duyệt •{" "}
                {upcomingRequests.length} lịch sắp tới •{" "}
                {
                  healthCheckPrograms.filter((p) => p.status === "Approved")
                    .length
                }{" "}
                đã duyệt
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-neutral-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiBarChart className="inline-block w-4 h-4 mr-2" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiClock className="inline-block w-4 h-4 mr-2" />
              Chờ duyệt ({pendingRequests.length})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-red-500 text-red-600 dark:text-red-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <FiCalendar className="inline-block w-4 h-4 mr-2" />
              Sắp tới ({upcomingRequests.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            healthCheckPrograms={healthCheckPrograms}
            pendingRequests={pendingRequests}
            fetchingData={fetchingData}
            error={error}
            onRefresh={fetchHealthCheckSchedules}
            onViewDetail={handleViewDetail}
            onSetActiveTab={setActiveTab}
            onSetSelectedRequest={setSelectedRequest}
          />
        )}
        {activeTab === "pending" && (
          <PendingRequestsTab
            pendingRequests={pendingRequests}
            fetchingData={fetchingData}
            error={error}
            onRefresh={fetchHealthCheckSchedules}
            onViewDetail={handleViewDetail}
            onApprovalAction={handleApprovalAction}
            setSelectedRequest={setSelectedRequest}
          />
        )}
        {activeTab === "upcoming" && (
          <UpcomingRequestsTab
            upcomingRequests={upcomingRequests}
            fetchingData={fetchingData}
            error={error}
            onRefresh={fetchHealthCheckSchedules}
            onViewDetail={handleViewDetail}
          />
        )}
      </div>

      {/* Detail Modal */}
      <HealthCheckDetailModal
        showModal={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedRequest={selectedRequest}
        onApprovalAction={handleApprovalAction}
      />

      {/* Approval Modal */}
      <ApprovalModal
        showModal={showApprovalModal}
        onClose={resetModals}
        selectedRequest={selectedRequest}
        approvalAction={approvalAction}
        approvalNotes={approvalNotes}
        setApprovalNotes={setApprovalNotes}
        loading={loading}
        onSubmit={handleApprovalSubmitWrapper}
      />
    </div>
  );
};

export default HealthCheckManagement;
