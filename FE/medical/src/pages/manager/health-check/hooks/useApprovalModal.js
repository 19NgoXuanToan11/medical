import { useState } from "react";

export const useApprovalModal = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle view request detail
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle approval action
  const handleApprovalAction = (action) => {
    setApprovalAction(action);
    setShowDetailModal(false);
    setShowApprovalModal(true);
  };

  // Reset modal states
  const resetModals = () => {
    setShowDetailModal(false);
    setShowApprovalModal(false);
    setApprovalNotes("");
    setSelectedRequest(null);
    setApprovalAction("");
  };

  // Handle approve/reject request
  const handleApprovalSubmit = async (updateSchedule) => {
    setLoading(true);
    try {
      if (!selectedRequest) return;

      // Determine new status based on approval action
      const newStatus = approvalAction === "approve" ? "Approved" : "Rejected";

      // Update the schedule status via API - only send fields that backend DTO has
      const updateData = {
        formId: selectedRequest.id,
        title: selectedRequest.title,
        scheduledDate: new Date(
          selectedRequest.scheduledDate + "T00:00:00.000Z"
        ).toISOString(),
        startTime: selectedRequest.scheduledTime, // Don't add ":00" - let backend handle conversion
        estimatedDuration: selectedRequest.estimatedDuration,
        description:
          selectedRequest.description +
          (approvalNotes ? `\n\nGhi chú phê duyệt: ${approvalNotes}` : ""),
        location: selectedRequest.location,
        // Student and Parent Information - set to null for schedule-type forms
        studentId: null,
        parentId: null,
        createdDate: selectedRequest.createdDate || new Date().toISOString(),
        // Consent and Confirmation
        consentStatus: "pending", // Parent consent - leave as pending for now
        consentDate: null,
        confirmStatus: approvalAction === "approve" ? "approved" : "rejected",
        confirmedBy: null, // TODO: Get actual manager ID from auth context
        confirmedDate: new Date().toISOString(),
        // Grade and Class Information
        className: null,
        gradeIds: JSON.stringify(selectedRequest.targetGrades),
        totalStudents: selectedRequest.totalStudents,
        // Settings
        notifyParents: selectedRequest.notifyParents !== false,
        autoAdvance: selectedRequest.autoAdvance !== false,
        saveResults: selectedRequest.saveResults !== false,
        generateReport: selectedRequest.generateReport !== false,
        requireParentConfirmation:
          selectedRequest.requireParentConfirmation !== false,
        // Station Information
        selectedStations: JSON.stringify(selectedRequest.checkItems),
        staffAssigned: null,
        // Status and Timing
        status: newStatus,
        estimatedEndTime: null,
      };

      await updateSchedule(selectedRequest.id, updateData);

      const actionText = approvalAction === "approve" ? "duyệt" : "từ chối";
      alert(`Yêu cầu đã được ${actionText} thành công!`);

      // Close modals and reset form
      resetModals();
    } catch (error) {
      console.error("Error updating health check schedule:", error);
      alert("Có lỗi xảy ra khi cập nhật: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedRequest,
    setSelectedRequest,
    showDetailModal,
    setShowDetailModal,
    showApprovalModal,
    setShowApprovalModal,
    approvalAction,
    approvalNotes,
    setApprovalNotes,
    loading,
    handleViewDetail,
    handleApprovalAction,
    handleApprovalSubmit,
    resetModals,
  };
};
