import { medicationService } from "../../../../utils/api/medication/medicationService";

// Transform API data to component structure
export const transformRequestData = (requests) => {
  return requests.map((req) => {
    const medicineItems = req.medicineRequestItems || [];
    const firstMedicine = medicineItems[0];

    return {
      id: req.requestId || req.id,
      studentName: req.student
        ? `${req.student.firstName} ${req.student.lastName}`
        : "N/A",
      studentId: req.student?.studentId || 0,
      className: req.student?.className || req.className,
      medicineName: firstMedicine?.medicineName || "N/A",
      dosage: firstMedicine?.dosage || "N/A",
      frequency: firstMedicine?.frequency || "N/A",
      timeOfDay: firstMedicine?.timeOfDay || "N/A",
      instructions: firstMedicine?.instructions || "N/A",
      status: req.status || "pending",
      requestDate: req.requestDate
        ? new Date(req.requestDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      date: req.date,
      parentName: req.parent
        ? `${req.parent.firstName} ${req.parent.lastName}`
        : "N/A",
      staffName: req.staff
        ? `${req.staff.firstName} ${req.staff.lastName}`
        : "N/A",
      staff: req.staff,
      medicineRequestItems: medicineItems,
      assignedDate: req.assignedDate,
      approvedBy: req.approvedBy,
      approvedDate: req.approvedDate,
      rejectedBy: req.rejectedBy,
      rejectedDate: req.rejectedDate,
      rejectionReason: req.rejectionReason,
      refusalReason: req.refusalReason,
      reason: req.reason,
      failureReason: req.failureReason,
      failureReasons: req.failureReasons,
      approvalNotes: req.approvalNotes,
      assignedBy: req.assignedBy,
      assignmentNotes: req.assignmentNotes,
      staffId: req.staffId,
      completedDate: req.completedDate,
      completedBy: req.completedBy,
      completionNotes: req.completionNotes,
    };
  });
};

// Filter requests based on search term and date
export const filterRequests = (requests, searchTerm, filterDate) => {
  return requests.filter((request) => {
    const matchesSearch =
      !searchTerm ||
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !filterDate || request.requestDate === filterDate;

    return matchesSearch && matchesDate;
  });
};

// Filter requests by status
export const filterByStatus = (requests, statuses) => {
  return requests.filter((req) => statuses.includes(req.status));
};

// Group requests by student and date to show multiple medicines together
export const groupRequestsByStudentAndDate = (requests) => {
  const grouped = {};

  requests.forEach((request) => {
    const key = `${request.studentName}_${request.requestDate}_${request.status}`;

    if (!grouped[key]) {
      grouped[key] = {
        ...request,
        medicineNames: [request.medicineName],
        allMedicineItems: request.medicineRequestItems || [],
        originalRequests: [request],
      };
    } else {
      // Add medicine name if not already included
      if (!grouped[key].medicineNames.includes(request.medicineName)) {
        grouped[key].medicineNames.push(request.medicineName);
      }
      // Merge medicine items
      if (request.medicineRequestItems) {
        grouped[key].allMedicineItems = [
          ...grouped[key].allMedicineItems,
          ...request.medicineRequestItems,
        ];
      }
      grouped[key].originalRequests.push(request);
    }
  });

  return Object.values(grouped);
};

// Check if student has any in-progress medication requests (deprecated - always returns false)
export const checkForInProgressRequests = async (studentId) => {
  // This function is deprecated as the "Đang thực hiện" tab has been removed
  return false;
};

// Validate medication start with user-friendly message
export const validateMedicationStart = async (
  studentId,
  studentName = "học sinh này"
) => {
  if (!studentId) {
    return { canStart: true }; // Allow if no student ID (shouldn't happen, but be safe)
  }

  // In-progress check has been removed as the "Đang thực hiện" tab is no longer available
  return { canStart: true };
};

// Normalize status values from API to consistent lowercase format
export const normalizeStatus = (status) => {
  if (!status) return "pending";

  const statusMap = {
    Pending: "pending",
    pending: "pending",
    Assigned: "assigned",
    assigned: "assigned",
    Completed: "completed",
    completed: "completed",
    Rejected: "rejected",
    rejected: "rejected",
    Approved: "approved",
    approved: "approved",
    Done: "completed", // Map "Done" to "completed"
    done: "completed",
    Failed: "failed",
    failed: "failed",
    Refused: "refused",
    refused: "refused",
  };

  return statusMap[status] || status.toLowerCase();
};

// Get Vietnamese status display text
export const getVietnameseStatusText = (status) => {
  // First normalize the status to handle variations
  const normalizedStatus = normalizeStatus(status);

  const statusTextMap = {
    pending: "Chờ xử lý",
    assigned: "Đã giao",
    completed: "Đã hoàn thành",
    rejected: "Từ chối",
    approved: "Đã phê duyệt",
    failed: "Thất bại",
    refused: "Từ chối",
  };

  return (
    statusTextMap[normalizedStatus] || normalizedStatus || "Không xác định"
  );
};
