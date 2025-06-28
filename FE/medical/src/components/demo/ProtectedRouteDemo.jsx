import React, { useState } from "react";
import { useAuth } from "../../utils/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRouteDemo = () => {
  const { user, hasRole, hasAnyRole, ROLES } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const roleTests = [
    {
      path: "/admin/dashboard",
      allowedRoles: ["admin"],
      description: "Admin Dashboard",
    },
    {
      path: "/manager/dashboard",
      allowedRoles: ["manager"],
      description: "Manager Dashboard",
    },
    {
      path: "/nurse/dashboard",
      allowedRoles: ["nurse"],
      description: "Nurse Dashboard",
    },
    {
      path: "/parent/dashboard",
      allowedRoles: ["parent"],
      description: "Parent Dashboard",
    },
    {
      path: "/student/dashboard",
      allowedRoles: ["student"],
      description: "Student Dashboard",
    },
  ];

  const testAccess = (path) => {
    navigate(path);
  };

  const simulateRole = (role) => {
    // Chỉ để demo - trong thực tế, role được quản lý qua đăng nhập
    setSelectedRole(role);
    alert(
      `Demo: Đang mô phỏng vai trò "${role}". Trong thực tế, vai trò được lấy từ JWT token sau khi đăng nhập.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Demo Hệ Thống Bảo Mật URL
      </h2>

      {/* Current User Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Thông Tin Người Dùng Hiện Tại
        </h3>
        {user ? (
          <div className="space-y-2">
            <p className="text-blue-800 dark:text-blue-200">
              <span className="font-medium">Tên:</span>{" "}
              {user.username || user.email}
            </p>
            <p className="text-blue-800 dark:text-blue-200">
              <span className="font-medium">Vai trò:</span>
              <span className="ml-2 px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded text-sm font-medium">
                {user.role}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-blue-800 dark:text-blue-200">Chưa đăng nhập</p>
        )}
      </div>

      {/* Role Simulation (Demo Only) */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
          Mô Phỏng Vai Trò (Chỉ Demo)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(ROLES).map((role) => (
            <button
              key={role}
              onClick={() => simulateRole(role)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedRole === role
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-300 dark:hover:bg-yellow-600"
              }`}
            >
              {role.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Access Tests */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Kiểm Tra Quyền Truy Cập
        </h3>
        <div className="space-y-3">
          {roleTests.map((test, index) => {
            const canAccess = hasAnyRole(test.allowedRoles);
            const currentUserRole = user?.role || "không có";

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  canAccess
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {test.description}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({test.path})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Yêu cầu vai trò: {test.allowedRoles.join(", ")} | Vai trò
                    hiện tại: {currentUserRole}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      canAccess
                        ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {canAccess ? "Có quyền" : "Không có quyền"}
                  </span>

                  <button
                    onClick={() => testAccess(test.path)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                  >
                    Thử truy cập
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Hướng Dẫn Sử Dụng
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <p>
            1. <strong>Có quyền:</strong> Bạn sẽ được chuyển đến trang được yêu
            cầu
          </p>
          <p>
            2. <strong>Không có quyền:</strong> Bạn sẽ được chuyển đến trang
            "Không có quyền truy cập"
          </p>
          <p>
            3. <strong>Chưa đăng nhập:</strong> Bạn sẽ được chuyển đến trang
            đăng nhập
          </p>
          <p>
            4. <strong>Trong production:</strong> Vai trò sẽ được lấy từ JWT
            token sau khi đăng nhập thành công
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRouteDemo;
