// Utility functions for medication request status management
export const PERIOD_STATUSES = {
  PENDING: "Pending",
  VERIFIED: "Verified",
  REFUSED: "Refused",
  COMPLETED: "Completed",
  FAILED: "Failed",
  ASSIGNED: "Assigned",
  REDO: "Redo",
};

export const VIETNAMESE_PERIODS = {
  sáng: "Sáng",
  trưa: "Trưa",
  chiều: "Chiều",
  tối: "Tối",
  "khi cần thiết": "Khi cần thiết",
};

// Parse PeriodVerificationStatus from JSON
export const parsePeriodStatus = (periodVerificationStatus) => {
  if (!periodVerificationStatus) return {};

  try {
    if (typeof periodVerificationStatus === "string") {
      return JSON.parse(periodVerificationStatus);
    }
    if (typeof periodVerificationStatus === "object") {
      return periodVerificationStatus;
    }
    return {};
  } catch (error) {
    console.error("Error parsing PeriodVerificationStatus:", error);
    return {};
  }
};

// Get all periods from a request
export const getAllPeriodsFromRequest = (request) => {
  const periods = new Set();
  request.medicineRequestItems?.forEach((item) => {
    const timeOfDay = item.timeOfDay || "";
    const timeSlots = timeOfDay.split(",").map((time) => time.trim());

    timeSlots.forEach((slot) => {
      const period = VIETNAMESE_PERIODS[slot.toLowerCase()];
      if (period) {
        periods.add(period);
      }
    });
  });
  return Array.from(periods);
};

// Get period status from a medicine request item
export const getPeriodStatus = (request, period) => {
  if (!request.medicineRequestItems) return PERIOD_STATUSES.PENDING;

  // Check all items for this period
  for (const item of request.medicineRequestItems) {
    const periodStatuses = parsePeriodStatus(item.periodVerificationStatus);

    // First, check for exact period match (Vietnamese)
    if (periodStatuses[period]) {
      const statusData = Array.isArray(periodStatuses[period])
        ? periodStatuses[period][periodStatuses[period].length - 1]
        : periodStatuses[period];

      // If it's an object with Status property, use that
      if (typeof statusData === "object" && statusData.Status) {
        return statusData.Status;
      }
      // If it's a string status, use that
      if (typeof statusData === "string") {
        return statusData;
      }
    }

    // If not found, check for English period equivalents (for backward compatibility)
    const englishPeriodMap = {
      Sáng: "morning",
      Trưa: "noon",
      Chiều: "afternoon",
      Tối: "evening",
    };

    const englishPeriod = englishPeriodMap[period];
    if (englishPeriod && periodStatuses[englishPeriod]) {
      const statusData = Array.isArray(periodStatuses[englishPeriod])
        ? periodStatuses[englishPeriod][
            periodStatuses[englishPeriod].length - 1
          ]
        : periodStatuses[englishPeriod];

      if (typeof statusData === "object" && statusData.Status) {
        return statusData.Status;
      }
      if (typeof statusData === "string") {
        return statusData;
      }
    }
  }

  return PERIOD_STATUSES.PENDING;
};

// Get period status label for display
export const getPeriodStatusLabel = (status) => {
  const statusLabels = {
    [PERIOD_STATUSES.PENDING]: "Chờ xử lý",
    [PERIOD_STATUSES.VERIFIED]: "Đã xác thực",
    [PERIOD_STATUSES.REFUSED]: "Đã từ chối",
    [PERIOD_STATUSES.COMPLETED]: "Hoàn thành",
    [PERIOD_STATUSES.FAILED]: "Thất bại",
    [PERIOD_STATUSES.ASSIGNED]: "Đã phân công",
    [PERIOD_STATUSES.REDO]: "Làm lại",
  };

  return statusLabels[status] || status || "Không xác định";
};

// Get CSS class for period status
export const getStatusClass = (status) => {
  const statusClasses = {
    [PERIOD_STATUSES.PENDING]: "status-pending",
    [PERIOD_STATUSES.VERIFIED]: "status-verified",
    [PERIOD_STATUSES.REFUSED]: "status-refused",
    [PERIOD_STATUSES.COMPLETED]: "status-completed",
    [PERIOD_STATUSES.FAILED]: "status-failed",
    [PERIOD_STATUSES.ASSIGNED]: "status-assigned",
    [PERIOD_STATUSES.REDO]: "status-redo",
  };

  return statusClasses[status] || "status-unknown";
};

// Classify overall request status
export const classifyOverallStatus = (periodStatuses) => {
  const hasPending = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.PENDING
  );
  const hasVerified = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.VERIFIED
  );
  const hasRefused = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.REFUSED
  );
  const hasCompleted = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.COMPLETED
  );

  // If there are refused periods
  if (hasRefused) {
    if (hasPending || hasVerified || hasCompleted) {
      return "partially_refused";
    } else {
      return "fully_refused";
    }
  }

  // If there are verified/completed periods but no refused periods
  if (hasVerified || hasCompleted) {
    if (hasPending) {
      return "partially_verified"; // New status for mixed verified/pending
    } else {
      return "verified";
    }
  }

  // If only pending periods
  if (hasPending) {
    return "pending";
  }

  return "mixed";
};

// Get request status with detailed information
export const getRequestStatus = (request) => {
  const periods = getAllPeriodsFromRequest(request);
  const periodStatuses = periods.map((period) =>
    getPeriodStatus(request, period)
  );

  const hasPending = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.PENDING
  );
  const hasVerified = periodStatuses.some(
    (status) =>
      status === PERIOD_STATUSES.VERIFIED ||
      status === PERIOD_STATUSES.COMPLETED
  );
  const hasRefused = periodStatuses.some(
    (status) => status === PERIOD_STATUSES.REFUSED
  );

  const overallStatus = classifyOverallStatus(periodStatuses);

  return {
    overall: overallStatus,
    periods: periods.map((period) => ({
      period,
      status: getPeriodStatus(request, period),
      label: getPeriodStatusLabel(getPeriodStatus(request, period)),
    })),
    hasPending,
    hasVerified,
    hasRefused,
    isPartiallyProcessed: (hasVerified || hasRefused) && hasPending,
    isFullyProcessed: !hasPending,
    isPartiallyVerified: overallStatus === "partially_verified",
  };
};

// Get available actions for a request
export const getAvailableActions = (request) => {
  const status = getRequestStatus(request);

  return {
    canVerify: status.hasPending,
    canRefuse: status.hasPending,
    canEdit: status.hasPending,
    showInPending: status.hasPending,
    showInVerified: status.hasVerified && !status.hasRefused, // Show any request with verified periods (regardless of pending status)
    showInRefused: status.hasRefused, // Show any request with refused periods
  };
};

// Get unprocessed periods for a request
export const getUnprocessedPeriods = (request) => {
  const periods = getAllPeriodsFromRequest(request);
  return periods
    .filter((period) => {
      const status = getPeriodStatus(request, period);
      return status === PERIOD_STATUSES.PENDING;
    })
    .map((period) => ({
      value: period,
      label: period,
    }));
};

// Get processed periods for a request
export const getProcessedPeriods = (request) => {
  const periods = getAllPeriodsFromRequest(request);
  return periods
    .filter((period) => {
      const status = getPeriodStatus(request, period);
      return status !== PERIOD_STATUSES.PENDING;
    })
    .map((period) => ({
      period,
      status: getPeriodStatus(request, period),
      label: getPeriodStatusLabel(getPeriodStatus(request, period)),
    }));
};

// Check if request is partially refused
export const isPartiallyRefused = (request) => {
  const status = getRequestStatus(request);
  // Partially refused means: has refused periods AND (has verified periods OR has pending periods)
  return status.hasRefused && (status.hasVerified || status.hasPending);
};

// Check if request is fully refused
export const isFullyRefused = (request) => {
  const status = getRequestStatus(request);
  // Fully refused means: has refused periods AND no verified periods AND no pending periods
  return status.hasRefused && !status.hasVerified && !status.hasPending;
};

// Check if request is partially verified (has both verified and pending periods)
export const isPartiallyVerified = (request) => {
  const status = getRequestStatus(request);
  // Partially verified means: has verified periods AND has pending periods AND no refused periods
  return status.hasVerified && status.hasPending && !status.hasRefused;
};

// Get period-specific refusal reason
export const getPeriodRefusalReason = (request, period) => {
  try {
    if (!request || !request.medicineRequestItems) return null;

    // Check all items for this period
    for (const item of request.medicineRequestItems) {
      if (!item) continue;

      const periodStatuses = parsePeriodStatus(item.periodVerificationStatus);

      // First, check for exact period match (Vietnamese)
      if (periodStatuses[period]) {
        const statusData = Array.isArray(periodStatuses[period])
          ? periodStatuses[period][periodStatuses[period].length - 1]
          : periodStatuses[period];

        // Check if this period was refused
        if (
          typeof statusData === "object" &&
          statusData.Status === PERIOD_STATUSES.REFUSED
        ) {
          return {
            reason: statusData.RefusalReason || "Không có lý do cụ thể",
            staffId: statusData.StaffId,
            timestamp: statusData.Timestamp,
            medicineName: item.medicineName || "Không xác định",
          };
        }
      }

      // If not found, check for English period equivalents (for backward compatibility)
      const englishPeriodMap = {
        Sáng: "morning",
        Trưa: "noon",
        Chiều: "afternoon",
        Tối: "evening",
      };

      const englishPeriod = englishPeriodMap[period];
      if (englishPeriod && periodStatuses[englishPeriod]) {
        const statusData = Array.isArray(periodStatuses[englishPeriod])
          ? periodStatuses[englishPeriod][
              periodStatuses[englishPeriod].length - 1
            ]
          : periodStatuses[englishPeriod];

        // Check if this period was refused
        if (
          typeof statusData === "object" &&
          statusData.Status === PERIOD_STATUSES.REFUSED
        ) {
          return {
            reason: statusData.RefusalReason || "Không có lý do cụ thể",
            staffId: statusData.StaffId,
            timestamp: statusData.Timestamp,
            medicineName: item.medicineName || "Không xác định",
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting period refusal reason:", error);
    return null;
  }
};

// Get all refused periods with their reasons
export const getRefusedPeriodsWithReasons = (request) => {
  try {
    if (!request || !request.medicineRequestItems) return [];

    const refusedPeriods = [];
    const allPeriods = getAllPeriodsFromRequest(request);

    allPeriods.forEach((period) => {
      const refusalInfo = getPeriodRefusalReason(request, period);
      if (refusalInfo) {
        refusedPeriods.push({
          period,
          ...refusalInfo,
        });
      }
    });

    return refusedPeriods;
  } catch (error) {
    console.error("Error getting refused periods with reasons:", error);
    return [];
  }
};

// Deduplicate requests by requestId to prevent same request appearing multiple times
export const deduplicateRequests = (requests) => {
  if (!requests || !Array.isArray(requests)) {
    return [];
  }

  const seenIds = new Set();
  return requests.filter((request) => {
    if (!request || !request.requestId) return false;
    if (seenIds.has(request.requestId)) return false;
    seenIds.add(request.requestId);
    return true;
  });
};

// Debug function to analyze request status
export const debugRequestStatus = (request) => {
  if (!request) return null;

  const periods = getAllPeriodsFromRequest(request);
  const periodStatuses = periods.map((period) => ({
    period,
    status: getPeriodStatus(request, period),
    rawData: request.medicineRequestItems?.map((item) => ({
      medicineName: item.medicineName,
      periodVerificationStatus: item.periodVerificationStatus,
    })),
  }));

  const status = getRequestStatus(request);
  const isPartially = isPartiallyRefused(request);
  const isFully = isFullyRefused(request);
  const isPartiallyVerifiedStatus = isPartiallyVerified(request);

  return {
    requestId: request.requestId,
    periods,
    periodStatuses,
    overallStatus: status,
    isPartiallyRefused: isPartially,
    isFullyRefused: isFully,
    isPartiallyVerified: isPartiallyVerifiedStatus,
    hasPending: status.hasPending,
    hasVerified: status.hasVerified,
    hasRefused: status.hasRefused,
  };
};

// Filter requests by status type
export const filterRequestsByStatus = (requests, statusType) => {
  try {
    if (!requests || !Array.isArray(requests)) {
      return [];
    }

    return requests.filter((request) => {
      if (!request) return false;

      try {
        const actions = getAvailableActions(request);
        const status = getRequestStatus(request);

        switch (statusType) {
          case "pending":
            return actions.showInPending;
          case "verified":
            return actions.showInVerified;
          case "refused":
            return actions.showInRefused;
          case "partially_refused":
            return isPartiallyRefused(request);
          case "fully_refused":
            return isFullyRefused(request);
          case "partially_verified":
            return isPartiallyVerified(request);
          default:
            return true;
        }
      } catch (error) {
        console.error("Error processing request in filter:", error, request);
        return false;
      }
    });
  } catch (error) {
    console.error("Error in filterRequestsByStatus:", error);
    return [];
  }
};

// Check if a period is already processed (Assigned or Completed)
// Note: Verified status means the medicine is verified but not yet assigned for administration
export const isPeriodProcessed = (request, period) => {
  const status = getPeriodStatus(request, period);
  return (
    status === PERIOD_STATUSES.ASSIGNED || status === PERIOD_STATUSES.COMPLETED
  );
};

// Get available periods for medication administration (only periods that can be assigned)
// This includes Pending and Verified periods, but excludes Assigned and Completed
export const getAvailablePeriodsForAdministration = (request) => {
  const allPeriods = getAllPeriodsFromRequest(request);

  return allPeriods
    .filter((period) => {
      const status = getPeriodStatus(request, period);
      // Allow Pending and Verified periods for administration assignment
      return (
        status === PERIOD_STATUSES.PENDING ||
        status === PERIOD_STATUSES.VERIFIED
      );
    })
    .map((period) => ({
      value: period,
      label: period,
      status: getPeriodStatus(request, period),
      statusLabel: getPeriodStatusLabel(getPeriodStatus(request, period)),
    }));
};

// Get processed periods for a request (for display purposes)
// This includes only Assigned and Completed periods
export const getProcessedPeriodsForDisplay = (request) => {
  const allPeriods = getAllPeriodsFromRequest(request);

  return allPeriods
    .filter((period) => {
      const status = getPeriodStatus(request, period);
      return (
        status === PERIOD_STATUSES.ASSIGNED ||
        status === PERIOD_STATUSES.COMPLETED
      );
    })
    .map((period) => ({
      period,
      status: getPeriodStatus(request, period),
      label: getPeriodStatusLabel(getPeriodStatus(request, period)),
      class: getStatusClass(getPeriodStatus(request, period)),
    }));
};

// Check if a request has any periods available for administration assignment
export const hasUnprocessedPeriods = (request) => {
  const availablePeriods = getAvailablePeriodsForAdministration(request);
  return availablePeriods.length > 0;
};

// Get period status summary for a request
export const getPeriodStatusSummary = (request) => {
  const allPeriods = getAllPeriodsFromRequest(request);
  const processedPeriods = getProcessedPeriodsForDisplay(request);
  const availablePeriods = getAvailablePeriodsForAdministration(request);

  return {
    total: allPeriods.length,
    processed: processedPeriods.length,
    available: availablePeriods.length,
    processedPeriods,
    availablePeriods,
  };
};

// Debug function to test period processing logic
export const debugPeriodProcessing = (request) => {
  if (!request) return null;

  const allPeriods = getAllPeriodsFromRequest(request);
  const processedPeriods = getProcessedPeriodsForDisplay(request);
  const availablePeriods = getAvailablePeriodsForAdministration(request);

  return {
    requestId: request.requestId,
    studentName: request.student
      ? `${request.student.firstName} ${request.student.lastName}`
      : "Unknown",
    allPeriods,
    processedPeriods,
    availablePeriods,
    hasUnprocessedPeriods: hasUnprocessedPeriods(request),
    summary: {
      total: allPeriods.length,
      processed: processedPeriods.length,
      available: availablePeriods.length,
    },
    periodDetails: allPeriods.map((period) => ({
      period,
      status: getPeriodStatus(request, period),
      isProcessed: isPeriodProcessed(request, period),
      statusLabel: getPeriodStatusLabel(getPeriodStatus(request, period)),
    })),
  };
};

// Detailed debug function to understand period processing issue
export const debugPeriodProcessingDetailed = (request) => {
  if (!request) return null;

  const allPeriods = getAllPeriodsFromRequest(request);
  const periodDetails = allPeriods.map((period) => {
    const status = getPeriodStatus(request, period);
    const isProcessed = isPeriodProcessed(request, period);

    // Get raw data for debugging
    const rawData = request.medicineRequestItems?.map((item) => ({
      medicineRequestItemId: item.medicineRequestItemId,
      medicineName: item.medicineName,
      periodVerificationStatus: item.periodVerificationStatus,
      parsedStatus: parsePeriodStatus(item.periodVerificationStatus),
    }));

    return {
      period,
      status,
      isProcessed,
      statusLabel: getPeriodStatusLabel(status),
      rawData,
    };
  });

  return {
    requestId: request.requestId,
    studentName: request.student
      ? `${request.student.firstName} ${request.student.lastName}`
      : "Unknown",
    requestStatus: request.status,
    allPeriods,
    periodDetails,
    hasUnprocessedPeriods: hasUnprocessedPeriods(request),
    availablePeriods: getAvailablePeriodsForAdministration(request),
    processedPeriods: getProcessedPeriodsForDisplay(request),
    summary: {
      total: allPeriods.length,
      processed: getProcessedPeriodsForDisplay(request).length,
      available: getAvailablePeriodsForAdministration(request).length,
    },
  };
};

// Test function to verify the new logic with sample data
export const testWithSampleData = () => {
  const sampleRequest = {
    requestId: 2108,
    status: "Pending",
    student: {
      firstName: "Hùng",
      lastName: "Vương",
    },
    medicineRequestItems: [
      {
        medicineRequestItemId: 2142,
        medicineName: "Oresol",
        periodVerificationStatus: {
          Chiều: {
            Status: "Verified",
            StaffId: 11,
            Timestamp: "2025-07-30T00:23:01.1339319Z",
          },
        },
      },
    ],
  };

  console.log("=== Testing with sample data ===");
  console.log("Sample request:", sampleRequest);

  const debug = debugPeriodProcessingDetailed(sampleRequest);
  console.log("Debug result:", debug);

  console.log("=== Key results ===");
  console.log("Has unprocessed periods:", hasUnprocessedPeriods(sampleRequest));
  console.log(
    "Available periods:",
    getAvailablePeriodsForAdministration(sampleRequest)
  );
  console.log(
    "Processed periods:",
    getProcessedPeriodsForDisplay(sampleRequest)
  );

  return debug;
};
