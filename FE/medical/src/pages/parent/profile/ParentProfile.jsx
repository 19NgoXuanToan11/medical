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
  FiUsers,
  FiPlus,
} from "react-icons/fi";

const ParentProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "Phụ Huynh",
    lastName: user?.lastName || "Mẫu Mực",
    email: user?.email || "parent@medical.com",
    phone: "0987654321",
    address: "456 Đường Gia Đình, Quận 3, TP.HCM",
    dateOfBirth: "1985-05-15",
    occupation: "Kỹ sư phần mềm",
    emergencyContact: "0123456789",
    relationship: "Bố/Mẹ",
    bio: "Phụ huynh quan tâm đến sức khỏe và giáo dục của con em.",
  });

  // Thông tin con em (trong thực tế sẽ lấy từ API)
  const [children] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      class: "10A1",
      dateOfBirth: "2008-03-20",
      studentId: "HS2024001",
      bloodType: "O+",
      allergies: "Không có",
    },
    {
      id: 2,
      name: "Nguyễn Thị Bình",
      class: "8B2",
      dateOfBirth: "2010-07-10",
      studentId: "HS2024002",
      bloodType: "A+",
      allergies: "Đậu phộng",
    },
  ]);

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
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 mb-6">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-lg"></div>

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
            <p className="text-neutral-600">{currentData.occupation}</p>
            <p className="text-sm text-neutral-500">
              Phụ huynh của {children.length} học sinh
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
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

              {/* Occupation */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nghề nghiệp
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentData.occupation}
                    onChange={(e) =>
                      handleInputChange("occupation", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="text-neutral-900">
                    {currentData.occupation}
                  </div>
                )}
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Liên hệ khẩn cấp
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={currentData.emergencyContact}
                    onChange={(e) =>
                      handleInputChange("emergencyContact", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-neutral-900">
                    <FiPhone className="w-4 h-4 text-neutral-500" />
                    {currentData.emergencyContact}
                  </div>
                )}
              </div>

              {/* Relationship */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mối quan hệ
                </label>
                {isEditing ? (
                  <select
                    value={currentData.relationship}
                    onChange={(e) =>
                      handleInputChange("relationship", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="Bố/Mẹ">Bố/Mẹ</option>
                    <option value="Ông/Bà">Ông/Bà</option>
                    <option value="Người giám hộ">Người giám hộ</option>
                  </select>
                ) : (
                  <div className="text-neutral-900">
                    {currentData.relationship}
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

          {/* Children Information */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                <FiUsers className="w-5 h-5" />
                Thông tin con em
              </h2>
              <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1 text-sm">
                <FiPlus className="w-4 h-4" />
                Thêm con
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {child.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">
                        {child.name}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Lớp {child.class}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Mã HS:</span>
                      <span className="text-neutral-900">
                        {child.studentId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Ngày sinh:</span>
                      <span className="text-neutral-900">
                        {new Date(child.dateOfBirth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Nhóm máu:</span>
                      <span className="text-neutral-900">
                        {child.bloodType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Dị ứng:</span>
                      <span className="text-neutral-900">
                        {child.allergies}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Settings */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
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
                Quản lý quyền riêng tư
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                Xuất thông tin cá nhân
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">
              Thống kê
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Số con:</span>
                <span className="font-semibold text-neutral-900">
                  {children.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Yêu cầu thuốc:</span>
                <span className="font-semibold text-neutral-900">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Kiểm tra y tế:</span>
                <span className="font-semibold text-neutral-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Tiêm chủng:</span>
                <span className="font-semibold text-neutral-900">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
