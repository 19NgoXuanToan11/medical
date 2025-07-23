import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiEye,
  FiEdit,
  FiPlay,
  FiMapPin,
  FiInfo,
  FiAlertCircle,
  FiX,
  FiRotateCcw,
} from "react-icons/fi";
import { useNurseHealthCheckData } from "./hooks/useNurseHealthCheckData";
import { formatDate } from "../../../utils/report/reportUtils";

const HealthCheckManagement = ({ searchTerm: parentSearchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState("pending");

  // Use custom hook for data management
  const {
    loading,
    error,
    stats,
    pendingHealthChecks,
    upcomingHealthChecks,
    completedHealthChecks,
    rejectedHealthChecks,
    fetchHealthCheckSchedules,
  } = useNurseHealthCheckData();

  // Function to translate station codes to Vietnamese names
  const translateStationName = (stationKey) => {
    if (!stationKey || typeof stationKey !== "string") {
      return "Trạm không xác định";
    }

    const stationMap = {
      // Các trạm cơ bản
      height: "Đo chiều cao",
      weight: "Cân nặng",
      "height-weight": "Chiều cao & Cân nặng",
      height_weight: "Chiều cao & Cân nặng",
      vision: "Khám mắt",
      hearing: "Khám tai",
      dental: "Khám răng miệng",

      // Các trạm nâng cao
      "blood-pressure": "Đo huyết áp",
      bloodPressure: "Đo huyết áp",
      "heart-rate": "Đo nhịp tim",
      heartRate: "Đo nhịp tim",
      temperature: "Đo nhiệt độ",
      bmi: "Chỉ số BMI",
      physical: "Thể lực",
      general: "Khám tổng quát",
      respiratory: "Khám hô hấp",
      cardiovascular: "Khám tim mạch",
      musculoskeletal: "Khám xương khớp",
      neurological: "Khám thần kinh",
      skin: "Khám da liễu",
      "mental-health": "Sức khỏe tâm thần",
      mental_health: "Sức khỏe tâm thần",
    };

    return stationMap[stationKey] || stationKey;
  };

  const getStatusBadge = (status) => {
    const badges = {
      // English statuses
      pending: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      active: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      // Vietnamese statuses
      "Chờ duyệt": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Đã lên lịch": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Đã duyệt": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Đang thực hiện": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Đã hoàn thành": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Đã hủy": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Đã từ chối": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      "Chưa xác định": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      badges[status] || badges.scheduled || badges["Đã lên lịch"]
    }`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      // English statuses
      pending: "Chờ duyệt",
      scheduled: "Đã lên lịch", 
      Approved: "Đã duyệt - Sẵn sàng",
      active: "Đang thực hiện",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
      Rejected: "Đã từ chối",
      // Vietnamese statuses (already translated, return as-is)
      "Chờ duyệt": "Chờ duyệt",
      "Đã lên lịch": "Đã lên lịch",
      "Đã duyệt": "Đã duyệt - Sẵn sàng",
      "Đang thực hiện": "Đang thực hiện",
      "Đã hoàn thành": "Đã hoàn thành",
      "Đã hủy": "Đã hủy",
      "Đã từ chối": "Đã từ chối",
      "Chưa xác định": "Chưa xác định",
    };
    return labels[status] || status;
  };

  // Get health checks based on active tab
  const getHealthChecksForTab = () => {
    switch (activeTab) {
      case "pending":
        return pendingHealthChecks;
      case "upcoming":
        return upcomingHealthChecks;
      case "completed":
        return completedHealthChecks;
      case "rejected":
        return rejectedHealthChecks;
      default:
        return [];
    }
  };

  // Filter health checks by search term
  const filteredHealthChecks = getHealthChecksForTab().filter((healthCheck) => {
    if (!parentSearchTerm) return true;

    const term = parentSearchTerm.toLowerCase();
    const titleMatch = healthCheck.title?.toLowerCase().includes(term);
    const descriptionMatch = healthCheck.description
      ?.toLowerCase()
      .includes(term);

    let gradesMatch = false;
    if (healthCheck.targetGrades) {
      const gradesArr = Array.isArray(healthCheck.targetGrades)
        ? healthCheck.targetGrades
        : [healthCheck.targetGrades];
      gradesMatch = gradesArr.some((grade) =>
        grade.toLowerCase().includes(term)
      );
    }

    return titleMatch || descriptionMatch || gradesMatch;
  });

  const handleStartHealthCheck = (healthCheckId) => {
    // Refresh data after action
    fetchHealthCheckSchedules();
  };

  const handleCompleteHealthCheck = (healthCheckId) => {
    // Refresh data after action
    fetchHealthCheckSchedules();
  };

  const renderHealthCheckCard = (healthCheck) => (
    <div
      key={healthCheck.id}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FiActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {healthCheck.title}
            </h3>
          </div>
        </div>
        <span className={getStatusBadge(healthCheck.status)}>
          {getStatusLabel(healthCheck.status)}
        </span>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(healthCheck.scheduledDate)}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="w-4 h-4 mr-2" />
          <span>{healthCheck.scheduledTime || healthCheck.startTime || "Chưa xác định"}</span>
        </div>
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>Khối: {healthCheck.grades?.length > 0 ? healthCheck.grades.join(", ") : healthCheck.targetGrades?.join(", ") || "Chưa xác định"}</span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span>{healthCheck.location}</span>
        </div>
      </div>

      {/* Check Items */}
      {healthCheck.checkItems && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Hạng mục:{" "}
          </span>
          {(Array.isArray(healthCheck.checkItems)
            ? healthCheck.checkItems
            : typeof healthCheck.checkItems === "string"
            ? JSON.parse(healthCheck.checkItems)
            : []
          ).map((item, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
            >
              {translateStationName(
                typeof item === "string" ? item : item.name || item
              )}
            </span>
          ))}
        </div>
      )}

      {healthCheck.status === "active" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Đã hoàn thành</span>
            <span>
              {healthCheck.completedStudents}/{healthCheck.totalStudents}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (healthCheck.completedStudents / healthCheck.totalStudents) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {healthCheck.confirmStatus?.toLowerCase() === "approved" && (
        <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <div className="flex items-start">
            <FiCheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-600 dark:text-green-400" />
            <div className="text-xs text-green-800 dark:text-green-200">
              <p className="font-medium">✅ Đã được Quản lý phê duyệt</p>
              <p>Sẵn sàng để bắt đầu thực hiện khám sức khỏe</p>
              {healthCheck.confirmedDate && (
                <p className="text-green-600 dark:text-green-400 mt-1">
                  Duyệt lúc:{" "}
                  {new Date(healthCheck.confirmedDate).toLocaleString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {healthCheck.confirmStatus?.toLowerCase() === "rejected" && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <div className="flex items-start">
            <FiX className="w-3 h-3 mr-2 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="text-xs text-red-800 dark:text-red-200">
              <p className="font-medium">❌ Đã bị Quản lý từ chối</p>
              <p>Bạn có thể chỉnh sửa và gửi lại yêu cầu</p>
              {healthCheck.confirmedDate && (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  Từ chối lúc:{" "}
                  {new Date(healthCheck.confirmedDate).toLocaleString("vi-VN")}
                </p>
              )}
              {healthCheck.rejectionReason && (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  <strong>Lý do:</strong> {healthCheck.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {healthCheck.status === "completed" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Kết quả</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {healthCheck.completedStudents}/{healthCheck.totalStudents}
            </span>
          </div>
          {healthCheck.abnormalCases && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              <FiAlertCircle className="w-3 h-3 inline mr-1" />
              {healthCheck.abnormalCases} trường hợp bất thường
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      {healthCheck.notes && (
        <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="flex items-start">
            <FiInfo className="w-3 h-3 mr-2 mt-0.5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              {healthCheck.notes}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {/* View Details Button */}
          <Link
            to={`/nurse/health-services/view/${
              healthCheck.formId || healthCheck.id
            }`}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded transition-colors"
          >
            <FiEye className="w-3 h-3 mr-1 inline" />
            Chi tiết
          </Link>

          {/* Show edit button for pending, scheduled, or rejected items */}
          {(healthCheck.status === "scheduled" ||
            healthCheck.status === "pending" ||
            healthCheck.status === "Chờ duyệt" ||
            healthCheck.status === "Đã lên lịch" ||
            healthCheck.confirmStatus?.toLowerCase() === "pending" ||
            healthCheck.confirmStatus?.toLowerCase() === "chờ duyệt" ||
            healthCheck.confirmStatus?.toLowerCase() === "rejected" ||
            healthCheck.confirmStatus?.toLowerCase() === "đã từ chối") && (
            <Link
              to={`/nurse/health-services/edit/${
                healthCheck.formId || healthCheck.id
              }`}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                (healthCheck.confirmStatus?.toLowerCase() === "rejected" ||
                 healthCheck.confirmStatus?.toLowerCase() === "đã từ chối")
                  ? "bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
                  : "border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
              }`}
            >
              <FiEdit className="w-3 h-3 mr-1 inline" />
              {(healthCheck.confirmStatus?.toLowerCase() === "rejected" ||
                healthCheck.confirmStatus?.toLowerCase() === "đã từ chối")
                ? "Chỉnh sửa & Gửi lại"
                : "Sửa"}
            </Link>
          )}
        </div>

        {/* Action buttons based on status */}
        <div className="flex space-x-2">
          {(healthCheck.confirmStatus?.toLowerCase() === "approved" ||
            healthCheck.confirmStatus?.toLowerCase() === "đã duyệt" ||
            healthCheck.status === "Approved" ||
            healthCheck.status === "Đã duyệt") && (
            <button
              onClick={() =>
                handleStartHealthCheck(healthCheck.formId || healthCheck.id)
              }
              className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <FiPlay className="w-3 h-3 mr-1 inline" />
              Bắt đầu khám
            </button>
          )}
          {(healthCheck.status === "active" || healthCheck.status === "Đang thực hiện") && (
            <button
              onClick={() =>
                handleCompleteHealthCheck(healthCheck.formId || healthCheck.id)
              }
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <FiCheckCircle className="w-3 h-3 mr-1 inline" />
              Hoàn thành
            </button>
          )}
          {(healthCheck.confirmStatus?.toLowerCase() === "pending" ||
            healthCheck.confirmStatus?.toLowerCase() === "chờ duyệt") && (
            <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded">
              <FiClock className="w-3 h-3 mr-1 inline" />
              Chờ Quản lý duyệt
            </span>
          )}
          {(healthCheck.confirmStatus?.toLowerCase() === "rejected" ||
            healthCheck.confirmStatus?.toLowerCase() === "đã từ chối") && (
            <span className="text-xs px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded">
              <FiX className="w-3 h-3 mr-1 inline" />
              Đã từ chối
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => {
    const messages = {
      pending: {
        title: "Không có yêu cầu chờ duyệt",
        description:
          "Tất cả yêu cầu khám sức khỏe đã được xử lý hoặc chưa có yêu cầu nào",
      },
      upcoming: {
        title: "Không có lịch khám sắp tới",
        description: "Chưa có lịch khám nào được phê duyệt hoặc đang thực hiện",
      },
      completed: {
        title: "Chưa có lịch khám hoàn thành",
        description: "Chưa có lịch khám sức khỏe nào được hoàn thành",
      },
      rejected: {
        title: "Không có yêu cầu bị từ chối",
        description: "Chưa có yêu cầu khám sức khỏe nào bị từ chối",
      },
    };

    const currentMessage = messages[activeTab] || messages.pending;

    return (
      <div className="text-center py-12">
        <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {currentMessage.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {currentMessage.description}
        </p>
        {activeTab === "pending" && (
          <Link
            to="/nurse/health-services/create/health_check"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiCalendar className="w-4 h-4 mr-2" />
            Tạo lịch khám mới
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {stats.pending}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sắp tới
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {stats.upcoming}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã từ chối
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {stats.rejected}
              </p>
            </div>
            <FiX className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng học sinh
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "pending", label: "Chờ duyệt", count: stats.pending },
            { id: "upcoming", label: "Sắp tới", count: stats.upcoming },
            { id: "completed", label: "Đã hoàn thành", count: stats.completed },
            { id: "rejected", label: "Đã từ chối", count: stats.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 text-xs rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu khám sức khỏe...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center max-w-md">
              <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                {error}
              </p>
              <button
                onClick={fetchHealthCheckSchedules}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiRotateCcw className="w-4 h-4 mr-2" />
                Thử lại
              </button>
            </div>
          </div>
        ) : filteredHealthChecks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredHealthChecks.map(renderHealthCheckCard)}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default HealthCheckManagement;
