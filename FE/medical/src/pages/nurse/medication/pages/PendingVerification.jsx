import React, { useState } from "react";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiClipboard,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import { getMedicineUnit } from "../../../../utils/medicine/medicineUnits";
import {
  calculateDosagePerAdministration,
  calculateDosagePerTime,
  formatTotalDosage,
  formatFrequencyDisplay,
} from "../../../../utils/api/medication/medicationUtils";
import {
  getRequestStatus,
  getAvailableActions,
  getUnprocessedPeriods,
  getProcessedPeriods,
  getAllPeriodsFromRequest,
  getPeriodStatus,
  getPeriodStatusLabel,
  getStatusClass,
  filterRequestsByStatus,
  isPartiallyRefused,
  isFullyRefused,
  isPartiallyVerified,
  deduplicateRequests,
  getPeriodRefusalReason,
  getRefusedPeriodsWithReasons,
  debugRequestStatus,
  isPeriodProcessed,
  getAvailablePeriodsForAdministration,
  getProcessedPeriodsForDisplay,
  hasUnprocessedPeriods,
  getPeriodStatusSummary,
  debugPeriodProcessing,
  debugPeriodProcessingDetailed,
  testWithSampleData,
  PERIOD_STATUSES,
  VIETNAMESE_PERIODS,
} from "../../../../utils/medicationRequestUtils";

const PendingVerification = ({
  pendingRequests,
  loading,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onRequestUpdate,
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [periodReasons, setPeriodReasons] = useState({});
  const [availablePeriods, setAvailablePeriods] = useState([]);

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  // Handle period selection (checkbox toggle)
  const handlePeriodToggle = (period) => {
    setSelectedPeriods((prev) => {
      if (prev.includes(period)) {
        // Remove period and its reason
        setPeriodReasons((prevReasons) => {
          const newReasons = { ...prevReasons };
          delete newReasons[period];
          return newReasons;
        });
        return prev.filter((p) => p !== period);
      } else {
        // Add period
        return [...prev, period];
      }
    });
  };

  // Handle reason input for specific period
  const handleReasonChange = (period, reason) => {
    setPeriodReasons((prev) => ({
      ...prev,
      [period]: reason,
    }));
  };

  // Check if all selected periods have reasons
  const areAllReasonsProvided = () => {
    return selectedPeriods.every(
      (period) =>
        periodReasons[period] && periodReasons[period].trim().length > 0
    );
  };

  // Update the openVerifyModal function
  const openVerifyModal = (request) => {
    setSelectedRequest(request);
    setAvailablePeriods(getUnprocessedPeriods(request));
    setSelectedPeriods([]);
    setPeriodReasons({});
    setShowVerifyModal(true);
  };

  // Update the openRefuseModal function
  const openRefuseModal = (request) => {
    setSelectedRequest(request);
    setAvailablePeriods(getUnprocessedPeriods(request));
    setSelectedPeriods([]);
    setPeriodReasons({});
    setShowRefuseModal(true);
  };

  const handleVerifyRequest = async (request) => {
    if (selectedPeriods.length === 0) {
      alert("Vui lòng chọn ít nhất một buổi");
      return;
    }

    try {
      // Verify each medicine item in the request for all selected periods
      const verifyPromises = [];

      for (const period of selectedPeriods) {
        for (const item of request.medicineRequestItems || []) {
          verifyPromises.push(
            medicationService.verifyRequestItem(
              item.medicineRequestItemId,
              period,
              currentStaffId
            )
          );
        }
      }

      const responses = await Promise.all(verifyPromises);

      // Check if all verifications were successful
      const allSuccessful = responses.every((response) => response.success);

      if (allSuccessful) {
        const periodsText = selectedPeriods.join(", ");
        alert(`Xác nhận yêu cầu thuốc cho các buổi ${periodsText} thành công!`);
        setShowVerifyModal(false);
        setSelectedPeriods([]);
        onRequestUpdate();
      } else {
        const failedResponses = responses.filter(
          (response) => !response.success
        );
        alert(
          `Có lỗi khi xác nhận: ${failedResponses
            .map((r) => r.message)
            .join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error verifying request:", error);
      alert("Có lỗi xảy ra khi xác nhận yêu cầu thuốc");
    }
  };

  const handleRefuseRequest = async (request) => {
    if (selectedPeriods.length === 0) {
      alert("Vui lòng chọn ít nhất một buổi");
      return;
    }

    if (!areAllReasonsProvided()) {
      alert("Vui lòng nhập lý do từ chối cho tất cả các buổi đã chọn");
      return;
    }

    try {
      // Refuse each medicine item in the request for all selected periods
      const refusePromises = [];

      for (const period of selectedPeriods) {
        const reasonForPeriod = periodReasons[period];
        for (const item of request.medicineRequestItems || []) {
          refusePromises.push(
            medicationService.refuseRequestItem(
              item.medicineRequestItemId,
              period,
              currentStaffId,
              reasonForPeriod
            )
          );
        }
      }

      const responses = await Promise.all(refusePromises);

      // Check if all refusals were successful
      const allSuccessful = responses.every((response) => response.success);

      if (allSuccessful) {
        const periodsText = selectedPeriods.join(", ");
        alert(`Từ chối yêu cầu thuốc cho các buổi ${periodsText} thành công!`);
        setShowRefuseModal(false);
        setPeriodReasons({});
        setSelectedPeriods([]);
        onRequestUpdate();
      } else {
        const failedResponses = responses.filter(
          (response) => !response.success
        );
        alert(
          `Có lỗi khi từ chối: ${failedResponses
            .map((r) => r.message)
            .join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error refusing request:", error);
      alert("Có lỗi xảy ra khi từ chối yêu cầu thuốc");
    }
  };

  const filterRequests = (requests) => {
    try {
      if (!requests || !Array.isArray(requests)) {
        return [];
      }

      return requests.filter((request) => {
        if (!request) return false;

        const searchLower = searchTerm.toLowerCase();
        const studentName = `${request.student?.firstName || ""} ${
          request.student?.lastName || ""
        }`.toLowerCase();

        // Search through all medicine names
        const medicineNames =
          request.medicineRequestItems
            ?.map((item) => item.medicineName?.toLowerCase() || "")
            .join(" ") || "";

        const requestId = request.requestId?.toString() || "";

        return (
          studentName.includes(searchLower) ||
          medicineNames.includes(searchLower) ||
          requestId.includes(searchLower)
        );
      });
    } catch (error) {
      console.error("Error in filterRequests:", error);
      return [];
    }
  };

  const getStatusBadge = (status) => {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        Chờ kiểm tra
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Function to render period status indicators
  const renderPeriodStatus = (request) => {
    const requestStatus = getRequestStatus(request);
    const periods = requestStatus.periods;

    if (periods.length === 0) {
      return <span className="text-gray-500 text-xs">N/A</span>;
    }

    return (
      <div className="period-status-list space-y-1">
        {periods.map(({ period, status, label }) => {
          const statusClass = getStatusClass(status);
          const isRefused = status === PERIOD_STATUSES.REFUSED;
          const isProcessed = isPeriodProcessed(request, period);

          // Get inline styles based on status for guaranteed rendering
          const getInlineStyles = (status) => {
            switch (status) {
              case PERIOD_STATUSES.REFUSED:
                return {
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderColor: "#f5c6cb",
                  border: "1px solid #f5c6cb",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                };
              case PERIOD_STATUSES.VERIFIED:
                return {
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderColor: "#c3e6cb",
                  border: "1px solid #c3e6cb",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                };
              case PERIOD_STATUSES.ASSIGNED:
                return {
                  backgroundColor: "#cce5ff",
                  color: "#004085",
                  borderColor: "#b3d7ff",
                  border: "1px solid #b3d7ff",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                };
              case PERIOD_STATUSES.COMPLETED:
                return {
                  backgroundColor: "#d1ecf1",
                  color: "#0c5460",
                  borderColor: "#bee5eb",
                  border: "1px solid #bee5eb",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                };
              case PERIOD_STATUSES.PENDING:
              default:
                return {
                  backgroundColor: "#fff3cd",
                  color: "#856404",
                  borderColor: "#ffeaa7",
                  border: "1px solid #ffeaa7",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "500",
                };
            }
          };

          return (
            <div key={period} className="period-status-item">
              <div className="flex items-center space-x-1">
                <span
                  className={`period-badge ${statusClass} ${
                    isProcessed ? "opacity-75" : ""
                  }`}
                  style={getInlineStyles(status)}
                  title={
                    isRefused
                      ? `Lý do: ${getPeriodRefusalReason(request, period)}`
                      : isProcessed
                      ? `${label} (Đã phân công/hoàn thành - không thể chọn lại)`
                      : label
                  }
                >
                  {period}
                </span>
                {isRefused && <span className="text-red-500 text-xs">✗</span>}
                {isProcessed && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to render multiple medicines in table
  const renderMedicinesList = (medicineItems) => {
    if (!medicineItems || medicineItems.length === 0) {
      return <span className="text-gray-500">N/A</span>;
    }

    if (medicineItems.length === 1) {
      return (
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {medicineItems[0].medicineName}
        </span>
      );
    }

    return (
      <div className="space-y-1">
        {medicineItems.map((item, index) => (
          <div key={index} className="text-sm text-gray-900 dark:text-gray-100">
            <span className="font-medium">{item.medicineName}</span>
          </div>
        ))}
      </div>
    );
  };

  const currentRequests = filterRequests(pendingRequests);

  return (
    <div className="space-y-6">
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

      {/* Requests Table */}
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
                  Buổi uống thuốc
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày gửi yêu cầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày uống thuốc
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
              {currentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? (
                      "Đang tải..."
                    ) : (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-lg font-medium">
                          Không có yêu cầu chờ kiểm tra
                        </div>
                        <div className="text-sm text-gray-400">
                          Các yêu cầu thuốc chờ kiểm tra sẽ hiển thị ở đây
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr
                    key={request.requestId}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {request.student?.firstName}{" "}
                            {request.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp:{" "}
                            {request.student?.class?.className ||
                              request.className}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderMedicinesList(request.medicineRequestItems)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderPeriodStatus(request)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {request.date
                        ? formatDate(request.date)
                        : formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(request.status)}
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
                          onClick={() => openVerifyModal(request)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Xác nhận đủ thuốc"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openRefuseModal(request)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Từ chối thiếu thuốc"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full overflow-y-auto border border-gray-300 dark:border-gray-600"
            style={{
              maxWidth: "64rem",
              maxHeight: "calc(100vh - 2rem)",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu thuốc #{selectedRequest.requestId}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Student and Request Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Học sinh
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.student?.firstName}{" "}
                    {selectedRequest.student?.lastName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Lớp:{" "}
                    {selectedRequest.student?.class?.className ||
                      selectedRequest.className}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày gửi yêu cầu
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(selectedRequest.requestDate)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày uống thuốc
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.date
                      ? formatDate(selectedRequest.date)
                      : formatDate(selectedRequest.requestDate)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Phụ huynh
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {selectedRequest.parent
                      ? `${selectedRequest.parent.firstName} ${selectedRequest.parent.lastName}`
                      : selectedRequest.parentName || "N/A"}
                  </div>
                </div>
              </div>

              {/* Medicine Information */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Danh sách thuốc yêu cầu
                </h4>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tên thuốc
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tổng liều lượng
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Tần suất uống
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          Liều lượng mỗi lần
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
                      {selectedRequest.medicineRequestItems?.map(
                        (item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {formatTotalDosage(
                                item.totalQuantity || item.dosage,
                                item.dosageUnit ||
                                  getMedicineUnit(item.medicineName)
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {formatFrequencyDisplay(item.frequency)}
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 dark:text-gray-100">
                              {calculateDosagePerTime(
                                item.dosage,
                                item.dosageUnit ||
                                  getMedicineUnit(item.medicineName),
                                item.frequency
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Hướng dẫn sử dụng
                </h4>

                {selectedRequest.medicineRequestItems?.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.medicineName}:
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                      {item.instructions ||
                        (() => {
                          if (item.dosage && item.frequency) {
                            const dosagePerTime = item.dosage / item.frequency;
                            const roundedDosage =
                              dosagePerTime % 1 === 0
                                ? dosagePerTime.toString()
                                : dosagePerTime.toFixed(1);
                            const unit =
                              item.dosageUnit ||
                              getMedicineUnit(item.medicineName);
                            return `Uống ${roundedDosage} ${unit} mỗi lần theo toa`;
                          }
                          return `Uống ${item.dosagePerTime || "1"} ${
                            item.dosageUnit ||
                            getMedicineUnit(item.medicineName)
                          } mỗi lần theo toa`;
                        })()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái:
                    </span>
                    <span className="ml-2">
                      {getStatusBadge(selectedRequest.status)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openRefuseModal(selectedRequest);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                  >
                    <FiX className="h-4 w-4 mr-2" />
                    Từ chối
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      openVerifyModal(selectedRequest);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <FiCheck className="h-4 w-4 mr-2" />
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full border border-gray-300 dark:border-gray-600 flex flex-col"
            style={{
              maxWidth: "28rem",
              maxHeight: "calc(100vh - 2rem)",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Xác nhận đủ thuốc
              </h3>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Period Status Overview */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tổng quan trạng thái các buổi:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getAllPeriodsFromRequest(selectedRequest).map((period) => {
                    const status = getPeriodStatus(selectedRequest, period);
                    const statusClass = getStatusClass(status);
                    const statusLabel = getPeriodStatusLabel(status);

                    return (
                      <div
                        key={period}
                        className={`period-indicator ${statusClass} px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {period}: {statusLabel}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Xác nhận yêu cầu thuốc cho học sinh:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Chọn buổi cần xác nhận *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePeriods.map((period) => (
                    <label
                      key={period.value}
                      className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPeriods.includes(period.value)}
                        onChange={() => handlePeriodToggle(period.value)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {period.label}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedPeriods.length > 0 && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                    Đã chọn: {selectedPeriods.join(", ")}
                  </div>
                )}
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {selectedPeriods.length > 0
                    ? `Bạn xác nhận rằng có đủ thuốc để thực hiện yêu cầu này cho ${
                        selectedPeriods.length > 1 ? "các buổi" : "buổi"
                      } ${selectedPeriods.join(", ")}?`
                    : "Vui lòng chọn ít nhất một buổi để xác nhận."}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setSelectedPeriods([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleVerifyRequest(selectedRequest)}
                  disabled={selectedPeriods.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Xác nhận ({selectedPeriods.length} buổi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refuse Modal */}
      {showRefuseModal && selectedRequest && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full border border-gray-300 dark:border-gray-600 flex flex-col"
            style={{
              maxWidth: "28rem",
              maxHeight: "calc(100vh - 2rem)",
              margin: "1rem",
            }}
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Từ chối yêu cầu thuốc
              </h3>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Period Status Overview */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tổng quan trạng thái các buổi:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getAllPeriodsFromRequest(selectedRequest).map((period) => {
                    const status = getPeriodStatus(selectedRequest, period);
                    const statusClass = getStatusClass(status);
                    const statusLabel = getPeriodStatusLabel(status);

                    return (
                      <div
                        key={period}
                        className={`period-indicator ${statusClass} px-2 py-1 rounded-full text-xs font-medium`}
                      >
                        {period}: {statusLabel}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Từ chối yêu cầu thuốc cho học sinh:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Chọn buổi cần từ chối *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availablePeriods.map((period) => (
                    <label
                      key={period.value}
                      className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPeriods.includes(period.value)}
                        onChange={() => handlePeriodToggle(period.value)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {period.label}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedPeriods.length > 0 && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Đã chọn: {selectedPeriods.join(", ")}
                  </div>
                )}
              </div>
              {/* Dynamic reason fields for each selected period */}
              {selectedPeriods.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Lý do từ chối cho từng buổi *
                  </label>
                  <div className="space-y-4">
                    {selectedPeriods.map((period) => {
                      const hasReason =
                        periodReasons[period] &&
                        periodReasons[period].trim().length > 0;
                      return (
                        <div
                          key={period}
                          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-neutral-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Buổi {period}
                            </label>
                          </div>
                          <textarea
                            value={periodReasons[period] || ""}
                            onChange={(e) =>
                              handleReasonChange(period, e.target.value)
                            }
                            placeholder={`Nhập lý do từ chối cho buổi ${period} (ví dụ: thiếu thuốc, hết hạn sử dụng...)`}
                            className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 ${
                              hasReason
                                ? "border-green-300 dark:border-green-600 focus:ring-green-500 focus:border-green-500"
                                : "border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500"
                            }`}
                            rows="3"
                            required
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRefuseModal(false);
                    setPeriodReasons({});
                    setSelectedPeriods([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleRefuseRequest(selectedRequest)}
                  disabled={
                    selectedPeriods.length === 0 || !areAllReasonsProvided()
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Từ chối ({selectedPeriods.length} buổi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingVerification;
