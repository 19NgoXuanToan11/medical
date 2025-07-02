// Transform Request Result API data to component structure
export const transformRequestResultData = (requestResults) => {
  return requestResults.map((result) => {
    const request = result.request || {};
    const student = request.student || {};
    const parent = request.parent || {};
    const administeredByStaff = result.administeredByStaff || {};
    const actionByStaff = result.actionByStaff || {};
    const medicineItems = request.medicineRequestItems || [];
    const firstMedicine = medicineItems[0] || {};

    return {
      // Result Information
      resultId: result.resultId,
      requestId: result.requestId,
      administeredTime: result.administeredTime,
      status: result.status || "pending",
      submittedAt: result.submittedAt,

      // Frequency and Administration Details
      frequency: result.frequency || firstMedicine.frequency,
      timesPerDay: result.timesPerDay || 0,
      currentDayCount: result.currentDayCount || 0,
      currentDate: result.currentDate,
      administeredFrequencies: result.administeredFrequencies,
      failedFrequencies: result.failedFrequencies,
      failureReasons: result.failureReasons,

      // Re-request Information
      isReRequest: result.isReRequest || false,
      originalRequestResultId: result.originalRequestResultId,
      lastAttemptTime: result.lastAttemptTime,
      failedAttempts: result.failedAttempts || 0,
      reRequestReason: result.reRequestReason,

      // Student Information
      studentId: student.studentId,
      studentCode: student.studentCode,
      studentName:
        student.firstName && student.lastName
          ? `${student.firstName} ${student.lastName}`
          : "N/A",
      className: student.className,
      gradeLevel: student.gradeLevel,
      studentGender: student.gender,
      studentDateOfBirth: student.dateOfBirth,
      studentAddress: student.address,

      // Parent Information
      parentId: parent.parentId,
      parentName:
        parent.firstName && parent.lastName
          ? `${parent.firstName} ${parent.lastName}`
          : "N/A",
      parentPhone: parent.phone,
      parentEmail: parent.email,
      parentRelationship: parent.relationship,
      isEmergencyContact: parent.isEmergencyContact,
      isMainContact: parent.isMainContact,

      // Medicine Information
      medicineName: firstMedicine.medicineName || "N/A",
      dosage: firstMedicine.dosage || "N/A",
      medicineFrequency: firstMedicine.frequency || "N/A",
      timeOfDay: firstMedicine.timeOfDay || "N/A",
      instructions: firstMedicine.instructions || "N/A",
      medicineRequestItems: medicineItems,

      // Staff Information (who administered)
      administeredByStaffId: administeredByStaff.staffId,
      administeredByStaffName:
        administeredByStaff.firstName && administeredByStaff.lastName
          ? `${administeredByStaff.firstName} ${administeredByStaff.lastName}`
          : "N/A",
      administeredByStaffEmail: administeredByStaff.email,
      administeredByStaffRole: administeredByStaff.roleName,

      // Staff Information (who took action)
      actionByStaffId: actionByStaff.staffId,
      actionByStaffName:
        actionByStaff.firstName && actionByStaff.lastName
          ? `${actionByStaff.firstName} ${actionByStaff.lastName}`
          : "N/A",
      actionByStaffEmail: actionByStaff.email,
      actionByStaffRole: actionByStaff.roleName,

      // Request Details
      requestDate: request.requestDate,
      requestStatus: request.status,
      requestStudentCode: request.studentCode,
      requestClassName: request.className,
      requestParentId: request.parentId,
      requestStaffId: request.staffId,
      requestDate: request.date,

      // Original request data for reference
      originalRequest: request,
      originalResult: result,
    };
  });
};

// Filter request results based on search term and date
export const filterRequestResults = (
  results,
  searchTerm,
  filterDate,
  filterStatus
) => {
  return results.filter((result) => {
    const matchesSearch =
      !searchTerm ||
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.studentCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.resultId?.toString().includes(searchTerm.toLowerCase());

    const matchesDate =
      !filterDate ||
      (result.administeredTime &&
        new Date(result.administeredTime).toISOString().split("T")[0] ===
          filterDate) ||
      result.currentDate === filterDate;

    const matchesStatus = !filterStatus || result.status === filterStatus;

    return matchesSearch && matchesDate && matchesStatus;
  });
};

// Filter results by status
export const filterByStatus = (results, statuses) => {
  return results.filter((result) => statuses.includes(result.status));
};

// Get administration statistics
export const getAdministrationStats = (results) => {
  const stats = {
    total: results.length,
    administered: 0,
    pending: 0,
    failed: 0,
    reRequests: 0,
    today: 0,
    thisWeek: 0,
  };

  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  results.forEach((result) => {
    // Count by status
    if (result.status === "administered" || result.status === "completed") {
      stats.administered++;
    } else if (result.status === "pending") {
      stats.pending++;
    } else if (result.status === "failed") {
      stats.failed++;
    }

    // Count re-requests
    if (result.isReRequest) {
      stats.reRequests++;
    }

    // Count today's administrations
    if (
      result.administeredTime &&
      new Date(result.administeredTime).toISOString().split("T")[0] === today
    ) {
      stats.today++;
    }

    // Count this week's administrations
    if (
      result.administeredTime &&
      new Date(result.administeredTime) >= weekAgo
    ) {
      stats.thisWeek++;
    }
  });

  return stats;
};

// Calculate progress for frequency-based medication
export const calculateMedicationProgress = (result) => {
  const timesPerDay = result.timesPerDay || 1;
  const currentCount = result.currentDayCount || 0;
  const progress = Math.min((currentCount / timesPerDay) * 100, 100);

  return {
    progress,
    completed: currentCount,
    total: timesPerDay,
    isComplete: currentCount >= timesPerDay,
    remaining: Math.max(timesPerDay - currentCount, 0),
  };
};

// Get next administration time
export const getNextAdministrationTime = (result) => {
  if (!result.frequency || !result.timeOfDay) return null;

  // Parse frequency and time of day to calculate next administration
  // This is a simplified version - you might want to implement more complex logic
  const today = new Date();
  const timesPerDay = result.timesPerDay || 1;
  const currentCount = result.currentDayCount || 0;

  if (currentCount >= timesPerDay) {
    // Move to next day
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(8, 0, 0, 0); // Default to 8 AM
    return nextDay;
  }

  // Calculate next time today based on frequency
  const hoursInterval = 24 / timesPerDay;
  const nextHour = 8 + currentCount * hoursInterval; // Start from 8 AM

  const nextTime = new Date(today);
  nextTime.setHours(Math.floor(nextHour), 0, 0, 0);

  return nextTime;
};

// Format administration schedule
export const formatAdministrationSchedule = (result) => {
  const progress = calculateMedicationProgress(result);
  const nextTime = getNextAdministrationTime(result);

  return {
    ...progress,
    nextAdministrationTime: nextTime,
    nextAdministrationFormatted: nextTime
      ? nextTime.toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : null,
    scheduleStatus: progress.isComplete ? "completed" : "pending",
  };
};

// Check if re-request is needed
export const shouldShowReRequestOption = (result) => {
  return (
    result.status === "failed" &&
    (result.failedAttempts || 0) < 3 && // Max 3 attempts
    !result.isReRequest
  );
};

// Format administration history
export const formatAdministrationHistory = (result) => {
  const history = [];

  if (result.administeredTime) {
    history.push({
      type: "administered",
      timestamp: result.administeredTime,
      staff: result.administeredByStaffName,
      notes: result.administeredFrequencies,
    });
  }

  if (result.failedAttempts > 0) {
    history.push({
      type: "failed",
      timestamp: result.lastAttemptTime,
      staff: result.actionByStaffName,
      notes: result.failureReasons,
      attempts: result.failedAttempts,
    });
  }

  if (result.isReRequest) {
    history.push({
      type: "rerequest",
      timestamp: result.submittedAt,
      reason: result.reRequestReason,
      originalId: result.originalRequestResultId,
    });
  }

  return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Get status display text in Vietnamese
export const getStatusDisplayText = (status) => {
  const statusMap = {
    pending: "Chờ cấp thuốc",
    administered: "Đã cấp thuốc",
    completed: "Hoàn thành",
    failed: "Thất bại",
    cancelled: "Đã hủy",
    expired: "Hết hạn",
    partial: "Cấp một phần",
  };

  return statusMap[status] || status;
};
