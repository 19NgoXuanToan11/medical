import { useState, useEffect } from "react";
import { medicationService } from "../../../../utils/api/medication/medicationService";

export const useMedicationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [availableNurses, setAvailableNurses] = useState([]);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState({});
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 0,
    completed: 0,
    rejected: 0,
    failed: 0,
    today: 0,
    total: 0,
  });

  // Load available nurses
  const loadAvailableNurses = async () => {
    try {
      const response = await medicationService.getAvailableNurses();
      if (response.success) {
        setAvailableNurses(response.data);
      }
    } catch (error) {
      console.error("Error loading available nurses:", error);
    }
  };

  // Load stats for all tabs
  const loadAllStats = async () => {
    try {
      const [
        pendingResponse,
        assignedResponse,
        completedResponse,
        rejectedResponse,
        failedResponse,
      ] = await Promise.all([
        medicationService.getPendingMedicationRequests(),
        medicationService.getAssignedMedicationRequests(),
        medicationService.getCompletedMedicationRequests(),
        medicationService.getRejectedMedicationRequests(),
        medicationService.getFailedMedicationRequests(),
      ]);

      let pendingCount = 0;
      let assignedCount = 0;
      let completedCount = 0;
      let rejectedCount = 0;
      let failedCount = 0;
      let todayCount = 0;

      // Calculate pending count
      if (pendingResponse.success && pendingResponse.data) {
        const pendingData = pendingResponse.data.filter(
          (req) =>
            req.status === "pending" || req.status === "Pending" || !req.status
        );
        pendingCount = pendingData.length;

        // Calculate today count from pending requests
        const todayString = new Date().toISOString().split("T")[0];
        todayCount = pendingData.filter((req) => {
          const reqDate = req.requestDate
            ? new Date(req.requestDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
          return reqDate === todayString;
        }).length;
      }

      // Calculate assigned count
      if (assignedResponse.success && assignedResponse.data) {
        const assignedData = assignedResponse.data.filter(
          (req) => req.status === "Assigned" || req.status === "assigned"
        );
        assignedCount = assignedData.length;
      }

      // Calculate completed count
      if (completedResponse.success && completedResponse.data) {
        const completedData = completedResponse.data.filter(
          (req) => req.status === "Completed" || req.status === "completed"
        );
        completedCount = completedData.length;
      }

      // Calculate rejected count
      if (rejectedResponse.success && rejectedResponse.data) {
        const rejectedData = rejectedResponse.data.filter(
          (req) => req.status === "Rejected" || req.status === "rejected"
        );
        rejectedCount = rejectedData.length;
      }

      // Calculate failed count
      if (failedResponse.success && failedResponse.data) {
        const failedData = failedResponse.data.filter(
          (req) => req.status === "Failed" || req.status === "failed"
        );
        failedCount = failedData.length;
      }

      setStats({
        pending: pendingCount,
        assigned: assignedCount,
        completed: completedCount,
        rejected: rejectedCount,
        failed: failedCount,
        today: todayCount,
        total:
          pendingCount +
          assignedCount +
          completedCount +
          rejectedCount +
          failedCount,
      });

      console.log("Updated stats:", {
        pending: pendingCount,
        assigned: assignedCount,
        completed: completedCount,
        rejected: rejectedCount,
        failed: failedCount,
        today: todayCount,
        total:
          pendingCount +
          assignedCount +
          completedCount +
          rejectedCount +
          failedCount,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Send notification to parent
  const sendParentNotification = async (requestId, action, notes, request) => {
    try {
      if (!request) return;

      let title = "";
      let message = "";

      if (action === "assigned") {
        title = "Yêu cầu thuốc đã được giao nhiệm vụ";
        message = `Yêu cầu cấp thuốc ${request.medicineName} cho ${
          request.studentName
        } đã được giao cho nhân viên y tế. ${notes ? `Ghi chú: ${notes}` : ""}`;
      } else if (action === "completed") {
        title = "Yêu cầu thuốc đã hoàn thành";
        message = `Yêu cầu cấp thuốc ${request.medicineName} cho ${
          request.studentName
        } đã được hoàn thành. ${notes ? `Ghi chú: ${notes}` : ""}`;
      }

      const notificationData = {
        type: "medication_response",
        title: title,
        message: message,
        recipientRole: "parent",
        studentId: request.studentId,
        medicationRequestId: requestId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      const existingNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "parentNotifications",
        JSON.stringify(existingNotifications)
      );

      console.log("Parent notification sent:", notificationData);
    } catch (error) {
      console.error("Error sending parent notification:", error);
    }
  };

  // Toggle action dropdown
  const toggleActionDropdown = (requestId) => {
    setShowActionDropdown((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".action-dropdown")) {
        setShowActionDropdown({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    loadAllStats();
    loadAvailableNurses();
  }, []);

  return {
    loading,
    setLoading,
    availableNurses,
    selectedNurse,
    setSelectedNurse,
    showActionDropdown,
    setShowActionDropdown,
    stats,
    setStats,
    loadAllStats,
    loadAvailableNurses,
    sendParentNotification,
    toggleActionDropdown,
  };
};
