import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiEye,
  FiClipboard,
  FiAlertTriangle,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiInfo,
  FiXCircle,
  FiActivity, // Thêm icon cho nút cho uống thuốc
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
  deduplicateRequests,
  getPeriodRefusalReason,
  getRefusedPeriodsWithReasons,
  debugRequestStatus,
  PERIOD_STATUSES,
  VIETNAMESE_PERIODS,
} from "../../../../utils/medicationRequestUtils";

const MedicineVerification = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [verifiedRequests, setVerifiedRequests] = useState([]);
  const [refusedRequests, setRefusedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("pending");
  const [refusedSubTab, setRefusedSubTab] = useState("all"); // all, fully, partially
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  // Thêm state cho modal cho uống thuốc
  const [showAdministerModal, setShowAdministerModal] = useState(false);
  const [selectedAdministerRequest, setSelectedAdministerRequest] =
    useState(null);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [periodReasons, setPeriodReasons] = useState({});
  const [availablePeriods, setAvailablePeriods] = useState([]);

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  // Function to get available periods from request
  const getAvailablePeriodsFromRequest = (request) => {
    const periods = new Set();

    request.medicineRequestItems?.forEach((item, index) => {
      // Parse timeOfDay to determine which time periods to show
      const timeOfDay = item.timeOfDay || "";

      const timeSlots = timeOfDay.split(",").map((time) => time.trim());

      timeSlots.forEach((slot) => {
        // Use VIETNAMESE_PERIODS mapping to handle Vietnamese lowercase -> proper case
        const period = VIETNAMESE_PERIODS[slot.toLowerCase()];
        if (period) {
          periods.add(period);
        }
      });
    });

    const result = Array.from(periods).map((period) => ({
      value: period,
      label: period,
    }));

    // Fallback: if no periods found, provide default periods based on verified status
    if (result.length === 0) {
      const fallbackPeriods = getAllPeriodsFromRequest(request);

      return fallbackPeriods.map((period) => ({
        value: period,
        label: period,
      }));
    }

    return result;
  };

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

  // Function để mở modal cho uống thuốc
  const openAdministerModal = (request) => {
    setSelectedAdministerRequest(request);
    const periods = getAvailablePeriodsFromRequest(request);

    setAvailablePeriods(periods);
    setSelectedPeriods([]);
    setShowAdministerModal(true);
  };

  // Function xử lý assign nurse cho medicine request item
  const handleAdministerMedicine = async (request) => {
    if (selectedPeriods.length === 0) {
      alert("Vui lòng chọn ít nhất một buổi để cho uống thuốc");
      return;
    }

    try {
      // Assign nurse for each medicine item in the request for all selected periods
      const assignPromises = [];

      for (const period of selectedPeriods) {
        for (const item of request.medicineRequestItems || []) {
          assignPromises.push(
            medicationService.assignNurseToRequestItem(
              item.medicineRequestItemId,
              currentStaffId,
              period
            )
          );
        }
      }

      const responses = await Promise.all(assignPromises);

      // Check if all assignments were successful
      const allSuccessful = responses.every((response) => response.success);

      if (allSuccessful) {
        const periodsText = selectedPeriods.join(", ");
        alert(`Phân công cho uống thuốc buổi ${periodsText} thành công!`);
        setShowAdministerModal(false);
        setSelectedPeriods([]);
        loadAllData();
      } else {
        const failedResponses = responses.filter(
          (response) => !response.success
        );
        alert(
          `Có lỗi khi phân công: ${failedResponses
            .map((r) => r.message)
            .join(", ")}`
        );
      }
    } catch (error) {
      console.error(
        "Error assigning nurse for medicine administration:",
        error
      );
      alert("Có lỗi xảy ra khi phân công cho uống thuốc");
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadPendingRequests(),
        loadVerifiedRequests(),
        loadRefusedRequests(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadPendingRequests = async () => {
    try {
      // Use new API that filters by nurse's assigned grades
      const response = await medicationService.getPendingMedicationRequests();
      if (response.success && response.data) {
        setPendingRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setPendingRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned pending requests:", error);
      setPendingRequests([]);
    }
  };

  const loadVerifiedRequests = async () => {
    try {
      // Use new API that filters by nurse's assigned grades
      const response = await medicationService.getVerifiedMedicationRequests();
      if (response.success && response.data) {
        setVerifiedRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setVerifiedRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned verified requests:", error);
      setVerifiedRequests([]);
    }
  };

  const loadRefusedRequests = async () => {
    try {
      // Use API endpoint /api/MedicineRequest/refused
      const response = await medicationService.getRefusedMedicationRequests();
      if (response.success && response.data) {
        setRefusedRequests(Array.isArray(response.data) ? response.data : []);
      } else {
        setRefusedRequests([]);
      }
    } catch (error) {
      console.error("Error loading refused requests:", error);
      setRefusedRequests([]);
    }
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
        loadAllData();
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
        loadAllData();
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

  // Enhanced data filtering with mixed status support
  const getCurrentData = () => {
    try {
      // Combine all requests and remove duplicates by requestId
      const allRequestsRaw = [
        ...(pendingRequests || []),
        ...(verifiedRequests || []),
        ...(refusedRequests || []),
      ];

      // Deduplicate requests by requestId to prevent same request appearing multiple times
      const allRequests = deduplicateRequests(allRequestsRaw);

      // Debug logging for refused requests (only for specific request)
      if (activeSubTab === "refused") {
        allRequests.forEach((request) => {
          if (request && request.requestId === 2053) {
            const debug = debugRequestStatus(request);
          }
        });
      }

      let filteredRequests = filterRequestsByStatus(allRequests, activeSubTab);

      // Apply sub-filtering for refused tab
      if (activeSubTab === "refused" && refusedSubTab !== "all") {
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

  const getStatusBadge = (status, subTab) => {
    const statusMap = {
      pending: {
        label: "Chờ kiểm tra",
        color: "bg-yellow-100 text-yellow-800",
      },
      verified: { label: "Đã xác nhận", color: "bg-green-100 text-green-800" },
      refused: { label: "Đã từ chối", color: "bg-red-100 text-red-800" },
    };

    const config = statusMap[subTab] || statusMap.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
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
                  className={`period-badge ${statusClass}`}
                  style={getInlineStyles(status)}
                  title={
                    isRefused && refusalInfo
                      ? `Lý do: ${refusalInfo.reason}`
                      : label
                  }
                >
                  {period}
                </span>
                {isRefused && <span className="text-red-500 text-xs">✗</span>}
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

  const currentRequests = useMemo(() => {
    try {
      return filterRequests(getCurrentData());
    } catch (error) {
      console.error("Error calculating currentRequests:", error);
      return [];
    }
  }, [
    pendingRequests,
    verifiedRequests,
    refusedRequests,
    activeSubTab,
    refusedSubTab,
    searchTerm,
  ]);

  // Component for refused tab sub-filters
  const RefusedTabFilters = () => {
    try {
      // Combine all requests and remove duplicates by requestId
      const allRequestsRaw = [
        ...(pendingRequests || []),
        ...(verifiedRequests || []),
        ...(refusedRequests || []),
      ];

      // Deduplicate requests by requestId to prevent same request appearing multiple times
      const allRequests = deduplicateRequests(allRequestsRaw);

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

  // Inject CSS styles for period indicators
  useEffect(() => {
    const styleId = "period-indicator-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .period-indicator {
          display: inline-block;
          font-weight: 500;
          border: 1px solid;
        }
        
        .status-pending {
          background-color: #fff3cd !important;
          color: #856404 !important;
          border-color: #ffeaa7 !important;
        }
        
        .status-verified {
          background-color: #d4edda !important;
          color: #155724 !important;
          border-color: #c3e6cb !important;
        }
        
        .status-refused {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          border-color: #f5c6cb !important;
        }
        
        .status-completed {
          background-color: #cce5ff !important;
          color: #004085 !important;
          border-color: #b3d7ff !important;
        }
        
        .status-failed {
          background-color: #f8d7da !important;
          color: #721c24 !important;
          border-color: #f5c6cb !important;
        }
        
        .status-assigned {
          background-color: #e2e3e5 !important;
          color: #383d41 !important;
          border-color: #d6d8db !important;
        }
        
        .status-redo {
          background-color: #ffeaa7;
          color: #6c757d;
          border-color: #fdcb6e;
        }
        
        .status-unknown {
          background-color: #f8f9fa;
          color: #6c757d;
          border-color: #dee2e6;
        }
        
        .partially-refused-row {
          background-color: #fff3cd;
          border-left: 4px solid #f97316;
        }
        
        .fully-refused-row {
          background-color: #f8d7da;
          border-left: 4px solid #dc2626;
        }
        
        .request-row-with-mixed-status {
          border-left: 4px solid #ffc107;
        }
        
        .refused-tab-button {
          transition: all 0.2s ease-in-out;
        }
        
        .refused-tab-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .refused-tab-button.active {
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
        }
        
        .period-status-list {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .period-status-item {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }
        
        .period-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid;
        }
        
        .status-text {
          font-size: 11px;
          color: #6c757d;
        }
        
        /* Dark mode styles */
        .dark .status-pending {
          background-color: #3d3d00;
          color: #ffeb3b;
          border-color: #5d5d00;
        }
        
        .dark .status-verified {
          background-color: #1b5e20;
          color: #4caf50;
          border-color: #2e7d32;
        }
        
        .dark .status-refused {
          background-color: #5d1a1a;
          color: #f44336;
          border-color: #7d2d2d;
        }
        
        .dark .status-completed {
          background-color: #1a237e;
          color: #2196f3;
          border-color: #303f9f;
        }
        
        .dark .partially-refused-row {
          background-color: #3d3d00;
          border-left: 4px solid #f44336;
        }
        
        .dark .fully-refused-row {
          background-color: #5d1a1a;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Kiểm tra số lượng thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kiểm tra số lượng thuốc và xác nhận/từ chối yêu cầu thuốc
          </p>
        </div>
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 p-1 rounded-lg">
        {[
          { key: "pending", label: "Chờ kiểm tra", icon: FiClipboard },
          { key: "verified", label: "Đã xác nhận", icon: FiCheck },
          { key: "refused", label: "Đã từ chối", icon: FiX },
        ].map(({ key, label, icon: Icon }) => {
          // Get the correct count for each tab using new logic
          const getTabCount = (tabKey) => {
            try {
              // Combine all requests and remove duplicates by requestId
              const allRequestsRaw = [
                ...(pendingRequests || []),
                ...(verifiedRequests || []),
                ...(refusedRequests || []),
              ];

              // Deduplicate requests by requestId to prevent same request appearing multiple times
              const allRequests = deduplicateRequests(allRequestsRaw);

              const count =
                filterRequestsByStatus(allRequests, tabKey)?.length || 0;

              return count;
            } catch (error) {
              console.error("Error in getTabCount:", error);
              return 0;
            }
          };

          return (
            <button
              key={key}
              onClick={() => {
                setActiveSubTab(key);
                if (key !== "refused") {
                  setRefusedSubTab("all");
                }
              }}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                activeSubTab === key
                  ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeSubTab === key
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                }`}
              >
                {getTabCount(key)}
              </span>
            </button>
          );
        })}
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

      {/* Refused Tab Sub-filters */}
      {activeSubTab === "refused" && (
        <>
          <RefusedTabFilters />
          {/* Statistics for refused requests */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Thống kê yêu cầu từ chối:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-neutral-750 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {filterRequestsByStatus(getCurrentData(), "refused")
                    ?.length || 0}
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
        </>
      )}

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
                          {activeSubTab === "refused" &&
                            refusedSubTab === "fully_refused" &&
                            "Không có yêu cầu từ chối hoàn toàn"}
                          {activeSubTab === "refused" &&
                            refusedSubTab === "partially_refused" &&
                            "Không có yêu cầu từ chối một phần"}
                          {activeSubTab === "refused" &&
                            refusedSubTab === "all" &&
                            "Không có yêu cầu bị từ chối"}
                          {activeSubTab === "pending" &&
                            "Không có yêu cầu chờ kiểm tra"}
                          {activeSubTab === "verified" &&
                            "Không có yêu cầu đã xác nhận"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {activeSubTab === "refused" &&
                            refusedSubTab === "fully_refused" &&
                            "Tất cả các buổi trong yêu cầu đều bị từ chối"}
                          {activeSubTab === "refused" &&
                            refusedSubTab === "partially_refused" &&
                            "Một số buổi bị từ chối, một số buổi khác đã được xác nhận hoặc đang chờ"}
                          {activeSubTab === "refused" &&
                            refusedSubTab === "all" &&
                            "Các yêu cầu thuốc bị từ chối sẽ hiển thị ở đây"}
                          {activeSubTab === "pending" &&
                            "Các yêu cầu thuốc chờ kiểm tra sẽ hiển thị ở đây"}
                          {activeSubTab === "verified" &&
                            "Các yêu cầu thuốc đã được xác nhận sẽ hiển thị ở đây"}
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
                        {getStatusBadge(request.status, activeSubTab)}
                        {activeSubTab === "refused" && (
                          <>
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
                          </>
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
                        {activeSubTab === "pending" && (
                          <>
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
                          </>
                        )}
                        {activeSubTab === "verified" && (
                          <button
                            onClick={() => openAdministerModal(request)}
                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Cho uống thuốc"
                          >
                            <FiActivity className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Detail Modal */}
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

              {/* Medication Schedule */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Lịch uống thuốc:
                </h4>

                {selectedRequest.medicineRequestItems?.map((item, index) => {
                  // Parse timeOfDay to determine which time periods to show
                  const timeOfDay = item.timeOfDay || "";
                  const timeSlots = timeOfDay
                    .split(",")
                    .map((time) => time.trim().toLowerCase());

                  const timeSlotConfig = {
                    sáng: {
                      label: "Buổi sáng (6:00 - 11:00)",
                      show: timeSlots.includes("sáng"),
                    },
                    trưa: {
                      label: "Buổi trưa (11:00 - 14:00)",
                      show: timeSlots.includes("trưa"),
                    },
                    chiều: {
                      label: "Buổi chiều (14:00 - 18:00)",
                      show: timeSlots.includes("chiều"),
                    },
                    tối: {
                      label: "Buổi tối (18:00 - 22:00)",
                      show: timeSlots.includes("tối"),
                    },
                    "khi cần thiết": {
                      label: "Khi cần thiết (theo triệu chứng)",
                      show: timeSlots.includes("khi cần thiết"),
                    },
                  };

                  const activeSlots = Object.values(timeSlotConfig).filter(
                    (slot) => slot.show
                  );
                  const dosagePerTime =
                    item.dosage && item.frequency
                      ? calculateDosagePerTime(
                          item.dosage,
                          item.dosageUnit || getMedicineUnit(item.medicineName),
                          item.frequency
                        )
                      : `${item.dosagePerTime || "1"} ${
                          item.dosageUnit || getMedicineUnit(item.medicineName)
                        }/lần`;

                  return (
                    <div key={index} className="mb-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {item.medicineName}
                      </div>

                      {activeSlots.length > 0 ? (
                        <div
                          className={`grid grid-cols-1 ${
                            activeSlots.length === 2
                              ? "md:grid-cols-2"
                              : activeSlots.length === 3
                              ? "md:grid-cols-3"
                              : activeSlots.length === 4
                              ? "md:grid-cols-4"
                              : "md:grid-cols-3"
                          } gap-3`}
                        >
                          {Object.entries(timeSlotConfig).map(
                            ([key, config]) =>
                              config.show && (
                                <div
                                  key={key}
                                  className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center"
                                >
                                  <div className="text-green-600 dark:text-green-400 font-medium">
                                    {config.label}
                                  </div>
                                  <div className="text-sm text-green-700 dark:text-green-300">
                                    {dosagePerTime}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      ) : (
                        // Fallback if no timeOfDay specified
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg text-center">
                          <div className="text-gray-600 dark:text-gray-400 font-medium">
                            Thời gian uống thuốc
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {dosagePerTime}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Theo chỉ định của bác sĩ
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Trạng thái:
                    </span>
                    <span className="ml-2">
                      {getStatusBadge(selectedRequest.status, activeSubTab)}
                    </span>
                  </div>
                </div>

                {activeSubTab === "pending" && (
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
                )}
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

      {/* Administer Medicine Modal */}
      {showAdministerModal && selectedAdministerRequest && (
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
                Cho uống thuốc
              </h3>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Period Status Overview */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tổng quan trạng thái các buổi:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getAllPeriodsFromRequest(selectedAdministerRequest).map(
                    (period) => {
                      const status = getPeriodStatus(
                        selectedAdministerRequest,
                        period
                      );
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
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Phân công cho uống thuốc cho học sinh:{" "}
                    <span className="font-medium">
                      {selectedAdministerRequest.student?.firstName}{" "}
                      {selectedAdministerRequest.student?.lastName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Chọn buổi cần cho uống thuốc *
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
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {period.label}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedPeriods.length > 0 && (
                  <div className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                    Đã chọn: {selectedPeriods.join(", ")}
                  </div>
                )}
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {selectedPeriods.length > 0
                    ? `Bạn sẽ được phân công cho uống thuốc cho ${
                        selectedPeriods.length > 1 ? "các buổi" : "buổi"
                      } ${selectedPeriods.join(
                        ", "
                      )}. Việc này sẽ chuyển yêu cầu sang trạng thái "Assigned".`
                    : "Vui lòng chọn ít nhất một buổi để phân công cho uống thuốc."}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAdministerModal(false);
                    setSelectedPeriods([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={() =>
                    handleAdministerMedicine(selectedAdministerRequest)
                  }
                  disabled={selectedPeriods.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <FiActivity className="h-4 w-4 mr-2" />
                  Cho uống thuốc ({selectedPeriods.length} buổi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineVerification;
