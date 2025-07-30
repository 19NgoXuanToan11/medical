import { useState, useEffect } from "react";
import { medicationService } from "../../../../utils/api/medication/medicationService";

export const useMedicationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState({});
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    rejected: 0,
    today: 0,
    total: 0,
  });

  // Load stats for all tabs (filtered by nurse's assigned grades)
  const loadAllStats = async () => {
    try {
      const [pendingResponse, completedResponse] = await Promise.all([
        medicationService.getMyAssignedMedicationRequests("pending"),
        medicationService.getMyAssignedMedicationRequests("completed"),
      ]);

      let pendingCount = 0;
      let completedCount = 0;
      let todayCount = 0;

      // Calculate pending count
      if (pendingResponse.success && pendingResponse.data) {
        // Ensure we have an array, even if API returns null/undefined
        const responseData = pendingResponse.data || [];
        const pendingData = responseData.filter(
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
      } else {
        // If API fails, ensure counts are 0
        pendingCount = 0;
        todayCount = 0;
      }

      // Calculate completed count
      if (completedResponse.success && completedResponse.data) {
        // Ensure we have an array, even if API returns null/undefined
        const responseData = completedResponse.data || [];
        const completedData = responseData.filter(
          (req) => req.status === "Completed" || req.status === "completed"
        );
        completedCount = completedData.length;
      } else {
        // If API fails, ensure count is 0
        completedCount = 0;
      }

      setStats({
        pending: pendingCount,
        completed: completedCount,
        rejected: 0,
        today: todayCount,
        total: pendingCount + completedCount,
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
  }, []);

  return {
    loading,
    setLoading,
    selectedNurse,
    setSelectedNurse,
    showActionDropdown,
    setShowActionDropdown,
    stats,
    setStats,
    loadAllStats,
    sendParentNotification,
    toggleActionDropdown,
  };
};
