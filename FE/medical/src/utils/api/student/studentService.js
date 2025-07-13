import axios from "axios";

const API_BASE_URL = "https://localhost:7111/api";

// Function to get student by student code
export const getStudentByCode = async (studentCode) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/by-code/${studentCode}`
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Student not found");
    }
    throw error;
  }
};

// Function to get all students
export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Student`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get student by ID
export const getStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Student/${studentId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Student not found");
    }
    throw error;
  }
};

// Function to get students by grade
export const getStudentsByGrade = async (grade) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/Student/by-grade/${grade}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  getStudentByCode,
  getAllStudents,
  getStudentById,
  getStudentsByGrade,
};
