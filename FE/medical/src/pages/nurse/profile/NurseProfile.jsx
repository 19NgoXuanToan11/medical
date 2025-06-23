import React, { useState } from "react";
import { useAuth } from "../../../utils/auth/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
} from "react-icons/fi";

const NurseProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "Y Tá",
    lastName: user?.lastName || "Chuyên Nghiệp",
    email: user?.email || "nurse@medical.com",
    phone: "0123456789",
    address: "123 Đường Y Tế, Quận 1, TP.HCM",
    dateOfBirth: "1990-01-01",
    specialization: "Y tá trường học",
    licenseNumber: "YT2024001",
    department: "Phòng Y Tế Trường",
    workingHours: "7:00 - 17:00",
    experience: "5 năm",
    bio: "Y tá có kinh nghiệm trong chăm sóc sức khỏe học sinh và quản lý y tế trường học.",
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    // Trong thực tế, bạn sẽ gọi API để cập nhật thông tin
    console.log("Saving profile data:", editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const currentData = isEditing ? editedData : profileData;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-teal-500 rounded-t-lg"></div>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
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
                className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-neutral-700 hover:bg-white transition-colors flex items-center gap-2"
              >
                <FiEdit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Lưu
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white/90 backdrop-blur-sm text-neutral-700 px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
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
            <h1 className="text-2xl font-bold text-neutral-900">
              {currentData.firstName} {currentData.lastName}
            </h1>
            <p className="text-neutral-600">{currentData.specialization}</p>
            <p className="text-sm text-neutral-500">{currentData.department}</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              Thông tin cá nhân
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiUser className="w-4 h-4 text-neutral-500" />
                    {currentData.firstName}
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Họ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiUser className="w-4 h-4 text-neutral-500" />
                    {currentData.lastName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={currentData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiMail className="w-4 h-4 text-neutral-500" />
                    {currentData.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={currentData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiPhone className="w-4 h-4 text-neutral-500" />
                    {currentData.phone}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Ngày sinh
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={currentData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiCalendar className="w-4 h-4 text-neutral-500" />
                    {new Date(currentData.dateOfBirth).toLocaleDateString(
                      "vi-VN"
                    )}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <textarea
                    value={currentData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiMapPin className="w-4 h-4 text-neutral-500" />
                    {currentData.address}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Giới thiệu
              </label>
              {isEditing ? (
                <textarea
                  value={currentData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                />
              ) : (
                <p className="text-neutral-700 leading-relaxed">
                  {currentData.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
              Thông tin nghề nghiệp
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Chuyên môn
                </label>
                <p className="text-neutral-900">{currentData.specialization}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Số chứng chỉ hành nghề
                </label>
                <p className="text-neutral-900">{currentData.licenseNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phòng ban
                </label>
                <p className="text-neutral-900">{currentData.department}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Giờ làm việc
                </label>
                <p className="text-neutral-900">{currentData.workingHours}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Kinh nghiệm
                </label>
                <p className="text-neutral-900">{currentData.experience}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Thao tác nhanh
            </h2>

            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                Đổi mật khẩu
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                Cài đặt thông báo
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                Xuất thông tin cá nhân
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseProfile;
