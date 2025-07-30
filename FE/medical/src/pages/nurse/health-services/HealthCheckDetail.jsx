import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiActivity,
  FiCheckCircle,
  FiX,
  FiInfo,
  FiEdit,
} from "react-icons/fi";
import { getHealthCheckScheduleById } from "../../../utils/api/healthCheck/healthCheckService";
import { formatDate } from "../../../utils/report/reportUtils";
import { getAllStudents } from "../../../utils/api/student/studentService";

const HealthCheckDetail = () => {
  const { id } = useParams();
  const [healthCheck, setHealthCheck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchHealthCheckDetail();
  }, [id]);

  const fetchHealthCheckDetail = async () => {
    try {
      setLoading(true);
      const data = await getHealthCheckScheduleById(id);
      setHealthCheck(data);
      // Lấy danh sách học sinh thật từ backend
      const students = await getAllStudents();
      setStudents(students);
      // Nếu cần lọc theo lớp hoặc grade, có thể lọc students tại đây
    } catch (error) {
      console.error("Error fetching health check detail:", error);
      setError("Không thể tải thông tin chi tiết lịch khám");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full";
      case "approved":
        return "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full";
      case "scheduled":
        return "px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full";
      case "active":
        return "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full";
      case "completed":
        return "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full";
      case "rejected":
        return "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full";
      default:
        return "px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full";
    }
  };

  const getStatusLabel = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "scheduled":
        return "Đã lên lịch";
      case "active":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Từ chối";
      default:
        return status || "Không xác định";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiX className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Có lỗi xảy ra
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <Link
          to="/nurse/health-services"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </div>
    );
  }

  if (!healthCheck) {
    return (
      <div className="text-center py-12">
        <FiX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không tìm thấy lịch khám
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Lịch khám bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          to="/nurse/health-services"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/nurse/health-services"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Chi tiết lịch khám
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Thông tin chi tiết và danh sách học sinh
            </p>
          </div>
        </div>
        
        {/* Edit button for rejected health checks */}
        {healthCheck.confirmStatus?.toLowerCase() === "rejected" && (
          <Link
            to={`/nurse/health-services/edit/${id}`}
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Chỉnh sửa & Gửi lại
          </Link>
        )}
      </div>

      {/* Health Check Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {healthCheck.title}
          </h2>
          <span className={getStatusBadge(healthCheck.status)}>
            {getStatusLabel(healthCheck.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <FiCalendar className="w-4 h-4 mr-2" />
            <span>Ngày khám: {formatDate(healthCheck.scheduledDate)}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-2" />
            <span>Giờ khám: {healthCheck.startTime}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>Địa điểm: {healthCheck.location}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-2" />
            <span>Khối: {healthCheck.grades?.join(", ")}</span>
          </div>
        </div>

        {healthCheck.description && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {healthCheck.description}
            </p>
          </div>
        )}
      </div>

      {/* Classes Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Danh sách lớp tham gia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {classItem.name}
                </h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {classItem.studentCount} học sinh
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Khối {classItem.gradeLevel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Danh sách học sinh
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mã học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.studentCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      <FiClock className="w-3 h-3 mr-1" />
                      Chưa khám
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckDetail; 