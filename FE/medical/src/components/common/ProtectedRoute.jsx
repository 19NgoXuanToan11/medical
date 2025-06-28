import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../utils/auth/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo = null,
}) => {
  const { user, loading, isAuthenticated, hasAnyRole } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log("ProtectedRoute debug:", {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    allowedRoles,
    currentPath: location.pathname,
    hasAnyRole:
      allowedRoles.length > 0 ? hasAnyRole(allowedRoles) : "not checked",
  });

  // Hiển thị loading trong khi kiểm tra auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Đang kiểm tra quyền truy cập...
          </p>
        </div>
      </div>
    );
  }

  // Nếu yêu cầu đăng nhập nhưng chưa đăng nhập
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có danh sách vai trò được phép và user không có vai trò phù hợp
  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    // Nếu có redirectTo được chỉ định, chuyển hướng đến đó
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Ngược lại, chuyển hướng đến trang Unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu tất cả kiểm tra đều pass, render children
  return children;
};

// Component wrapper để dễ sử dụng cho từng vai trò cụ thể
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const ManagerRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["manager"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const NurseRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["nurse"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const ParentRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["parent"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const StudentRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["student"]} {...props}>
    {children}
  </ProtectedRoute>
);

// Component cho staff (nurse + manager + admin)
export const StaffRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["nurse", "manager", "admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

// Component cho quản lý (manager + admin)
export const ManagementRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={["manager", "admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
