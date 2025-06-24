import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "https://localhost:7111/api";

const ComprehensiveHealthTable = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/HealthProfile`);
        setProfiles(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching health profiles:", err);
        setError(
          "Không thể tải danh sách hồ sơ sức khỏe. Vui lòng thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch (err) {
      return dateString;
    }
  };

  const formatBoolean = (value) => {
    if (value === true) return "✓";
    if (value === false) return "✗";
    return "N/A";
  };

  const getBooleanClass = (value) => {
    if (value === true) return "text-green-600 font-semibold";
    if (value === false) return "text-red-600 font-semibold";
    return "text-gray-500";
  };

  const getHealthFlags = (profile) => {
    const flags = [];
    if (profile.hasAllergies) flags.push("DỊ ỨNG");
    if (profile.hasChronicDiseases) flags.push("MÃN TÍNH");
    if (profile.hasVisionIssues) flags.push("THỊ LỰC");
    if (profile.hasHearingIssues) flags.push("THÍNH LỰC");
    if (profile.hasPreviousTreatment) flags.push("TIỀN SỬ");
    return flags.length > 0 ? flags.join(", ") : "KHÔNG CÓ";
  };

  const getHealthFlagClass = (profile) => {
    const hasIssues =
      profile.hasAllergies ||
      profile.hasChronicDiseases ||
      profile.hasVisionIssues ||
      profile.hasHearingIssues ||
      profile.hasPreviousTreatment;
    return hasIssues ? "text-orange-600 font-medium" : "text-green-600";
  };

  // Helper function to format gender display
  const formatGender = (gender) => {
    if (!gender) return "N/A";

    // Handle both English and Vietnamese formats
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

  // Helper function to format vaccination status
  const formatVaccinationStatus = (value) => {
    if (value === true || value === "Yes" || value === "yes") return "ĐẦY ĐỦ";
    if (value === false || value === "No" || value === "no") return "CHƯA ĐỦ";
    return "CHƯA CẬP NHẬT";
  };

  // Helper function to get vaccination status for styling
  const getVaccinationClass = (value) => {
    if (value === true || value === "Yes" || value === "yes")
      return "text-green-600";
    if (value === false || value === "No" || value === "no")
      return "text-orange-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-full">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-full">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">
                Tổng quan hồ sơ sức khỏe học sinh
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Xem toàn bộ thông tin sức khỏe chi tiết của tất cả học sinh
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/parent/health-profile"
                className="bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 px-4 py-2 rounded flex items-center text-sm font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Danh sách
              </Link>
              <Link
                to="/parent/health-profile/new"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Cập nhật hồ sơ
              </Link>
            </div>
          </div>
        </div>

        {/* Comprehensive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 table-fixed">
            <thead className="bg-gray-50 dark:bg-neutral-700">
              <tr>
                <th className="w-48 px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-neutral-700 z-10 border-r dark:border-neutral-600">
                  Học sinh
                </th>
                <th className="w-32 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Thể chất
                </th>
                <th className="w-36 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Chỉ số sinh tồn
                </th>
                <th className="w-28 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Tiền sử
                </th>
                <th className="w-32 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Tiêm chủng
                </th>
                <th className="w-32 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Thị/Thính lực
                </th>
                <th className="w-40 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Vấn đề sức khỏe
                </th>
                <th className="w-44 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Liên hệ khẩn cấp
                </th>
                <th className="w-28 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Cập nhật
                </th>
                <th className="w-24 px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-neutral-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {profiles.map((profile) => {
                const student = profile.student || {};
                return (
                  <tr
                    key={profile.healthProfileId}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {/* Student Info - Sticky Column */}
                    <td className="w-48 px-6 py-4 sticky left-0 bg-white dark:bg-neutral-800 z-10 border-r dark:border-neutral-600">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-neutral-400">
                          {profile.studentCode || student.studentCode}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500">
                          {student.className} - {formatGender(student.gender)}
                        </div>
                      </div>
                    </td>

                    {/* Physical Info */}
                    <td className="w-32 px-4 py-4 text-center">
                      <div className="text-sm space-y-1 text-gray-900 dark:text-neutral-100">
                        <div>Cao: {profile.height || "N/A"} cm</div>
                        <div>Nặng: {profile.weight || "N/A"} kg</div>
                        <div>Máu: {profile.bloodType || "N/A"}</div>
                      </div>
                    </td>

                    {/* Vital Signs */}
                    <td className="w-36 px-4 py-4 text-center">
                      <div className="text-sm space-y-1 text-gray-900 dark:text-neutral-100">
                        <div>HA: {profile.bloodPressure || "N/A"}</div>
                        <div>
                          Tim:{" "}
                          {profile.heartRate
                            ? `${profile.heartRate} bpm`
                            : "N/A"}
                        </div>
                      </div>
                    </td>

                    {/* Medical History */}
                    <td className="w-28 px-4 py-4 text-center">
                      <div
                        className={getBooleanClass(
                          profile.hasPreviousTreatment
                        )}
                      >
                        {formatBoolean(profile.hasPreviousTreatment)}
                      </div>
                      {profile.treatmentDetails && (
                        <div
                          className="text-xs text-gray-600 dark:text-neutral-400 mt-1 truncate"
                          title={profile.treatmentDetails}
                        >
                          {profile.treatmentDetails}
                        </div>
                      )}
                    </td>

                    {/* Vaccination */}
                    <td className="w-32 px-4 py-4 text-center">
                      <div className="text-sm">
                        <span
                          className={getVaccinationClass(
                            profile.hasCompleteVaccinations
                          )}
                        >
                          {formatVaccinationStatus(
                            profile.hasCompleteVaccinations
                          )}
                        </span>
                        {profile.vaccinations &&
                          Array.isArray(profile.vaccinations) && (
                            <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                              {profile.vaccinations.length} loại
                            </div>
                          )}
                      </div>
                    </td>

                    {/* Vision/Hearing */}
                    <td className="w-32 px-4 py-4 text-center">
                      <div className="text-sm space-y-1">
                        <div>
                          Mắt:{" "}
                          <span
                            className={getBooleanClass(profile.hasVisionIssues)}
                          >
                            {formatBoolean(profile.hasVisionIssues)}
                          </span>
                        </div>
                        <div>
                          Tai:{" "}
                          <span
                            className={getBooleanClass(
                              profile.hasHearingIssues
                            )}
                          >
                            {formatBoolean(profile.hasHearingIssues)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Health Issues */}
                    <td className="w-40 px-4 py-4 text-center">
                      <div
                        className={`text-xs font-medium ${getHealthFlagClass(
                          profile
                        )}`}
                      >
                        {getHealthFlags(profile)}
                      </div>
                    </td>

                    {/* Emergency Contact */}
                    <td className="w-44 px-4 py-4 text-center">
                      <div
                        className="text-sm text-gray-900 dark:text-neutral-100 truncate"
                        title={profile.emergencyContact || "N/A"}
                      >
                        {profile.emergencyContact || "N/A"}
                      </div>
                    </td>

                    {/* Last Updated */}
                    <td className="w-28 px-4 py-4 text-center">
                      <div className="text-sm text-gray-500 dark:text-neutral-400">
                        {formatDate(profile.lastUpdated)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="w-24 px-4 py-4 text-center">
                      <div className="flex flex-col space-y-1">
                        <Link
                          to={`/parent/health-profile/${profile.healthProfileId}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Xem
                        </Link>
                        <Link
                          to={`/parent/health-profile/edit/${profile.healthProfileId}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Sửa
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-neutral-700 border-t dark:border-neutral-600">
          <div className="flex justify-between items-center text-sm">
            <div className="text-gray-600 dark:text-neutral-300">
              Tổng số hồ sơ:{" "}
              <span className="font-semibold text-gray-900 dark:text-neutral-100">
                {profiles.length}
              </span>
            </div>
            <div className="flex space-x-6 text-xs text-gray-600 dark:text-neutral-300">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Tốt</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                <span>Cần theo dõi</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>Có vấn đề</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveHealthTable;
