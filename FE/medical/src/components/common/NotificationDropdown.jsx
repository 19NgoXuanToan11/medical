import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaCircle, FaTimes, FaCheck } from "react-icons/fa";
import {
  FiTablet,
  FiCalendar,
  FiShield,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiX,
} from "react-icons/fi";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const NotificationDropdown = ({ userRole = "parent" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Mock notification data based on user role
  const mockNotifications = {
    parent: [
      {
        id: "parent_1",
        title: "Yêu cầu thuốc đã được giao nhiệm vụ",
        message:
          "Yêu cầu cấp thuốc fpt uni cho Lê Minh Nguyễn đã được giao cho nhân viên y tế.",
        type: "medication",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionRequired: false,
        priority: "medium",
      },
      {
        id: "parent_2",
        title: "Yêu cầu thuốc đã được giao nhiệm vụ",
        message:
          "Yêu cầu cấp thuốc Vixindisenomo cho Ngô Xuân Toản đã được giao cho nhân viên y tế.",
        type: "medication",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        read: false,
        actionRequired: false,
        priority: "medium",
      },
      {
        id: "parent_3",
        title: "Sự kiện khám sức khỏe sắp diễn ra",
        message:
          "Trường sẽ tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/01/2024. Vui lòng đảm bảo con bạn có mặt.",
        type: "health_event",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        actionRequired: true,
        actionLink: "/parent/health-events",
        priority: "high",
      },
      {
        id: "parent_4",
        title: "Yêu cầu xác nhận tiêm chủng",
        message:
          "Vui lòng xác nhận đồng ý cho con bạn tham gia chương trình tiêm chủng vaccine cúm sắp tới.",
        type: "vaccination",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        actionRequired: true,
        actionLink: "/parent/vaccination/consent",
        priority: "high",
      },
      {
        id: "parent_5",
        title: "Báo cáo sức khỏe hàng tháng",
        message: "Báo cáo sức khỏe tháng 12 của con bạn đã sẵn sàng để xem.",
        type: "report",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        actionRequired: false,
        priority: "low",
      },
    ],
    nurse: [
      {
        id: "nurse_1",
        title: "Yêu cầu thuốc mới cần xử lý",
        message: "Có 3 yêu cầu thuốc mới cần được xem xét và phê duyệt.",
        type: "medication",
        date: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionRequired: true,
        actionLink: "/nurse/medication/pending",
        priority: "high",
      },
      {
        id: "nurse_2",
        title: "Lịch khám sức khỏe hôm nay",
        message: "Bạn có 15 học sinh cần khám sức khỏe định kỳ hôm nay.",
        type: "health_event",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionRequired: true,
        actionLink: "/nurse/health-check",
        priority: "medium",
      },
      {
        id: "nurse_3",
        title: "Cảnh báo dị ứng",
        message:
          "Học sinh Nguyễn Văn A có tiền sử dị ứng với Penicillin, cần lưu ý khi kê đơn.",
        type: "alert",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        actionRequired: false,
        priority: "high",
      },
    ],
    manager: [
      {
        id: "manager_1",
        title: "Báo cáo thống kê tuần",
        message: "Báo cáo thống kê hoạt động y tế tuần này đã sẵn sàng.",
        type: "report",
        date: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        actionRequired: true,
        actionLink: "/manager/reports",
        priority: "medium",
      },
      {
        id: "manager_2",
        title: "Tồn kho thuốc thấp",
        message: "Một số loại thuốc sắp hết, cần bổ sung kho.",
        type: "inventory",
        date: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        read: false,
        actionRequired: true,
        actionLink: "/manager/inventory",
        priority: "high",
      },
    ],
    admin: [
      {
        id: "admin_1",
        title: "Yêu cầu phê duyệt tài khoản mới",
        message: "Có 5 yêu cầu tạo tài khoản nhân viên mới cần phê duyệt.",
        type: "user_management",
        date: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        read: false,
        actionRequired: true,
        actionLink: "/admin/user-management",
        priority: "medium",
      },
      {
        id: "admin_2",
        title: "Cập nhật hệ thống",
        message: "Hệ thống sẽ được bảo trì vào 2:00 AM ngày mai.",
        type: "system",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        actionRequired: false,
        priority: "low",
      },
    ],
    student: [
      {
        id: "student_1",
        title: "Nhắc nhở uống thuốc",
        message: "Đã đến giờ uống thuốc theo đơn của bác sĩ.",
        type: "medication",
        date: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        read: false,
        actionRequired: true,
        actionLink: "/student/medication",
        priority: "high",
      },
      {
        id: "student_2",
        title: "Lịch khám sức khỏe",
        message: "Bạn có lịch khám sức khỏe định kỳ vào thứ 5 tuần này.",
        type: "health_event",
        date: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        read: false,
        actionRequired: false,
        priority: "medium",
      },
    ],
  };

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setNotifications(mockNotifications[userRole] || []);
      setLoading(false);
    }, 500);
  }, [userRole]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "medication":
        return (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <FiTablet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        );
      case "health_event":
        return (
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <FiCalendar className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        );
      case "vaccination":
        return (
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <FiShield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        );
      case "report":
        return (
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <FiFileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        );
      case "alert":
        return (
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
            <FiAlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        );
      case "inventory":
        return (
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <FiAlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        );
      case "user_management":
        return (
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
            <FiCheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
        );
      case "system":
        return (
          <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-full">
            <FiClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
            <FaBell className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
          </div>
        );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500 dark:border-red-400";
      case "medium":
        return "border-yellow-500 dark:border-yellow-400";
      case "low":
        return "border-green-500 dark:border-green-400";
      default:
        return "border-neutral-200 dark:border-neutral-700";
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays === 1) {
      return `Hôm qua, ${format(date, "HH:mm", { locale: vi })}`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return format(date, "dd/MM/yyyy", { locale: vi });
    }
  };

  const getNotificationLink = () => {
    switch (userRole) {
      case "parent":
        return "/parent/notifications";
      case "nurse":
        return "/nurse/notifications";
      case "manager":
        return "/manager/notifications";
      case "admin":
        return "/admin/notifications";
      case "student":
        return "/student/notifications";
      default:
        return "/notifications";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {unreadCount} thông báo chưa đọc
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30"
                >
                  Đánh dấu tất cả
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <FaBell className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-500 mb-2" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Không có thông báo nào
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                      !notification.read
                        ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 " +
                          getPriorityColor(notification.priority)
                        : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium ${
                                !notification.read
                                  ? "text-neutral-900 dark:text-neutral-100"
                                  : "text-neutral-700 dark:text-neutral-300"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                              {formatDate(notification.date)}
                            </p>
                            {notification.actionRequired && (
                              <div className="mt-2">
                                <Link
                                  to={notification.actionLink}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                                >
                                  Xem chi tiết
                                  <svg
                                    className="ml-1 h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1 ml-2">
                            {!notification.read && (
                              <FaCircle className="h-2 w-2 text-blue-500" />
                            )}
                            <div className="flex items-center space-x-1">
                              {!notification.read && (
                                <button
                                  onClick={() =>
                                    handleMarkAsRead(notification.id)
                                  }
                                  className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 p-1"
                                  title="Đánh dấu đã đọc"
                                >
                                  <FaCheck className="h-3 w-3" />
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                                title="Xóa thông báo"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-750">
              <Link
                to={getNotificationLink()}
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
