import React, { useState } from "react";
import {
  FiSearch,
  FiEye,
  FiX,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
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

const RefusedRequests = ({
  refusedRequests,
  loading,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onRequestUpdate,
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [refusedSubTab, setRefusedSubTab] = useState("all"); // all, fully, partially

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
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
        Đã từ chối
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

    // Get refusal reasons for refused periods
    const refusedPeriodsWithReasons = getRefusedPeriodsWithReasons(request);

    return (
      <div className="period-status-list space-y-1">
        {periods.map(({ period, status, label }) => {
          const statusClass = getStatusClass(status);
          const isRefused = status === PERIOD_STATUSES.REFUSED;
          const isProcessed = isPeriodProcessed(request, period);
          const refusalInfo = refusedPeriodsWithReasons.find(
            (p) => p.period === period
          );

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
                    isRefused && refusalInfo
                      ? `Lý do: ${refusalInfo.reason}`
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
              {isRefused && refusalInfo && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1 max-w-[200px] truncate">
                  {refusalInfo.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Function to get row class based on request status
  const getRequestRowClass = (request) => {
    const baseClass =
      "hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200";

    if (isPartiallyRefused(request)) {
      return `${baseClass} partially-refused-row bg-orange-50 dark:bg-orange-900/20`;
    } else if (isFullyRefused(request)) {
      return `${baseClass} fully-refused-row bg-red-50 dark:bg-red-900/20`;
    } else {
      const requestStatus = getRequestStatus(request);
      if (requestStatus.isPartiallyProcessed) {
        return `${baseClass} request-row-with-mixed-status`;
      }
    }

    return baseClass;
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

  // Enhanced data filtering with mixed status support
  const getCurrentData = () => {
    try {
      // Deduplicate requests by requestId to prevent same request appearing multiple times
      const allRequests = deduplicateRequests(refusedRequests || []);

      // Debug logging for refused requests (only for specific request)
      allRequests.forEach((request) => {
        if (request && request.requestId === 2053) {
          const debug = debugRequestStatus(request);
        }
      });

      let filteredRequests = filterRequestsByStatus(allRequests, "refused");

      // Apply sub-filtering for refused tab
      if (refusedSubTab !== "all") {
        const beforeSubFilter = filteredRequests.length;
        filteredRequests = filterRequestsByStatus(
          filteredRequests,
          refusedSubTab
        );
      }

      return filteredRequests || [];
    } catch (error) {
      console.error("Error in getCurrentData:", error);
      return [];
    }
  };

  const currentRequests = filterRequests(getCurrentData());

  // Component for refused tab sub-filters
  const RefusedTabFilters = () => {
    try {
      // Deduplicate requests by requestId to prevent same request appearing multiple times
      const allRequests = deduplicateRequests(refusedRequests || []);

      const refusedRequestsFiltered =
        filterRequestsByStatus(allRequests, "refused") || [];

      const fullyRefusedCount =
        filterRequestsByStatus(refusedRequestsFiltered, "fully_refused")
          ?.length || 0;
      const partiallyRefusedCount =
        filterRequestsByStatus(refusedRequestsFiltered, "partially_refused")
          ?.length || 0;

      return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 mb-4">
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phân loại yêu cầu từ chối:
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              • <strong>Từ chối hoàn toàn:</strong> Tất cả các buổi trong yêu
              cầu đều bị từ chối
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              • <strong>Từ chối một phần:</strong> Một số buổi bị từ chối, một
              số buổi khác đã được xác nhận hoặc đang chờ
            </p>
          </div>

          <div className="flex space-x-1 bg-gray-50 dark:bg-neutral-750 p-2 rounded-lg">
            {[
              {
                key: "all",
                label: "Tất cả",
                count: refusedRequestsFiltered.length,
                description: "Tất cả yêu cầu bị từ chối",
              },
              {
                key: "fully_refused",
                label: "Từ chối hoàn toàn",
                count: fullyRefusedCount,
                description: "Tất cả buổi đều bị từ chối",
              },
              {
                key: "partially_refused",
                label: "Từ chối một phần",
                count: partiallyRefusedCount,
                description: "Chỉ một số buổi bị từ chối",
              },
            ].map(({ key, label, count, description }) => (
              <button
                key={key}
                onClick={() => setRefusedSubTab(key)}
                className={`refused-tab-button flex flex-col items-center px-4 py-3 rounded-md text-sm transition-colors duration-200 min-w-[140px] ${
                  refusedSubTab === key
                    ? "active bg-white dark:bg-neutral-600 text-red-600 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-700"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
                }`}
                title={description}
              >
                <span className="font-medium">{label}</span>
                <span
                  className={`mt-1 px-2 py-0.5 text-xs rounded-full ${
                    refusedSubTab === key
                      ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error in RefusedTabFilters:", error);
      return (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 mb-4">
          <div className="text-red-600 text-sm">Lỗi khi tải bộ lọc</div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Refused Tab Sub-filters */}
      <RefusedTabFilters />

      {/* Statistics for refused requests */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Thống kê yêu cầu từ chối:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-neutral-750 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {filterRequestsByStatus(getCurrentData(), "refused")?.length || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Tổng số yêu cầu từ chối
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-neutral-750 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {filterRequestsByStatus(getCurrentData(), "partially_refused")
                ?.length || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Từ chối một phần
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-neutral-750 rounded-lg">
            <div className="text-2xl font-bold text-red-800 dark:text-red-300">
              {filterRequestsByStatus(getCurrentData(), "fully_refused")
                ?.length || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Từ chối hoàn toàn
            </div>
          </div>
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
                          {refusedSubTab === "fully_refused" &&
                            "Không có yêu cầu từ chối hoàn toàn"}
                          {refusedSubTab === "partially_refused" &&
                            "Không có yêu cầu từ chối một phần"}
                          {refusedSubTab === "all" &&
                            "Không có yêu cầu bị từ chối"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {refusedSubTab === "fully_refused" &&
                            "Tất cả các buổi trong yêu cầu đều bị từ chối"}
                          {refusedSubTab === "partially_refused" &&
                            "Một số buổi bị từ chối, một số buổi khác đã được xác nhận hoặc đang chờ"}
                          {refusedSubTab === "all" &&
                            "Các yêu cầu thuốc bị từ chối sẽ hiển thị ở đây"}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr
                    key={request.requestId}
                    className={getRequestRowClass(request)}
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
                      <div className="flex flex-col items-center space-y-1">
                        {getStatusBadge(request.status)}
                        {isPartiallyRefused(request) && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Từ chối một phần
                          </span>
                        )}
                        {isFullyRefused(request) && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Từ chối hoàn toàn
                          </span>
                        )}
                      </div>
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
                  <FiXCircle className="h-6 w-6" />
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

              {/* Refusal Details */}
              {(() => {
                const refusedPeriods =
                  getRefusedPeriodsWithReasons(selectedRequest);
                if (refusedPeriods.length === 0) return null;

                return (
                  <div className="mb-6">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="text-md font-medium text-red-800 dark:text-red-300 mb-3 flex items-center">
                        <FiXCircle className="h-5 w-5 mr-2" />
                        Chi tiết lý do từ chối theo từng buổi
                      </h4>

                      {/* Summary section */}
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-800/30 rounded-lg border border-red-300 dark:border-red-700">
                        <p className="text-sm text-red-800 dark:text-red-200">
                          <strong>Tổng quan:</strong> Yêu cầu này có{" "}
                          {refusedPeriods.length} buổi bị từ chối. Dưới đây là
                          chi tiết lý do từ chối cho từng buổi để bạn có thể
                          hiểu rõ nguyên nhân.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {refusedPeriods.map((refusalInfo, index) => (
                          <div
                            key={index}
                            className="bg-white dark:bg-red-900/30 p-4 rounded border border-red-300 dark:border-red-700"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-semibold text-red-800 dark:text-red-200">
                                Buổi {refusalInfo.period}
                              </h5>
                              {refusalInfo.medicineName && (
                                <span className="text-xs text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-800 px-2 py-1 rounded">
                                  {refusalInfo.medicineName}
                                </span>
                              )}
                            </div>

                            <div className="mb-3">
                              <label className="text-xs font-medium text-red-700 dark:text-red-300 block mb-1">
                                Lý do từ chối:
                              </label>
                              <p className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-800/50 p-3 rounded border-l-4 border-red-400">
                                {refusalInfo.reason}
                              </p>
                            </div>

                            {/* Additional context for better understanding */}
                            <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-700">
                              <p className="text-xs text-red-600 dark:text-red-400">
                                <strong>Ghi chú:</strong> Lý do từ chối này áp
                                dụng cho tất cả các loại thuốc trong buổi{" "}
                                {refusalInfo.period} của yêu cầu này.
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Fallback to general refusal reason if no period-specific reasons found */}
                      {refusedPeriods.length === 0 && (
                        <div className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                          <p className="text-red-700 dark:text-red-300 font-medium">
                            {selectedRequest.refusalReason ||
                              selectedRequest.rejectionReason ||
                              selectedRequest.reason ||
                              "Không có lý do cụ thể"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefusedRequests;
