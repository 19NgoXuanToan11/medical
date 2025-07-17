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
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import {
  calculateDosagePerAdministration,
  calculateDosagePerTime,
  formatTotalDosage,
  formatFrequencyDisplay,
} from "../../../../utils/api/medication/medicationUtils";

// Helper function to format dosage with units
const formatDosageWithUnit = (dosage, dosageUnit = "viên") => {
  if (!dosage || dosage === "N/A") return "Chưa xác định";
  return `${dosage} ${dosageUnit}`;
};

// Helper function to format frequency
const formatFrequency = (frequency) => {
  if (!frequency || frequency === "N/A") return "Chưa xác định";

  // If it's already formatted
  if (typeof frequency === "string" && frequency.includes("lần/ngày")) {
    return frequency;
  }

  // If it's a number or number string
  const numericFrequency = parseInt(frequency);
  if (!isNaN(numericFrequency) && numericFrequency > 0) {
    return `${numericFrequency} lần/ngày`;
  }

  // Handle special cases
  if (frequency === "as_needed") return "Khi cần thiết";

  return frequency;
};

const FailedRequestManagement = () => {
  const [failedRequests, setFailedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReRequestModal, setShowReRequestModal] = useState(false);
  const [showMarkFailedModal, setShowMarkFailedModal] = useState(false);
  const [showReRequestsModal, setShowReRequestsModal] = useState(false);
  const [reRequestReason, setReRequestReason] = useState("");
  const [markFailedReason, setMarkFailedReason] = useState("");
  const [reRequests, setReRequests] = useState([]);

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  useEffect(() => {
    loadFailedRequests();
  }, []);

  const loadFailedRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getFailedMedicationRequests();
      if (response.success) {
        setFailedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading failed requests:", error);
    }
    setLoading(false);
  };

  const loadReRequests = async (originalRequestResultId) => {
    try {
      const response = await medicationService.getReRequests(
        originalRequestResultId
      );
      if (response.success) {
        setReRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading re-requests:", error);
    }
  };

  const handleCreateReRequest = async () => {
    if (!reRequestReason.trim()) {
      alert("Vui lòng nhập lý do tạo yêu cầu lại");
      return;
    }

    if (!selectedRequest) {
      alert("Không có request được chọn");
      return;
    }

    try {
      const response = await medicationService.createReRequest(
        selectedRequest.resultId,
        reRequestReason,
        currentStaffId
      );

      if (response.success) {
        alert("Tạo yêu cầu lại thành công!");
        setShowReRequestModal(false);
        setReRequestReason("");
        loadFailedRequests();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo yêu cầu lại");
      console.error("Error creating re-request:", error);
    }
  };

  const handleMarkAsFailed = async () => {
    if (!markFailedReason.trim()) {
      alert("Vui lòng nhập lý do đánh dấu thất bại");
      return;
    }

    if (!selectedRequest) {
      alert("Không có request được chọn");
      return;
    }

    try {
      const response = await medicationService.markRequestAsFailed(
        selectedRequest.resultId,
        markFailedReason
      );

      if (response.success) {
        alert("Đánh dấu thất bại thành công!");
        setShowMarkFailedModal(false);
        setMarkFailedReason("");
        loadFailedRequests();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đánh dấu thất bại");
      console.error("Error marking as failed:", error);
    }
  };

  const handleViewReRequests = async (request) => {
    setSelectedRequest(request);
    await loadReRequests(request.resultId);
    setShowReRequestsModal(true);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const isAfterCutoffTime = () => {
    const now = new Date();
    const cutoffHour = 17; // 5 PM
    return now.getHours() >= cutoffHour;
  };

  const canCreateReRequest = (request) => {
    // Check if it's before 5 PM
    if (isAfterCutoffTime()) return false;

    // Check if request status allows re-request
    return request.status === "Failed" || request.status === "failed";
  };

  const getFailureInfo = (request) => {
    try {
      // Parse failedFrequencies - array of failed time periods
      let failedFrequencies = [];
      if (request.failedFrequencies) {
        if (Array.isArray(request.failedFrequencies)) {
          failedFrequencies = request.failedFrequencies;
        } else if (typeof request.failedFrequencies === "string") {
          failedFrequencies = JSON.parse(request.failedFrequencies);
        }
      }

      // Parse failureReasons - object with time period as key and reason as value
      let failureReasons = {};
      if (request.failureReasons) {
        if (
          typeof request.failureReasons === "object" &&
          !Array.isArray(request.failureReasons)
        ) {
          failureReasons = request.failureReasons;
        } else if (typeof request.failureReasons === "string") {
          failureReasons = JSON.parse(request.failureReasons);
        }
      }

      return { failedFrequencies, failureReasons };
    } catch (error) {
      return { failedFrequencies: [], failureReasons: {} };
    }
  };

  const filteredRequests = filterRequests(failedRequests);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý thất bại & Tạo lại
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý các yêu cầu thất bại và tạo yêu cầu lại
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {isAfterCutoffTime() && (
            <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-lg">
              <FiInfo className="h-3 w-3 mr-1" />
              Sau 17h: Không thể tạo request mới
            </div>
          )}
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

      {/* Search */}
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                  Lý do thất bại
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
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => {
                  const medicineItem =
                    request.request?.medicineRequestItems?.[0];
                  const failureInfo = getFailureInfo(request);

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
                      <td className="px-6 py-4 text-left align-middle min-w-[200px]">
                        {(() => {
                          const failureInfo = getFailureInfo(request);
                          const shortReason =
                            request.refusalReason ||
                            request.failureReason ||
                            (failureInfo.failedFrequencies.length > 0 &&
                              failureInfo.failureReasons[
                                failureInfo.failedFrequencies[0]
                              ]) ||
                            "Không xác định";

                          return (
                            <div
                              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-4 border-red-500"
                              title={shortReason}
                            >
                              <p className="break-words">{shortReason}</p>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          Thất bại
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewReRequests(request)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Xem request lại"
                          >
                            <FiInfo className="h-4 w-4" />
                          </button>
                          {canCreateReRequest(request) && (
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowReRequestModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Tạo yêu cầu lại"
                            >
                              <FiRepeat className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowMarkFailedModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Đánh dấu thất bại"
                          >
                            <FiXCircle className="h-4 w-4" />
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

      {/* Enhanced Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDetailModal(false)}
          ></div>

          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl transition-colors duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Chi tiết thất bại #{selectedRequest.resultId}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Thông tin chi tiết về yêu cầu cấp thuốc thất bại
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Student Information */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Thông tin học sinh
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Họ tên:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedRequest.request?.student?.firstName}{" "}
                          {selectedRequest.request?.student?.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Lớp:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedRequest.request?.student?.class?.className ||
                            selectedRequest.request?.className}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Mã học sinh:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedRequest.request?.student?.studentCode ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ngày sinh:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {selectedRequest.request?.student?.dateOfBirth
                            ? formatDate(
                                selectedRequest.request.student.dateOfBirth
                              )
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Request Information */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <FiCalendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      Thông tin yêu cầu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ngày gửi yêu cầu:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {formatDate(selectedRequest.request?.requestDate)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ngày thất bại:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {formatDate(selectedRequest.submittedAt)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Trạng thái:
                        </label>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                            <FiAlertTriangle className="h-4 w-4 mr-1" />
                            Thất bại
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Failure Details */}
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="text-lg font-medium text-red-800 dark:text-red-200 mb-3 flex items-center">
                      <FiXCircle className="h-5 w-5 mr-2" />
                      Lý do thất bại
                    </h4>

                    {(() => {
                      const failureInfo = getFailureInfo(selectedRequest);

                      if (failureInfo.failedFrequencies.length === 0) {
                        return (
                          <div className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                            <p className="text-sm text-red-700 dark:text-red-300">
                              <strong>Lý do chung:</strong>{" "}
                              {selectedRequest.refusalReason ||
                                selectedRequest.failureReason ||
                                "Không xác định lý do thất bại"}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          <div>
                            <div className="space-y-2">
                              {failureInfo.failedFrequencies.map(
                                (freq, freqIndex) => {
                                  // Get time period display name
                                  const getTimePeriodName = (period) => {
                                    switch (period) {
                                      case "morning":
                                        return "sáng (6:00-11:00)";
                                      case "noon":
                                        return "trưa (11:00-14:00)";
                                      case "afternoon":
                                        return "chiều (14:00-18:00)";
                                      case "evening":
                                        return "tối (18:00-22:00)";
                                      default:
                                        return period;
                                    }
                                  };

                                  // Get failure reason for this period
                                  const reasonForPeriod =
                                    failureInfo.failureReasons[freq] ||
                                    failureInfo.failureReasons[
                                      freq.toLowerCase()
                                    ] ||
                                    selectedRequest.refusalReason ||
                                    selectedRequest.failureReason ||
                                    "Không có lý do cụ thể";

                                  return (
                                    <div
                                      key={freqIndex}
                                      className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700"
                                    >
                                      <div className="flex items-center mb-2">
                                        <FiClock className="h-4 w-4 text-red-600 mr-2" />
                                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                          Buổi {getTimePeriodName(freq)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-red-700 dark:text-red-300">
                                        <strong>Lý do:</strong>{" "}
                                        {reasonForPeriod}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>

                          {/* Additional failure information */}
                          {(selectedRequest.refusalReason ||
                            selectedRequest.failureReason) && (
                            <div className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                              <p className="text-sm text-red-700 dark:text-red-300">
                                <strong>Thông tin bổ sung:</strong>{" "}
                                {selectedRequest.refusalReason ||
                                  selectedRequest.failureReason}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Medicine Information */}
                  <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <FiTablet className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Thông tin thuốc được yêu cầu
                    </h4>

                    {selectedRequest.request?.medicineRequestItems &&
                    selectedRequest.request.medicineRequestItems.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tên thuốc
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tổng liều lượng
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Tần suất
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Liều mỗi lần
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {selectedRequest.request.medicineRequestItems.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {item.medicineName}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                                    {formatTotalDosage(
                                      item.dosage,
                                      item.dosageUnit
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                                    {formatFrequencyDisplay(item.frequency)}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                                    {calculateDosagePerTime(
                                      item.dosage,
                                      item.dosageUnit,
                                      item.frequency
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FiTablet className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Không có thông tin thuốc
                        </p>
                      </div>
                    )}

                    {/* Instructions */}
                    {selectedRequest.request?.medicineRequestItems &&
                      selectedRequest.request.medicineRequestItems.some(
                        (item) => item.instructions
                      ) && (
                        <div className="mt-4">
                          <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Hướng dẫn sử dụng
                          </h5>
                          <div className="space-y-2">
                            {selectedRequest.request.medicineRequestItems.map(
                              (item, index) =>
                                item.instructions && (
                                  <div
                                    key={index}
                                    className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800"
                                  >
                                    <p className="text-sm text-gray-900 dark:text-gray-100">
                                      <strong className="text-blue-800 dark:text-blue-200">
                                        {item.medicineName}:
                                      </strong>{" "}
                                      {item.instructions}
                                    </p>
                                  </div>
                                )
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Schedule Information */}
                  {selectedRequest.request?.medicineRequestItems &&
                    selectedRequest.request.medicineRequestItems.some(
                      (item) => item.timeOfDay && item.timeOfDay !== "N/A"
                    ) && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                          <FiClock className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                          Lịch uống thuốc đã lên kế hoạch
                        </h4>
                        <div className="space-y-4">
                          {selectedRequest.request.medicineRequestItems.map(
                            (item, index) =>
                              item.timeOfDay &&
                              item.timeOfDay !== "N/A" && (
                                <div
                                  key={index}
                                  className="bg-white dark:bg-green-900/30 p-3 rounded border border-green-300 dark:border-green-700"
                                >
                                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    {item.medicineName}
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {(Array.isArray(item.timeOfDay)
                                      ? item.timeOfDay
                                      : item.timeOfDay.split(", ")
                                    ).map((time, timeIndex) => (
                                      <div
                                        key={timeIndex}
                                        className="bg-green-100 dark:bg-green-800/50 p-2 rounded border border-green-300 dark:border-green-600"
                                      >
                                        <div className="flex items-center gap-2">
                                          <FiClock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                          <div>
                                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                              {time.trim() === "morning"
                                                ? "Buổi sáng (6:00 - 11:00)"
                                                : time.trim() === "noon"
                                                ? "Buổi trưa (11:00 - 14:00)"
                                                : time.trim() === "afternoon"
                                                ? "Buổi chiều (14:00 - 18:00)"
                                                : time.trim() === "evening"
                                                ? "Buổi tối (18:00 - 22:00)"
                                                : time.trim()}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                              {item.dosage &&
                                              item.frequency &&
                                              item.dosage !== "N/A" &&
                                              item.frequency !== "N/A"
                                                ? calculateDosagePerAdministration(
                                                    formatDosageWithUnit(
                                                      item.dosage,
                                                      item.dosageUnit
                                                    ),
                                                    item.frequency
                                                  )
                                                : "Chưa xác định"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Re-Request Modal */}
      {showReRequestModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              setShowReRequestModal(false);
              setReRequestReason("");
            }}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl transition-colors duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Tạo yêu cầu lại
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tạo yêu cầu cấp thuốc mới cho học sinh
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowReRequestModal(false);
                    setReRequestReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Student Info Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                  <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    Thông tin học sinh
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Họ tên:
                      </label>
                      <p className="text-blue-900 dark:text-blue-100">
                        {selectedRequest.request?.student?.firstName}{" "}
                        {selectedRequest.request?.student?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Lớp:
                      </label>
                      <p className="text-blue-900 dark:text-blue-100">
                        {selectedRequest.request?.student?.class?.className ||
                          selectedRequest.request?.className}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Thuốc:
                      </label>
                      <p className="text-blue-900 dark:text-blue-100">
                        {
                          selectedRequest.request?.medicineRequestItems?.[0]
                            ?.medicineName
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Yêu cầu gốc:
                      </label>
                      <p className="text-blue-900 dark:text-blue-100">
                        #{selectedRequest.resultId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lý do tạo yêu cầu lại{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reRequestReason}
                    onChange={(e) => setReRequestReason(e.target.value)}
                    placeholder="Nhập lý do tạo yêu cầu lại (ví dụ: học sinh đã trở lại trường, tình trạng sức khỏe đã ổn định...)"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    rows="4"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hãy mô tả rõ lý do để có thể tạo yêu cầu lại phù hợp
                  </p>
                </div>

                {/* Info Alert */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-6">
                  <div className="flex items-start">
                    <FiInfo className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-green-800 dark:text-green-200">
                        Lưu ý quan trọng
                      </h5>
                      <ul className="text-sm text-green-700 dark:text-green-300 mt-1 list-disc list-inside space-y-1">
                        <li>
                          Yêu cầu lại sẽ được tạo và có thể thực hiện lại việc
                          cho uống thuốc
                        </li>
                        <li>
                          Chỉ có thể tạo yêu cầu lại trước 17:00 hàng ngày
                        </li>
                        <li>
                          Yêu cầu lại sẽ cần được phê duyệt trước khi thực hiện
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowReRequestModal(false);
                      setReRequestReason("");
                    }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleCreateReRequest}
                    disabled={!reRequestReason.trim()}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center"
                  >
                    <FiRepeat className="h-4 w-4 mr-2" />
                    Tạo yêu cầu lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mark Failed Modal */}
      {showMarkFailedModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => {
              setShowMarkFailedModal(false);
              setMarkFailedReason("");
            }}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl transition-colors duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Đánh dấu thất bại vĩnh viễn
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Đánh dấu yêu cầu này là thất bại và không thể thực hiện
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowMarkFailedModal(false);
                    setMarkFailedReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Student Info Summary */}
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                  <h4 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2 flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    Thông tin học sinh
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-red-700 dark:text-red-300">
                        Họ tên:
                      </label>
                      <p className="text-red-900 dark:text-red-100">
                        {selectedRequest.request?.student?.firstName}{" "}
                        {selectedRequest.request?.student?.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 dark:text-red-300">
                        Lớp:
                      </label>
                      <p className="text-red-900 dark:text-red-100">
                        {selectedRequest.request?.student?.class?.className ||
                          selectedRequest.request?.className}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 dark:text-red-300">
                        Thuốc:
                      </label>
                      <p className="text-red-900 dark:text-red-100">
                        {
                          selectedRequest.request?.medicineRequestItems?.[0]
                            ?.medicineName
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-red-700 dark:text-red-300">
                        Yêu cầu:
                      </label>
                      <p className="text-red-900 dark:text-red-100">
                        #{selectedRequest.resultId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lý do đánh dấu thất bại vĩnh viễn{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={markFailedReason}
                    onChange={(e) => setMarkFailedReason(e.target.value)}
                    placeholder="Nhập lý do đánh dấu thất bại (ví dụ: học sinh chuyển trường, không thể liên lạc được, tình trạng sức khỏe không cho phép...)"
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                    rows="4"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hãy mô tả rõ lý do để ghi nhận vào hồ sơ
                  </p>
                </div>

                {/* Warning Alert */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-6">
                  <div className="flex items-start">
                    <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        ⚠️ Cảnh báo quan trọng
                      </h5>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside space-y-1">
                        <li>
                          Đánh dấu thất bại sẽ kết thúc yêu cầu này vĩnh viễn
                        </li>
                        <li>
                          Sau khi đánh dấu, không thể tạo yêu cầu lại từ request
                          này
                        </li>
                        <li>
                          Thông tin sẽ được ghi nhận vào hồ sơ y tế của học sinh
                        </li>
                        <li>Hành động này không thể hoàn tác</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowMarkFailedModal(false);
                      setMarkFailedReason("");
                    }}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleMarkAsFailed}
                    disabled={!markFailedReason.trim()}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition-colors flex items-center"
                  >
                    <FiXCircle className="h-4 w-4 mr-2" />
                    Đánh dấu thất bại
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Re-Requests Modal */}
      {showReRequestsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowReRequestsModal(false)}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl transition-colors duration-300">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Lịch sử yêu cầu lại #{selectedRequest.resultId}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Danh sách tất cả các yêu cầu lại đã được tạo từ yêu cầu gốc
                  </p>
                </div>
                <button
                  onClick={() => setShowReRequestsModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {reRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FiInfo className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                      Chưa có yêu cầu lại nào
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Chưa có yêu cầu lại nào được tạo
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            ID Yêu cầu lại
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Ngày tạo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Lý do tạo lại
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Người tạo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {reRequests.map((reRequest, index) => (
                          <tr
                            key={reRequest.resultId || index}
                            className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                              #{reRequest.resultId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {formatDateTime(reRequest.submittedAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                              <div className="max-w-xs">
                                <p
                                  className="truncate"
                                  title={reRequest.reRequestReason}
                                >
                                  {reRequest.reRequestReason ||
                                    "Không có lý do"}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  reRequest.status === "Completed" ||
                                  reRequest.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : reRequest.status === "Failed" ||
                                      reRequest.status === "failed"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                }`}
                              >
                                {reRequest.status === "Completed"
                                  ? "Hoàn thành"
                                  : reRequest.status === "Failed"
                                  ? "Thất bại"
                                  : reRequest.status === "Pending"
                                  ? "Chờ xử lý"
                                  : reRequest.status || "Không xác định"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                              {reRequest.staffName || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
                <button
                  onClick={() => setShowReRequestsModal(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FailedRequestManagement;
