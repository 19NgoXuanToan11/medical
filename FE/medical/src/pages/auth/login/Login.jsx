import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import medicalVideo from "../../../../public/videos/login.mp4";
import { useAuth, ROLES } from "../../../utils/auth/AuthContext";
import authService from "../../../utils/auth/authService";
import ThemeToggle from "../../../components/common/ThemeToggle";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get role from URL parameter if available
  const getInitialRole = () => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    return roleParam || "parent"; // Default to parent if not specified
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: getInitialRole(),
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Update role if URL parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const roleParam = searchParams.get("role");
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }));
      // Clear validation errors when role changes
      setValidationErrors({});
    }
  }, [location.search]);

  // Validation functions
  const validateUsername = (value, role) => {
    if (!value.trim()) {
      return "";
    }

    if (role === "parent") {
      // For parent (phone number): only allow numbers
      const phoneRegex = /^[0-9]*$/;
      if (!phoneRegex.test(value)) {
        return "Số điện thoại chỉ được phép nhập số";
      }
      // Optional: validate phone number length (Vietnamese phone numbers)
      if (value.length > 0 && (value.length < 10 || value.length > 11)) {
        return "Số điện thoại phải có 10-11 chữ số";
      }
    } else if (role === "student") {
      // For student (student code): allow letters, numbers, and some special characters
      const studentCodeRegex =
        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ_-]*$/;
      if (!studentCodeRegex.test(value)) {
        return "Mã học sinh chỉ được phép nhập chữ cái, số và dấu gạch ngang, gạch dưới";
      }
    } else {
      // For admin, manager, nurse (username): allow letters, numbers, and underscore
      const usernameRegex =
        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ_]*$/;
      if (!usernameRegex.test(value)) {
        return "Tên đăng nhập chỉ được phép nhập chữ cái, số và dấu gạch dưới";
      }
    }
    return "";
  };

  // Validate if account format matches the selected role
  const validateAccountRoleMatch = (username, role) => {
    if (!username.trim()) {
      return "";
    }

    const isPhoneNumber = /^[0-9]{10,11}$/.test(username);
    const isUsernameFormat = /^[a-zA-Z]/.test(username); // Starts with letter

    const roleLabels = {
      parent: "phụ huynh",
      manager: "quản lý",
      nurse: "nhân viên y tế",
      admin: "quản trị viên",
      student: "học sinh",
    };

    if (role === "parent" && !isPhoneNumber) {
      return `Bạn đang chọn vai trò ${roleLabels[role]} nhưng nhập định dạng tên đăng nhập. Vui lòng nhập số điện thoại hoặc chọn vai trò phù hợp.`;
    }

    if (role !== "parent" && isPhoneNumber) {
      return `Bạn đang nhập số điện thoại nhưng chọn vai trò ${roleLabels[role]}. Vui lòng chọn vai trò "Phụ huynh" hoặc nhập tên đăng nhập phù hợp.`;
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle username validation
    if (name === "username") {
      const validationError = validateUsername(value, formData.role);
      const roleMatchError = validateAccountRoleMatch(value, formData.role);

      setValidationErrors((prev) => ({
        ...prev,
        username: validationError,
        roleMatch: roleMatchError,
      }));

      // Only update the value if it passes basic format validation
      if (formData.role === "parent") {
        // For phone number: only allow numbers
        if (/^[0-9]*$/.test(value)) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      } else if (formData.role === "student") {
        // For student code: allow letters, numbers, underscore, and hyphen
        if (
          /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ_-]*$/.test(
            value
          )
        ) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      } else {
        // For admin, manager, nurse: allow letters, numbers, and underscore
        if (
          /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ_]*$/.test(
            value
          )
        ) {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      }
    } else if (name === "role") {
      // When role changes, check if current username format matches new role
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear validation errors when role changes
      setValidationErrors({});

      // Check account-role match for the new role
      if (formData.username.trim()) {
        const roleMatchError = validateAccountRoleMatch(
          formData.username,
          value
        );
        if (roleMatchError) {
          setValidationErrors((prev) => ({
            ...prev,
            roleMatch: roleMatchError,
          }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear general error when user changes input
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.username.trim() === "" || formData.password.trim() === "") {
      setError("Vui lòng nhập đầy đủ thông tin đăng nhập");
      setIsLoading(false);
      return;
    }

    // Check for validation errors
    const usernameError = validateUsername(formData.username, formData.role);
    const roleMatchError = validateAccountRoleMatch(
      formData.username,
      formData.role
    );

    if (usernameError || roleMatchError) {
      setValidationErrors({
        username: usernameError,
        roleMatch: roleMatchError,
      });
      setError("Vui lòng sửa các lỗi trong form");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare login data for API
      const loginData = {
        Username: formData.username,
        Password: formData.password,
        Role: formData.role,
      };

      // Call API login
      const userData = await login(loginData);

      // Verify that the user's actual role matches the selected role
      if (userData.role !== formData.role) {
        const roleLabels = {
          admin: "quản trị viên",
          manager: "quản lý",
          nurse: "nhân viên y tế",
          parent: "phụ huynh",
          student: "học sinh",
        };

        const selectedRoleLabel = roleLabels[formData.role] || formData.role;
        const actualRoleLabel = roleLabels[userData.role] || userData.role;

        throw new Error(
          `Bạn đã chọn vai trò "${selectedRoleLabel}" nhưng tài khoản này là "${actualRoleLabel}". Vui lòng chọn đúng vai trò của tài khoản hoặc sử dụng tài khoản phù hợp.`
        );
      }

      // Redirect to the appropriate dashboard based on the verified role
      const redirectMap = {
        admin: "/admin/dashboard",
        staff: "/nurse/dashboard",
        manager: "/manager/dashboard",
        nurse: "/nurse/dashboard",
        parent: "/parent/dashboard",
        student: "/student/dashboard",
      };

      navigate(redirectMap[userData.role] || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Available roles in the system
  const roles = [
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
      <div className="w-1/2 flex items-center justify-center bg-white dark:bg-neutral-800 h-screen overflow-y-auto transition-colors duration-300">
        {/* Back to Home Button */}
        <Link
          to="/"
          className="absolute top-8 right-8 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-white dark:bg-neutral-700 rounded-full shadow-md hover:bg-indigo-50 dark:hover:bg-neutral-600 transition duration-300 flex items-center gap-2"
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

        {/* Theme Toggle Button */}
        <div className="absolute top-20 right-8">
          <ThemeToggle />
        </div>

        <div className="w-4/5 max-w-md mx-auto py-12 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Chào mừng trở lại
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Đăng nhập để truy cập tài khoản của bạn
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <label
                htmlFor="role"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Tôi là
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-neutral-700 dark:text-gray-100 appearance-none"
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
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {authService.getUsernameLabel(formData.role)}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-neutral-700 dark:text-gray-100 ${
                    validationErrors.username
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder={authService.getPlaceholderText(formData.role)}
                />
              </div>
              {validationErrors.username && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.username}
                </p>
              )}
              {validationErrors.roleMatch && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {validationErrors.roleMatch}
                </p>
              )}
              {formData.role === "parent" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chỉ được phép nhập số (0-9)
                </p>
              )}
              {formData.role === "student" && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chỉ được phép nhập chữ cái, số và dấu gạch ngang, gạch dưới
                </p>
              )}
              {(formData.role === "admin" ||
                formData.role === "manager" ||
                formData.role === "nurse") && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Chỉ được phép nhập chữ cái, số và dấu gạch dưới (VD: admin1,
                  nurse2)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 dark:bg-neutral-700 dark:text-gray-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 focus:ring-indigo-500 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
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
