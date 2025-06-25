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
  FiBriefcase,
  FiHeart,
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 mb-8 overflow-hidden">
          <div className="relative">
            {/* Cover Image */}
            <div className="h-40 bg-gradient-to-r from-primary-500 via-primary-600 to-blue-600"></div>

            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="w-32 h-32 bg-white dark:bg-neutral-800 rounded-full p-1 shadow-xl">
                  <div className="w-full h-full bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {currentData.firstName.charAt(0)}
                    {currentData.lastName.charAt(0)}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 bg-primary-600 rounded-full p-3 text-white hover:bg-primary-700 transition-colors shadow-lg">
                    <FiCamera className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm px-6 py-3 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200 flex items-center gap-2 shadow-lg border border-neutral-200 dark:border-neutral-600"
                >
                  <FiEdit2 className="w-5 h-5" />
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <FiSave className="w-5 h-5" />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-neutral-500 dark:bg-neutral-600 text-white px-6 py-3 rounded-lg hover:bg-neutral-600 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <FiX className="w-5 h-5" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {currentData.firstName} {currentData.lastName}
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                <FiBriefcase className="w-5 h-5" />
                {currentData.occupation}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                Phụ huynh của {children.length} học sinh
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Personal Information */}
          <div className="xl:col-span-3 space-y-8">
            {/* Basic Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-8 flex items-center gap-3">
                <FiUser className="w-6 h-6 text-primary-600" />
                Thông tin cá nhân
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiUser className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.firstName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Họ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiUser className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.lastName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={currentData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiMail className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiPhone className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.phone}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Ngày sinh
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={currentData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiCalendar className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {new Date(currentData.dateOfBirth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Occupation */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Nghề nghiệp
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentData.occupation}
                      onChange={(e) =>
                        handleInputChange("occupation", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiBriefcase className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.occupation}
                      </span>
                    </div>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Liên hệ khẩn cấp
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={currentData.emergencyContact}
                      onChange={(e) =>
                        handleInputChange("emergencyContact", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiPhone className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.emergencyContact}
                      </span>
                    </div>
                  )}
                </div>

                {/* Relationship */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Mối quan hệ
                  </label>
                  {isEditing ? (
                    <select
                      value={currentData.relationship}
                      onChange={(e) =>
                        handleInputChange("relationship", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    >
                      <option value="Bố/Mẹ">Bố/Mẹ</option>
                      <option value="Ông/Bà">Ông/Bà</option>
                      <option value="Anh/Chị">Anh/Chị</option>
                      <option value="Khác">Khác</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <FiHeart className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                        {currentData.relationship}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="mt-8 space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <textarea
                    value={currentData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <FiMapPin className="w-5 h-5 text-neutral-500 dark:text-neutral-400 flex-shrink-0" />
                    <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                      {currentData.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="mt-8 space-y-3">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Giới thiệu
                </label>
                {isEditing ? (
                  <textarea
                    value={currentData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                    placeholder="Viết vài dòng về bản thân..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed">
                      {currentData.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Children Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                  <FiUsers className="w-6 h-6 text-primary-600" />
                  Thông tin con em
                </h2>
                <button className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                  <FiPlus className="w-4 h-4" />
                  Thêm con
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="border border-neutral-200 dark:border-neutral-600 rounded-xl p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 bg-neutral-50 dark:bg-neutral-700"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                          {child.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                          {child.name}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Lớp {child.class}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Mã học sinh:
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                          {child.studentId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Ngày sinh:
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {new Date(child.dateOfBirth).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Nhóm máu:
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-neutral-100 font-semibold">
                          {child.bloodType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Dị ứng:
                        </span>
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {child.allergies}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                Thống kê
              </h3>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {children.length}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Số con
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    3
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Yêu cầu thuốc
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    12
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Kiểm tra y tế
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    8
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    Tiêm chủng
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-600">
                <div className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                  Thành viên từ
                </div>
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 text-center mt-1">
                  Tháng 9, 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
