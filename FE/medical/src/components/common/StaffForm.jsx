import React, { useState } from "react";
import { FiEye, FiEyeOff, FiSave, FiX } from "react-icons/fi";
import { MANAGEABLE_ROLES, validateStaffData } from "../../utils/staffService";

const StaffForm = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  mode = "create", // create, edit, view
  submitting = false,
}) => {
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    const validation = validateStaffData(formData, mode === "edit");
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    onSubmit();
  };

  const isViewMode = mode === "view";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Staff ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="staffId"
            value={formData.staffId || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.staffId ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập Staff ID"
          />
          {formErrors.staffId && (
            <p className="mt-1 text-sm text-red-500">{formErrors.staffId}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên đăng nhập <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.username ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập tên đăng nhập"
          />
          {formErrors.username && (
            <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập email"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.firstName ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập tên"
          />
          <p className="mt-1 text-xs text-gray-500">
            * Tên không được viết dấu (ví dụ: An thay vì Ân)
          </p>
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.lastName ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập họ"
          />
          <p className="mt-1 text-xs text-gray-500">
            * Họ không được viết dấu (ví dụ: Nguyen thay vì Nguyễn)
          </p>
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.phone ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập số điện thoại"
          />
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
          )}
        </div>

        {/* Role ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="roleId"
            value={formData.roleId || ""}
            onChange={handleInputChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.roleId ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-50" : ""}`}
            placeholder="Nhập Role ID"
          />
          {formErrors.roleId && (
            <p className="mt-1 text-sm text-red-500">{formErrors.roleId}</p>
          )}
        </div>

        {/* Password fields (only for create/edit) */}
        {!isViewMode && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu{" "}
                {mode === "create" && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={
                    mode === "edit"
                      ? "Để trống nếu không đổi mật khẩu"
                      : "Nhập mật khẩu"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <FiEye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>

            {mode === "create" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FiEye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {isViewMode ? "Đóng" : "Hủy"}
        </button>
        {!isViewMode && (
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <FiSave />
                {mode === "create" ? "Tạo mới" : "Cập nhật"}
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default StaffForm;
