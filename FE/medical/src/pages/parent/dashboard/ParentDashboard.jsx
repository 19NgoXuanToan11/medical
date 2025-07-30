import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPills,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaPlus,
  FaHistory,
  FaFileMedical,
  FaBell,
  FaChartLine,
  FaHeartbeat,
  FaSyringe,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import SimpleGreeting from "../../../components/common/SimpleGreeting";
import { useParent } from "../../../utils/auth/ParentContext";
import { medicationService } from "../../../utils/api/medication/medicationService";
import { calculateMedicationStats } from "../../../utils/api/medication/parentMedicationUtils";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { selectedStudent, parentData, loading: parentLoading } = useParent();

  const [dashboardData, setDashboardData] = useState({
    medicationStats: {
      active: 0,
      pending: 0,
      completed: 0,
      rejected: 0,
      total: 0,
    },
    healthEvents: {
      recent: 0,
      pending: 0,
    },
    notifications: {
      unread: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!parentData?.parentId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch medication requests
        const medicationResponse =
          await medicationService.getMedicationRequestsByParent(
            parentData.parentId
          );

        if (medicationResponse.success) {
          const stats = calculateMedicationStats(medicationResponse.data);
          setDashboardData((prev) => ({
            ...prev,
            medicationStats: stats,
          }));
        }

        // TODO: Add health events and notifications API calls here
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [parentData?.parentId]);

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case "new-medication":
        navigate("/parent/medication/request");
        break;
      case "medication-history":
        navigate("/parent/medication/history");
        break;
      case "health-profile":
        navigate("/parent/health-profile");
        break;
      case "health-events":
        navigate("/parent/health-events");
        break;
      case "notifications":
        navigate("/parent/notifications");
        break;
      default:
        break;
    }
  };

  // Loading state
  if (parentLoading || loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <SimpleGreeting roleTitle="Phụ huynh" />
        <div className="flex items-center justify-center py-12">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin mr-3" />
          <span className="text-lg text-neutral-600 dark:text-neutral-400">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <SimpleGreeting roleTitle="Phụ huynh" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 max-w-7xl space-y-6">
      {/* Enhanced Greeting with Student Info */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-100 dark:border-primary-800 rounded-xl p-6 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              Xin chào buổi{" "}
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return "sáng";
                if (hour < 18) return "chiều";
                return "tối";
              })()}
              , {parentData?.firstName || "Phụ huynh"}!
            </h1>
            {selectedStudent && (
              <p className="text-primary-700 dark:text-primary-400 font-medium">
                Theo dõi sức khỏe của {selectedStudent.name} - Lớp{" "}
                {selectedStudent.className || "N/A"}
              </p>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Hôm nay
              </p>
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Medications */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
              <FaPills className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {dashboardData.medicationStats.active}
            </span>
          </div>
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Số thuốc đã gửi
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Đang được thực hiện tại trường
          </p>
          <Link
            to="/parent/medication/history?status=active"
            className="inline-flex items-center mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
          >
            Xem chi tiết <FaEye className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Health Events */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
              <MdHealthAndSafety className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">
              {dashboardData.healthEvents.recent}
            </span>
          </div>
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Sự cố y tế
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Sự cố gần đây
          </p>
          <Link
            to="/parent/health-events"
            className="inline-flex items-center mt-3 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
          >
            Xem chi tiết <FaEye className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-all duration-200 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <FaBell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData.notifications.unread}
            </span>
          </div>
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
            Thông báo
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Thông báo chưa đọc
          </p>
          <Link
            to="/parent/notifications"
            className="inline-flex items-center mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Xem chi tiết <FaEye className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center">
              <FaChartLine className="w-5 h-5 mr-3 text-primary-600" />
              Thao tác nhanh
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* New Medication Request */}
              <button
                onClick={() => handleQuickAction("new-medication")}
                className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30 border border-primary-200 dark:border-primary-700 rounded-xl p-6 hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-800/30 dark:hover:to-primary-700/40 transition-all duration-200 group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-200 dark:bg-primary-700 rounded-lg group-hover:bg-primary-300 dark:group-hover:bg-primary-600 transition-colors">
                    <FaPlus className="w-6 h-6 text-primary-700 dark:text-primary-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-1">
                      Gửi yêu cầu thuốc mới
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      Tạo yêu cầu mới để gửi thuốc đến trường
                    </p>
                  </div>
                </div>
              </button>

              {/* Medication History */}
              <button
                onClick={() => handleQuickAction("medication-history")}
                className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border border-green-200 dark:border-green-700 rounded-xl p-6 hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/40 transition-all duration-200 group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-200 dark:bg-green-700 rounded-lg group-hover:bg-green-300 dark:group-hover:bg-green-600 transition-colors">
                    <FaHistory className="w-6 h-6 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                      Lịch sử yêu cầu thuốc
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Xem tất cả các yêu cầu thuốc trước đây
                    </p>
                  </div>
                </div>
              </button>

              {/* Health Profile */}
              <button
                onClick={() => handleQuickAction("health-profile")}
                className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/40 transition-all duration-200 group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-200 dark:bg-blue-700 rounded-lg group-hover:bg-blue-300 dark:group-hover:bg-blue-600 transition-colors">
                    <FaFileMedical className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                      Hồ sơ sức khỏe
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Thông tin sức khỏe chi tiết của học sinh
                    </p>
                  </div>
                </div>
              </button>

              {/* Health Services */}
              <button
                onClick={() => handleQuickAction("health-events")}
                className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border border-purple-200 dark:border-purple-700 rounded-xl p-6 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/40 transition-all duration-200 group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-200 dark:bg-purple-700 rounded-lg group-hover:bg-purple-300 dark:group-hover:bg-purple-600 transition-colors">
                    <FaSyringe className="w-6 h-6 text-purple-700 dark:text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">
                      Dịch vụ Y tế
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Tiêm chủng & Khám sức khỏe định kỳ
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Student Health Summary */}
        <div className="space-y-6">
          {/* Student Info Card */}
          {selectedStudent && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
              <h2 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center">
                <FaHeartbeat className="w-5 h-5 mr-3 text-red-500" />
                Thông tin học sinh
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 dark:text-primary-300 font-semibold">
                      {selectedStudent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Lớp {selectedStudent.className || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Mã học sinh
                    </p>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                      {selectedStudent.studentCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Khối lớp
                    </p>
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                      {selectedStudent.gradeLevel || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
