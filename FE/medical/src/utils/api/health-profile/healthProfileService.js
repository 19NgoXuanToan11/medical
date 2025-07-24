import axios from "axios";

const API_URL = "https://localhost:7111/api";

// Helper function to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const healthProfileService = {
  // Get all health profiles
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/HealthProfile`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all health profiles:", error);
      throw error;
    }
  },

  // Get health profile by student code
  getByStudentCode: async (studentCode) => {
    try {
      const response = await axios.get(
        `${API_URL}/HealthProfile/student/${studentCode}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching health profile by student code:", error);
      throw error;
    }
  },

  // Get health profile by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/HealthProfile/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching health profile by ID:", error);
      throw error;
    }
  },

  // Create new health profile
  create: async (profileData) => {
    try {
      const response = await axios.post(
        `${API_URL}/HealthProfile`,
        profileData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating health profile:", error);
      throw error;
    }
  },

  // Update health profile
  update: async (id, profileData) => {
    try {
      const response = await axios.put(
        `${API_URL}/HealthProfile/${id}`,
        profileData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating health profile:", error);
      throw error;
    }
  },

  // Delete health profile
  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/HealthProfile/${id}`, {
        headers: getAuthHeaders()
      });
      return true;
    } catch (error) {
      console.error("Error deleting health profile:", error);
      throw error;
    }
  },

  // Get health profiles of students assigned to current nurse
  getMyAssignedStudents: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/HealthProfile/my-assigned-students`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching assigned students' health profiles:",
        error
      );
      throw error;
    }
  },
};

export default healthProfileService;
