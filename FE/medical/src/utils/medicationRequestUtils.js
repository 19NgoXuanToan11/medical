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
  morning: "Sáng",
  noon: "Trưa",
  afternoon: "Chiều",
  evening: "Tối",
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

    if (periodStatuses[period]) {
      const statusData = Array.isArray(periodStatuses[period])
        ? periodStatuses[period][periodStatuses[period].length - 1]
        : periodStatuses[period];

      return statusData?.Status || PERIOD_STATUSES.PENDING;
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

  if (hasPending) {
    return "pending";
  } else if (hasRefused && !hasPending) {
    return hasVerified || hasCompleted ? "partially_refused" : "fully_refused";
  } else if ((hasVerified || hasCompleted) && !hasPending && !hasRefused) {
    return "verified";
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

  return {
    overall: classifyOverallStatus(periodStatuses),
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
    showInVerified:
      status.isFullyProcessed && status.hasVerified && !status.hasRefused,
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
