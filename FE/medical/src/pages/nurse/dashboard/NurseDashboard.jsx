import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "react-icons/fi";
import MedicationReminders from "../medication/MedicationReminders";

const NurseDashboard = () => {
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          <p className="ml-2 text-neutral-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Notifications Section */}
          {notifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center">
                  <FiBell className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-medium text-neutral-800">
                    Thông báo mới
                  </h3>
                  {unreadNotifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications.length}
                    </span>
                  )}
                </div>
                {notifications.length > 3 && (
                  <button
                    onClick={() =>
                      setShowAllNotifications(!showAllNotifications)
                    }
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {showAllNotifications ? "Thu gọn" : "Xem tất cả"}
                  </button>
                )}
              </div>
              <div className="divide-y divide-neutral-100">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.createdAt}
                    className={`p-4 hover:bg-neutral-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <FiTablet className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-neutral-900"
                                : "text-neutral-700"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-neutral-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(notification.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markNotificationAsRead(notification.createdAt)
                            }
                            className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() =>
                            removeNotification(notification.createdAt)
                          }
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                Tổng quan y tế học đường
              </h2>
              <p className="text-neutral-600 mb-6">
                Theo dõi tình hình sức khỏe và hoạt động y tế của học sinh
              </p>

              {/* Date Range Selector */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDateRangeChange("today")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "today"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => handleDateRangeChange("week")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "week"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Tuần này
                </button>
                <button
                  onClick={() => handleDateRangeChange("month")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "month"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Tháng này
                </button>
                <button
                  onClick={() => handleDateRangeChange("semester")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "semester"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Học kỳ
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Yêu cầu thuốc chờ xử lý
                      </div>
                      <div className="text-3xl font-bold text-primary-700">
                        {stats.pendingMedications}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiTablet className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Kiểm tra sức khỏe sắp tới
                      </div>
                      <div className="text-3xl font-bold text-yellow-600">
                        {stats.scheduledHealthChecks}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FiClipboard className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Tiêm chủng sắp tới
                      </div>
                      <div className="text-3xl font-bold text-green-600">
                        {stats.upcomingVaccinations}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCalendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Sự kiện y tế hôm nay
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        {stats.healthEventsToday}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FiActivity className="h-6 w-6 text-red-600" />
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Performance Metrics */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-800">
                  Lịch trình hôm nay
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center p-3 bg-neutral-50 rounded-lg"
                    >
                      <div className="bg-primary-100 p-2 rounded-full">
                        <FiClock className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-neutral-800">
                            {task.title}
                          </div>
                          <div className="text-xs font-medium text-primary-600">
                            {task.time}
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500">
                          {task.type === "medication"
                            ? "Cấp thuốc"
                            : task.type === "health_check"
                            ? "Kiểm tra sức khỏe"
                            : task.type === "consultation"
                            ? "Tư vấn"
                            : "Cuộc họp"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="#"
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Xem tất cả lịch trình
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-800">
                  Sự kiện gần đây
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center p-3 bg-neutral-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          event.type === "illness"
                            ? "bg-red-100"
                            : event.type === "injury"
                            ? "bg-yellow-100"
                            : "bg-green-100"
                        }`}
                      >
                        <FiActivity
                          className={`h-5 w-5 ${
                            event.type === "illness"
                              ? "text-red-600"
                              : event.type === "injury"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-neutral-800">
                            {event.studentName} ({event.class})
                          </div>
                          <div className="text-xs text-neutral-500">
                            {event.timestamp}
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/nurse/health-events"
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Xem tất cả sự kiện
                  </Link>
                </div>
              </div>
            </div>

            {/* Alerts and Notifications */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-800">
                  Cảnh báo sức khỏe
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Cảnh báo dị ứng
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {stats.allergyAlerts} học sinh
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${(stats.allergyAlerts / 20) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Học sinh có dị ứng cần chú ý
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Tuân thủ dùng thuốc
                      </span>
                      <span className="text-sm font-medium text-primary-700">
                        {stats.medicationAdherence}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${stats.medicationAdherence}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Tỷ lệ học sinh uống thuốc đúng lịch
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-4">
                    <div className="font-medium text-neutral-800 mb-2">
                      Học sinh cần quan tâm
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center">
                          <FiAlertCircle className="text-red-500 mr-2" />
                          <span className="text-sm">
                            Nguyễn Văn B - Dị ứng thức ăn
                          </span>
                        </div>
                        <Link
                          to="#"
                          className="text-xs text-primary-600 hover:underline"
                        >
                          Chi tiết
                        </Link>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div className="flex items-center">
                          <FiAlertCircle className="text-yellow-500 mr-2" />
                          <span className="text-sm">
                            Trần Thị C - Hen suyễn
                          </span>
                        </div>
                        <Link
                          to="#"
                          className="text-xs text-primary-600 hover:underline"
                        >
                          Chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NurseDashboard;
