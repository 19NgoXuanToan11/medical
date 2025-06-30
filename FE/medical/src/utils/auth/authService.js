// API Configuration - you can change this URL to match your backend
const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  "https://localhost:7111";

class AuthService {
  // Helper function to format role for backend API
  formatRoleForAPI(role) {
    const roleMapping = {
      admin: "Admin",
      staff: "Staff",
      manager: "Manager",
      nurse: "Nurse",
      parent: "Parent",
      student: "Student",
    };
    return roleMapping[role] || role;
  }

  async login(loginData) {
    try {
      // Format the role properly
      const formattedLoginData = {
        ...loginData,
        Role: this.formatRoleForAPI(loginData.Role),
      };

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedLoginData),
      });

      if (!response.ok) {
        let errorMessage = "Đăng nhập thất bại";

        try {
          const errorData = await response.json();

          // Check if the error is related to role permissions
          if (
            errorData.message &&
            (errorData.message.toLowerCase().includes("permission") ||
              errorData.message.toLowerCase().includes("role") ||
              errorData.message.toLowerCase().includes("access") ||
              errorData.message.toLowerCase().includes("unauthorized role"))
          ) {
            const roleLabels = {
              admin: "quản trị viên",
              manager: "quản lý",
              nurse: "nhân viên y tế",
              parent: "phụ huynh",
              student: "học sinh",
            };
            const roleName =
              roleLabels[loginData.Role.toLowerCase()] || loginData.Role;
            errorMessage = `Tài khoản của bạn không có quyền được phép truy cập vai trò của ${roleName}`;
          } else {
            errorMessage = errorData.message || errorData || errorMessage;
          }
        } catch (e) {
          // If response is not JSON, handle different status codes
          if (response.status === 401) {
            errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";
          } else if (response.status === 403) {
            // Forbidden - likely a role permission issue
            const roleLabels = {
              admin: "quản trị viên",
              manager: "quản lý",
              nurse: "nhân viên y tế",
              parent: "phụ huynh",
              student: "học sinh",
            };
            const roleName =
              roleLabels[loginData.Role.toLowerCase()] || loginData.Role;
            errorMessage = `Tài khoản của bạn không có quyền được phép truy cập vai trò của ${roleName}`;
          } else if (response.status === 400) {
            errorMessage = "Thông tin đăng nhập không hợp lệ";
          } else if (response.status >= 500) {
            errorMessage = "Lỗi server. Vui lòng thử lại sau";
          } else {
            errorMessage = `Lỗi: ${response.status} ${response.statusText}`;
          }
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Save token to localStorage
      if (data.Token) {
        localStorage.setItem("token", data.Token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng"
        );
      }

      throw error;
    }
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // Get placeholder text based on role
  getPlaceholderText(role) {
    switch (role) {
      case "admin":
        return "Nhập tên đăng nhập (admin)";
      case "staff":
      case "manager":
      case "nurse":
        return "Nhập tên đăng nhập";
      case "student":
        return "Nhập mã học sinh";
      case "parent":
        return "Nhập số điện thoại";
      default:
        return "Nhập tên đăng nhập";
    }
  }

  // Get username label based on role
  getUsernameLabel(role) {
    switch (role) {
      case "student":
        return "Mã học sinh";
      case "parent":
        return "Số điện thoại";
      default:
        return "Tên đăng nhập";
    }
  }
}

export default new AuthService();
