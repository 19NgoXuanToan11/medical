import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/auth/AuthContext";
import { staffService } from "../../../utils/staff/staffService";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiLoader,
  FiShield,
  FiBarChart,
} from "react-icons/fi";

const NurseProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Profile data matching exact API schema
  const [profileData, setProfileData] = useState({
    staffId: 0,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    roleId: 0,
    roleName: "",
    studentCount: 0,
    healthEventCount: 0,
    parentCount: 0,
    medicineRequestCount: 0,
  });

  const [editedData, setEditedData] = useState(profileData);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await staffService.getStaffById(user.id);

        if (response.success && response.data) {
          const apiData = response.data;

          // Map API data exactly as received
          const updatedProfile = {
            staffId: apiData.staffId,
            username: apiData.username,
            email: apiData.email,
            firstName: apiData.firstName,
            lastName: apiData.lastName,
            phone: apiData.phone || "",
            roleId: apiData.roleId,
            roleName: apiData.roleName,
            studentCount: apiData.studentCount || 0,
            healthEventCount: apiData.healthEventCount || 0,
            parentCount: apiData.parentCount || 0,
            medicineRequestCount: apiData.medicineRequestCount || 0,
          };

          setProfileData(updatedProfile);
          setEditedData(updatedProfile);
        } else {
          setError(response.message || "Không thể tải thông tin hồ sơ");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Có lỗi xảy ra khi tải thông tin hồ sơ");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  // Show notification
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = async () => {
    if (!editedData.staffId) {
      showNotification(
        "Không thể cập nhật: thiếu thông tin nhân viên",
        "error"
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Prepare data for API (only include API-supported fields)
      const updateData = {
        staffId: editedData.staffId,
        username: editedData.username,
        email: editedData.email,
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        phone: editedData.phone,
        roleId: editedData.roleId,
      };

      const response = await staffService.updateStaff(
        editedData.staffId,
        updateData
      );

      if (response.success) {
        // Update the profile data with the edited data
        setProfileData(editedData);
        setIsEditing(false);
        showNotification("Cập nhật hồ sơ thành công!", "success");
      } else {
        setError(response.message || "Không thể cập nhật hồ sơ");
        showNotification(
          response.message || "Không thể cập nhật hồ sơ",
          "error"
        );
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = "Có lỗi xảy ra khi cập nhật hồ sơ";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentData = isEditing ? editedData : profileData;

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
            <div className="flex items-center justify-center">
              <FiLoader className="w-8 h-8 animate-spin text-primary-600" />
              <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                Đang tải thông tin hồ sơ...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Notification */}
        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                : notification.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600 rounded-t-lg"></div>

            {/* Profile Picture */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white dark:bg-neutral-800 rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                    {currentData.firstName.charAt(0)}
                    {currentData.lastName.charAt(0)}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 rounded-full p-2 text-white hover:bg-primary-700 transition-colors">
                    <FiCamera className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm px-4 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {saving ? (
                      <FiLoader className="w-4 h-4 animate-spin" />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    {saving ? "Đang lưu..." : "Lưu"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <FiX className="w-4 h-4" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {currentData.firstName} {currentData.lastName}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                Thông tin cá nhân
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <FiUser className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      {currentData.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Họ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <FiUser className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      {currentData.lastName}
                    </div>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tên đăng nhập
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <FiUser className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      {currentData.username}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <FiMail className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      {currentData.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Nhập số điện thoại"
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <FiPhone className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                      {currentData.phone || "Chưa cập nhật"}
                    </div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Vai trò
                  </label>
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                    <FiShield className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {currentData.roleName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <div className="flex items-center gap-2 mb-6">
                <FiBarChart className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Thống kê công việc
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Học sinh chăm sóc
                  </span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300 text-lg">
                    {currentData.studentCount.toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Sự kiện y tế
                  </span>
                  <span className="font-semibold text-green-700 dark:text-green-300 text-lg">
                    {currentData.healthEventCount.toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Yêu cầu thuốc
                  </span>
                  <span className="font-semibold text-orange-700 dark:text-orange-300 text-lg">
                    {currentData.medicineRequestCount.toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Phụ huynh liên hệ
                  </span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300 text-lg">
                    {currentData.parentCount.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseProfile;
