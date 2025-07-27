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
        case "pending":
          return "pending";
        case "assigned":
          return "active";
        case "completed":
        case "done":
          return "completed";
        case "failed":
        case "rejected":
        case "refused":
          return "rejected";
        default:
          return "pending";
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
        : `MED${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: req.requestId || null,
      studentName:
        req.student?.firstName && req.student?.lastName
          ? `${req.student.firstName} ${req.student.lastName}`
          : req.studentName || req.studentCode, // Use student name from nested object or fallback
      studentCode: req.studentCode,
      class: req.className,
      medicationName: firstMedicine.medicineName || "N/A", // Keep for backward compatibility
      medicationNames: allMedicationNames, // Array of all medication names
      medicationDisplay: medicationDisplay, // For easy display in components
      medicationCount: medicineItems.length, // Number of medications in this request
      requestDate: req.requestDate
        ? new Date(req.requestDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate: req.date || new Date().toISOString().split("T")[0],
      endDate: req.date || new Date().toISOString().split("T")[0], // Using same date as start for now
      status: getUIStatus(req.status),
      dosage: firstMedicine.dosage || "N/A",
      dosageUnit: firstMedicine.dosageUnit || "viên",
      frequency: firstMedicine.frequency || "N/A",
      timeOfDay: firstMedicine.timeOfDay || "N/A",
      instructions: firstMedicine.instructions || "N/A",
      refusalReason: req.refusalReason || null, // Add refusal reason for rejected requests
      lastAdministered: lastAdministered,
      completedDoses: completedDoses,
      totalDoses: totalDoses,
      progressPercentage: progressPercentage,
      progress: progress,
      medicineRequestItems: medicineItems, // Keep for backward compatibility
      medicineItems: medicineItems, // Use correct field name from API
      parentId: req.parentId,
      staffId: req.staffId,
      staffName:
        req.staff?.firstName && req.staff?.lastName
          ? `${req.staff.firstName} ${req.staff.lastName}`
          : "N/A", // Add staff name for who processed the request
      // Raw API data for reference
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
  switch (status) {
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
    case "pending":
      return {
        className:
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-1 ring-yellow-600/20 dark:ring-yellow-400/20",
        text: "Chờ xác nhận",
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

// Calculate medication statistics for dashboard
export const calculateMedicationStats = (medications) => {
  const stats = {
    pending: 0,
    active: 0,
    completed: 0,
    rejected: 0,
    failed: 0,
    total: medications.length,
  };

  medications.forEach((med) => {
    switch (med.status) {
      case "pending":
        stats.pending++;
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
    const request = result.request || {};
    const student = request.student || {};
    const medicineItems =
      request.medicineItems || request.medicineRequestItems || [];
    const firstMedicine = medicineItems[0] || {};

    // Get all medication names for display
    const allMedicationNames = medicineItems
      .map((item) => item.medicineName)
      .filter((name) => name);
    const medicationDisplay =
      allMedicationNames.length > 0 ? allMedicationNames : ["N/A"];

    // Get failed frequencies and reasons
    const failedFrequencies = result.failedFrequencies || [];
    const failureReasons = result.failureReasons || {};
    const failedReasonsDisplay =
      Object.values(failureReasons).join("; ") || "Không có lý do cụ thể";

    return {
      id: request.requestId
        ? `MED${request.requestId}`
        : `MED${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requestId: request.requestId || null,
      resultId: result.resultId,
      studentName:
        student.firstName && student.lastName
          ? `${student.firstName} ${student.lastName}`
          : request.studentCode,
      studentCode: request.studentCode,
      class: request.className || student.className,
      medicationName: firstMedicine.medicineName || "N/A",
      medicationNames: allMedicationNames,
      medicationDisplay: medicationDisplay,
      medicationCount: medicineItems.length,
      requestDate: request.requestDate
        ? new Date(request.requestDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      startDate: request.date || new Date().toISOString().split("T")[0],
      administeredTime: result.administeredTime
        ? new Date(result.administeredTime).toLocaleString("vi-VN")
        : null,
      submittedAt: result.submittedAt
        ? new Date(result.submittedAt).toLocaleString("vi-VN")
        : null,
      lastAttemptTime: result.lastAttemptTime
        ? new Date(result.lastAttemptTime).toLocaleString("vi-VN")
        : null,
      status: "failed",
      frequency: result.frequency || firstMedicine.frequency || "N/A",
      timesPerDay: result.timesPerDay || 0,
      currentDayCount: result.currentDayCount || 0,
      failedAttempts: result.failedAttempts || 0,
      failedFrequencies: failedFrequencies,
      failureReasons: failedReasonsDisplay,
      reRequestReason: result.reRequestReason || null,
      isReRequest: result.isReRequest || false,
      originalRequestResultId: result.originalRequestResultId || null,
      // Staff information
      administeredByStaff: result.administeredByStaff || null,
      actionByStaff: result.actionByStaff || null,
      staffName: result.actionByStaff
        ? `${result.actionByStaff.firstName || ""} ${
            result.actionByStaff.lastName || ""
          }`.trim()
        : "N/A",
      // Keep all original data for reference
      originalData: result,
    };
  });
};

// Filter medications by status and search term
export const filterMedications = (medications, filterStatus, searchTerm) => {
  return medications.filter((med) => {
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    const matchesSearch =
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.id && med.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};
