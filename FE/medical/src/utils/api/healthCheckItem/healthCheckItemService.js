import api from "../../staff/staffService";

// HealthCheckItem API Service
export const healthCheckItemService = {
  // Get all health check items
  getAllHealthCheckItems: async () => {
    try {
      const response = await api.get("/HealthCheckItem");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách hạng mục khám thành công",
      };
    } catch (error) {
      console.error("Error fetching health check items:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get active health check items only
  getActiveHealthCheckItems: async () => {
    try {
      const response = await api.get("/HealthCheckItem/active");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách hạng mục khám đang hoạt động thành công",
      };
    } catch (error) {
      console.error("Error fetching active health check items:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách hạng mục khám đang hoạt động",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get health check item by ID
  getHealthCheckItemById: async (id) => {
    try {
      const response = await api.get(`/HealthCheckItem/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin hạng mục khám thành công",
      };
    } catch (error) {
      console.error("Error fetching health check item by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get health check items by category
  getHealthCheckItemsByCategory: async (category) => {
    try {
      const response = await api.get(
        `/HealthCheckItem/category/${encodeURIComponent(category)}`
      );
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách hạng mục khám theo danh mục thành công",
      };
    } catch (error) {
      console.error("Error fetching health check items by category:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách hạng mục khám theo danh mục",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get("/HealthCheckItem/categories");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách danh mục thành công",
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách danh mục",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get health check items with medical supplies
  getHealthCheckItemsWithMedicalSupplies: async () => {
    try {
      const response = await api.get("/HealthCheckItem/with-medical-supplies");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách hạng mục khám với vật tư y tế thành công",
      };
    } catch (error) {
      console.error(
        "Error fetching health check items with medical supplies:",
        error
      );
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách hạng mục khám với vật tư y tế",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create new health check item
  createHealthCheckItem: async (itemData) => {
    try {
      const response = await api.post("/HealthCheckItem", itemData);
      return {
        success: true,
        data: response.data,
        message: "Tạo hạng mục khám mới thành công",
      };
    } catch (error) {
      console.error("Error creating health check item:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể tạo hạng mục khám mới",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update health check item
  updateHealthCheckItem: async (id, itemData) => {
    try {
      const response = await api.put(`/HealthCheckItem/${id}`, itemData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật hạng mục khám thành công",
      };
    } catch (error) {
      console.error("Error updating health check item:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể cập nhật hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete health check item
  deleteHealthCheckItem: async (id) => {
    try {
      const response = await api.delete(`/HealthCheckItem/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Xóa hạng mục khám thành công",
      };
    } catch (error) {
      console.error("Error deleting health check item:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể xóa hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update health check item medical supplies
  updateHealthCheckItemMedicalSupplies: async (id, medicalSupplies) => {
    try {
      const response = await api.put(
        `/HealthCheckItem/${id}/medical-supplies`,
        medicalSupplies
      );
      return {
        success: true,
        data: response.data,
        message: "Cập nhật vật tư y tế cho hạng mục khám thành công",
      };
    } catch (error) {
      console.error(
        "Error updating health check item medical supplies:",
        error
      );
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật vật tư y tế cho hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },

  // Check if code exists
  checkCodeExists: async (code, excludeId = null) => {
    try {
      const params = new URLSearchParams({ code });
      if (excludeId) {
        params.append("excludeId", excludeId);
      }
      const response = await api.get(
        `/HealthCheckItem/check-code/${code}?${params.toString()}`
      );
      return {
        success: true,
        data: response.data,
        message: "Kiểm tra mã hạng mục khám thành công",
      };
    } catch (error) {
      console.error("Error checking code exists:", error);
      return {
        success: false,
        data: false,
        message:
          error.response?.data?.message ||
          "Không thể kiểm tra mã hạng mục khám",
        error: error.response?.data || error.message,
      };
    }
  },
};
