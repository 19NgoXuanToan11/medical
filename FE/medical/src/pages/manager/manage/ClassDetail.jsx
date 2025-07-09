import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit2,
  FiUsers,
  FiBook,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiHome,
  FiHeart,
  FiSearch,
  FiUserPlus,
  FiUserMinus,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiEye,
} from "react-icons/fi";
import { getClassById } from "../../../utils/api/class/classService";
import { getHealthCheckFormsByStudentId } from "../../../utils/api/healthCheck/healthCheckService";

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("students");
  const [studentHealthStatus, setStudentHealthStatus] = useState({});

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        setLoading(true);
        const data = await getClassById(id);
        setClassData(data);

        // Fetch health status for each student
        if (data?.students) {
          await fetchStudentHealthStatuses(data.students);
        }
      } catch (error) {
        console.error("Error fetching class detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClassDetail();
    }
  }, [id]);

  const fetchStudentHealthStatuses = async (students) => {
    try {
      const statusPromises = students.map(async (student) => {
        try {
          // Mock data for demonstration - replace with actual API calls
          const pendingCheckups = Math.floor(Math.random() * 3);
          const lastCheckupDate = new Date(
            Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
          );
          const hasHealthIssues = Math.random() > 0.8;
          const needsAttention = Math.random() > 0.85;
          const overdueDays = Math.floor(
            (Date.now() - lastCheckupDate) / (24 * 60 * 60 * 1000)
          );

          return {
            studentId: student.studentId,
            pendingCheckups,
            lastCheckupDate: lastCheckupDate.toLocaleDateString("vi-VN"),
            hasHealthIssues,
            needsAttention,
            overdueDays,
            healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
          };
        } catch (error) {
          console.error(
            `Error fetching health status for student ${student.studentId}:`,
            error
          );
          return {
            studentId: student.studentId,
            pendingCheckups: 0,
            lastCheckupDate: "Chưa có",
            hasHealthIssues: false,
            needsAttention: false,
            overdueDays: 0,
            healthScore: 100,
          };
        }
      });

      const results = await Promise.all(statusPromises);
      const statusMap = {};
      results.forEach((result) => {
        statusMap[result.studentId] = result;
      });
      setStudentHealthStatus(statusMap);
    } catch (error) {
      console.error("Error fetching student health statuses:", error);
    }
  };

  const getHealthStatusBadge = (studentId) => {
    const status = studentHealthStatus[studentId];
    if (!status) return null;

    if (status.needsAttention || status.hasHealthIssues) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          <FiAlertTriangle className="w-3 h-3 mr-1" />
          Cần xem lại
        </span>
      );
    } else if (status.pendingCheckups > 1 || status.overdueDays > 30) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
          <FiClock className="w-3 h-3 mr-1" />
          Cần khám
        </span>
      );
    } else if (status.healthScore >= 85) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
          <FiCheckCircle className="w-3 h-3 mr-1" />
          Tốt
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
          <FiActivity className="w-3 h-3 mr-1" />
          Bình thường
        </span>
      );
    }
  };

  const getHealthStatusIcon = (studentId) => {
    const status = studentHealthStatus[studentId];
    if (!status)
      return (
        <FiActivity className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      );

    if (status.needsAttention || status.hasHealthIssues) {
      return (
        <FiAlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
      );
    } else if (status.pendingCheckups > 1 || status.overdueDays > 30) {
      return (
        <FiClock className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
      );
    } else {
      return (
        <FiCheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
      );
    }
  };

  const getRowHighlight = (studentId) => {
    const status = studentHealthStatus[studentId];
    if (!status) return "";

    if (status.needsAttention || status.hasHealthIssues) {
      return "bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500";
    } else if (status.pendingCheckups > 1 || status.overdueDays > 30) {
      return "bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500";
    }
    return "";
  };

  const filteredStudents =
    classData?.students?.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parents?.some(
          (parent) =>
            parent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parent.phone?.includes(searchTerm)
        )
    ) || [];

  // Health statistics
  const healthStats = {
    total: filteredStudents.length,
    needsAttention: Object.values(studentHealthStatus).filter(
      (s) => s.needsAttention || s.hasHealthIssues
    ).length,
    pendingCheckups: Object.values(studentHealthStatus).filter(
      (s) => s.pendingCheckups > 1 || s.overdueDays > 30
    ).length,
    healthy: Object.values(studentHealthStatus).filter(
      (s) => s.healthScore >= 85 && !s.needsAttention && !s.hasHealthIssues
    ).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy thông tin lớp học
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/manager/class-management")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {classData.className}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Khối {classData.gradeLevel} - {classData.currentStudentCount}/
              {classData.maxStudents} học sinh
            </p>
          </div>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiEdit2 className="mr-2 w-4 h-4" />
          Chỉnh sửa lớp
        </button>
      </div>

      {/* Class Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiBook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Khối học
              </p>
              <p className="font-semibold text-gray-800 dark:text-white">
                Khối {classData.gradeLevel}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sĩ số</p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {classData.currentStudentCount}/{classData.maxStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Giáo viên chủ nhiệm
              </p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {classData.classTeacher}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiMapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Phòng học
              </p>
              <p className="font-semibold text-gray-800 dark:text-white">
                {classData.classRoom}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Cần xem lại
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {healthStats.needsAttention}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
              <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                Cần khám
              </p>
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {healthStats.pendingCheckups}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Sức khỏe tốt
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {healthStats.healthy}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Tổng số
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {healthStats.total}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh, phụ huynh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-80"
          />
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FiUserPlus className="mr-2 w-4 h-4" />
            Thêm học sinh
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Danh sách học sinh ({filteredStudents.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thông tin cơ bản
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tình hình sức khỏe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Phụ huynh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => {
                  const healthStatus = studentHealthStatus[student.studentId];
                  return (
                    <tr
                      key={student.studentId}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getRowHighlight(
                        student.studentId
                      )}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center relative">
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {student.firstName.charAt(0)}
                            </span>
                            {/* Health Status Icon Overlay */}
                            <div className="absolute -top-1 -right-1">
                              {getHealthStatusIcon(student.studentId)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.fullName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.studentCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center space-x-1 mb-1">
                            <FiCalendar className="w-3 h-3 text-gray-400" />
                            <span>
                              {new Date(student.dateOfBirth).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mb-1">
                            <FiUser className="w-3 h-3 text-gray-400" />
                            <span>{student.gender}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FiHome className="w-3 h-3 text-gray-400" />
                            <span className="text-xs truncate max-w-40">
                              {student.address}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          {getHealthStatusBadge(student.studentId)}
                          {healthStatus && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                              <div>
                                Khám cuối: {healthStatus.lastCheckupDate}
                              </div>
                              {healthStatus.overdueDays > 30 && (
                                <div className="text-red-600 dark:text-red-400">
                                  Quá hạn {healthStatus.overdueDays} ngày
                                </div>
                              )}
                              {healthStatus.pendingCheckups > 0 && (
                                <div className="text-yellow-600 dark:text-yellow-400">
                                  {healthStatus.pendingCheckups} khám chờ
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {student.parents.map((parent) => (
                            <div
                              key={parent.parentId}
                              className="flex items-center space-x-2"
                            >
                              <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  {parent.firstName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {parent.fullName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {parent.relationship}
                                  {parent.isMainContact && (
                                    <span className="ml-1 px-1 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                                      Chính
                                    </span>
                                  )}
                                  {parent.isEmergencyContact && (
                                    <span className="ml-1 px-1 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">
                                      Khẩn cấp
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {student.parents.map((parent) => (
                            <div key={parent.parentId} className="text-sm">
                              <div className="flex items-center space-x-1 mb-1">
                                <FiPhone className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-900 dark:text-white">
                                  {parent.phone}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FiMail className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400 text-xs">
                                  {parent.email}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <FiEye
                              className="w-4 h-4"
                              title="Xem hồ sơ sức khỏe"
                            />
                          </button>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <FiHeart
                              className="w-4 h-4"
                              title="Hồ sơ sức khỏe"
                            />
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <FiEdit2 className="w-4 h-4" title="Chỉnh sửa" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                            <FiUserMinus
                              className="w-4 h-4"
                              title="Xóa khỏi lớp"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm
                  ? "Không tìm thấy học sinh nào phù hợp"
                  : "Chưa có học sinh nào trong lớp"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
