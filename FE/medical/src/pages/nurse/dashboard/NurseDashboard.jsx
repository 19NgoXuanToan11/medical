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
        </>
      )}
    </div>
  );
};

export default NurseDashboard;
