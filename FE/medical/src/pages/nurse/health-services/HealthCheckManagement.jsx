import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { getHealthCheckSchedules } from "../../../utils/api/healthCheck/healthCheckService";
import { formatDate } from "../../../utils/report/reportUtils";

const HealthCheckManagement = ({ searchTerm: parentSearchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load health check data
  useEffect(() => {
    const loadHealthChecks = async () => {
      setLoading(true);
      try {
        const data = await getHealthCheckSchedules();
        setHealthChecks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading health checks:", error);
        setHealthChecks([]);
      }
      setLoading(false);
    };
    loadHealthChecks();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      active:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      badges[status] || badges.scheduled
    }`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: "Đang chờ duyệt",
      active: "Đang thực hiện",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const filteredHealthChecks = healthChecks.filter((healthCheck) => {
    // Filter by status
    if (activeTab !== "all" && healthCheck.status !== activeTab) return false;

    // Filter by search term
    if (parentSearchTerm) {
      const term = parentSearchTerm.toLowerCase();
      const gradesArr =
        healthCheck.grades ||
        (healthCheck.gradeIds ? JSON.parse(healthCheck.gradeIds) : []);
      return (
        healthCheck.title.toLowerCase().includes(term) ||
        healthCheck.description.toLowerCase().includes(term) ||
        gradesArr.some((grade) => grade.toLowerCase().includes(term))
      );
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    scheduled: healthChecks.filter((h) => h.status === "scheduled").length,
    active: healthChecks.filter((h) => h.status === "active").length,
    completed: healthChecks.filter((h) => h.status === "completed").length,
    totalStudents: healthChecks
      .filter((h) => h.status === "scheduled" || h.status === "active")
      .reduce((sum, h) => sum + h.totalStudents, 0),
  };

  const handleStartHealthCheck = (healthCheckId) => {
    setHealthChecks((prev) =>
      prev.map((healthCheck) =>
        healthCheck.id === healthCheckId
          ? {
              ...healthCheck,
              status: "active",
              startTime: new Date().toISOString(),
            }
          : healthCheck
      )
    );
  };

  const handleCompleteHealthCheck = (healthCheckId) => {
    setHealthChecks((prev) =>
      prev.map((healthCheck) =>
        healthCheck.id === healthCheckId
          ? {
              ...healthCheck,
              status: "completed",
              completedDate: new Date().toISOString(),
            }
          : healthCheck
      )
    );
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
          <span>{healthCheck.scheduledTime || healthCheck.startTime}</span>
        </div>
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>Lớp: {healthCheck.grades?.join(", ")}</span>
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
          {healthCheck.checkItems.map((item, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1"
            >
              {item}
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

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <Link
            to={`/nurse/health-services/${
              healthCheck.formId || healthCheck.id
            }`}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            <FiEye className="w-3 h-3 mr-1 inline" />
            Chi tiết
          </Link>
          {healthCheck.status === "scheduled" && (
            <Link
              to={`/nurse/health-services/${healthCheck.id}/edit`}
              className="text-xs px-3 py-1 border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <FiEdit className="w-3 h-3 mr-1 inline" />
              Sửa
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Chưa có lịch khám sức khỏe
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Tạo lịch khám sức khỏe định kỳ cho học sinh
      </p>
      <Link
        to="/nurse/health-services/create/health_check"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <FiCalendar className="w-4 h-4 mr-2" />
        Tạo lịch khám mới
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {stats.scheduled}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang thực hiện
              </p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.active}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hoàn thành
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
            { id: "scheduled", label: "Chờ duyệt", count: stats.scheduled },
            { id: "active", label: "Đang thực hiện", count: stats.active },
            { id: "completed", label: "Đã hoàn thành", count: stats.completed },
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

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
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
