import React, { useState, useEffect } from "react";
import { useAuth } from "../../../utils/auth/AuthContext";
import { useParent } from "../../../utils/auth/ParentContext";
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
  const { parentData, students, loading, updateParentData } = useParent();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
    emergencyContact: "",
    relationship: "",
    bio: "",
  });

  const [editedData, setEditedData] = useState(profileData);

  // Update profile data when parentData changes
  useEffect(() => {
    if (parentData) {
      const newProfileData = {
        firstName: parentData.firstName || "",
        lastName: parentData.lastName || "",
        email: parentData.email || "",
        phone: parentData.phone || "",
        address: parentData.address || "",
        dateOfBirth: parentData.dateOfBirth || "",
        occupation: parentData.occupation || "",
        emergencyContact: parentData.isEmergencyContact ? parentData.phone : "",
        relationship: parentData.relationship || "",
        bio: "Phụ huynh quan tâm đến sức khỏe và giáo dục của con em.",
      };
      setProfileData(newProfileData);
      setEditedData(newProfileData);
    } else if (user) {
      // Use fallback data from user context when no parent data
      const fallbackData = {
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
      };
      setProfileData(fallbackData);
      setEditedData(fallbackData);
    }
  }, [parentData, user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = async () => {
    try {
      // Prepare data for API update
      const updateData = {
        parentId: parentData?.parentId || user?.id,
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        email: editedData.email,
        phone: editedData.phone,
        address: editedData.address,
        occupation: editedData.occupation,
        relationship: editedData.relationship,
        isEmergencyContact: editedData.emergencyContact ? true : false,
        isActive: true,
      };

      // Call API to update parent information using context
      await updateParentData(updateData);

      setProfileData(editedData);
      setIsEditing(false);

      // Show success message (you can add a toast notification here)
      console.log("Profile updated successfully:", editedData);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Show error message (you can add a toast notification here)
      alert("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-500 dark:text-neutral-400">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

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

                {/* Address */}
                <div className="space-y-3">
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
              </div>
            </div>

            {/* Children Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-3">
                  <FiUsers className="w-6 h-6 text-primary-600" />
                  Thông tin con em
                </h2>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-2">
                    Chưa có thông tin con em
                  </p>
                  <p className="text-neutral-400 dark:text-neutral-500 text-sm">
                    Vui lòng liên hệ nhà trường để cập nhật thông tin
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div
                      key={student.studentId}
                      className="border border-neutral-200 dark:border-neutral-600 rounded-xl p-6 hover:shadow-md dark:hover:shadow-lg transition-all duration-200 bg-neutral-50 dark:bg-neutral-700"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                            {student.name}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Lớp {student.class}
                          </p>
                          {student.isActive === false && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full mt-1">
                              Không hoạt động
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Mã học sinh:
                          </span>
                          <span className="text-sm text-neutral-900 dark:text-neutral-100 font-mono">
                            {student.studentCode || "N/A"}
                          </span>
                        </div>
                        {student.gender && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Giới tính:
                            </span>
                            <span className="text-sm text-neutral-900 dark:text-neutral-100">
                              {student.gender}
                            </span>
                          </div>
                        )}
                        {student.gradeLevel && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Khối:
                            </span>
                            <span className="text-sm text-neutral-900 dark:text-neutral-100">
                              {student.gradeLevel}
                            </span>
                          </div>
                        )}
                        {student.address && (
                          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-600">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Địa chỉ:
                            </span>
                            <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                              {student.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    {students.length}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
