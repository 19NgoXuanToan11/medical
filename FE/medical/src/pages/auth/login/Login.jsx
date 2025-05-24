import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import medicalVideo from "../../../../public/videos/login.mp4";
import { useAuth, ROLES } from "../../../utils/AuthContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithRole } = useAuth();

  // Get role from URL parameter if available
  const getInitialRole = () => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    return roleParam || "student"; // Default to student if not specified
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: getInitialRole(),
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update role if URL parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user changes input
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Map form roles to our ROLES constant
    const roleMapping = {
      student: ROLES.STUDENT,
      parent: ROLES.PARENT,
      admin: ROLES.ADMIN,
      nurse: ROLES.STAFF,
      manager: ROLES.MANAGER,
    };

    // Simple validation for demo
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu");
      setIsLoading(false);
      return;
    }

    try {
      // In a real app, you would call an API here
      setTimeout(() => {
        // For the demo, we'll use a mock login function
        const mappedRole = roleMapping[formData.role];
        loginWithRole(mappedRole);

        // Redirect to the appropriate dashboard based on role
        const redirectMap = {
          [ROLES.ADMIN]: "/admin/dashboard",
          [ROLES.STAFF]: "/staff/medication",
          [ROLES.MANAGER]: "/manager/dashboard",
          [ROLES.PARENT]: "/parent/dashboard",
          [ROLES.STUDENT]: "/student/dashboard",
        };

        navigate(redirectMap[mappedRole]);
        setIsLoading(false);
      }, 1000); // Simulating API delay
    } catch (err) {
      setError(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
      );
      setIsLoading(false);
    }
  };

  // Available roles in the system
  const roles = [
    { id: "student", label: "Học sinh" },
    { id: "parent", label: "Phụ huynh" },
    { id: "manager", label: "Quản lý" },
    { id: "nurse", label: "Nhân viên y tế" },
    { id: "admin", label: "Quản trị viên" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Video Section - Left 50% */}
      <div className="w-1/2 relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={medicalVideo} />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Form Section - Right 50% */}
      <div className="w-1/2 flex items-center justify-center bg-white h-screen overflow-y-auto">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-8 right-8 px-4 py-2 text-sm font-medium text-indigo-600 bg-white rounded-full shadow-md hover:bg-indigo-50 transition duration-300 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Trang chủ
        </Link>

        <div className="w-4/5 max-w-md mx-auto py-12 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600">
              Đăng nhập để truy cập tài khoản của bạn
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Tôi là
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 appearance-none"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
