import React, { useState, useEffect } from "react";
import { useParent } from "../../../utils/auth/ParentContext";
import healthProfileService from "../../../utils/api/health-profile/healthProfileService";
import {
  FiUser,
  FiEye,
  FiAlertCircle,
  FiActivity,
  FiHeart,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

const HealthProfileList = () => {
  const { students } = useParent();
  const [healthProfiles, setHealthProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch health profiles for all students
  const fetchAllHealthProfiles = async () => {
    if (!students || students.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const profilePromises = students.map((student) =>
        healthProfileService
          .getByStudentCode(student.studentCode)
          .catch((err) => {
            console.error(
              `Error fetching profile for ${student.studentCode}:`,
              err
            );
            return {
              studentCode: student.studentCode,
              student: student,
              error: true,
              errorMessage: "Không thể tải hồ sơ",
            };
          })
      );

      const profiles = await Promise.all(profilePromises);
      setHealthProfiles(profiles);
    } catch (err) {
      console.error("Error fetching health profiles:", err);
      setError("Không thể tải hồ sơ sức khỏe");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all health profiles when students change
  useEffect(() => {
    if (students && students.length > 0) {
      fetchAllHealthProfiles();
    }
  }, [students]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatGender = (gender) => {
    if (!gender) return "N/A";
    const genderLower = gender.toLowerCase();
    if (genderLower === "male" || genderLower === "nam") return "Nam";
    if (
      genderLower === "female" ||
      genderLower === "nữ" ||
      genderLower === "nu"
    )
      return "Nữ";
    return "N/A";
  };

  const getHealthStatusColor = (hasIssues) => {
    if (hasIssues)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  };

  const getHealthStatusText = (hasIssues) => {
    if (hasIssues) return "Cần theo dõi";
    return "Bình thường";
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Hồ sơ sức khỏe học sinh
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs">
              Quản lý thông tin sức khỏe học sinh và cập nhật khi có thay đổi
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Tổng số: {students.length} học sinh
            </span>
            <button
              onClick={fetchAllHealthProfiles}
              disabled={loading}
              className="flex items-center px-3 py-2 text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              <FiRefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-neutral-600 dark:text-neutral-400">
            Đang tải hồ sơ sức khỏe...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Health Profiles List */}
      {!loading && healthProfiles.length > 0 && (
        <div className="space-y-8">
          {healthProfiles.map((healthProfile, index) => {
            const student =
              healthProfile.student ||
              students.find((s) => s.studentCode === healthProfile.studentCode);

            if (healthProfile.error) {
              return (
                <div
                  key={healthProfile.studentCode || index}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mr-4">
                      <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                        {student?.name || "Học sinh không xác định"}
                      </h3>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {healthProfile.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            const studentName =
              student?.name ||
              healthProfile.student?.firstName +
                " " +
                healthProfile.student?.lastName;

            return (
              <div
                key={healthProfile.studentCode || index}
                className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700"
              >
                {/* Profile Header */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                      <FiUser className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                        Hồ sơ sức khỏe - {studentName}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Mã học sinh: {healthProfile.studentCode} | Lớp:{" "}
                        {student?.className || healthProfile.student?.className}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-8">
                    {/* Student Basic Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                        <FiUser className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                        Thông tin học sinh
                      </h4>
                      <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Mã học sinh
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {healthProfile.studentCode ||
                                student?.studentCode}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Họ và tên
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {studentName}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Lớp
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {healthProfile.student?.className ||
                                student?.className}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Ngày sinh
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {formatDate(
                                healthProfile.student?.dateOfBirth ||
                                  student?.dateOfBirth
                              )}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Giới tính
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {formatGender(
                                healthProfile.student?.gender || student?.gender
                              )}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Cập nhật lần cuối
                            </label>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                              {formatDate(healthProfile.lastUpdated)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Physical Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                        <FiActivity className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                        Thông tin thể chất
                      </h4>
                      <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Chiều cao
                            </label>
                            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                              {healthProfile.height
                                ? `${healthProfile.height} cm`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Cân nặng
                            </label>
                            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                              {healthProfile.weight
                                ? `${healthProfile.weight} kg`
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Nhóm máu
                            </label>
                            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                              {healthProfile.bloodType || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Huyết áp
                            </label>
                            <p className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                              {healthProfile.bloodPressure || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Conditions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Vision */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                          <FiEye className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                          Thị lực
                        </h4>
                        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Tình trạng
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(
                                healthProfile.hasVisionIssues
                              )}`}
                            >
                              {getHealthStatusText(
                                healthProfile.hasVisionIssues
                              )}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Mắt trái
                              </label>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {healthProfile.leftEye || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Mắt phải
                              </label>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {healthProfile.rightEye || "N/A"}
                              </p>
                            </div>
                          </div>
                          {healthProfile.visionNotes && (
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600">
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Ghi chú
                              </label>
                              <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                                {healthProfile.visionNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Allergies */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                          <FiAlertCircle className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                          Dị ứng
                        </h4>
                        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Có dị ứng
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(
                                healthProfile.hasAllergies
                              )}`}
                            >
                              {healthProfile.hasAllergies ? "Có" : "Không"}
                            </span>
                          </div>
                          {healthProfile.allergyDetails && (
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Chi tiết
                              </label>
                              <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                                {healthProfile.allergyDetails}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medical History & Other Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Chronic Diseases */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                          <FiHeart className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                          Bệnh mãn tính
                        </h4>
                        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Có bệnh mãn tính
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(
                                healthProfile.hasChronicDiseases
                              )}`}
                            >
                              {healthProfile.hasChronicDiseases
                                ? "Có"
                                : "Không"}
                            </span>
                          </div>
                          {healthProfile.chronicDetails && (
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Chi tiết
                              </label>
                              <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                                {healthProfile.chronicDetails}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vaccination History */}
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                          <FiShield className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                          Lịch sử tiêm chủng
                        </h4>
                        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Tiêm chủng đầy đủ
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                healthProfile.hasCompleteVaccinations
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}
                            >
                              {healthProfile.hasCompleteVaccinations
                                ? "Đầy đủ"
                                : "Chưa đầy đủ"}
                            </span>
                          </div>
                          {healthProfile.vaccinationDetails && (
                            <div>
                              <label className="text-sm text-neutral-600 dark:text-neutral-400">
                                Chi tiết
                              </label>
                              <p className="text-sm text-neutral-900 dark:text-neutral-100 mt-1">
                                {healthProfile.vaccinationDetails}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact & Other Info */}
                    {(healthProfile.emergencyContact ||
                      healthProfile.otherInfo) && (
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                          Thông tin khác
                        </h4>
                        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 space-y-4">
                          {healthProfile.emergencyContact && (
                            <div>
                              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Liên hệ khẩn cấp
                              </label>
                              <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                                {healthProfile.emergencyContact}
                              </p>
                            </div>
                          )}
                          {healthProfile.otherInfo && (
                            <div>
                              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                Thông tin bổ sung
                              </label>
                              <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-100">
                                {healthProfile.otherInfo}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Students State */}
      {!loading && students.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Chưa có học sinh nào
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Hiện tại chưa có thông tin học sinh nào trong hệ thống
          </p>
        </div>
      )}

      {/* No Profiles State */}
      {!loading &&
        students.length > 0 &&
        healthProfiles.length === 0 &&
        !error && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Chưa có hồ sơ sức khỏe
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              Các học sinh chưa có hồ sơ sức khỏe trong hệ thống
            </p>
            <button
              onClick={fetchAllHealthProfiles}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Thử tải lại
            </button>
          </div>
        )}
    </div>
  );
};

export default HealthProfileList;
