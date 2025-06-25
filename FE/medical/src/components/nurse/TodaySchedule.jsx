import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiClock,
  FiTablet,
  FiClipboard,
  FiUsers,
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiMoreVertical,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUser,
  FiFileText,
  FiMessageCircle,
} from "react-icons/fi";

const TodaySchedule = () => {
  const [loading, setLoading] = useState(true);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockSchedule = [
        {
          id: 1,
          time: "08:30",
          endTime: "09:00",
          title: "Cấp thuốc cho Nguyễn Văn An",
          subtitle: "Lớp 3A",
          type: "medication",
          status: "completed",
          priority: "normal",
          details: "Paracetamol 250mg - 1 viên",
          student: {
            name: "Nguyễn Văn An",
            class: "3A",
            avatar: null,
          },
          notes: "Đã cấp thuốc đúng giờ, học sinh uống thuốc tại phòng y tế",
        },
        {
          id: 2,
          time: "09:30",
          endTime: "10:00",
          title: "Kiểm tra sức khỏe định kỳ",
          subtitle: "Lớp 5B - 25 học sinh",
          type: "health_check",
          status: "in_progress",
          priority: "high",
          details: "Kiểm tra tầm vóc, cân nặng, thị lực",
          location: "Phòng y tế",
          studentsCount: 25,
          completedCount: 12,
        },
        {
          id: 3,
          time: "10:15",
          endTime: "10:45",
          title: "Tư vấn dinh dưỡng",
          subtitle: "Học sinh béo phì - 5 em",
          type: "consultation",
          status: "upcoming",
          priority: "normal",
          details: "Tư vấn chế độ ăn uống và luyện tập",
          students: [
            "Trần Văn A (4A)",
            "Lê Thị B (4B)",
            "Nguyễn Văn C (5A)",
            "Phạm Thị D (5B)",
            "Hoàng Văn E (3C)",
          ],
        },
        {
          id: 4,
          time: "11:30",
          endTime: "12:00",
          title: "Tiêm chủng Viêm gan B",
          subtitle: "Lớp 1A - 20 học sinh",
          type: "vaccination",
          status: "upcoming",
          priority: "high",
          details: "Mũi tiêm thứ 2 theo lịch",
          location: "Phòng y tế",
          studentsCount: 20,
          consent: {
            received: 18,
            pending: 2,
          },
        },
        {
          id: 5,
          time: "13:15",
          endTime: "14:00",
          title: "Họp ban giám hiệu",
          subtitle: "Kế hoạch y tế học đường",
          type: "meeting",
          status: "upcoming",
          priority: "normal",
          details: "Báo cáo tình hình sức khỏe học sinh tháng này",
          location: "Phòng họp",
          attendees: ["Hiệu trưởng", "Phó hiệu trưởng", "Trưởng khoa"],
        },
        {
          id: 6,
          time: "14:30",
          endTime: "15:00",
          title: "Xử lý sự cố y tế",
          subtitle: "Học sinh ngất xỉu",
          type: "emergency",
          status: "upcoming",
          priority: "urgent",
          details: "Học sinh lớp 4C ngất xỉu trong giờ thể dục",
          student: {
            name: "Phạm Thị Mai",
            class: "4C",
            avatar: null,
          },
        },
        {
          id: 7,
          time: "15:30",
          endTime: "16:00",
          title: "Cấp thuốc chiều",
          subtitle: "3 học sinh",
          type: "medication",
          status: "upcoming",
          priority: "normal",
          details: "Thuốc dị ứng và vitamin",
          students: [
            "Nguyễn Văn F (2A) - Thuốc dị ứng",
            "Trần Thị G (3B) - Vitamin D",
            "Lê Văn H (4A) - Sắt",
          ],
        },
      ];

      setScheduleItems(mockSchedule);
      setLoading(false);
    }, 1000);
  }, []);

  // Get icon for schedule type
  const getTypeIcon = (type) => {
    switch (type) {
      case "medication":
        return <FiTablet className="h-5 w-5" />;
      case "health_check":
        return <FiClipboard className="h-5 w-5" />;
      case "consultation":
        return <FiMessageCircle className="h-5 w-5" />;
      case "vaccination":
        return <FiActivity className="h-5 w-5" />;
      case "meeting":
        return <FiUsers className="h-5 w-5" />;
      case "emergency":
        return <FiAlertCircle className="h-5 w-5" />;
      default:
        return <FiCalendar className="h-5 w-5" />;
    }
  };

  // Get color scheme for schedule type
  const getTypeColors = (type, status) => {
    const baseColors = {
      medication: "blue",
      health_check: "green",
      consultation: "purple",
      vaccination: "orange",
      meeting: "gray",
      emergency: "red",
    };

    const color = baseColors[type] || "gray";

    if (status === "completed") {
      return {
        bg: "bg-gray-50 dark:bg-gray-800/50",
        border: "border-gray-200 dark:border-gray-600",
        icon: "text-gray-400 dark:text-gray-500",
        text: "text-gray-600 dark:text-gray-400",
      };
    }

    return {
      bg: `bg-${color}-50 dark:bg-${color}-900/30`,
      border: `border-${color}-200 dark:border-${color}-800`,
      icon: `text-${color}-600 dark:text-${color}-400`,
      text: `text-${color}-800 dark:text-${color}-200`,
    };
  };

  // Get status badge
  const getStatusBadge = (status, priority) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
            <FiCheckCircle className="h-3 w-3 mr-1" />
            Hoàn thành
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
            <FiClock className="h-3 w-3 mr-1" />
            Đang thực hiện
          </span>
        );
      case "upcoming":
        if (priority === "urgent") {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
              <FiAlertCircle className="h-3 w-3 mr-1" />
              Khẩn cấp
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
            <FiClock className="h-3 w-3 mr-1" />
            Sắp tới
          </span>
        );
      default:
        return null;
    }
  };

  // Check if time is current
  const isCurrentTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const itemTime = new Date();
    itemTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const timeDiff = Math.abs(itemTime - now);

    return timeDiff <= 30 * 60 * 1000; // Within 30 minutes
  };

  // Filter items based on selected filter
  const filteredItems = scheduleItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status !== "completed";
    if (filter === "urgent")
      return item.priority === "urgent" || item.priority === "high";
    return item.status === filter;
  });

  // Mark item as completed
  const markAsCompleted = (id) => {
    setScheduleItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "completed" } : item
      )
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/30 to-blue-50 dark:to-blue-900/30 p-6 border-b border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center mb-2">
              <FiCalendar className="h-7 w-7 mr-3 text-primary-600 dark:text-primary-400" />
              Lịch trình hôm nay
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 shadow-sm border border-neutral-200 dark:border-neutral-600">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {currentTime.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Giờ hiện tại
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center shadow-sm border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              {scheduleItems.length}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Tổng số
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center shadow-sm border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {
                scheduleItems.filter((item) => item.status !== "completed")
                  .length
              }
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Chờ xử lý
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center shadow-sm border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {
                scheduleItems.filter(
                  (item) =>
                    item.priority === "urgent" || item.priority === "high"
                ).length
              }
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
              Khẩn cấp
            </div>
          </div>
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 text-center shadow-sm border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {
                scheduleItems.filter((item) => item.status === "completed")
                  .length
              }
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              Hoàn thành
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {[
            {
              key: "all",
              label: "Tất cả",
              count: scheduleItems.length,
              color: "bg-neutral-600 dark:bg-neutral-500",
            },
            {
              key: "pending",
              label: "Chờ xử lý",
              count: scheduleItems.filter((item) => item.status !== "completed")
                .length,
              color: "bg-blue-600 dark:bg-blue-500",
            },
            {
              key: "urgent",
              label: "Khẩn cấp",
              count: scheduleItems.filter(
                (item) => item.priority === "urgent" || item.priority === "high"
              ).length,
              color: "bg-red-600 dark:bg-red-500",
            },
            {
              key: "completed",
              label: "Hoàn thành",
              count: scheduleItems.filter((item) => item.status === "completed")
                .length,
              color: "bg-green-600 dark:bg-green-500",
            },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === filterOption.key
                  ? `${filterOption.color} text-white shadow-md transform scale-105`
                  : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-sm border border-neutral-200 dark:border-neutral-600"
              }`}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
            <span className="ml-3 text-neutral-500 dark:text-neutral-400">
              Đang tải lịch trình...
            </span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400">
            <FiCalendar className="h-12 w-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-500" />
            <p className="text-lg font-medium mb-1">Không có lịch trình</p>
            <p className="text-sm">
              {filter === "all"
                ? "Chưa có hoạt động nào được lên lịch cho hôm nay"
                : `Không có hoạt động nào trong bộ lọc "${
                    filter === "pending"
                      ? "Chờ xử lý"
                      : filter === "urgent"
                      ? "Khẩn cấp"
                      : "Hoàn thành"
                  }"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const colors = getTypeColors(item.type, item.status);
              const isCurrent = isCurrentTime(item.time);

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-neutral-800 rounded-xl border-2 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                    isCurrent
                      ? "border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-neutral-200 dark:border-neutral-600 hover:border-primary-200 dark:hover:border-primary-600"
                  } ${
                    item.priority === "urgent"
                      ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                      : ""
                  }`}
                >
                  {/* Header với timeline */}
                  <div
                    className={`p-4 border-b border-neutral-200 dark:border-neutral-600 ${
                      isCurrent
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : "bg-neutral-50 dark:bg-neutral-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Time Badge */}
                        <div
                          className={`px-4 py-2 rounded-lg font-bold text-lg ${
                            isCurrent
                              ? "bg-yellow-500 dark:bg-yellow-600 text-white"
                              : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600"
                          }`}
                        >
                          {item.time}
                          {item.endTime && (
                            <span className="text-sm font-normal opacity-70 ml-1">
                              - {item.endTime}
                            </span>
                          )}
                        </div>

                        {/* Type Icon */}
                        <div
                          className={`p-3 rounded-xl ${colors.bg} ${colors.border} border-2`}
                        >
                          <div className={`${colors.icon} text-lg`}>
                            {getTypeIcon(item.type)}
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <h4 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(item.status, item.priority)}
                        {isCurrent && (
                          <div className="flex items-center px-2 py-1 bg-yellow-500 dark:bg-yellow-600 text-white rounded-full text-xs font-medium">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            Đang diễn ra
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {item.details && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 bg-neutral-50 dark:bg-neutral-700 p-3 rounded-lg">
                        {item.details}
                      </p>
                    )}

                    {/* Additional Info */}
                    {(item.location || item.studentsCount || item.consent) && (
                      <div className="flex flex-wrap gap-3 mb-4">
                        {item.location && (
                          <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-sm text-blue-700 dark:text-blue-300">
                            <FiCalendar className="h-4 w-4 mr-2" />
                            {item.location}
                          </div>
                        )}
                        {item.studentsCount && (
                          <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-sm text-green-700 dark:text-green-300">
                            <FiUsers className="h-4 w-4 mr-2" />
                            {item.studentsCount} học sinh
                            {item.completedCount && (
                              <span className="ml-1 font-medium">
                                ({item.completedCount} hoàn thành)
                              </span>
                            )}
                          </div>
                        )}
                        {item.consent && (
                          <div className="flex items-center bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-700 dark:text-purple-300">
                            <FiFileText className="h-4 w-4 mr-2" />
                            Đồng ý: {item.consent.received}/
                            {item.consent.received + item.consent.pending}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {item.status !== "completed" && (
                        <button
                          onClick={() => markAsCompleted(item.id)}
                          className="flex items-center bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          <FiCheckCircle className="h-4 w-4 mr-2" />
                          Hoàn thành
                        </button>
                      )}
                      <button className="flex items-center bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg transition-colors">
                        <FiEdit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </button>
                      <button className="flex items-center bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg transition-colors">
                        <FiUser className="h-4 w-4 mr-2" />
                        Chi tiết
                      </button>
                    </div>

                    {/* Notes */}
                    {item.notes && item.status === "completed" && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-300">
                          <strong>Ghi chú:</strong> {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-neutral-50 dark:from-neutral-800 to-blue-50 dark:to-blue-900/30 border-t border-neutral-100 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Tổng cộng:</span>{" "}
              {scheduleItems.length} hoạt động
            </div>
            {/* Progress indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      scheduleItems.length > 0
                        ? (scheduleItems.filter(
                            (item) => item.status === "completed"
                          ).length /
                            scheduleItems.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {
                  scheduleItems.filter((item) => item.status === "completed")
                    .length
                }
                /{scheduleItems.length} hoàn thành
              </span>
            </div>
          </div>
          <Link
            to="/nurse/schedule"
            className="flex items-center bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            Xem lịch trình đầy đủ
            <FiCalendar className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;
