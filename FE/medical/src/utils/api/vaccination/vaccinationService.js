import axios from "axios";

const API_URL = "https://localhost:7111/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Vaccine API Service
export const vaccineService = {
  // Get all vaccines
  getAllVaccines: async () => {
    try {
      const response = await api.get("/Vaccine");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách vaccine thành công",
      };
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách vaccine",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get active vaccines only
  getActiveVaccines: async () => {
    try {
      const response = await api.get("/Vaccine/active");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách vaccine đang sử dụng thành công",
      };
    } catch (error) {
      console.error("Error fetching active vaccines:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách vaccine đang sử dụng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get vaccine by ID
  getVaccineById: async (id) => {
    try {
      const response = await api.get(`/Vaccine/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin vaccine thành công",
      };
    } catch (error) {
      console.error("Error fetching vaccine by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy thông tin vaccine",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create new vaccine
  createVaccine: async (vaccineData) => {
    try {
      const response = await api.post("/Vaccine", vaccineData);
      return {
        success: true,
        data: response.data,
        message: "Tạo vaccine mới thành công",
      };
    } catch (error) {
      console.error("Error creating vaccine:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tạo vaccine mới",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update vaccine
  updateVaccine: async (id, vaccineData) => {
    try {
      const response = await api.put(`/Vaccine/${id}`, vaccineData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật vaccine thành công",
      };
    } catch (error) {
      console.error("Error updating vaccine:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể cập nhật vaccine",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete vaccine
  deleteVaccine: async (id) => {
    try {
      await api.delete(`/Vaccine/${id}`);
      return {
        success: true,
        data: null,
        message: "Xóa vaccine thành công",
      };
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể xóa vaccine",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Legacy vaccination service for existing components (can be deprecated later)
export const vaccinationService = {
  // Keep existing methods for backward compatibility until all components are migrated
  getAllVaccinations: async () => {
    // This would need to be implemented based on actual vaccination schedule/program endpoints
    // For now, return empty data
    return {
      success: true,
      data: [],
      message: "Chức năng này đang được phát triển",
    };
  },

  createVaccination: async (vaccinationData) => {
    // This would need to be implemented based on actual vaccination schedule/program endpoints
    return {
      success: false,
      data: null,
      message: "Chức năng này đang được phát triển",
    };
  },

  updateVaccination: async (id, vaccinationData) => {
    // This would need to be implemented based on actual vaccination schedule/program endpoints
    return {
      success: false,
      data: null,
      message: "Chức năng này đang được phát triển",
    };
  },

  deleteVaccination: async (id) => {
    // This would need to be implemented based on actual vaccination schedule/program endpoints
    return {
      success: false,
      data: null,
      message: "Chức năng này đang được phát triển",
    };
  },
};

export default { vaccineService, vaccinationService };
