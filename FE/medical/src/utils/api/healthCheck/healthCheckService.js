import axios from "axios";

const API_BASE_URL = "https://localhost:7111/api/HealthCheckForm";

// Health Check Form API calls - Updated to match API schema
export const createHealthCheck = async (formData) => {
  try {
    // Set proper headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Use the schedules endpoint for creating health check schedules
    const response = await axios.post(
      `${API_BASE_URL}/schedules`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to create health check schedule"
    );
  }
};

export const getHealthCheckSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch health check schedules"
    );
  }
};

// NEW: Get health check schedules for current nurse's assigned grades only
export const getMyHealthCheckSchedules = async () => {
  try {
    // Get token from localStorage (where authService stores it)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.token;

    if (!token) {
      throw new Error("No authentication token found");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(`${API_BASE_URL}/schedules/my-schedules`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching nurse's health check schedules:", error);
    throw error;
  }
};

// New functions to get schedules by specific status
export const getPendingHealthCheckSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/pending`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch pending health check schedules"
    );
  }
};

export const getApprovedHealthCheckSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/approved`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch approved health check schedules"
    );
  }
};

export const getRejectedHealthCheckSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/rejected`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch rejected health check schedules"
    );
  }
};

export const getCompletedHealthCheckSchedules = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/completed`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch completed health check schedules"
    );
  }
};

export const getHealthCheckScheduleById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch health check schedule"
    );
  }
};

export const updateHealthCheckSchedule = async (id, scheduleData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/schedules/${id}`,
      scheduleData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update health check schedule"
    );
  }
};

export const deleteHealthCheckSchedule = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete health check schedule"
    );
  }
};

// Helper API calls for frontend data
export const getAvailableGrades = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch available grades"
    );
  }
};

export const getAvailableStations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stations`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch available stations"
    );
  }
};

export const getAvailableStaff = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/staff`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch available staff"
    );
  }
};

// Health Check Form API calls (existing functionality)
export const getHealthCheckForms = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch health check forms"
    );
  }
};

export const getHealthCheckFormById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch health check form"
    );
  }
};

export const updateHealthCheckForm = async (id, formData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to update health check form"
    );
  }
};

export const deleteHealthCheckForm = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to delete health check form"
    );
  }
};

export const getHealthCheckFormsByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Failed to fetch health check forms by student"
    );
  }
};

export const getHealthCheckFormsByParentId = async (parentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/parent/${parentId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Failed to fetch health check forms by parent"
    );
  }
};

export const getHealthCheckFormsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status/${status}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        "Failed to fetch health check forms by status"
    );
  }
};
