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

// Response interceptor for error handling
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

// Staff API Service
export const staffService = {
  // Get all staff members
  getAllStaff: async (params = {}) => {
    try {
      const response = await api.get("/Staff", { params });
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách nhân viên thành công",
      };
    } catch (error) {
      console.error("Error fetching staff:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách nhân viên",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get staff by ID
  getStaffById: async (id) => {
    try {
      const response = await api.get(`/Staff/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy thông tin nhân viên thành công",
      };
    } catch (error) {
      console.error("Error fetching staff by ID:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message || "Không thể lấy thông tin nhân viên",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create new staff
  createStaff: async (staffData) => {
    try {
      // Validate required fields before sending
      const requiredFields = [
        "username",
        "password",
        "email",
        "firstName",
        "lastName",
        "phone",
        "roleId",
      ];
      const missingFields = requiredFields.filter((field) => !staffData[field]);

      if (missingFields.length > 0) {
        return {
          success: false,
          data: null,
          message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
          error: { missingFields },
        };
      }

      // Prepare data according to API schema
      const requestData = {
        username: staffData.username.trim(),
        password: staffData.password,
        email: staffData.email.trim().toLowerCase(),
        firstName: staffData.firstName.trim(),
        lastName: staffData.lastName.trim(),
        phone: staffData.phone.trim(),
        roleId: parseInt(staffData.roleId),
      };

      const response = await api.post("/Staff", requestData);
      return {
        success: true,
        data: response.data,
        message: "Tạo nhân viên mới thành công",
      };
    } catch (error) {
      console.error("Error creating staff:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể tạo nhân viên mới",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update staff
  updateStaff: async (id, staffData) => {
    try {
      // Validate required fields
      const requiredFields = [
        "staffId",
        "username",
        "email",
        "firstName",
        "lastName",
        "phone",
        "roleId",
      ];
      const missingFields = requiredFields.filter((field) => !staffData[field]);

      if (missingFields.length > 0) {
        return {
          success: false,
          data: null,
          message: `Thiếu thông tin bắt buộc: ${missingFields.join(", ")}`,
          error: { missingFields },
        };
      }

      // Prepare data according to API schema
      const requestData = {
        staffId: parseInt(staffData.staffId) || parseInt(id),
        username: staffData.username.trim(),
        email: staffData.email.trim().toLowerCase(),
        firstName: staffData.firstName.trim(),
        lastName: staffData.lastName.trim(),
        phone: staffData.phone.trim(),
        roleId: parseInt(staffData.roleId),
      };

      // Only include password if it's being updated
      if (staffData.password && staffData.password.trim()) {
        requestData.password = staffData.password;
      }

      const response = await api.put(`/Staff/${id}`, requestData);
      return {
        success: true,
        data: response.data,
        message: "Cập nhật thông tin nhân viên thành công",
      };
    } catch (error) {
      console.error("Error updating staff:", error);
      return {
        success: false,
        data: null,
        message:
          error.response?.data?.message ||
          "Không thể cập nhật thông tin nhân viên",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete staff
  deleteStaff: async (id) => {
    try {
      await api.delete(`/Staff/${id}`);
      return {
        success: true,
        data: null,
        message: "Xóa nhân viên thành công",
      };
    } catch (error) {
      console.error("Error deleting staff:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể xóa nhân viên",
        error: error.response?.data || error.message,
      };
    }
  },

  // Staff login
  loginStaff: async (credentials) => {
    try {
      const response = await api.post("/Staff/login", {
        username: credentials.username.trim(),
        password: credentials.password,
      });
      return {
        success: true,
        data: response.data,
        message: "Đăng nhập thành công",
      };
    } catch (error) {
      console.error("Error logging in staff:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Đăng nhập thất bại",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Role mapping for display
export const STAFF_ROLES = {
  1: { id: 1, name: "Admin", label: "Quản trị viên", color: "purple" },
  2: { id: 2, name: "Manager", label: "Quản lý", color: "green" },
  3: { id: 3, name: "Nurse", label: "Nhân viên y tế", color: "blue" },
  4: { id: 4, name: "Manager", label: "Quản lý", color: "green" },
};

// Available roles for management (excluding Admin)
export const MANAGEABLE_ROLES = {
  2: { id: 2, name: "Manager", label: "Quản lý", color: "green" },
  3: { id: 3, name: "Nurse", label: "Nhân viên y tế", color: "blue" },
};

// Get role info from API response or fallback to mapping
export const getRoleDisplayInfo = (staff) => {
  // If API provides roleName, use it directly
  if (staff.roleName) {
    const colorMap = {
      "Quản trị viên": "purple",
      "Nhân viên y tế": "blue",
      "Quản lý": "green",
      Manager: "green",
      Nurse: "blue",
      "Không xác định": "gray",
    };

    return {
      label:
        staff.roleName === "Manager"
          ? "Quản lý"
          : staff.roleName === "Nurse"
          ? "Nhân viên y tế"
          : staff.roleName,
      color: colorMap[staff.roleName] || "gray",
    };
  }

  // Fallback to roleId mapping
  if (staff.roleId && STAFF_ROLES[staff.roleId]) {
    return {
      label: STAFF_ROLES[staff.roleId].label,
      color: STAFF_ROLES[staff.roleId].color,
    };
  }

  // Default fallback
  return {
    label: "Không xác định",
    color: "gray",
  };
};

// Validation utilities
export const validateStaffData = (data, isUpdate = false) => {
  const errors = {};

  // Staff ID validation (for updates)
  if (isUpdate && !data.staffId) {
    errors.staffId = "Staff ID là bắt buộc";
  } else if (isUpdate && isNaN(parseInt(data.staffId))) {
    errors.staffId = "Staff ID phải là số";
  }

  // Username validation
  if (!data.username?.trim()) {
    errors.username = "Tên đăng nhập là bắt buộc";
  } else if (data.username.length < 3) {
    errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username =
      "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới";
  }

  // Password validation (required for create, optional for update)
  if (!isUpdate && !data.password) {
    errors.password = "Mật khẩu là bắt buộc";
  } else if (data.password && data.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }

  // Confirm password validation
  if (!isUpdate && data.password !== data.confirmPassword) {
    errors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  // Email validation
  if (!data.email?.trim()) {
    errors.email = "Email là bắt buộc";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email không hợp lệ";
  }

  // Name validation
  if (!data.firstName?.trim()) {
    errors.firstName = "Tên là bắt buộc";
  } else if (data.firstName.length < 2) {
    errors.firstName = "Tên phải có ít nhất 2 ký tự";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Họ là bắt buộc";
  } else if (data.lastName.length < 2) {
    errors.lastName = "Họ phải có ít nhất 2 ký tự";
  }

  // Phone validation
  if (!data.phone?.trim()) {
    errors.phone = "Số điện thoại là bắt buộc";
  } else if (!/^[0-9+\-\s\(\)]{10,15}$/.test(data.phone.replace(/\s/g, ""))) {
    errors.phone = "Số điện thoại không hợp lệ (10-15 số)";
  }

  // Role validation
  if (!data.roleId) {
    errors.roleId = "Vai trò là bắt buộc";
  } else if (![2, 3].includes(parseInt(data.roleId))) {
    errors.roleId = "Vai trò không hợp lệ";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default api;
