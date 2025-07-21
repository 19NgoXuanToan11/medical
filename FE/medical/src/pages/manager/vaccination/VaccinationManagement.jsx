import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiCheck,
  FiX,
  FiFileText,
} from "react-icons/fi";
import { injectionFormService } from "../../../utils/api/injection/injectionService";
import PendingInjectionTab from "./components/PendingInjectionTab";

const VaccinationManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Injection form state
  const [selectedInjectionForm, setSelectedInjectionForm] = useState(null);
  const [showInjectionApprovalModal, setShowInjectionApprovalModal] =
    useState(false);
  const [injectionApprovalAction, setInjectionApprovalAction] = useState("");
  const [injectionApprovalNotes, setInjectionApprovalNotes] = useState("");

  // Vaccination stats - these would come from API in real implementation
  const stats = {
    totalVaccinations: 0,
    completedToday: 0,
    scheduled: 0,
    pending: 0,
    completionRate: 0,
  };

  // No pending requests - all removed
  const pendingRequests = [];

  // No vaccination programs - all removed
  const vaccinationPrograms = [];

  // Handle injection form approval action
  const handleInjectionApprovalAction = (action) => {
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

        // Refresh would be handled by the PendingInjectionTab component
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

  // Render pending requests tab - now shows empty state
  const renderPendingRequests = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu tiêm chủng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center gap-2">
            <FiFilter className="h-4 w-4" />
            Bộ lọc
          </button>
        </div>
      </div>

      {/* Empty state for pending requests */}
      <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
        <FiShield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Không có yêu cầu chờ duyệt
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tất cả yêu cầu tiêm chủng đã được xử lý hoặc chưa có yêu cầu nào được
          tạo
        </p>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tổng mũi tiêm
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.totalVaccinations}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiShield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Hoàn thành hôm nay
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completedToday}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đang chờ duyệt
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.scheduled}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ phụ huynh
              </p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tỷ lệ hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.completionRate}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiUsers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Vaccination Programs Table - Empty state */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chương trình tiêm chủng
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Danh sách các chương trình tiêm chủng đang thực hiện
          </p>
        </div>

        <div className="p-8 text-center">
          <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Chưa có chương trình tiêm chủng
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Hiện tại chưa có chương trình tiêm chủng nào được tạo
          </p>
        </div>
      </div>
    </div>
  );

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
              Quản lý các chương trình tiêm chủng và duyệt yêu cầu từ y tá
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
                count: 0,
              },
              {
                id: "injection_forms",
                label: "Phiếu tiêm chủng",
                icon: FiShield,
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
        {activeTab === "overview" && renderOverview()}
        {activeTab === "pending" && renderPendingRequests()}
        {activeTab === "injection_forms" && (
          <PendingInjectionTab
            onApprovalAction={handleInjectionApprovalAction}
            setSelectedForm={setSelectedInjectionForm}
          />
        )}
        {activeTab === "programs" && (
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow border border-gray-200 dark:border-neutral-700 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
              Quản lý chương trình tiêm chủng
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Chức năng này đang được phát triển
            </p>
          </div>
        )}
      </div>

      {/* Injection Form Approval Modal */}
      {showInjectionApprovalModal && selectedInjectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {injectionApprovalAction === "approve"
                    ? "Duyệt phiếu tiêm chủng"
                    : "Từ chối phiếu tiêm chủng"}
                </h2>
                <button
                  onClick={() => setShowInjectionApprovalModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {injectionApprovalAction === "approve"
                    ? `Bạn có chắc chắn muốn duyệt phiếu tiêm chủng cho học sinh "${
                        selectedInjectionForm.student?.fullName || "N/A"
                      }"?`
                    : `Bạn có chắc chắn muốn từ chối phiếu tiêm chủng cho học sinh "${
                        selectedInjectionForm.student?.fullName || "N/A"
                      }"?`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {injectionApprovalAction === "approve"
                    ? "Ghi chú (tùy chọn)"
                    : "Lý do từ chối"}
                  {injectionApprovalAction === "reject" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <textarea
                  value={injectionApprovalNotes}
                  onChange={(e) => setInjectionApprovalNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={
                    injectionApprovalAction === "approve"
                      ? "Nhập ghi chú thêm nếu cần..."
                      : "Nhập lý do từ chối..."
                  }
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
