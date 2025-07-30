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

// Upload health check results from Excel file
export const uploadHealthCheckResults = async (healthCheckId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('healthCheckId', healthCheckId);

    // Fix URL - remove duplicate path
    const response = await fetch(`https://localhost:7111/api/HealthCheckForm/upload-results`, {
      method: 'POST',
      headers: {
        // Fix getAuthToken() - use localStorage directly
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading health check results:', error);
    throw error;
  }
};

// Download Excel template for health check results
export const downloadHealthCheckTemplate = async (healthCheckId) => {
  try {
    // Fix URL - remove duplicate path
    const response = await fetch(`https://localhost:7111/api/HealthCheckForm/download-template/${healthCheckId}`, {
      method: 'GET',
      headers: {
        // Fix getAuthToken() - use localStorage directly
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download template');
    }

    // Get filename from response headers
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `Mau_KetQua_KhamSucKhoe_${healthCheckId}.xlsx`;
    
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    console.error('Error downloading health check template:', error);
    throw error;
  }
};

// Mark health check as completed
export const markHealthCheckCompleted = async (healthCheckId, resultData = null) => {
  try {
    // Fix URL - remove duplicate path
    const response = await fetch(`https://localhost:7111/api/HealthCheckForm/complete/${healthCheckId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Fix getAuthToken() - use localStorage directly
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        completedDate: new Date().toISOString(),
        resultData: resultData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to complete health check');
    }

    return await response.json();
  } catch (error) {
    console.error('Error completing health check:', error);
    throw error;
  }
};
