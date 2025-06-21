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
import TodaySchedule from "../../../components/nurse/TodaySchedule";

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
            {/* Today's Schedule - Takes up more space */}
            <div className="lg:col-span-2">
              <TodaySchedule />
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
          </div>

          {/* Enhanced Health Alerts Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
                  <FiAlertCircle className="h-6 w-6 text-red-500 mr-3" />
                  Cảnh báo & Theo dõi sức khỏe
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-neutral-500">Cập nhật:</span>
                  <span className="text-sm font-medium text-neutral-700">
                    {new Date().toLocaleTimeString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Alert Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Cảnh báo khẩn cấp
                      </p>
                      <p className="text-2xl font-bold text-red-600">3</p>
                      <p className="text-xs text-red-600">Cần xử lý ngay</p>
                    </div>
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <FiAlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Cảnh báo dị ứng
                      </p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {stats.allergyAlerts}
                      </p>
                      <p className="text-xs text-yellow-600">
                        Học sinh có dị ứng
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FiTablet className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Theo dõi đặc biệt
                      </p>
                      <p className="text-2xl font-bold text-blue-600">8</p>
                      <p className="text-xs text-blue-600">
                        Cần chú ý thường xuyên
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUsers className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Tuân thủ thuốc
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.medicationAdherence}%
                      </p>
                      <p className="text-xs text-green-600">Tỷ lệ tuân thủ</p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Priority Students */}
                <div className="border border-neutral-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                    <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    Học sinh ưu tiên theo dõi
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-medium text-red-800">
                            Nguyễn Văn B
                          </p>
                          <p className="text-sm text-red-600">
                            Lớp 3A - Dị ứng thức ăn nghiêm trọng
                          </p>
                          <p className="text-xs text-red-500">
                            Cần kiểm tra trước bữa ăn
                          </p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-yellow-800">
                            Trần Thị C
                          </p>
                          <p className="text-sm text-yellow-600">
                            Lớp 4B - Hen suyễn
                          </p>
                          <p className="text-xs text-yellow-500">
                            Cần thuốc xịt khẩn cấp
                          </p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full hover:bg-yellow-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-orange-800">
                            Lê Minh D
                          </p>
                          <p className="text-sm text-orange-600">
                            Lớp 5A - Tiểu đường type 1
                          </p>
                          <p className="text-xs text-orange-500">
                            Cần theo dõi đường huyết
                          </p>
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full hover:bg-orange-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <Link
                      to="/nurse/health-check"
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800"
                    >
                      Xem tất cả học sinh cần theo dõi
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Health Metrics & Trends */}
                <div className="border border-neutral-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center">
                    <FiActivity className="h-5 w-5 text-blue-500 mr-2" />
                    Chỉ số sức khỏe tổng quan
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Tuân thủ dùng thuốc
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          {stats.medicationAdherence}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${stats.medicationAdherence}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Mục tiêu: ≥95%
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Tỷ lệ học sinh khỏe mạnh
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          87%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: "87%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Không có vấn đề sức khỏe nghiêm trọng
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-neutral-700">
                          Tỷ lệ tiêm chủng đầy đủ
                        </span>
                        <span className="text-sm font-bold text-purple-600">
                          92%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: "92%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        Đã tiêm đủ vaccine theo lứa tuổi
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-200">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            847
                          </p>
                          <p className="text-xs text-green-700">
                            Học sinh khỏe mạnh
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-lg font-bold text-yellow-600">
                            48
                          </p>
                          <p className="text-xs text-yellow-700">
                            Cần theo dõi
                          </p>
                        </div>
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
