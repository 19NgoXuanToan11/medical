// Transform parent medication API data to component structure
export const transformParentMedicationData = (requests) => {
  return requests.map((req) => {
    const medicineItems = req.medicineRequestItems || [];
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

    return {
      id: `MED${req.requestId}`,
      requestId: req.requestId,
      studentName: req.studentCode, // Using studentCode as studentName for now
      studentCode: req.studentCode,
      class: req.className,
      medicationName: firstMedicine.medicineName || "N/A",
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
      lastAdministered: lastAdministered,
      completedDoses: completedDoses,
      totalDoses: totalDoses,
      progressPercentage: progressPercentage,
      progress: progress,
      medicineRequestItems: medicineItems,
      parentId: req.parentId,
      staffId: req.staffId,
      // Raw API data for reference
      originalData: req,
    };
  });
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
    }
  });

  return stats;
};

// Filter medications by status and search term
export const filterMedications = (medications, filterStatus, searchTerm) => {
  return medications.filter((med) => {
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    const matchesSearch =
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.studentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });
};
