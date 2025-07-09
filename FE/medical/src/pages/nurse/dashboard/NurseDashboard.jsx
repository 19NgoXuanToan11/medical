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
} from "react-icons/fi";
import MedicationReminders from "../medication/MedicationReminders";
import TodaySchedule from "../../../components/nurse/TodaySchedule";
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Today's Schedule - Takes up more space */}
            <div className="lg:col-span-2">
              <TodaySchedule />
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                  Sự kiện gần đây
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          event.type === "illness"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : event.type === "injury"
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : "bg-green-100 dark:bg-green-900/30"
                        }`}
                      >
                        <FiActivity
                          className={`h-5 w-5 ${
                            event.type === "illness"
                              ? "text-red-600 dark:text-red-400"
                              : event.type === "injury"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {event.studentName} ({event.class})
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {event.timestamp}
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {event.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/nurse/health-events"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    Xem tất cả sự kiện
                  </Link>
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
