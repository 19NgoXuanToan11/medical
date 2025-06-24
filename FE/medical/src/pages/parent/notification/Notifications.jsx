import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Load notifications from localStorage and combine with mock data
    const loadNotifications = () => {
      // Get medication response notifications from localStorage
      const parentNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );

      // Mock data for other notifications
      const mockNotifications = [
        {
          id: 1,
          type: "health_event",
          title: "Sự kiện khám sức khỏe sắp diễn ra",
          message:
            "Trường sẽ tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/01/2024. Vui lòng đảm bảo con bạn có mặt.",
          date: new Date(2024, 0, 15, 14, 30),
          read: false,
          actionRequired: true,
          actionLink: "/parent/health-events/1",
        },
        {
          id: 2,
          type: "vaccination",
          title: "Yêu cầu xác nhận tiêm chủng",
          message:
            "Vui lòng xác nhận đồng ý cho con bạn tham gia chương trình tiêm chủng vaccine cúm sắp tới.",
          date: new Date(2024, 0, 10, 9, 15),
          read: true,
          actionRequired: true,
          actionLink: "/parent/vaccination/consent/1",
        },
        {
          id: 3,
          type: "report",
          title: "Báo cáo sức khỏe tháng 12 đã có",
          message:
            "Báo cáo sức khỏe hàng tháng của con bạn đã được cập nhật. Nhấn vào đây để xem chi tiết.",
          date: new Date(2024, 0, 5, 15, 45),
          read: true,
          actionRequired: true,
          actionLink: "/parent/reports/12-2023",
        },
      ];

      // Convert localStorage notifications to component format
      const formattedParentNotifications = parentNotifications.map(
        (notif, index) => ({
          id: `parent_${index}`,
          type: notif.type || "medication",
          title: notif.title,
          message: notif.message,
          date: new Date(notif.createdAt),
          read: notif.isRead || false,
          actionRequired: false,
          medicationRequestId: notif.medicationRequestId,
          studentId: notif.studentId,
        })
      );

      // Combine and sort by date (newest first)
      const allNotifications = [
        ...formattedParentNotifications,
        ...mockNotifications,
      ].sort((a, b) => b.date - a.date);

      setNotifications(allNotifications);
      setLoading(false);
    };

    // Initial load
    loadNotifications();

    // Set up interval to check for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );

      // Update localStorage for parent notifications
      if (id.startsWith("parent_")) {
        const parentNotifications = JSON.parse(
          localStorage.getItem("parentNotifications") || "[]"
        );
        const index = parseInt(id.replace("parent_", ""));
        if (parentNotifications[index]) {
          parentNotifications[index].isRead = true;
          localStorage.setItem(
            "parentNotifications",
            JSON.stringify(parentNotifications)
          );
        }
      }

      return updatedNotifications;
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) => ({
        ...notification,
        read: true,
      }));

      // Update localStorage for all parent notifications
      const parentNotifications = JSON.parse(
        localStorage.getItem("parentNotifications") || "[]"
      );
      const updatedParentNotifications = parentNotifications.map((notif) => ({
        ...notif,
        isRead: true,
      }));
      localStorage.setItem(
        "parentNotifications",
        JSON.stringify(updatedParentNotifications)
      );

      return updatedNotifications;
    });
  };

  const handleDeleteNotification = (id) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter(
        (notification) => notification.id !== id
      );

      // Remove from localStorage for parent notifications
      if (id.startsWith("parent_")) {
        const parentNotifications = JSON.parse(
          localStorage.getItem("parentNotifications") || "[]"
        );
        const index = parseInt(id.replace("parent_", ""));
        parentNotifications.splice(index, 1);
        localStorage.setItem(
          "parentNotifications",
          JSON.stringify(parentNotifications)
        );
      }

      return updatedNotifications;
    });
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "action") return notification.actionRequired;
    return notification.type === filter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case "medication":
      case "medication_response":
        return (
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "health_event":
        return (
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600 dark:text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "vaccination":
        return (
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600 dark:text-purple-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
              <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
            </svg>
          </div>
        );
      case "report":
        return (
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-600 dark:text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-neutral-600 dark:text-neutral-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hôm nay, ${format(date, "HH:mm", { locale: vi })}`;
    } else if (diffDays === 1) {
      return `Hôm qua, ${format(date, "HH:mm", { locale: vi })}`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước, ${format(date, "HH:mm", { locale: vi })}`;
    } else {
      return format(date, "dd/MM/yyyy, HH:mm", { locale: vi });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Thông báo
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-neutral-700 dark:text-neutral-200 font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto py-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "unread"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("action")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "action"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Cần xác nhận
        </button>
        <button
          onClick={() => setFilter("medication")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "medication"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Thuốc
        </button>
        <button
          onClick={() => setFilter("health_event")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "health_event"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Sự kiện y tế
        </button>
        <button
          onClick={() => setFilter("vaccination")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "vaccination"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Tiêm chủng
        </button>
      </div>

      {/* Notifications list */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A9.971 9.971 0 0124 30a9.971 9.971 0 018.287 6.286"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Không có thông báo
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              {filter === "all"
                ? "Bạn chưa có thông báo nào."
                : `Không có thông báo nào trong bộ lọc "${
                    filter === "unread"
                      ? "chưa đọc"
                      : filter === "action"
                      ? "cần xác nhận"
                      : filter === "medication"
                      ? "thuốc"
                      : filter === "health_event"
                      ? "sự kiện y tế"
                      : "tiêm chủng"
                  }".`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                  !notification.read
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-4">
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
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
                          {formatDate(notification.date)}
                        </p>

                        {notification.actionRequired && (
                          <div className="mt-3">
                            <Link
                              to={notification.actionLink}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
