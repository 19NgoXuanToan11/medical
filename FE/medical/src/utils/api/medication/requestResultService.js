import api from "../../staff/staffService";

// Request Result API Service - for medication administration results
export const requestResultService = {
  // Get all request results
  getAllRequestResults: async (params = {}) => {
    try {
      const response = await api.get("/RequestResult", { params });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách kết quả yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching request results:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách kết quả yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get request result by ID
  getRequestResultById: async (id) => {
    try {
      const response = await api.get(`/RequestResult/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin kết quả yêu cầu thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching request result by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin kết quả yêu cầu thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create new medication administration result
  createRequestResult: async (resultData) => {
    try {
      const response = await api.post("/RequestResult", resultData);
      return {
        success: true,
        data: response.data,
        message: "Tạo kết quả cấp thuốc thành công",
      };
    } catch (error) {
      console.error("Error creating request result:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể tạo kết quả cấp thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update request result
  updateRequestResult: async (id, updateData) => {
    try {
      const response = await api.put(`/RequestResult/${id}`, updateData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật kết quả cấp thuốc thành công",
      };
    } catch (error) {
      console.error("Error updating request result:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật kết quả cấp thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Mark medication as administered
  markAsAdministered: async (resultId, administrationData) => {
    try {
      const updateData = {
        ...administrationData,
        administeredTime: new Date().toISOString(),
        status: "administered",
        currentDayCount: (administrationData.currentDayCount || 0) + 1,
      };

      const response = await api.put(`/RequestResult/${resultId}`, updateData);
      return {
        success: true,
        data: response.data,
        message: "Đã ghi nhận cấp thuốc thành công",
      };
    } catch (error) {
      console.error("Error marking as administered:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể ghi nhận cấp thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create re-request
  createReRequest: async (originalResultId, reRequestData) => {
    try {
      const requestData = {
        ...reRequestData,
        isReRequest: true,
        originalRequestResultId: originalResultId,
        lastAttemptTime: new Date().toISOString(),
        status: "pending",
      };

      const response = await api.post("/RequestResult", requestData);
      return {
        success: true,
        data: response.data,
        message: "Tạo yêu cầu lại thành công",
      };
    } catch (error) {
      console.error("Error creating re-request:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tạo yêu cầu lại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get request results by student
  getRequestResultsByStudent: async (studentCode) => {
    try {
      const response = await api.get(`/RequestResult/student/${studentCode}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách kết quả yêu cầu thuốc của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching request results by student:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách kết quả yêu cầu thuốc của học sinh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get pending administration tasks
  getPendingAdministrations: async () => {
    try {
      const response = await api.get("/RequestResult/pending-administration");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách nhiệm vụ cấp thuốc chờ thực hiện thành công",
      };
    } catch (error) {
      console.error("Error fetching pending administrations:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách nhiệm vụ cấp thuốc chờ thực hiện",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get completed administrations
  getCompletedAdministrations: async () => {
    try {
      const response = await api.get("/RequestResult/completed-administration");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách cấp thuốc đã hoàn thành thành công",
      };
    } catch (error) {
      console.error("Error fetching completed administrations:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách cấp thuốc đã hoàn thành",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get failed administrations
  getFailedAdministrations: async () => {
    try {
      const response = await api.get("/RequestResult/failed-administration");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách cấp thuốc thất bại thành công",
      };
    } catch (error) {
      console.error("Error fetching failed administrations:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách cấp thuốc thất bại",
        error: error.response?.data || error.message,
      };
    }
  },

  // Mark administration as failed
  markAsFailed: async (resultId, failureData) => {
    try {
      const updateData = {
        ...failureData,
        status: "failed",
        lastAttemptTime: new Date().toISOString(),
        failedAttempts: (failureData.failedAttempts || 0) + 1,
      };

      const response = await api.put(`/RequestResult/${resultId}`, updateData);
      return {
        success: true,
        data: response.data,
        message: "Đã ghi nhận thất bại cấp thuốc",
      };
    } catch (error) {
      console.error("Error marking as failed:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể ghi nhận thất bại cấp thuốc",
        error: error.response?.data || error.message,
      };
    }
  },
};
