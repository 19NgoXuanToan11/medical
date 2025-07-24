import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiTablet,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiBell,
  FiClipboard,
  FiX,
  FiUser,
  FiPlus,
  FiHeart,
  FiEye,
} from "react-icons/fi";
import MedicationReminders from "../medication/MedicationReminders";
import SimpleGreeting from "../../../components/common/SimpleGreeting";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingMedications: 0,
    scheduledHealthChecks: 0,
    upcomingVaccinations: 0,
    healthEventsToday: 0,
    medicationAdherence: 0,
    allergyAlerts: 0,
    totalCheckedStudents: 0,
  });

  const [dateRange, setDateRange] = useState("today");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalStudents: 895,
        pendingMedications: 32,
        scheduledHealthChecks: 3,
        upcomingVaccinations: 2,
        healthEventsToday: 8,
        medicationAdherence: 94,
        allergyAlerts: 15,
        totalCheckedStudents: 42,
      });

      // Load notifications from localStorage (for demo)
      const nurseNotifications = JSON.parse(
        localStorage.getItem("nurseNotifications") || "[]"
      );
      setNotifications(nurseNotifications);

      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would fetch new data based on the selected range
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((notif) =>
      notif.createdAt === notificationId ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "nurseNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(
      (notif) => notif.createdAt !== notificationId
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(
      "nurseNotifications",
      JSON.stringify(updatedNotifications)
    );
  };

  const unreadNotifications = notifications.filter((notif) => !notif.isRead);
  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 3);

  // Mock upcoming tasks data
  const upcomingTasks = [
    {
      id: 1,
      time: "09:30",
      title: "Cấp thuốc cho Nguyễn Văn An (Lớp 3A)",
      type: "medication",
    },
    {
      id: 2,
      time: "10:15",
      title: "Kiểm tra sức khỏe lớp 5B",
      type: "health_check",
    },
    {
      id: 3,
      time: "11:30",
      title: "Tư vấn dinh dưỡng cho học sinh béo phì",
      type: "consultation",
    },
    {
      id: 4,
      time: "13:15",
      title: "Họp với ban giám hiệu về kế hoạch y tế học đường",
      type: "meeting",
    },
  ];

  // Mock recent events data
  const recentEvents = [
    {
      id: 1,
      studentName: "Trần Minh Đức",
      class: "5B",
      description: "Sốt nhẹ 38°C, đã cấp thuốc hạ sốt",
      timestamp: "1 giờ trước",
      type: "illness",
    },
    {
      id: 2,
      studentName: "Lê Thị Hoa",
      class: "2C",
      description: "Té ngã sân chơi, xây xát nhẹ, đã sơ cứu",
      timestamp: "2 giờ trước",
      type: "injury",
    },
    {
      id: 3,
      studentName: "Nguyễn Văn An",
      class: "3A",
      description: "Đã cấp thuốc theo lịch",
      timestamp: "3 giờ trước",
      type: "medication",
    },
    {
      id: 4,
      studentName: "Phạm Thị Mai",
      class: "4A",
      description: "Đau bụng, đã liên hệ phụ huynh",
      timestamp: "4 giờ trước",
      type: "illness",
    },
  ];

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 dark:border-primary-400"></div>
          <p className="ml-2 text-neutral-500 dark:text-neutral-400">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <>
          {/* Simple Greeting */}
          <SimpleGreeting roleTitle="Nurse" />

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
                Tổng quan y tế học đường
              </h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Theo dõi tình hình sức khỏe và hoạt động y tế của học sinh
              </p>

              {/* Date Range Selector */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDateRangeChange("today")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "today"
                      ? "bg-primary-600 dark:bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  } transition-colors duration-200`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => handleDateRangeChange("week")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "week"
                      ? "bg-primary-600 dark:bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  } transition-colors duration-200`}
                >
                  Tuần này
                </button>
                <button
                  onClick={() => handleDateRangeChange("month")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "month"
                      ? "bg-primary-600 dark:bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  } transition-colors duration-200`}
                >
                  Tháng này
                </button>
                <button
                  onClick={() => handleDateRangeChange("semester")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "semester"
                      ? "bg-primary-600 dark:bg-primary-500 text-white"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  } transition-colors duration-200`}
                >
                  Học kỳ
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-primary-50 dark:bg-primary-900/30 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Yêu cầu thuốc chờ xử lý
                      </div>
                      <div className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                        {stats.pendingMedications}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center">
                      <FiTablet className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Kiểm tra sức khỏe sắp tới
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.scheduledHealthChecks}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                      <FiClipboard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Tiêm chủng sắp tới
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.upcomingVaccinations}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCalendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-100 dark:border-red-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-300">
                        Sự cố y tế hôm nay
                      </div>
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.healthEventsToday}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                      <FiActivity className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medication Reminders Section */}
          <div className="mb-8">
            <MedicationReminders />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Health Records Management - Takes up more space */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/30 to-blue-50 dark:to-blue-900/30 p-6 border-b border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center mb-2">
                        <FiHeart className="h-7 w-7 mr-3 text-primary-600 dark:text-primary-400" />
                        Hồ sơ sức khỏe học sinh
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Quản lý và theo dõi tình trạng sức khỏe của các học sinh
                        thuộc khối bạn phụ trách
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm border border-neutral-200 dark:border-neutral-600">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {stats.totalStudents}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          Tổng học sinh
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {stats.totalStudents - stats.allergyAlerts - 10}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Sức khỏe tốt
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                        {stats.allergyAlerts}
                      </div>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                        Có dị ứng
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
                        10
                      </div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                        Bệnh mãn tính
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {stats.totalCheckedStudents}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Đã kiểm tra
                      </div>
                    </div>
                  </div>

                  {/* Recent Health Records */}
                  <div className="space-y-3 mb-6">
                    <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                      Hồ sơ cần chú ý
                    </h4>
                    {[
                      {
                        name: "Nguyễn Văn An",
                        class: "5A",
                        issue: "Dị ứng thức ăn",
                        severity: "medium",
                      },
                      {
                        name: "Trần Thị Bình",
                        class: "5B",
                        issue: "Cận thị",
                        severity: "low",
                      },
                      {
                        name: "Lê Văn Cường",
                        class: "5C",
                        issue: "Hen suyễn",
                        severity: "high",
                      },
                    ].map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                              <FiUser className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {record.name} - {record.class}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              {record.issue}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              record.severity === "high"
                                ? "bg-red-500"
                                : record.severity === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></span>
                          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                            <FiEye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/nurse/health-records"
                      className="flex items-center bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                      <FiHeart className="h-4 w-4 mr-2" />
                      Xem tất cả hồ sơ
                    </Link>
                    <Link
                      to="/nurse/health-services/health-check-create"
                      className="flex items-center bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                      <FiPlus className="h-4 w-4 mr-2" />
                      Khám sức khỏe
                    </Link>
                    <Link
                      to="/nurse/health-events/create"
                      className="flex items-center bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
                    >
                      <FiAlertCircle className="h-4 w-4 mr-2" />
                      Báo cáo sự cố
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                  Hoạt động gần đây
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">{/* Activities content */}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NurseDashboard;
