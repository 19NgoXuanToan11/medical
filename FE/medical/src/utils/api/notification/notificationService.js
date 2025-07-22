const API_BASE_URL = "https://localhost:7111/api";

export const notificationService = {
  // Get all notifications
  async getAllNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      throw error;
    }
  },

  // Get notifications by parent ID
  async getNotificationsByParentId(parentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/parent/${parentId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching notifications by parent ID:", error);
      throw error;
    }
  },

  // Get unread notifications by parent ID
  async getUnreadNotificationsByParentId(parentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/parent/${parentId}/unread`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      throw error;
    }
  },

  // Get unread count by parent ID
  async getUnreadCountByParentId(parentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/parent/${parentId}/unread-count`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/${notificationId}/mark-read`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read for a parent
  async markAllAsRead(parentId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/parent/${parentId}/mark-all-read`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/${notificationId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Create notification
  async createNotification(notificationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },
};

export default notificationService;
