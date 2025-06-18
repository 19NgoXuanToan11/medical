import api from "../../staff/staffService";

// Medication Request API Service
export const medicationService = {
  // Create new medication request
  createMedicationRequest: async (requestData) => {
    try {
      const response = await api.post("/MedicineRequest", requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được gửi thành công",
      };
    } catch (error) {
      console.error("Error creating medication request:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể gửi yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all medication requests
  getAllMedicationRequests: async (params = {}) => {
    try {
      const response = await api.get("/MedicineRequest", { params });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication request by ID
  getMedicationRequestById: async (id) => {
    try {
      const response = await api.get(`/MedicineRequest/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication request by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update medication request status
  updateMedicationRequestStatus: async (id, statusData) => {
    try {
      const response = await api.put(
        `/MedicineRequest/${id}/status`,
        statusData
      );
      return {
        success: true,
        data: response.data,
        message: "Cập nhật trạng thái yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error updating medication request status:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật trạng thái yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Approve medication request
  approveMedicationRequest: async (id, approvalData) => {
    try {
      const requestData = {
        ...approvalData,
        status: "approved",
        approvedDate: new Date().toISOString(),
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã được phê duyệt",
      };
    } catch (error) {
      console.error("Error approving medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể phê duyệt yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Reject medication request
  rejectMedicationRequest: async (id, rejectionData) => {
    try {
      const requestData = {
        ...rejectionData,
        status: "rejected",
        rejectedDate: new Date().toISOString(),
      };

      const response = await api.put(`/MedicineRequest/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Yêu cầu thuốc đã bị từ chối",
      };
    } catch (error) {
      console.error("Error rejecting medication request:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể từ chối yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication requests by student code
  getMedicationRequestsByStudent: async (studentCode) => {
    try {
      const response = await api.get(`/MedicineRequest/student/${studentCode}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching medication requests by student:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc của học sinh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get pending medication requests
  getPendingMedicationRequests: async () => {
    try {
      const response = await api.get("/MedicineRequest?status=pending");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách yêu cầu thuốc chờ xử lý thành công",
      };
    } catch (error) {
      console.error("Error fetching pending medication requests:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách yêu cầu thuốc chờ xử lý",
        error: error.response?.data || error.message,
      };
    }
  },

  // Upload medication image
  uploadMedicationImage: async (file, type = "medication") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await api.post(
        "/MedicineRequest/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: "Tải lên hình ảnh thành công",
      };
    } catch (error) {
      console.error("Error uploading medication image:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tải lên hình ảnh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medication request statistics
  getMedicationRequestStats: async (dateRange = "today") => {
    try {
      const response = await api.get(
        `/MedicineRequest/stats?range=${dateRange}`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy thống kê yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medication request stats:", error);
      return {
        success: false,
        data: {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        },
        message:
          error.response?.data?.message ||
          "Không thể lấy thống kê yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Notification Service for Medication Requests
export const notificationService = {
  // Send notification to nurse about new medication request
  notifyNurseNewRequest: async (requestData) => {
    try {
      const notificationData = {
        type: "medication_request",
        title: "Yêu cầu cấp thuốc mới",
        message: `Phụ huynh của ${
          requestData.studentName || "học sinh"
        } đã gửi yêu cầu cấp thuốc ${requestData.medicineName}`,
        recipientRole: "nurse",
        isRead: false,
        createdAt: new Date().toISOString(),
        medicationRequestId: requestData.id || Date.now(),
      };

      // Store in localStorage for demo (in real app, use proper notification system)
      const existingNotifications = JSON.parse(
        localStorage.getItem("nurseNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "nurseNotifications",
        JSON.stringify(existingNotifications)
      );

      return {
        success: true,
        message: "Thông báo đã được gửi đến y tá",
      };
    } catch (error) {
      console.error("Error sending nurse notification:", error);
      return {
        success: false,
        message: "Không thể gửi thông báo đến y tá",
      };
    }
  },

  // Send notification to parent about request status
  notifyParentRequestStatus: async (requestId, action, notes, requestData) => {
    try {
      const notificationData = {
        type: "medication_response",
        title:
          action === "approved"
            ? "Yêu cầu thuốc được chấp thuận"
            : "Yêu cầu thuốc bị từ chối",
        message: `Yêu cầu cấp thuốc ${requestData.medicineName} cho ${
          requestData.studentName
        } đã ${action === "approved" ? "được chấp thuận" : "bị từ chối"}. ${
          notes ? `Ghi chú: ${notes}` : ""
        }`,
        recipientRole: "parent",
        studentId: requestData.studentId,
        medicationRequestId: requestId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage for demo (in real app, use proper notification system)
      const existingNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );
      existingNotifications.unshift(notificationData);
      localStorage.setItem(
        "parentNotifications",
        JSON.stringify(existingNotifications)
      );

      return {
        success: true,
        message: "Thông báo đã được gửi đến phụ huynh",
      };
    } catch (error) {
      console.error("Error sending parent notification:", error);
      return {
        success: false,
        message: "Không thể gửi thông báo đến phụ huynh",
      };
    }
  },

  // Get notifications for current user
  getNotifications: async (role, userId = null) => {
    try {
      const storageKey =
        role === "nurse" ? "nurseNotifications" : "parentNotifications";
      const notifications = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      return {
        success: true,
        data: notifications,
        message: "Lấy danh sách thông báo thành công",
      };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        data: [],
        message: "Không thể lấy danh sách thông báo",
      };
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId, role) => {
    try {
      const storageKey =
        role === "nurse" ? "nurseNotifications" : "parentNotifications";
      const notifications = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      const updatedNotifications = notifications.map((notif) =>
        notif.createdAt === notificationId ? { ...notif, isRead: true } : notif
      );

      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));

      return {
        success: true,
        message: "Đánh dấu thông báo đã đọc thành công",
      };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return {
        success: false,
        message: "Không thể đánh dấu thông báo đã đọc",
      };
    }
  },
};

export default medicationService;
