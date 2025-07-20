import axios from "axios";
import { getStudentsByGrade } from "../student/studentService";

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

// Injection Form API Service
export const injectionFormService = {
  // Create vaccination schedule (single API call like HealthCheckForm)
  createVaccinationSchedule: async (vaccinationData) => {
    try {
      // Validate required data
      if (
        !vaccinationData.targetGrades ||
        vaccinationData.targetGrades.length === 0
      ) {
        throw new Error("Cần chọn ít nhất một lớp học");
      }

      if (!vaccinationData.vaccineId) {
        throw new Error("Cần chọn vaccine để tiêm chủng");
      }

      if (!vaccinationData.title) {
        throw new Error("Tiêu đề là bắt buộc");
      }

      // Map vaccination data to HealthCheckForm-like structure
      const vaccinationSchedule = {
        FormId: 0, // Always 0 for new forms
        Title: vaccinationData.title?.trim(),
        ScheduledDate: vaccinationData.scheduledDateTime ? 
          new Date(vaccinationData.scheduledDateTime).toISOString().split('T')[0] : null,
        StartTime: vaccinationData.scheduledDateTime ? 
          new Date(vaccinationData.scheduledDateTime).toTimeString().split(' ')[0] : "08:00:00",
        EstimatedDuration: 60, // Default duration for vaccination
        Description: vaccinationData.description?.trim() || "",
        Location: vaccinationData.location?.trim() || "Phòng y tế trường",
        StudentId: null,
        ParentId: null,
        CreatedDate: new Date().toISOString(),
        ConsentStatus: "đang chờ",
        ConsentDate: null,
        ConfirmStatus: "đang chờ",
        ConfirmedBy: null,
        ConfirmedDate: null,
        ClassName: null,
        GradeIds: JSON.stringify(vaccinationData.targetGrades.map(g => String(g))),
        TotalStudents: vaccinationData.totalStudents || 0,
        NotifyParents: true,
        AutoAdvance: true,
        SaveResults: true,
        GenerateReport: true,
        RequireParentConfirmation: true,
        SelectedStations: JSON.stringify([`vaccination-${vaccinationData.vaccineId}`]),
        StaffAssigned: null,
        Status: "đang chờ",
        EstimatedEndTime: null,
        Student: null,
        Parent: null,
        ConfirmedByStaff: null,
        Results: null,
        
        // Vaccination-specific fields (stored in description or notes)
        VaccineId: vaccinationData.vaccineId,
        VaccineName: vaccinationData.vaccineName,
        VaccinationType: "vaccination"
      };

      // Create single vaccination schedule using HealthCheckForm API
      const response = await api.post("/HealthCheckForm/schedules", vaccinationSchedule);

      return {
        success: true,
        data: {
          formId: response.data.formId,
          title: response.data.title,
          scheduledDate: response.data.scheduledDate,
          totalStudents: response.data.totalStudents,
          status: response.data.status
        },
        message: "Kế hoạch tiêm chủng đã được tạo thành công!",
      };
    } catch (error) {
      console.error("Error creating vaccination schedule:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || error.message || "Không thể tạo kế hoạch tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get vaccination schedules (using HealthCheckForm API with vaccination filter)
  getVaccinationSchedules: async () => {
    try {
      const response = await api.get("/HealthCheckForm/schedules");
      
      // Filter for vaccination schedules (those that contain vaccination info)
      const vaccinationSchedules = response.data.filter(schedule => 
        schedule.selectedStations && 
        (schedule.selectedStations.includes('vaccination') || 
         schedule.description?.includes('tiêm chủng') ||
         schedule.title?.includes('tiêm chủng'))
      );

      return {
        success: true,
        data: vaccinationSchedules,
        message: "Lấy danh sách kế hoạch tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching vaccination schedules:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.error || "Không thể lấy danh sách kế hoạch tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all injection forms
  getAllInjectionForms: async () => {
    try {
      const response = await api.get("/InjectionForm");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phiếu tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching injection forms:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection form by ID
  getInjectionFormById: async (id) => {
    try {
      const response = await api.get(`/InjectionForm/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin phiếu tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching injection form:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể lấy thông tin phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection forms by student ID
  getInjectionFormsByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/InjectionForm/student/${studentId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy lịch sử tiêm chủng của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching student injection forms:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy lịch sử tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection forms by parent ID
  getInjectionFormsByParentId: async (parentId) => {
    try {
      const response = await api.get(`/InjectionForm/parent/${parentId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phiếu tiêm chủng của con em thành công",
      };
    } catch (error) {
      console.error("Error fetching parent injection forms:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection forms by status
  getInjectionFormsByStatus: async (status) => {
    try {
      const response = await api.get(`/InjectionForm/status/${status}`);
      return {
        success: true,
        data: response.data,
        message: `Lấy danh sách phiếu tiêm chủng trạng thái ${status} thành công`,
      };
    } catch (error) {
      console.error("Error fetching injection forms by status:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get approved injection students
  getApprovedInjectionStudents: async () => {
    try {
      const response = await api.get("/InjectionForm/approved-students");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách học sinh được phép tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching approved injection students:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách học sinh được phép tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Parent confirm consent
  parentConfirmConsent: async (formId) => {
    try {
      const response = await api.post(
        `/InjectionForm/parent-confirm/${formId}`
      );
      return {
        success: true,
        data: response.data,
        message: "Phụ huynh đã xác nhận đồng ý tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error confirming parent consent:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể xác nhận đồng ý",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update injection form
  updateInjectionForm: async (id, formData) => {
    try {
      const response = await api.put(`/InjectionForm/${id}`, formData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật phiếu tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error updating injection form:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete injection form
  deleteInjectionForm: async (id) => {
    try {
      await api.delete(`/InjectionForm/${id}`);
      return {
        success: true,
        data: null,
        message: "Xóa phiếu tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error deleting injection form:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể xóa phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get pending injection forms for approval
  getPendingInjectionForms: async () => {
    try {
      const response = await api.get("/InjectionForm/status/pending");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phiếu tiêm chủng chờ duyệt thành công",
      };
    } catch (error) {
      console.error("Error fetching pending injection forms:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách phiếu tiêm chủng chờ duyệt",
        error: error.response?.data || error.message,
      };
    }
  },

  // Approve injection form
  approveInjectionForm: async (formId, notes = "") => {
    try {
      const response = await api.post(`/InjectionForm/approve/${formId}`, {
        notes: notes,
      });
      return {
        success: true,
        data: response.data,
        message: "Phiếu tiêm chủng đã được duyệt thành công",
      };
    } catch (error) {
      console.error("Error approving injection form:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể duyệt phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Reject injection form
  rejectInjectionForm: async (formId, notes = "") => {
    try {
      const response = await api.post(`/InjectionForm/reject/${formId}`, {
        notes: notes,
      });
      return {
        success: true,
        data: response.data,
        message: "Phiếu tiêm chủng đã bị từ chối",
      };
    } catch (error) {
      console.error("Error rejecting injection form:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể từ chối phiếu tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Injection Result API Service
export const injectionResultService = {
  // Create injection result
  createInjectionResult: async (resultData) => {
    try {
      const response = await api.post("/InjectionResult", resultData);
      return {
        success: true,
        data: response.data,
        message: "Ghi nhận kết quả tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error creating injection result:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể ghi nhận kết quả tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all injection results
  getAllInjectionResults: async () => {
    try {
      const response = await api.get("/InjectionResult");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách kết quả tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching injection results:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách kết quả tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection results by form ID
  getInjectionResultsByFormId: async (formId) => {
    try {
      const response = await api.get(`/InjectionResult/form/${formId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy kết quả tiêm chủng thành công",
      };
    } catch (error) {
      console.error("Error fetching injection results by form ID:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy kết quả tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get injection results by student ID
  getInjectionResultsByStudentId: async (studentId) => {
    try {
      const response = await api.get(`/InjectionResult/student/${studentId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy lịch sử kết quả tiêm chủng của học sinh thành công",
      };
    } catch (error) {
      console.error("Error fetching injection results by student ID:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy lịch sử kết quả tiêm chủng",
        error: error.response?.data || error.message,
      };
    }
  },
};

export default { injectionFormService, injectionResultService };
