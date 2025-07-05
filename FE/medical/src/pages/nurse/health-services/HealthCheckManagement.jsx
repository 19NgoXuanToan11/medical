import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiEye,
  FiEdit,
  FiPlay,
  FiPause,
  FiUser,
  FiMapPin,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
import { getHealthCheckSchedules } from '../../../utils/api/healthCheck/healthCheckService';

const HealthCheckManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState("scheduled");
  const [healthChecks, setHealthChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load health check data
  useEffect(() => {
    const loadHealthChecks = async () => {
      setLoading(true);
      try {
        const data = await getHealthCheckSchedules();
        setHealthChecks(data);
      } catch (error) {
        setHealthChecks([]);
      }
      setLoading(false);
    };
    loadHealthChecks();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "scheduled":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case "active":
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "active":
        return "Đang thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const filteredHealthChecks = healthChecks.filter((healthCheck) => {
    // Filter by status (sub tab)
    const status = healthCheck.status?.toLowerCase();
    if (activeSubTab === "scheduled" && status !== "scheduled")
      return false;
    if (activeSubTab === "active" && status !== "active")
      return false;
    if (activeSubTab === "completed" && status !== "completed")
      return false;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const gradesArr = healthCheck.grades || (healthCheck.gradeIds ? JSON.parse(healthCheck.gradeIds) : []);
      return (
        healthCheck.title.toLowerCase().includes(term) ||
        healthCheck.description.toLowerCase().includes(term) ||
        gradesArr.some((grade) => grade.toLowerCase().includes(term))
      );
    }

    return true;
  });

  // Calculate statistics
  const getStats = () => {
    const scheduledCount = healthChecks.filter(
      (h) => h.status === "scheduled"
    ).length;
    const activeCount = healthChecks.filter(
      (h) => h.status === "active"
    ).length;
    const completedThisMonth = healthChecks.filter((h) => {
      if (h.status !== "completed") return false;
      const completedDate = new Date(h.completedDate || h.scheduledDate);
      const now = new Date();
      return (
        completedDate.getMonth() === now.getMonth() &&
        completedDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const totalStudents = healthChecks.reduce((sum, healthCheck) => {
      if (
        healthCheck.status === "scheduled" ||
        healthCheck.status === "active"
      ) {
        return sum + healthCheck.totalStudents;
      }
      return sum;
    }, 0);

    return {
      scheduled: scheduledCount,
      active: activeCount,
      completedThisMonth,
      totalStudents,
    };
  };

  const stats = getStats();

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
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
              <FiActivity className="w-5 h-5" />
            </div>
            <div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Khám sức khỏe
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {healthCheck.title}
              </h3>
            </div>
          </div>
          <span className={getStatusBadge(healthCheck.status)}>
            {getStatusLabel(healthCheck.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiCalendar className="w-4 h-4 mr-2" />
            <span>{healthCheck.scheduledDate}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiClock className="w-4 h-4 mr-2" />
            <span>{healthCheck.scheduledTime || healthCheck.startTime}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiUsers className="w-4 h-4 mr-2" />
            <span>Lớp: {healthCheck.grades.join(", ")}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{healthCheck.location}</span>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {healthCheck.description}
          </p>
        </div>

        {/* Check items */}
        {healthCheck.checkItems && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Hạng mục kiểm tra:
            </h4>
            <div className="flex flex-wrap gap-2">
              {healthCheck.checkItems.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress information */}
        {healthCheck.status === "scheduled" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Phụ huynh đã xác nhận</span>
              <span>
                {healthCheck.confirmedParents}/{healthCheck.totalStudents}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (healthCheck.confirmedParents / healthCheck.totalStudents) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {healthCheck.status === "active" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Đã hoàn thành</span>
              <span>
                {healthCheck.completedStudents}/{healthCheck.totalStudents}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-amber-600 dark:bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (healthCheck.completedStudents /
                      healthCheck.totalStudents) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {healthCheck.status === "completed" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">
                Kết quả hoàn thành
              </span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {healthCheck.completedStudents}/{healthCheck.totalStudents}
              </span>
            </div>
            {healthCheck.abnormalCases && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                <FiAlertCircle className="w-4 h-4 inline mr-1" />
                {healthCheck.abnormalCases} trường hợp bất thường
              </div>
            )}
          </div>
        )}

        {healthCheck.notes && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mr-2 mt-0.5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {healthCheck.notes}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-600">
          <div className="flex space-x-3">
            <Link
              to={`/nurse/health-services/${healthCheck.id}`}
              className="inline-flex items-center px-3 py-2 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-200"
            >
              <FiEye className="w-4 h-4 mr-1" />
              Chi tiết
            </Link>

            {healthCheck.status === "scheduled" && (
              <Link
                to={`/nurse/health-services/${healthCheck.id}/edit`}
                className="inline-flex items-center px-3 py-2 text-sm border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors duration-200"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Chỉnh sửa
              </Link>
            )}
          </div>

          <div className="flex space-x-2">
            {healthCheck.status === "scheduled" && (
              <button
                onClick={() => handleStartHealthCheck(healthCheck.id)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
              >
                <FiPlay className="w-4 h-4 mr-1" />
                Bắt đầu
              </button>
            )}

            {healthCheck.status === "active" && (
              <button
                onClick={() => handleCompleteHealthCheck(healthCheck.id)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500 mb-4">
        {activeSubTab === "scheduled" && <FiCalendar className="w-12 h-12" />}
        {activeSubTab === "active" && <FiClock className="w-12 h-12" />}
        {activeSubTab === "completed" && (
          <FiCheckCircle className="w-12 h-12" />
        )}
      </div>
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
        {activeSubTab === "scheduled" &&
          "Không có khám sức khỏe nào được lên lịch"}
        {activeSubTab === "active" &&
          "Không có khám sức khỏe nào đang thực hiện"}
        {activeSubTab === "completed" && "Chưa có khám sức khỏe nào hoàn thành"}
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6">
        {activeSubTab === "scheduled" &&
          "Tạo lịch khám sức khỏe mới để bắt đầu"}
        {activeSubTab === "active" &&
          "Các khám sức khỏe đang thực hiện sẽ hiển thị ở đây"}
        {activeSubTab === "completed" &&
          "Lịch sử các khám sức khỏe đã hoàn thành sẽ hiển thị ở đây"}
      </p>
      {activeSubTab === "scheduled" && (
        <Link
          to="/nurse/health-services/create"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Tạo lịch khám sức khỏe mới
        </Link>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              Quản lý Y tế định kỳ
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Quản lý khám sức khỏe định kỳ và theo dõi tình trạng sức khỏe học
              sinh
            </p>
          </div>
          <Link
            to="/nurse/health-services/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Tạo lịch khám sức khỏe mới
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Đã lên lịch
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.scheduled}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Đang thực hiện
              </p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats.active}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Hoàn thành tháng này
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.completedThisMonth}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Tổng học sinh
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {stats.totalStudents}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khám sức khỏe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub Status Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50">
          <nav className="flex">
            {[
              {
                id: "scheduled",
                label: "Đã lên lịch",
                icon: FiCalendar,
                count: healthChecks.filter((h) => h.status === "scheduled")
                  .length,
              },
              {
                id: "active",
                label: "Đang thực hiện",
                icon: FiClock,
                count: healthChecks.filter((h) => h.status === "active").length,
              },
              {
                id: "completed",
                label: "Đã hoàn thành",
                icon: FiCheckCircle,
                count: healthChecks.filter((h) => h.status === "completed")
                  .length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeSubTab === tab.id
                    ? "bg-white dark:bg-neutral-800 border-b-2 border-primary-500 text-primary-700 dark:text-primary-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-600/50"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredHealthChecks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHealthChecks.map(renderHealthCheckCard)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheckManagement;
