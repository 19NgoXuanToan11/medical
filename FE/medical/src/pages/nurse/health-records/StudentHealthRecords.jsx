import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiUser,
  FiHeart,
  FiAlertTriangle,
  FiCalendar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiActivity,
  FiInfo,
  FiRefreshCw,
  FiDownload,
} from "react-icons/fi";
import healthProfileService from "../../../utils/api/health-profile/healthProfileService";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateWithContext,
  formatDuration,
  formatRelativeTime
} from "../../../utils/timeUtils";

const StudentHealthRecords = () => {
  const [healthProfiles, setHealthProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load assigned students' health profiles
  useEffect(() => {
    loadHealthProfiles();
  }, []);

  const loadHealthProfiles = async () => {
    try {
      setLoading(true);
      const data = await healthProfileService.getMyAssignedStudents();
      setHealthProfiles(data);
    } catch (error) {
      console.error("Lỗi khi tải hồ sơ sức khỏe:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredProfiles = healthProfiles.filter((profile) => {
    const matchesSearch =
      profile.student?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      profile.student?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      profile.studentCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade =
      !filterGrade || profile.student?.gradeLevel?.toString() === filterGrade;
    const matchesClass =
      !filterClass || profile.student?.className?.includes(filterClass);

    return matchesSearch && matchesGrade && matchesClass;
  });

  // Get unique grades and classes from the data
  const availableGrades = [
    ...new Set(
      healthProfiles.map((p) => p.student?.gradeLevel).filter(Boolean)
    ),
  ].sort();
  const availableClasses = [
    ...new Set(healthProfiles.map((p) => p.student?.className).filter(Boolean)),
  ].sort();

  const handleViewDetail = (profile) => {
    setSelectedProfile(profile);
    setShowDetailModal(true);
  };

  const getHealthStatusColor = (profile) => {
    if (profile.hasAllergies || profile.hasChronicDiseases)
      return "text-red-600";
    if (profile.hasPreviousTreatment) return "text-yellow-600";
    return "text-green-600";
  };

  const getHealthStatusText = (profile) => {
    if (profile.hasAllergies || profile.hasChronicDiseases) return "Cần chú ý";
    if (profile.hasPreviousTreatment) return "Bình thường";
    return "Tốt";
  };

  // formatDate function is now imported from timeUtils
  const formatDateWithFallback = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return formatDate(dateString);
  };

  const getBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return { text: "Chưa đo", color: "text-gray-500" };
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: "Thiếu cân", color: "text-blue-600" };
    if (bmiValue < 25) return { text: "Bình thường", color: "text-green-600" };
    if (bmiValue < 30) return { text: "Thừa cân", color: "text-yellow-600" };
    return { text: "Béo phì", color: "text-red-600" };
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              Hồ sơ sức khỏe học sinh
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Quản lý và theo dõi tình trạng sức khỏe của các học sinh thuộc
              khối bạn phụ trách
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={loadHealthProfiles}
              className="flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiRefreshCw className="h-4 w-4 mr-2" />
              Làm mới
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {healthProfiles.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Tổng học sinh
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {
                healthProfiles.filter(
                  (p) => !p.hasAllergies && !p.hasChronicDiseases
                ).length
              }
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Sức khỏe tốt
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {healthProfiles.filter((p) => p.hasAllergies).length}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Có dị ứng
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {healthProfiles.filter((p) => p.hasChronicDiseases).length}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Bệnh mãn tính
            </div>
          </div>
        </div>
      </div>

      {/* Health Profiles List */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-neutral-500 dark:text-neutral-400">
              Đang tải hồ sơ sức khỏe...
            </span>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
            <FiUser className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p className="text-lg font-medium mb-1">Không có hồ sơ nào</p>
            <p className="text-sm">
              {healthProfiles.length === 0
                ? "Bạn chưa được phân công quản lý khối nào hoặc chưa có học sinh nào có hồ sơ sức khỏe"
                : "Không tìm thấy hồ sơ nào phù hợp với bộ lọc"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Chiều cao/Cân nặng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    BMI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tình trạng sức khỏe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Cập nhật gần nhất
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredProfiles.map((profile) => {
                  const bmi = getBMI(profile.height, profile.weight);
                  const bmiStatus = getBMIStatus(bmi);

                  return (
                    <tr
                      key={profile.healthProfileId}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="ml-0">
                            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {profile.student?.firstName}{" "}
                              {profile.student?.lastName}
                            </div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {profile.studentCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-900 dark:text-neutral-100">
                          {profile.student?.className}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                        {profile.height ? `${profile.height}cm` : "Chưa đo"} /{" "}
                        {profile.weight ? `${profile.weight}kg` : "Chưa đo"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${bmiStatus.color}`}
                        >
                          {bmi ? `${bmi} - ${bmiStatus.text}` : bmiStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              profile.hasAllergies || profile.hasChronicDiseases
                                ? "bg-red-500"
                                : profile.hasPreviousTreatment
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <span
                            className={`text-sm font-medium ${getHealthStatusColor(
                              profile
                            )}`}
                          >
                            {getHealthStatusText(profile)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(profile.lastUpdated)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewDetail(profile)}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedProfile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-neutral-500 dark:bg-neutral-900 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-neutral-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white dark:bg-neutral-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                    Chi tiết hồ sơ sức khỏe
                  </h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Student Info */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Thông tin học sinh
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Họ tên:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.student?.firstName}{" "}
                          {selectedProfile.student?.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Mã học sinh:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.studentCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Lớp:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.student?.className}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Nhóm máu:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.bloodType || "Chưa xác định"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Physical Info */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Thông số cơ thể
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Chiều cao:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.height
                            ? `${selectedProfile.height}cm`
                            : "Chưa đo"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Cân nặng:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.weight
                            ? `${selectedProfile.weight}kg`
                            : "Chưa đo"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Huyết áp:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.bloodPressure || "Chưa đo"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Nhịp tim:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.heartRate
                            ? `${selectedProfile.heartRate} bpm`
                            : "Chưa đo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Health Conditions */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Tình trạng sức khỏe
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">
                          Dị ứng:
                        </span>
                        <span
                          className={`ml-2 ${
                            selectedProfile.hasAllergies
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedProfile.hasAllergies ? "Có" : "Không"}
                        </span>
                        {selectedProfile.hasAllergies &&
                          selectedProfile.allergyDetails && (
                            <span className="ml-2 text-neutral-600 dark:text-neutral-300 text-xs">
                              ({selectedProfile.allergyDetails})
                            </span>
                          )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">
                          Bệnh mãn tính:
                        </span>
                        <span
                          className={`ml-2 ${
                            selectedProfile.hasChronicDiseases
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedProfile.hasChronicDiseases ? "Có" : "Không"}
                        </span>
                        {selectedProfile.hasChronicDiseases &&
                          selectedProfile.chronicDetails && (
                            <span className="ml-2 text-neutral-600 dark:text-neutral-300 text-xs">
                              ({selectedProfile.chronicDetails})
                            </span>
                          )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-neutral-500 dark:text-neutral-400 w-24">
                          Điều trị trước:
                        </span>
                        <span
                          className={`ml-2 ${
                            selectedProfile.hasPreviousTreatment
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedProfile.hasPreviousTreatment
                            ? "Có"
                            : "Không"}
                        </span>
                        {selectedProfile.hasPreviousTreatment &&
                          selectedProfile.treatmentDetails && (
                            <span className="ml-2 text-neutral-600 dark:text-neutral-300 text-xs">
                              ({selectedProfile.treatmentDetails})
                            </span>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Vision & Hearing */}
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      Thị lực & Thính lực
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Mắt trái:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.leftEye || "Chưa kiểm tra"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Mắt phải:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.rightEye || "Chưa kiểm tra"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Tai trái:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.leftEar === "Normal"
                            ? "Bình thường"
                            : selectedProfile.leftEar || "Chưa kiểm tra"}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">
                          Tai phải:
                        </span>
                        <span className="ml-2 text-neutral-900 dark:text-neutral-100">
                          {selectedProfile.rightEar === "Normal"
                            ? "Bình thường"
                            : selectedProfile.rightEar || "Chưa kiểm tra"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  {selectedProfile.student?.parents &&
                    selectedProfile.student.parents.length > 0 && (
                      <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                          Thông tin liên hệ phụ huynh
                        </h4>
                        <div className="space-y-2">
                          {selectedProfile.student.parents.map(
                            (parent, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                                  {parent.firstName} {parent.lastName} (
                                  {parent.relationship === "Guardian"
                                    ? "Người giám hộ"
                                    : parent.relationship}
                                  )
                                </div>
                                <div className="text-neutral-600 dark:text-neutral-300 flex items-center mt-1">
                                  <FiPhone className="h-3 w-3 mr-1" />
                                  {parent.phone}
                                  {parent.email && (
                                    <>
                                      <FiMail className="h-3 w-3 ml-3 mr-1" />
                                      {parent.email}
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHealthRecords;
