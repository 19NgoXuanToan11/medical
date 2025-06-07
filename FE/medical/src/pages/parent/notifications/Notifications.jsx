import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // In a real application, this would be an API call
    // Mock data for demonstration
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          type: "medication",
          title: "Thuốc đã được cấp cho con bạn",
          message:
            "Thuốc Paracetamol đã được cấp cho Nguyễn Văn An vào lúc 10:30.",
          date: new Date(2023, 9, 12, 10, 45),
          read: false,
          actionRequired: false,
        },
        {
          id: 2,
          type: "health_event",
          title: "Sự kiện khám sức khỏe sắp diễn ra",
          message:
            "Trường sẽ tổ chức khám sức khỏe định kỳ cho học sinh vào ngày 25/10/2023. Vui lòng đảm bảo con bạn có mặt.",
          date: new Date(2023, 9, 10, 14, 30),
          read: false,
          actionRequired: true,
          actionLink: "/parent/health-events/1",
        },
        {
          id: 3,
          type: "vaccination",
          title: "Yêu cầu xác nhận tiêm chủng",
          message:
            "Vui lòng xác nhận đồng ý cho con bạn tham gia chương trình tiêm chủng vaccine cúm sắp tới.",
          date: new Date(2023, 9, 8, 9, 15),
          read: true,
          actionRequired: true,
          actionLink: "/parent/vaccination/consent/1",
        },
        {
          id: 4,
          type: "medication",
          title: "Yêu cầu thuốc đã được phê duyệt",
          message:
            "Yêu cầu cấp thuốc Amoxicillin cho Nguyễn Văn An đã được phê duyệt.",
          date: new Date(2023, 9, 5, 11, 20),
          read: true,
          actionRequired: false,
        },
        {
          id: 5,
          type: "report",
          title: "Báo cáo sức khỏe tháng 9 đã có",
          message:
            "Báo cáo sức khỏe hàng tháng của Nguyễn Văn An đã được cập nhật. Nhấn vào đây để xem chi tiết.",
          date: new Date(2023, 9, 2, 15, 45),
          read: true,
          actionRequired: true,
          actionLink: "/parent/reports/9-2023",
        },
      ];

      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
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
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
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
          <div className="p-2 bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
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
          <div className="p-2 bg-purple-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-purple-600"
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
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600"
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
          <div className="p-2 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>

        <div className="flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex overflow-x-auto py-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "all"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "unread"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Chưa đọc
        </button>
        <button
          onClick={() => setFilter("action")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "action"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Cần xác nhận
        </button>
        <button
          onClick={() => setFilter("medication")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "medication"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Thuốc
        </button>
        <button
          onClick={() => setFilter("vaccination")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "vaccination"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Tiêm chủng
        </button>
        <button
          onClick={() => setFilter("health_event")}
          className={`px-4 py-2 mr-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "health_event"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Sự kiện
        </button>
        <button
          onClick={() => setFilter("report")}
          className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
            filter === "report"
              ? "bg-primary-100 text-primary-800"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Báo cáo
        </button>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Không có thông báo
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Hiện tại bạn không có thông báo nào{" "}
            {filter !== "all" ? "trong danh mục này" : ""}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 bg-white rounded-lg shadow-sm border ${
                notification.read
                  ? "border-gray-100"
                  : "border-primary-100 bg-primary-50"
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-base font-semibold ${
                        notification.read ? "text-gray-800" : "text-primary-800"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatDate(notification.date)}</span>
                      {!notification.read && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                          Mới
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-gray-600">{notification.message}</p>
                  <div className="mt-3 flex items-center justify-between">
                    {notification.actionRequired ? (
                      <Link
                        to={notification.actionLink}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        Xem chi tiết
                      </Link>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Không cần hành động
                      </div>
                    )}
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
