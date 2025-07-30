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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const appointmentService = {
  // Create new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post("/Appointment", appointmentData);
      return {
        success: true,
        data: response.data,
        message: "Đặt lịch hẹn thành công",
      };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể đặt lịch hẹn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all appointments
  getAllAppointments: async (params = {}) => {
    try {
      const response = await api.get("/Appointment", { params });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách lịch hẹn thành công",
      };
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách lịch hẹn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/Appointment/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin lịch hẹn thành công",
      };
    } catch (error) {
      console.error("Error fetching appointment by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy thông tin lịch hẹn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get appointments by student ID
  getAppointmentsByStudent: async (studentId) => {
    try {
      const response = await api.get(`/Appointment/student/${studentId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách lịch hẹn của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching appointments by student:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách lịch hẹn của học sinh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get appointments by parent ID
  getAppointmentsByParent: async (parentId) => {
    try {
      const response = await api.get(`/Appointment/parent/${parentId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách lịch hẹn của phụ huynh thành công",
      };
    } catch (error) {
      console.error("Error fetching appointments by parent:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách lịch hẹn của phụ huynh",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    try {
      const response = await api.put(`/Appointment/${id}`, appointmentData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật lịch hẹn thành công",
      };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể cập nhật lịch hẹn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Cancel appointment
  cancelAppointment: async (id, reason = "") => {
    try {
      const response = await api.patch(`/Appointment/${id}/cancel`, {
        cancellationReason: reason,
        cancelledDate: new Date().toISOString(),
      });
      return {
        success: true,
        data: response.data,
        message: "Hủy lịch hẹn thành công",
      };
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể hủy lịch hẹn",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get available staff for appointments
  getAvailableStaff: async (appointmentDate) => {
    try {
      const response = await api.get(`/Appointment/available-staff`, {
        params: { date: appointmentDate },
      });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách nhân viên có sẵn thành công",
      };
    } catch (error) {
      console.error("Error fetching available staff:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách nhân viên có sẵn",
        error: error.response?.data || error.message,
      };
    }
  },
};

export default appointmentService;
