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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Get all classes
export const getAllClasses = async () => {
  try {
    const response = await api.get("/Class");
    return response.data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

// Get active classes only
export const getActiveClasses = async () => {
  try {
    const response = await api.get("/Class/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching active classes:", error);
    throw error;
  }
};

// Get class by ID with detailed information including students and parents
export const getClassById = async (id) => {
  try {
    const response = await api.get(`/Class/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class details:", error);
    throw error;
  }
};

// Get classes by grade level
export const getClassesByGrade = async (gradeLevel) => {
  try {
    const response = await api.get(`/Class/grade/${gradeLevel}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classes by grade:", error);
    throw error;
  }
};

// Get students in a specific class
export const getClassStudents = async (classId) => {
  try {
    const response = await api.get(`/Class/${classId}/students`);
    return response.data;
  } catch (error) {
    console.error("Error fetching class students:", error);
    throw error;
  }
};

export const getStudentCountByGrade = async (gradeLevel) => {
  const response = await api.get(`/Class/grade/${gradeLevel}/student-count`);
  return response.data; // { gradeLevel: 2, studentCount: 81 }
};

// Create a new class
export const createClass = async (classData) => {
  try {
    const response = await api.post("/Class", classData);
    return response.data;
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

// Update an existing class
export const updateClass = async (id, classData) => {
  try {
    const response = await api.put(`/Class/${id}`, {
      ...classData,
      classId: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

// Delete a class
export const deleteClass = async (id) => {
  try {
    const response = await api.delete(`/Class/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

// Assign a student to a class
export const assignStudentToClass = async (studentId, classId) => {
  try {
    const response = await api.post("/Class/assign-student", {
      studentId,
      classId,
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning student to class:", error);
    throw error;
  }
};

// Remove a student from their current class
export const removeStudentFromClass = async (studentId) => {
  try {
    const response = await api.post(`/Class/remove-student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing student from class:", error);
    throw error;
  }
};

// Get class summary statistics
export const getClassSummary = async () => {
  try {
    const response = await api.get("/Class/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching class summary:", error);
    throw error;
  }
};
