import axios from "axios";

const API_URL = "https://localhost:7111/api";
const API_BASE_URL = "https://localhost:7111";

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
  getAllStaff: async () => {
    try {
      const response = await api.get("/Staff");

      // Security measure: Filter out admin users from the response
      const filteredData = response.data.filter((staff) => {
        return (
          staff.roleId !== 1 &&
          staff.roleName !== "Admin" &&
          staff.roleName !== "Quản trị viên"
        );
      });

      return {
        success: true,
        data: filteredData,
        message: "Lấy danh sách nhân viên thành công",
      };
    } catch (error) {
      console.error("Error fetching staff:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể tải danh sách nhân viên",
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
      // Security check: Prevent admin role creation
      if (parseInt(staffData.roleId) === 1) {
        return {
          success: false,
          data: null,
          message: "Không được phép tạo tài khoản Admin qua giao diện này",
          error: { securityViolation: "Admin creation attempt blocked" },
        };
      }

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

      // Additional validation for role
      if (![2, 3].includes(parseInt(staffData.roleId))) {
        return {
          success: false,
          data: null,
          message:
            "Vai trò không hợp lệ. Chỉ được phép tạo tài khoản Quản lý hoặc Nhân viên y tế",
          error: { invalidRole: true },
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
      // Security check: Prevent admin role update
      if (parseInt(staffData.roleId) === 1) {
        return {
          success: false,
          data: null,
          message: "Không được phép chuyển đổi thành vai trò Admin",
          error: { securityViolation: "Admin role update attempt blocked" },
        };
      }

      // Additional validation for role
      if (staffData.roleId && ![2, 3].includes(parseInt(staffData.roleId))) {
        return {
          success: false,
          data: null,
          message:
            "Vai trò không hợp lệ. Chỉ được phép cập nhật thành Quản lý hoặc Nhân viên y tế",
          error: { invalidRole: true },
        };
      }

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

  // NEW: Get current nurse's assigned grade levels
  getMyAssignedGrades: async () => {
    try {
      // Get token from localStorage (where authService stores it)
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found");
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/Staff/my-assigned-grades`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - please login again");
        }
        if (response.status === 403) {
          throw new Error(
            "Access forbidden - only nurses can access assigned grades"
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const assignedGrades = await response.json();
      return {
        success: true,
        data: assignedGrades,
      };
    } catch (error) {
      console.error("Error fetching assigned grades:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get all grade-nurse assignments
  getAllGradeNurses: async () => {
    try {
      const response = await api.get("/Staff/grade-nurse");
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phân công thành công",
      };
    } catch (error) {
      console.error("Error fetching grade nurse assignments:", error);
      console.error("Error details:", error.response?.data, error.message);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message || "Không thể lấy danh sách phân công",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create grade-nurse assignment
  createGradeNurseAssignment: async (staffId, grade) => {
    try {
      const response = await api.post("/Staff/grade-nurse", {
        staffId: parseInt(staffId),
        grade: parseInt(grade),
      });
      return {
        success: true,
        data: response.data,
        message: "Phân công y tá thành công",
      };
    } catch (error) {
      console.error("Error creating grade nurse assignment:", error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Không thể phân công y tá",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete grade-nurse assignment
  deleteGradeNurseAssignment: async (gradeNurseId) => {
    try {
      await api.delete(`/Staff/grade-nurse/${gradeNurseId}`);
      return {
        success: true,
        message: "Hủy phân công thành công",
      };
    } catch (error) {
      console.error("Error deleting grade nurse assignment:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Không thể hủy phân công",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get nurses assigned to a specific grade
  getNursesByGrade: async (grade) => {
    try {
      const response = await api.get(`/Staff/grade-nurse/by-grade/${grade}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách nurse phụ trách khối thành công",
      };
    } catch (error) {
      console.error("Error fetching nurses by grade:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách nurse phụ trách khối",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get grade assignments for a specific staff member
  getGradeAssignmentsByStaffId: async (staffId) => {
    try {
      const response = await api.get(`/Staff/grade-nurse/by-staff/${staffId}`);
      return {
        success: true,
        data: response.data,
        message: "Lấy danh sách phân công khối thành công",
      };
    } catch (error) {
      console.error("Error fetching grade assignments by staff ID:", error);
      return {
        success: false,
        data: [],
        message:
          error.response?.data?.message ||
          "Không thể lấy danh sách phân công khối",
        error: error.response?.data || error.message,
      };
    }
  },

  // NEW: Get classes filtered by current nurse's assigned grade levels
  getMyAssignedClasses: async () => {
    try {
      // Get token from localStorage (where authService stores it)
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No authentication token found for assigned classes");
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/Class/my-assigned-classes-with-students`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized - please login again");
        }
        if (response.status === 403) {
          throw new Error(
            "Access forbidden - only nurses can access assigned classes"
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const assignedClasses = await response.json();
      return {
        success: true,
        data: assignedClasses,
      };
    } catch (error) {
      console.error("Error fetching assigned classes:", error);
      return {
        success: false,
        error: error.message,
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

// Security utilities
export const securityUtils = {
  // Log security violations for monitoring
  logSecurityViolation: (violation, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      violation,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, this should send to a security monitoring service
    console.warn("🔒 SECURITY VIOLATION:", logEntry);

    // Store in session storage for debugging (remove in production)
    if (typeof sessionStorage !== "undefined") {
      const existing = sessionStorage.getItem("security_violations") || "[]";
      const violations = JSON.parse(existing);
      violations.push(logEntry);
      sessionStorage.setItem(
        "security_violations",
        JSON.stringify(violations.slice(-10))
      ); // Keep last 10
    }
  },

  // Check if user is attempting unauthorized actions
  isUnauthorizedAction: (roleId, action) => {
    const unauthorizedActions = {
      1: ["view", "edit", "delete", "create"], // Admin role - all actions unauthorized from this interface
    };

    return unauthorizedActions[roleId]?.includes(action) || false;
  },
};

// Enhanced validation utilities with security logging
export const validateStaffData = (data, isUpdate = false) => {
  const errors = {};

  // Security check first
  if (parseInt(data.roleId) === 1) {
    securityUtils.logSecurityViolation("ADMIN_ROLE_ATTEMPT", {
      action: isUpdate ? "update" : "create",
      attemptedRoleId: data.roleId,
      username: data.username,
    });
  }

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

  // Role validation - Enhanced security check
  if (!data.roleId) {
    errors.roleId = "Vai trò là bắt buộc";
  } else if (parseInt(data.roleId) === 1) {
    errors.roleId = "Không được phép tạo/cập nhật tài khoản Admin";
  } else if (![2, 3].includes(parseInt(data.roleId))) {
    errors.roleId =
      "Vai trò không hợp lệ. Chỉ được phép chọn Quản lý hoặc Nhân viên y tế";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default api;
