import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "./authService";

// Tạo context cho xác thực
const AuthContext = createContext(null);

// Role constants
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  MANAGER: "manager",
  NURSE: "nurse",
  PARENT: "parent",
  STUDENT: "student",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem đã có thông tin đăng nhập được lưu trong localStorage chưa
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = authService.getToken();

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập với API
  const login = async (loginData) => {
    try {
      const response = await authService.login(loginData);

      const userData = {
        id: response.id || response.Id, // API có thể trả về cả id hoặc Id
        username: response.username || response.Username,
        email: response.email || response.Email,
        firstName: response.firstName || response.FirstName,
        lastName: response.lastName || response.LastName,
        role: (response.role || response.Role)?.toLowerCase() || "parent",
        token: response.token || response.Token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    authService.logout();
  };

  // Kiểm tra người dùng có vai trò cụ thể không
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = () => {
    return !!user && !!authService.getToken();
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
    ROLES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
