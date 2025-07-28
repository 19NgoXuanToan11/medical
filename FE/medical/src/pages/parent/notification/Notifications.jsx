import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "../../../utils/auth/AuthContext";
import useNotificationPolling from "../../../hooks/useNotificationPolling";
import { formatNotificationTime } from "../../../utils/timeUtils";

const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  // Use notification polling hook
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotificationPolling(user?.id, 10000); // Poll every 10 seconds

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    if (filter === "action") return notification.type === "health_event"; // Health events require action
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
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600 dark:text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
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

  const formatDate = (dateString) => {
    return formatNotificationTime(dateString);
  };

  const getNotificationDateTime = (notification) => {
    // Parse additionalData to get EventDate if available
    try {
      if (notification.additionalData) {
        const additionalData = JSON.parse(notification.additionalData);
        return additionalData?.EventDate || notification.createdAt;
      }
    } catch (error) {
      console.warn("Error parsing additional data:", error);
    }
    return notification.createdAt;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 dark:text-red-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400";
      case "low":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-neutral-600 dark:text-neutral-400";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Lỗi tải thông báo
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshNotifications}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Thông báo
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={refreshNotifications}
            className="px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-neutral-700 dark:text-neutral-200 font-medium"
          >
            Làm mới
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-neutral-700 dark:text-neutral-200 font-medium"
            disabled={unreadCount === 0}
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
          Cần xem
        </button>
        <button
          onClick={() => setFilter("health_event")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            filter === "health_event"
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
              : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
          }`}
        >
          Sự cố y tế
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
                      ? "cần xem"
                      : filter === "medication"
                      ? "thuốc"
                      : filter === "health_event"
                      ? "sự cố y tế"
                      : "tiêm chủng"
                  }".`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.notificationId}
                className={`p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                  !notification.isRead
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-neutral-900 dark:text-neutral-100"
                                : "text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span
                            className={`text-xs font-medium ${getPriorityColor(
                              notification.priority
                            )}`}
                          >
                            {notification.priority === "urgent"
                              ? "Khẩn cấp"
                              : notification.priority === "high"
                              ? "Quan trọng"
                              : notification.priority === "medium"
                              ? "Bình thường"
                              : "Thấp"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">
                          {formatDate(getNotificationDateTime(notification))}
                        </p>

                        {notification.studentName && (
                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                            Học sinh: {notification.studentName}
                          </p>
                        )}

                        {notification.type === "health_event" && (
                          <div className="mt-3">
                            <Link
                              to="/parent/health-events"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              handleMarkAsRead(notification.notificationId)
                            }
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(
                              notification.notificationId
                            )
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
