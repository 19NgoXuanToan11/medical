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
      dosageUnit: firstMedicine?.dosageUnit || "viên", // Add dosageUnit extraction
      frequency: firstMedicine?.frequency || "N/A",
      timeOfDay: firstMedicine?.timeOfDay || "N/A",
      instructions: firstMedicine?.instructions || "N/A",
      status: normalizeStatus(req.status) || "pending",
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
  const statusTextMap = {
    pending: "Chờ xử lý",
    assigned: "Đã giao",
    completed: "Đã hoàn thành",
    rejected: "Từ chối",
    approved: "Đã phê duyệt",
    failed: "Thất bại",
    refused: "Từ chối",
  };

  return statusTextMap[status] || status || "Không xác định";
};

// Test function to verify status normalization (for development)
export const testStatusNormalization = () => {
  console.log("Testing status normalization:");
  console.log(
    "Pending ->",
    normalizeStatus("Pending"),
    "->",
    getVietnameseStatusText(normalizeStatus("Pending"))
  );
  console.log(
    "Assigned ->",
    normalizeStatus("Assigned"),
    "->",
    getVietnameseStatusText(normalizeStatus("Assigned"))
  );
  console.log(
    "Completed ->",
    normalizeStatus("Completed"),
    "->",
    getVietnameseStatusText(normalizeStatus("Completed"))
  );
  console.log(
    "Done ->",
    normalizeStatus("Done"),
    "->",
    getVietnameseStatusText(normalizeStatus("Done"))
  );
  console.log(
    "unknown ->",
    normalizeStatus("unknown"),
    "->",
    getVietnameseStatusText(normalizeStatus("unknown"))
  );
  console.log(
    "Failed ->",
    normalizeStatus("Failed"),
    "->",
    getVietnameseStatusText(normalizeStatus("Failed"))
  );
  console.log(
    "Refused ->",
    normalizeStatus("Refused"),
    "->",
    getVietnameseStatusText(normalizeStatus("Refused"))
  );
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
