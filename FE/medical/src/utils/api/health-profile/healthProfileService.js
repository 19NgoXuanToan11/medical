import axios from "axios";

const API_URL = "https://localhost:7111/api";

const healthProfileService = {
  // Get health profile by student code
  getByStudentCode: async (studentCode) => {
    try {
      const response = await axios.get(
        `${API_URL}/HealthProfile/student/${studentCode}`
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
      const response = await axios.get(`${API_URL}/HealthProfile/${id}`);
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
        profileData
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
        profileData
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
      await axios.delete(`${API_URL}/HealthProfile/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting health profile:", error);
      throw error;
    }
  },
};

export default healthProfileService;
