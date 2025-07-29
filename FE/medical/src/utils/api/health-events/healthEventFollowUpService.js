import authService from "../../auth/authService";

const API_BASE_URL = "https://localhost:7111/api";

export const healthEventFollowUpService = {
  // Lấy danh sách follow-up theo event ID
  async getFollowUpsByEventId(eventId) {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/HealthEventFollowUp/event/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      throw error;
    }
  },

  // Lấy follow-up theo ID
  async getFollowUpById(followUpId) {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/HealthEventFollowUp/${followUpId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching follow-up:", error);
      throw error;
    }
  },

  // Tạo follow-up mới
  async createFollowUp(followUpData) {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/HealthEventFollowUp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(followUpData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating follow-up:", error);
      throw error;
    }
  },

  // Cập nhật follow-up
  async updateFollowUp(followUpId, followUpData) {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/HealthEventFollowUp/${followUpId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(followUpData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating follow-up:", error);
      throw error;
    }
  },

  // Xóa follow-up
  async deleteFollowUp(followUpId) {
    try {
      const token = authService.getToken();
      const response = await fetch(
        `${API_BASE_URL}/HealthEventFollowUp/${followUpId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      throw error;
    }
  },
};
