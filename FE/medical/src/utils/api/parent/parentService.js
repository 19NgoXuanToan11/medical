import axios from "axios";

const API_URL = "https://localhost:7111/api";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Setup axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Parent service methods
const parentService = {
  // Get parent by ID
  getParentById: async (parentId) => {
    try {
      const response = await apiClient.get(`/Parent/${parentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching parent:", error);
      throw error;
    }
  },

  // Get current parent (using user ID from auth context)
  getCurrentParent: async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        throw new Error("No authenticated user found");
      }

      const response = await apiClient.get(`/Parent/${user.id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching current parent:", error);
      throw error;
    }
  },

  // Update parent information
  updateParent: async (parentId, parentData) => {
    try {
      const response = await apiClient.put(`/Parent/${parentId}`, parentData);
      return response.data;
    } catch (error) {
      console.error("Error updating parent:", error);
      throw error;
    }
  },

  // Get children of a parent
  getParentChildren: async (parentId) => {
    try {
      const parentData = await parentService.getParentById(parentId);
      return parentData.students || [];
    } catch (error) {
      console.error("Error fetching parent children:", error);
      throw error;
    }
  },

  // Get parent statistics
  getParentStatistics: async (parentId) => {
    try {
      const response = await apiClient.get(`/Parent/${parentId}/statistics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching parent statistics:", error);
      throw error;
    }
  },
};

export default parentService;
