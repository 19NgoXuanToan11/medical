// Transform parent medication API data to component structure
export const transformParentMedicationData = (requests) => {
  return requests.map((req) => {
    const medicineItems = req.medicineItems || [];
    const firstMedicine = medicineItems[0] || {};
    const progress = req.progress || [];

    // Calculate progress statistics
    const totalDoses = progress.reduce(
      (sum, p) => sum + (p.timesPerDay || 0),
      0
    );
    const completedDoses = progress.reduce(
      (sum, p) => sum + (p.currentDayCount || 0),
      0
    );
    const progressPercentage =
      totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;

    // Map status from API to UI
    const getUIStatus = (apiStatus) => {
      switch (apiStatus?.toLowerCase()) {
        case "assigned":
          return "active";
        case "completed":
        case "done":
          return "completed";
        case "failed":
        case "rejected":
        case "refused":
          return "rejected";
        case "verified":
        case "confirmed":
          return "confirmed";
        default:
          return "confirmed";
      }
    };

    // Get the latest progress entry for last administered time
    const latestProgress =
      progress.length > 0 ? progress[progress.length - 1] : null;
    const lastAdministered = latestProgress?.administeredTime
      ? new Date(latestProgress.administeredTime).toLocaleString("vi-VN")
      : null;

    // Get all medication names for display
    const allMedicationNames = medicineItems
      .map((item) => item.medicineName)
      .filter((name) => name);
    const medicationDisplay =
      allMedicationNames.length > 0 ? allMedicationNames : ["N/A"];

    return {
      id: req.requestId
        ? `MED${req.requestId}`
        : req.medicineRequestItemId
        ? `MED${req.medicineRequestItemId}`
        : `MED${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: req.requestId || req.medicineRequestItemId || null,
      studentName:
        req.student?.firstName && req.student?.lastName
          ? `${req.student.firstName} ${req.student.lastName}`
          : req.studentName || req.studentCode, // Use student name from nested object or fallback
      studentCode: req.studentCode,
      class: req.className,
      medicationName: req.medicineName || firstMedicine.medicineName || "N/A", // Keep for backward compatibility
      medicationNames: req.medicineName
        ? [req.medicineName]
        : allMedicationNames, // Array of all medication names
      medicationDisplay: req.medicineName
        ? [req.medicineName]
        : medicationDisplay, // For easy display in components
      medicationCount: req.medicineName ? 1 : medicineItems.length, // Number of medications in this request
      requestDate: req.requestDate
        ? new Date(req.requestDate).toISOString().split("T")[0]
        : req.timestamp
        ? new Date(req.timestamp).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate:
        req.date || req.timestamp || new Date().toISOString().split("T")[0],
      endDate:
        req.date || req.timestamp || new Date().toISOString().split("T")[0], // Using same date as start for now
      status: getUIStatus(req.status),
      dosage: req.dosage || firstMedicine.dosage || "N/A",
      dosageUnit: req.dosageUnit || firstMedicine.dosageUnit || "viên",
      frequency: req.frequency || firstMedicine.frequency || "N/A",
      timeOfDay: req.timeOfDay || firstMedicine.timeOfDay || "N/A",
      instructions: req.instructions || firstMedicine.instructions || "N/A",
      period: req.period || "N/A", // Add period field
      timestamp: req.timestamp || null, // Add timestamp field
      refusalReason: req.refusalReason || null, // Add refusal reason for rejected requests
      lastAdministered: lastAdministered,
      completedDoses: completedDoses,
      totalDoses: totalDoses,
      progressPercentage: progressPercentage,
      progress: progress,
      medicineRequestItems: medicineItems, // Keep for backward compatibility
      medicineItems: medicineItems, // Use correct field name from API
      parentId: req.parentId,
      parentName: req.parentName || "N/A", // Add parent name
      staffId: req.staffId,
      staffName:
        req.staff?.firstName && req.staff?.lastName
          ? `${req.staff.firstName} ${req.staff.lastName}`
          : "N/A", // Add staff name for who processed the request
      // Raw API data for reference - preserve all original fields
      originalData: req,
    };
  });
};

// Transform rejected medication API data to component structure
export const transformRejectedMedicationData = (requests) => {
  const result = requests.map((req) => {
    return {
      id: req.medicineRequestItemId
        ? `MED${req.medicineRequestItemId}`
        : `MED${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: req.medicineRequestItemId || null,
      medicineRequestItemId: req.medicineRequestItemId,
      studentName: req.studentName || "N/A",
      studentCode: req.studentCode || "N/A",
      className: req.className || "N/A",
      class: req.className || "N/A", // For backward compatibility
      parentId: req.parentId,
      parentName: req.parentName || "N/A",
      medicineName: req.medicineName || "N/A",
      medicationName: req.medicineName || "N/A", // For backward compatibility
      dosage: req.dosage || null,
      dosageUnit: req.dosageUnit || "viên",
      frequency: req.frequency || null,
      timeOfDay: req.timeOfDay || null,
      instructions: req.instructions || null,
      period: req.period || "N/A",
      status: "Refused",
      staffId: req.staffId,
      timestamp: req.timestamp,
      refusalReason: req.refusalReason || "Không có lý do",
      requestDate: req.timestamp
        ? new Date(req.timestamp).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate: req.timestamp
        ? new Date(req.timestamp).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      // Raw API data for reference
      originalData: req,
    };
  });
  return result;
};

// Get status badge configuration
export const getStatusBadge = (status) => {
  // Normalize status to lowercase for comparison
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case "active":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/20 dark:ring-blue-400/20",
        text: "Đang thực hiện",
      };
    case "completed":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-1 ring-green-600/20 dark:ring-green-400/20",
        text: "Đã hoàn thành",
      };
    case "confirmed":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ring-1 ring-purple-600/20 dark:ring-purple-400/20",
        text: "Đã xác nhận",
      };
    case "rejected":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-1 ring-red-600/20 dark:ring-red-400/20",
        text: "Từ chối",
      };
    case "failed":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 ring-1 ring-orange-600/20 dark:ring-orange-400/20",
        text: "Thất bại",
      };
    default:
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 ring-1 ring-gray-600/20 dark:ring-gray-400/20",
        text: "Không xác định",
      };
  }
};

// Helper function to normalize verifiedStatus keys
export const normalizeVerifiedStatus = (verifiedStatus) => {
  if (!verifiedStatus || typeof verifiedStatus !== "object") {
    return {};
  }

  const normalized = {};

  // Helper function to capitalize first letter
  const capitalizeFirst = (str) => {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Process each key-value pair
  Object.entries(verifiedStatus).forEach(([key, value]) => {
    const normalizedKey = capitalizeFirst(key);

    // If key already exists, prioritize the object/array version over string version
    if (normalizedKey in normalized) {
      // If current value is an array and existing value is a string, keep the array
      if (
        Array.isArray(value) &&
        typeof normalized[normalizedKey] === "string"
      ) {
        normalized[normalizedKey] = value;
      }
      // If current value is an object and existing value is a string, keep the object
      else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof normalized[normalizedKey] === "string"
      ) {
        normalized[normalizedKey] = value;
      }
      // If both are objects (not arrays), merge them (object takes precedence)
      else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof normalized[normalizedKey] === "object" &&
        !Array.isArray(normalized[normalizedKey])
      ) {
        normalized[normalizedKey] = { ...normalized[normalizedKey], ...value };
      }
      // If both are arrays, keep the current one (more recent)
      else if (
        Array.isArray(value) &&
        Array.isArray(normalized[normalizedKey])
      ) {
        normalized[normalizedKey] = value;
      }
      // If both are strings, keep the one that's not "Pending"
      else if (
        typeof value === "string" &&
        typeof normalized[normalizedKey] === "string"
      ) {
        if (value !== "Pending" && normalized[normalizedKey] === "Pending") {
          normalized[normalizedKey] = value;
        }
      }
    } else {
      normalized[normalizedKey] = value;
    }
  });

  return normalized;
};

// Helper function to determine medication status based on verifiedStatus
export const getMedicationStatusFromVerifiedStatus = (medicineItems) => {
  if (!medicineItems || medicineItems.length === 0) {
    return "confirmed";
  }

  let hasConfirmed = false;
  let hasActive = false;
  let hasCompleted = false;
  let hasRejected = false;
  let hasFailed = false;

  medicineItems.forEach((item) => {
    // Normalize the verifiedStatus to remove duplicates and standardize keys
    const normalizedVerifiedStatus = normalizeVerifiedStatus(
      item.verifiedStatus || {}
    );

    // Check each time period in normalized verifiedStatus
    Object.values(normalizedVerifiedStatus).forEach((status) => {
      let statusStr = "";

      // Handle different status formats
      if (typeof status === "string") {
        statusStr = status.toLowerCase();
      } else if (Array.isArray(status)) {
        // Handle array format like [{ Status: "Assigned", StaffId: 11, Timestamp: "..." }]
        if (status.length > 0) {
          const firstItem = status[0];
          if (typeof firstItem === "object" && firstItem !== null) {
            if (firstItem.Status) {
              statusStr = firstItem.Status.toLowerCase();
            } else if (firstItem.status) {
              statusStr = firstItem.status.toLowerCase();
            }
          }
        }
      } else if (typeof status === "object" && status !== null) {
        // Handle object format like { Status: "Verified", StaffId: 11, Timestamp: "..." }
        if (status.Status) {
          statusStr = status.Status.toLowerCase();
        } else if (status.status) {
          statusStr = status.status.toLowerCase();
        } else {
          // If no Status property, try to convert to string
          statusStr = String(status).toLowerCase();
        }
      } else {
        statusStr = String(status).toLowerCase();
      }

      switch (statusStr) {
        case "verified":
        case "confirmed":
          hasConfirmed = true;
          break;
        case "assigned":
        case "in_progress":
        case "administering":
          hasActive = true;
          break;
        case "completed":
        case "done":
          hasCompleted = true;
          break;
        case "rejected":
        case "refused":
          hasRejected = true;
          break;
        case "failed":
          hasFailed = true;
          break;
      }
    });
  });

  // Priority order: failed > rejected > completed > active > confirmed
  if (hasFailed) return "failed";
  if (hasRejected) return "rejected";
  if (hasCompleted) return "completed";
  if (hasActive) return "active";
  if (hasConfirmed) return "confirmed";

  return "confirmed"; // Default fallback
};

// Calculate medication statistics for dashboard based on verifiedStatus
export const calculateMedicationStats = (medications) => {
  const stats = {
    confirmed: 0,
    active: 0,
    completed: 0,
    rejected: 0,
    failed: 0,
    total: medications.length,
  };

  medications.forEach((med) => {
    // Use verifiedStatus-based status instead of overall request status
    const status = getMedicationStatusFromVerifiedStatus(med.medicineItems);

    switch (status) {
      case "confirmed":
        stats.confirmed++;
        break;
      case "active":
        stats.active++;
        break;
      case "completed":
        stats.completed++;
        break;
      case "rejected":
        stats.rejected++;
        break;
      case "failed":
        stats.failed++;
        break;
    }
  });

  return stats;
};

// Transform failed medication request data
export const transformFailedMedicationData = (failedResults) => {
  return failedResults.map((result) => {
    // The API now returns a flat structure with all fields directly available
    return {
      id: result.medicineRequestItemId
        ? `MED${result.medicineRequestItemId}`
        : `MED${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: result.medicineRequestItemId || null,
      medicineRequestItemId: result.medicineRequestItemId,
      studentName: result.studentName,
      studentCode: result.studentCode,
      class: result.className,
      className: result.className,
      parentId: result.parentId,
      parentName: result.parentName,
      medicationName: result.medicineName || "N/A",
      medicineName: result.medicineName,
      medicationNames: [result.medicineName].filter((name) => name),
      medicationDisplay: [result.medicineName].filter((name) => name),
      medicationCount: 1,
      dosage: result.dosage,
      dosageUnit: result.dosageUnit,
      frequency: result.frequency,
      timeOfDay: result.timeOfDay,
      period: result.period,
      instructions: result.instructions,
      status: result.status || "Failed",
      staffId: result.staffId,
      staffName: "N/A", // This would need to be looked up separately if needed
      timestamp: result.timestamp,
      failureReason: result.failureReason,
      notes: result.notes,
      requestDate: result.timestamp
        ? new Date(result.timestamp).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate: result.timestamp
        ? new Date(result.timestamp).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      administeredTime: null,
      submittedAt: result.timestamp
        ? new Date(result.timestamp).toLocaleString("vi-VN")
        : null,
      lastAttemptTime: result.timestamp
        ? new Date(result.timestamp).toLocaleString("vi-VN")
        : null,
      timesPerDay: 0,
      currentDayCount: 0,
      failedAttempts: 1, // Assuming each record represents one failed attempt
      failedFrequencies: [],
      failureReasons: result.failureReason || "Không có lý do cụ thể",
      reRequestReason: null,
      isReRequest: false,
      originalRequestResultId: null,
      // Staff information
      administeredByStaff: null,
      actionByStaff: null,
      // Keep all original data for reference
      originalData: result,
    };
  });
};

// Filter medications by status and search term using verifiedStatus
export const filterMedications = (medications, filterStatus, searchTerm) => {
  return medications.filter((med) => {
    // Use verifiedStatus-based status instead of overall request status
    const medicationStatus = getMedicationStatusFromVerifiedStatus(
      med.medicineItems
    );
    const matchesStatus =
      filterStatus === "all" || medicationStatus === filterStatus;

    const matchesSearch =
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.id && med.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};
