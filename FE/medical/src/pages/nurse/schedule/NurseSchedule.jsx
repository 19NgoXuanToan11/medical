import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiTablet,
  FiClipboard,
  FiUsers,
  FiActivity,
  FiMessageCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiDownload,
  FiRefreshCw,
} from "react-icons/fi";

const NurseSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Generate calendar dates for week view
  const generateCalendarDates = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Mock schedule data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockSchedule = [
        {
          id: 1,
          date: "2024-06-21",
          time: "08:30",
          endTime: "09:00",
          title: "Cấp thuốc cho Nguyễn Văn An",
          subtitle: "Lớp 3A",
          type: "medication",
          status: "completed",
          priority: "normal",
          details: "Paracetamol 250mg - 1 viên",
          location: "Phòng y tế",
        },
        {
          id: 2,
          date: "2024-06-21",
          time: "09:30",
          endTime: "10:30",
          title: "Kiểm tra sức khỏe định kỳ",
          subtitle: "Lớp 5B - 25 học sinh",
          type: "health_check",
          status: "in_progress",
          priority: "high",
          details: "Kiểm tra tầm vóc, cân nặng, thị lực",
          location: "Phòng y tế",
        },
        {
          id: 3,
          date: "2024-06-21",
          time: "10:15",
          endTime: "10:45",
          title: "Tư vấn dinh dưỡng",
          subtitle: "Học sinh béo phì - 5 em",
          type: "consultation",
          status: "upcoming",
          priority: "normal",
          details: "Tư vấn chế độ ăn uống và luyện tập",
          location: "Phòng tư vấn",
        },
        {
          id: 4,
          date: "2024-06-22",
          time: "08:00",
          endTime: "09:00",
          title: "Tiêm chủng Viêm gan B",
          subtitle: "Lớp 1A - 20 học sinh",
          type: "vaccination",
          status: "upcoming",
          priority: "high",
          details: "Mũi tiêm thứ 2 theo lịch",
          location: "Phòng y tế",
        },
        {
          id: 5,
          date: "2024-06-22",
          time: "10:00",
          endTime: "11:00",
          title: "Họp ban giám hiệu",
          subtitle: "Kế hoạch y tế học đường",
          type: "meeting",
          status: "upcoming",
          priority: "normal",
          details: "Báo cáo tình hình sức khỏe học sinh tháng này",
          location: "Phòng họp",
        },
        {
          id: 6,
          date: "2024-06-23",
          time: "14:30",
          endTime: "15:00",
          title: "Xử lý sự cố y tế",
          subtitle: "Học sinh ngất xỉu",
          type: "emergency",
          status: "upcoming",
          priority: "urgent",
          details: "Học sinh lớp 4C ngất xỉu trong giờ thể dục",
          location: "Phòng y tế",
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
        return <FiTablet className="h-4 w-4" />;
      case "health_check":
        return <FiClipboard className="h-4 w-4" />;
      case "consultation":
        return <FiMessageCircle className="h-4 w-4" />;
      case "vaccination":
        return <FiActivity className="h-4 w-4" />;
      case "meeting":
        return <FiUsers className="h-4 w-4" />;
      case "emergency":
        return <FiAlertCircle className="h-4 w-4" />;
      default:
        return <FiCalendar className="h-4 w-4" />;
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
        bg: "bg-gray-100",
        border: "border-gray-300",
        text: "text-gray-600",
      };
    }

    return {
      bg: `bg-${color}-100`,
      border: `border-${color}-300`,
      text: `text-${color}-800`,
    };
  };

  // Filter items by date and other criteria
  const getItemsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return scheduleItems.filter((item) => {
      const itemDate = item.date;
      const matchesDate = itemDate === dateStr;
      const matchesType = filterType === "all" || item.type === filterType;
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesDate && matchesType && matchesSearch;
    });
  };

  // Navigate calendar
  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Lịch trình y tá
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và theo dõi lịch trình công việc hàng ngày
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <FiPlus className="h-5 w-5 mr-2" />
              Thêm lịch trình
            </button>
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center">
              <FiDownload className="h-5 w-5 mr-2" />
              Xuất lịch
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Calendar Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateWeek(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-lg font-semibold text-gray-800">
                {currentDate.toLocaleDateString("vi-VN", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <button
                onClick={() => navigateWeek(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={navigateToToday}
                className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
              >
                Hôm nay
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lịch trình..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="medication">Cấp thuốc</option>
                <option value="health_check">Kiểm tra sức khỏe</option>
                <option value="consultation">Tư vấn</option>
                <option value="vaccination">Tiêm chủng</option>
                <option value="meeting">Họp</option>
                <option value="emergency">Khẩn cấp</option>
              </select>

              <button
                onClick={() => window.location.reload()}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
            <div
              key={index}
              className="p-4 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 min-h-[600px]">
          {calendarDates.map((date, index) => {
            const items = getItemsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`border-r border-gray-200 last:border-r-0 border-b border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-primary-50" : ""
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`text-sm font-medium ${
                      isToday
                        ? "bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        : isSelected
                        ? "text-primary-600"
                        : "text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  {items.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {items.length} việc
                    </div>
                  )}
                </div>

                {/* Schedule Items */}
                <div className="space-y-1">
                  {items.slice(0, 3).map((item) => {
                    const colors = getTypeColors(item.type, item.status);
                    return (
                      <div
                        key={item.id}
                        className={`p-2 rounded text-xs ${colors.bg} ${colors.border} border ${colors.text} hover:shadow-sm transition-shadow`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            {getTypeIcon(item.type)}
                            <span className="ml-1 font-medium">
                              {item.time}
                            </span>
                          </div>
                          {item.status === "completed" && (
                            <FiCheckCircle className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <div className="truncate">{item.title}</div>
                      </div>
                    );
                  })}
                  {items.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{items.length - 3} việc khác
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">
              Lịch trình ngày{" "}
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-gray-500">Đang tải...</span>
              </div>
            ) : getItemsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiCalendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-1">Không có lịch trình</p>
                <p className="text-sm">
                  Chưa có hoạt động nào được lên lịch cho ngày này
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {getItemsForDate(selectedDate)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((item) => {
                    const colors = getTypeColors(item.type, item.status);
                    return (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div
                              className={`p-3 rounded-lg ${colors.bg} ${colors.border} border`}
                            >
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-lg font-medium text-gray-800">
                                  {item.title}
                                </h4>
                                {item.status === "completed" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <FiCheckCircle className="h-3 w-3 mr-1" />
                                    Hoàn thành
                                  </span>
                                )}
                                {item.status === "in_progress" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <FiClock className="h-3 w-3 mr-1" />
                                    Đang thực hiện
                                  </span>
                                )}
                                {item.priority === "urgent" && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <FiAlertCircle className="h-3 w-3 mr-1" />
                                    Khẩn cấp
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2">
                                {item.subtitle}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <FiClock className="h-4 w-4 mr-1" />
                                  {item.time} - {item.endTime}
                                </span>
                                {item.location && (
                                  <span className="flex items-center">
                                    <FiCalendar className="h-4 w-4 mr-1" />
                                    {item.location}
                                  </span>
                                )}
                              </div>
                              {item.details && (
                                <p className="text-sm text-gray-600 mb-3">
                                  {item.details}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseSchedule;
