import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth/AuthContext";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate("/login");
    } else {
      // Chuyển hướng về dashboard tương ứng với vai trò
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        case "nurse":
          navigate("/nurse/dashboard");
          break;
        case "parent":
          navigate("/parent/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <svg
            className="h-8 w-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Không có quyền truy cập
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Xin lỗi, bạn không có quyền truy cập vào trang này.
        </p>

        {/* User Info */}
        {user && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium">Vai trò:</span>{" "}
              <span className="capitalize font-medium text-blue-600 dark:text-blue-400">
                {user.role}
              </span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {user ? "Về trang chủ của tôi" : "Đăng nhập"}
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
