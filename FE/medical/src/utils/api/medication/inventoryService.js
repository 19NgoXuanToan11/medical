import axios from "axios";

const API_BASE_URL = "https://localhost:7111/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Medicine Inventory API Service
export const medicineInventoryService = {
  // Get all medicines from inventory
  getAllMedicines: async () => {
    try {
      const response = await api.get("/Medicine");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medicines:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách thuốc",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get only active medicines from inventory
  getActiveMedicines: async () => {
    try {
      const response = await api.get("/Medicine/active");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách thuốc đang sử dụng thành công",
      };
    } catch (error) {
      console.error("Error fetching active medicines:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách thuốc đang sử dụng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medicine by ID
  getMedicineById: async (id) => {
    try {
      const response = await api.get(`/Medicine/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin thuốc thành công",
      };
    } catch (error) {
      console.error("Error fetching medicine by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy thông tin thuốc",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Medical Supply Inventory API Service
export const medicalSupplyInventoryService = {
  // Get all medical supplies from inventory
  getAllMedicalSupplies: async () => {
    try {
      const response = await api.get("/MedicalSupply");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách vật tư y tế thành công",
      };
    } catch (error) {
      console.error("Error fetching medical supplies:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách vật tư y tế",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get only active medical supplies from inventory
  getActiveMedicalSupplies: async () => {
    try {
      const response = await api.get("/MedicalSupply/active");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách vật tư y tế đang sử dụng thành công",
      };
    } catch (error) {
      console.error("Error fetching active medical supplies:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách vật tư y tế đang sử dụng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get medical supply by ID
  getMedicalSupplyById: async (id) => {
    try {
      const response = await api.get(`/MedicalSupply/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin vật tư y tế thành công",
      };
    } catch (error) {
      console.error("Error fetching medical supply by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin vật tư y tế",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Combined service for convenience
export const inventoryService = {
  ...medicineInventoryService,
  ...medicalSupplyInventoryService,
};

export default inventoryService;
