import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";
import { injectionFormService } from "../../../utils/api/injection/injectionService";
import { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  formatDateWithContext,
  formatDuration,
  formatRelativeTime 
} from "../../../utils/timeUtils";

// Import tab components
import OverviewTab from "./components/OverviewTab";
import PendingTab from "./components/PendingTab";
import UpcomingTab from "./components/UpcomingTab";
import RejectedTab from "./components/RejectedTab";

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // State for injection forms
  const [pendingForms, setPendingForms] = useState([]);
  const [upcomingForms, setUpcomingForms] = useState([]);
  const [rejectedForms, setRejectedForms] = useState([]);
  const [selectedInjectionForm, setSelectedInjectionForm] = useState(null);
  const [showInjectionApprovalModal, setShowInjectionApprovalModal] =
    useState(false);
  const [injectionApprovalAction, setInjectionApprovalAction] = useState("");
  const [injectionApprovalNotes, setInjectionApprovalNotes] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalVaccinations: 0,
    completedToday: 0,
    pending: 0,
    upcoming: 0,
    rejected: 0,
    completionRate: 0,
    totalStudents: 0,
  });

  // Load data functions
  const loadPendingForms = async () => {
    try {
      const response = await injectionFormService.getInjectionFormsByStatus(
        "pending"
      );
      if (response.success) {
        const data = response.data || [];
        setPendingForms(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error loading pending forms:", error);
      return [];
    }
  };

  const loadUpcomingForms = async () => {
    try {
      const response = await injectionFormService.getInjectionFormsByStatus(
        "approved"
      );
      if (response.success) {
        const data = response.data || [];
        setUpcomingForms(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error loading upcoming forms:", error);
      return [];
    }
  };

  const loadRejectedForms = async () => {
    try {
      const response = await injectionFormService.getInjectionFormsByStatus(
        "rejected"
      );
      if (response.success) {
        const data = response.data || [];
        setRejectedForms(data);
        return data;
      }
      return [];
    } catch (error) {
      console.error("Error loading rejected forms:", error);
      return [];
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pendingResult, upcomingResult, rejectedResult] = await Promise.all(
        [loadPendingForms(), loadUpcomingForms(), loadRejectedForms()]
      );

      // Get fresh data from the results
      const pendingData = pendingResult || [];
      const upcomingData = upcomingResult || [];
      const rejectedData = rejectedResult || [];

      // Calculate total students
      const totalStudents = [...pendingData, ...upcomingData].reduce(
        (sum, form) => sum + (form.totalStudents || 0),
        0
      );

      // Update stats with fresh data
      const total =
        pendingData.length + upcomingData.length + rejectedData.length;
      setStats({
        totalVaccinations: total,
        completedToday: 0, // Would need specific API for today's completed
        pending: pendingData.length,
        upcoming: upcomingData.length,
        rejected: rejectedData.length,
        completionRate:
          total > 0 ? Math.round((upcomingData.length / total) * 100) : 0,
        totalStudents: totalStudents,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle injection form approval action
  const handleInjectionApprovalAction = (action, form) => {
    setSelectedInjectionForm(form);
    setInjectionApprovalAction(action);
    setShowInjectionApprovalModal(true);
  };

  // Handle injection form approve/reject
  const handleInjectionApprovalSubmit = async () => {
    if (!selectedInjectionForm) return;

    setLoading(true);
    try {
      let response;

      if (injectionApprovalAction === "approve") {
        response = await injectionFormService.approveInjectionForm(
          selectedInjectionForm.formId,
          injectionApprovalNotes
        );
      } else {
        response = await injectionFormService.rejectInjectionForm(
          selectedInjectionForm.formId,
          injectionApprovalNotes
        );
      }

      if (response.success) {
        alert(response.message);

        // Close modals and reset form
        setShowInjectionApprovalModal(false);
        setInjectionApprovalNotes("");
        setSelectedInjectionForm(null);

        // Reload data
        await loadAllData();
      } else {
        alert(response.message || "Có lỗi xảy ra khi xử lý yêu cầu!");
      }
    } catch (error) {
      console.error("Error processing injection form approval:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Handle show detail
  const handleShowDetail = (form) => {
    setSelectedInjectionForm(form);
    setShowDetailModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Quản lý tiêm chủng
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý và duyệt các phiếu tiêm chủng từ y tá
            </p>
          </div>
          <button
            onClick={() => navigate("/manager/vaccines")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <FiShield className="h-4 w-4" />
            Quản lý Vaccine
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700 overflow-hidden mb-6">
        <div className="border-b border-gray-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              { id: "overview", label: "Tổng quan", icon: FiCalendar },
              {
                id: "pending",
                label: "Chờ duyệt",
                icon: FiClock,
                count: stats.pending,
              },
              {
                id: "upcoming",
                label: "Sắp tới",
                icon: FiCheckCircle,
                count: stats.upcoming,
              },
              {
                id: "rejected",
                label: "Đã từ chối",
                icon: FiXCircle,
                count: stats.rejected,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 border-b-2 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            pendingForms={pendingForms}
            upcomingForms={upcomingForms}
            rejectedForms={rejectedForms}
          />
        )}
        {activeTab === "pending" && (
          <PendingTab
            pendingForms={pendingForms}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={loadAllData}
            loading={loading}
            onApprovalAction={handleInjectionApprovalAction}
            onShowDetail={handleShowDetail}
          />
        )}
        {activeTab === "upcoming" && (
          <UpcomingTab
            upcomingForms={upcomingForms}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={loadAllData}
            loading={loading}
            onShowDetail={handleShowDetail}
          />
        )}
        {activeTab === "rejected" && (
          <RejectedTab
            rejectedForms={rejectedForms}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={loadAllData}
            loading={loading}
            onShowDetail={handleShowDetail}
          />
        )}
      </div>

      {/* Injection Form Detail Modal */}
      {showDetailModal && selectedInjectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Chi tiết phiếu tiêm chủng #{selectedInjectionForm.formId}
                </h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thông tin cơ bản
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Tên:
                      </span>{" "}
                      {selectedInjectionForm.injectionName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Mô tả:
                      </span>{" "}
                      {selectedInjectionForm.description || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Trạng thái:
                      </span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedInjectionForm.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedInjectionForm.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedInjectionForm.status === "pending"
                          ? "Chờ duyệt"
                          : selectedInjectionForm.status === "approved"
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Lịch tiêm
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Ngày:
                      </span>{" "}
                      {selectedInjectionForm.scheduledDate
                        ? formatDateWithContext(selectedInjectionForm.scheduledDate)
                        : "Chưa xác định"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Giờ:
                      </span>{" "}
                      {selectedInjectionForm.startTime || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Địa điểm:
                      </span>{" "}
                      {selectedInjectionForm.location || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Thời gian dự kiến:
                      </span>{" "}
                      {selectedInjectionForm.estimatedDuration || 60} phút
                    </p>
                  </div>
                </div>
              </div>

              {/* Vaccine Information */}
              {selectedInjectionForm.vaccine && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Thông tin Vaccine
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Tên:
                        </span>{" "}
                        {selectedInjectionForm.vaccine.name || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Loại:
                        </span>{" "}
                        {selectedInjectionForm.vaccine.type || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Nhà sản xuất:
                        </span>{" "}
                        {selectedInjectionForm.vaccine.manufacturer || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes for rejected forms */}
              {selectedInjectionForm.status === "rejected" &&
                selectedInjectionForm.notes && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                      Lý do từ chối
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {selectedInjectionForm.notes}
                      </p>
                    </div>
                  </div>
                )}
            </div>

            {/* Action buttons */}
            {activeTab === "pending" && (
              <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleInjectionApprovalAction(
                      "reject",
                      selectedInjectionForm
                    );
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                >
                  <FiX className="h-4 w-4" />
                  Từ chối
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleInjectionApprovalAction(
                      "approve",
                      selectedInjectionForm
                    );
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  Duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Injection Form Approval Modal */}
      {showInjectionApprovalModal && selectedInjectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {injectionApprovalAction === "approve"
                  ? "Duyệt phiếu tiêm chủng"
                  : "Từ chối phiếu tiêm chủng"}
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Bạn có chắc chắn muốn{" "}
                {injectionApprovalAction === "approve" ? "duyệt" : "từ chối"}{" "}
                phiếu tiêm chủng{" "}
                <strong>#{selectedInjectionForm.formId}</strong>?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {injectionApprovalAction === "approve"
                    ? "Ghi chú (tùy chọn)"
                    : "Lý do từ chối"}
                  {injectionApprovalAction === "reject" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  value={injectionApprovalNotes}
                  onChange={(e) => setInjectionApprovalNotes(e.target.value)}
                  placeholder={
                    injectionApprovalAction === "approve"
                      ? "Nhập ghi chú thêm nếu cần..."
                      : "Nhập lý do từ chối phiếu tiêm chủng..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required={injectionApprovalAction === "reject"}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-neutral-700 flex justify-end gap-3">
              <button
                onClick={() => setShowInjectionApprovalModal(false)}
                disabled={loading}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleInjectionApprovalSubmit}
                disabled={
                  loading ||
                  (injectionApprovalAction === "reject" &&
                    !injectionApprovalNotes.trim())
                }
                className={`px-4 py-2 text-white rounded-md flex items-center gap-2 disabled:opacity-50 ${
                  injectionApprovalAction === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    {injectionApprovalAction === "approve" ? (
                      <FiCheck className="h-4 w-4" />
                    ) : (
                      <FiX className="h-4 w-4" />
                    )}
                    {injectionApprovalAction === "approve"
                      ? "Xác nhận duyệt"
                      : "Xác nhận từ chối"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManagement;
