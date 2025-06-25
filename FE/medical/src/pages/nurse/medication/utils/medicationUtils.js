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
