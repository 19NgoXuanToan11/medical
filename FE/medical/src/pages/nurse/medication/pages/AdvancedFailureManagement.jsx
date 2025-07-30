import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiX,
  FiAlertTriangle,
  FiRepeat,
  FiXCircle,
  FiInfo,
  FiCheckCircle,
  FiMail,
  FiPhone,
  FiList,
  FiFileText,
  FiPlay,
  FiPause,
  FiCheck,
  FiArrowRight,
  FiAlertCircle,
  FiShield,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import { toast } from "react-toastify";

// Helper functions
const formatDosageWithUnit = (dosage, dosageUnit = "viên") => {
  if (!dosage || dosage === "N/A") return "Chưa xác định";
  return `${dosage} ${dosageUnit}`;
};

const formatFrequency = (frequency) => {
  if (!frequency || frequency === "N/A") return "Chưa xác định";
  if (typeof frequency === "string" && frequency.includes("lần/ngày")) {
    return frequency;
  }
  const numericFrequency = parseInt(frequency);
  if (!isNaN(numericFrequency) && numericFrequency > 0) {
    return `${numericFrequency} lần/ngày`;
  }
  if (frequency === "as_needed") return "Khi cần thiết";
  return frequency;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("vi-VN");
};

const getTimePeriodName = (period) => {
  switch (period) {
    case "morning":
      return "Sáng (6:00-11:00)";
    case "noon":
      return "Trưa (11:00-14:00)";
    case "afternoon":
      return "Chiều (14:00-18:00)";
    case "evening":
      return "Tối (18:00-22:00)";
    default:
      return period;
  }
};

const AdvancedFailureManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [failedRequests, setFailedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  // Modal states
  const [showReportFailureModal, setShowReportFailureModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showReRequestModal, setShowReRequestModal] = useState(false);
  const [showReRequestInfoModal, setShowReRequestInfoModal] = useState(false);

  // Form states
  const [failureReason, setFailureReason] = useState("");
  const [failureNotes, setFailureNotes] = useState("");
  const [reRequestReason, setReRequestReason] = useState("");

  // Data states
  const [periodHistory, setPeriodHistory] = useState([]);
  const [reRequestInfo, setReRequestInfo] = useState(null);

  const { user } = useAuth();
  const currentStaffId = user?.id || 1;

  useEffect(() => {
    loadFailedRequests();
  }, []);

  const loadFailedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getFailedMedicationRequests();
      if (response.success) {
        setFailedRequests(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách thất bại");
      }
    } catch (error) {
      console.error("Error loading failed requests:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    }
    setLoading(false);
  };

  // API 1: Report Failure
  const handleReportFailure = async () => {
    if (!failureReason.trim()) {
      toast.error("Vui lòng nhập lý do thất bại");
      return;
    }

    if (!selectedItem || !selectedPeriod) {
      toast.error("Vui lòng chọn thuốc và buổi");
      return;
    }

    try {
      const response = await medicationService.reportMedicineFailure(
        selectedRequest.requestId,
        selectedItem.medicineRequestItemId,
        selectedPeriod,
        failureReason,
        currentStaffId,
        failureNotes
      );

      if (response.success) {
        toast.success("Báo cáo thất bại thành công");
        setShowReportFailureModal(false);
        setFailureReason("");
        setFailureNotes("");
        loadFailedRequests();
      } else {
        toast.error(response.message || "Không thể báo cáo thất bại");
      }
    } catch (error) {
      console.error("Error reporting failure:", error);
      toast.error("Có lỗi xảy ra khi báo cáo thất bại");
    }
  };

  // API 2: Get Period History
  const handleViewHistory = async (itemId, period) => {
    try {
      const response = await fetch(
        `https://localhost:7111/api/MedicineRequest/item/${itemId}/period/${period}/history`
      );

      if (response.ok) {
        const data = await response.json();
        setPeriodHistory(data);
        setShowHistoryModal(true);
      } else {
        toast.error("Không thể tải lịch sử");
      }
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Có lỗi xảy ra khi tải lịch sử");
    }
  };

  // API 3: Re-Request Period
  const handleReRequest = async () => {
    if (!reRequestReason.trim()) {
      toast.error("Vui lòng nhập lý do tạo lại");
      return;
    }

    if (!selectedItem || !selectedPeriod) {
      toast.error("Vui lòng chọn thuốc và buổi");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7111/api/MedicineRequest/item/${selectedItem.medicineRequestItemId}/rerequest?period=${selectedPeriod}&staffId=${currentStaffId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: reRequestReason,
          }),
        }
      );

      if (response.ok) {
        toast.success("Tạo yêu cầu lại thành công");
        setShowReRequestModal(false);
        setReRequestReason("");
        loadFailedRequests();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể tạo yêu cầu lại");
      }
    } catch (error) {
      console.error("Error creating re-request:", error);
      toast.error("Có lỗi xảy ra khi tạo yêu cầu lại");
    }
  };

  // API 4: Get Re-Request Info
  const handleCheckReRequestInfo = async (itemId, period) => {
    try {
      const response = await fetch(
        `https://localhost:7111/api/MedicineRequest/item/${itemId}/period/${period}/re-request-info`
      );

      if (response.ok) {
        const data = await response.json();
        setReRequestInfo(data);
        setShowReRequestInfoModal(true);
      } else {
        toast.error("Không thể kiểm tra thông tin tạo lại");
      }
    } catch (error) {
      console.error("Error checking re-request info:", error);
      toast.error("Có lỗi xảy ra khi kiểm tra thông tin");
    }
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = `${request.request?.student?.firstName || ""} ${
        request.request?.student?.lastName || ""
      }`.toLowerCase();
      const medicineName =
        request.request?.medicineRequestItems?.[0]?.medicineName?.toLowerCase() ||
        "";
      const resultId = request.resultId?.toString() || "";

      return (
        studentName.includes(searchLower) ||
        medicineName.includes(searchLower) ||
        resultId.includes(searchLower)
      );
    });
  };

  const filteredRequests = filterRequests(failedRequests);

  const tabs = [
    {
      key: "overview",
      label: "Tổng quan",
      icon: FiActivity,
      description: "Xem tổng quan các yêu cầu thất bại",
    },
    {
      key: "report",
      label: "Báo cáo thất bại",
      icon: FiAlertTriangle,
      description: "Báo cáo thất bại cho từng buổi",
    },
    {
      key: "history",
      label: "Lịch sử",
      icon: FiList,
      description: "Xem lịch sử trạng thái",
    },
    {
      key: "rerequest",
      label: "Tạo lại",
      icon: FiRepeat,
      description: "Tạo yêu cầu lại cho buổi thất bại",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              Quản lý thất bại & Tạo lại nâng cao
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Hệ thống tích hợp đầy đủ 5 API xử lý nghiệp vụ thất bại và tạo lại
              yêu cầu
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadFailedRequests}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
            >
              <FiRefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, thuốc hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 w-full"
          />
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tổng thất bại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredRequests.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Chờ xử lý
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {
                      filteredRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiRepeat className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Đã tạo lại
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {filteredRequests.filter((r) => r.isReRequest).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Có lịch sử
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {
                      filteredRequests.filter((r) =>
                        r.medicineRequestItems?.some(
                          (item) => item.verificationStatus
                        )
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Failed Requests Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Học sinh
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thuốc
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ngày thất bại
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        {loading ? "Đang tải..." : "Không có dữ liệu"}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => {
                      const medicineItem =
                        request.request?.medicineRequestItems?.[0];

                      return (
                        <tr
                          key={request.resultId}
                          className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {request.request?.student?.firstName}{" "}
                                  {request.request?.student?.lastName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Lớp:{" "}
                                  {request.request?.student?.class?.className ||
                                    request.request?.className}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {medicineItem?.medicineName || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                            {formatDate(request.submittedAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              Thất bại
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setSelectedItem(medicineItem);
                                  setShowReportFailureModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Báo cáo thất bại"
                              >
                                <FiAlertTriangle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setSelectedItem(medicineItem);
                                  setShowHistoryModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Xem lịch sử"
                              >
                                <FiList className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setSelectedItem(medicineItem);
                                  setShowReRequestModal(true);
                                }}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Tạo lại"
                              >
                                <FiRepeat className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Report Failure Modal */}
      {showReportFailureModal && selectedRequest && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowReportFailureModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiAlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    Báo cáo thất bại
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Báo cáo thất bại cho buổi cụ thể
                  </p>
                </div>
                <button
                  onClick={() => setShowReportFailureModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Student Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Thông tin học sinh
                  </h4>
                  <p className="text-blue-900 dark:text-blue-100">
                    {selectedRequest.request?.student?.firstName}{" "}
                    {selectedRequest.request?.student?.lastName} -
                    {selectedRequest.request?.student?.class?.className ||
                      selectedRequest.request?.className}
                  </p>
                </div>

                {/* Period Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn buổi thất bại <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["morning", "noon", "afternoon", "evening"].map(
                      (period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            selectedPeriod === period
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-600 hover:border-red-300"
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getTimePeriodName(period)}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Failure Reason */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lý do thất bại <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={failureReason}
                    onChange={(e) => setFailureReason(e.target.value)}
                    placeholder="Nhập lý do thất bại..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500"
                    rows="3"
                  />
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú bổ sung
                  </label>
                  <textarea
                    value={failureNotes}
                    onChange={(e) => setFailureNotes(e.target.value)}
                    placeholder="Ghi chú bổ sung (nếu có)..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowReportFailureModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleReportFailure}
                    disabled={!failureReason.trim() || !selectedPeriod}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300"
                  >
                    Báo cáo thất bại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && selectedRequest && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowHistoryModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiList className="h-5 w-5 text-blue-600 mr-2" />
                    Lịch sử trạng thái
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Lịch sử trạng thái của từng buổi
                  </p>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {["morning", "noon", "afternoon", "evening"].map((period) => (
                    <button
                      key={period}
                      onClick={() =>
                        handleViewHistory(
                          selectedItem.medicineRequestItemId,
                          period
                        )
                      }
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getTimePeriodName(period)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Xem lịch sử
                      </div>
                    </button>
                  ))}
                </div>

                {periodHistory.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Lịch sử trạng thái:
                    </h4>
                    {periodHistory.map((entry, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {entry.Status}
                            </span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDateTime(entry.Timestamp)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Staff ID: {entry.StaffId}
                            </span>
                          </div>
                        </div>
                        {entry.FailureReason && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                            Lý do: {entry.FailureReason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-Request Modal */}
      {showReRequestModal && selectedRequest && selectedItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowReRequestModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiRepeat className="h-5 w-5 text-green-600 mr-2" />
                    Tạo yêu cầu lại
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tạo lại yêu cầu cho buổi thất bại
                  </p>
                </div>
                <button
                  onClick={() => setShowReRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Check Re-Request Info First */}
                <div className="mb-6">
                  <button
                    onClick={() =>
                      handleCheckReRequestInfo(
                        selectedItem.medicineRequestItemId,
                        selectedPeriod
                      )
                    }
                    className="w-full p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FiInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        Kiểm tra thông tin tạo lại
                      </span>
                    </div>
                  </button>
                </div>

                {/* Period Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chọn buổi tạo lại <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["morning", "noon", "afternoon", "evening"].map(
                      (period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            selectedPeriod === period
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-600 hover:border-green-300"
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getTimePeriodName(period)}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Re-Request Reason */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lý do tạo lại <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reRequestReason}
                    onChange={(e) => setReRequestReason(e.target.value)}
                    placeholder="Nhập lý do tạo lại yêu cầu..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowReRequestModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleReRequest}
                    disabled={!reRequestReason.trim() || !selectedPeriod}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                  >
                    Tạo yêu cầu lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-Request Info Modal */}
      {showReRequestInfoModal && reRequestInfo && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowReRequestInfoModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiInfo className="h-5 w-5 text-blue-600 mr-2" />
                    Thông tin tạo lại
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Kiểm tra khả năng tạo lại yêu cầu
                  </p>
                </div>
                <button
                  onClick={() => setShowReRequestInfoModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg border ${
                      reRequestInfo.canReRequest
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center">
                      {reRequestInfo.canReRequest ? (
                        <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                      )}
                      <span
                        className={`font-medium ${
                          reRequestInfo.canReRequest
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {reRequestInfo.canReRequest
                          ? "Có thể tạo lại"
                          : "Không thể tạo lại"}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        reRequestInfo.canReRequest
                          ? "text-green-700 dark:text-green-300"
                          : "text-red-700 dark:text-red-300"
                      }`}
                    >
                      {reRequestInfo.reason}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                      Thông tin chi tiết:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Học sinh:
                        </span>
                        <p className="text-gray-900 dark:text-gray-100">
                          {reRequestInfo.studentName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Lớp:
                        </span>
                        <p className="text-gray-900 dark:text-gray-100">
                          {reRequestInfo.className}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Thuốc:
                        </span>
                        <p className="text-gray-900 dark:text-gray-100">
                          {reRequestInfo.medicineName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Buổi:
                        </span>
                        <p className="text-gray-900 dark:text-gray-100">
                          {getTimePeriodName(reRequestInfo.period)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowReRequestInfoModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFailureManagement;
