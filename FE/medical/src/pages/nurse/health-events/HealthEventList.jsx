import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiClock,
  FiCalendar,
  FiActivity,
  FiPackage,
  FiCheck,
  FiAlertTriangle,
} from "react-icons/fi";

const HealthEventList = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setTimeout(() => {
      setEventsList([
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          class: "3A",
          type: "illness",
          description: "Sốt nhẹ 37.8°C, đã cấp thuốc hạ sốt",
          time: "2023-06-15T09:30:00",
          status: "resolved",
          actionTaken: "Đã cho uống thuốc hạ sốt và thông báo cho phụ huynh",
          hasMedications: true,
          hasMedicalSupplies: true,
        },
        {
          id: 2,
          studentName: "Lê Thị Bình",
          class: "2B",
          type: "injury",
          description: "Té ngã sân chơi, xây xát đầu gối",
          time: "2023-06-15T10:15:00",
          status: "resolved",
          actionTaken: "Đã rửa vết thương và băng bó, thông báo cho phụ huynh",
          hasMedications: false,
          hasMedicalSupplies: true,
        },
        {
          id: 3,
          studentName: "Trần Văn Cường",
          class: "5C",
          type: "allergy",
          description: "Phát ban nhẹ sau bữa trưa",
          time: "2023-06-15T12:30:00",
          status: "pending",
          actionTaken: "Đã cách ly và liên hệ phụ huynh đến đón",
          hasMedications: true,
          hasMedicalSupplies: false,
        },
        {
          id: 4,
          studentName: "Phạm Thị Dung",
          class: "4A",
          type: "chronic",
          description: "Hen suyễn - khó thở nhẹ",
          time: "2023-06-14T14:20:00",
          status: "resolved",
          actionTaken: "Đã xịt thuốc theo kế hoạch điều trị có sẵn",
          hasMedications: true,
          hasMedicalSupplies: false,
        },
        {
          id: 5,
          studentName: "Hoàng Minh Đức",
          class: "1B",
          type: "illness",
          description: "Đau bụng, buồn nôn",
          time: "2023-06-14T11:10:00",
          status: "pending",
          actionTaken: "Đang theo dõi, đã liên hệ phụ huynh",
          hasMedications: false,
          hasMedicalSupplies: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getEventTypeLabel = (type) => {
    switch (type) {
      case "illness":
        return "Bệnh tật";
      case "injury":
        return "Chấn thương";
      case "allergy":
        return "Dị ứng";
      case "chronic":
        return "Bệnh mãn tính";
      default:
        return "Khác";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 w-24 h-8">
            Đang xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 w-24 h-8">
            Đã xử lý
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 w-24 h-8">
            {status}
          </span>
        );
    }
  };

  const filterEventsByDate = (events, dateFilter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    return events.filter((event) => {
      const eventDate = new Date(event.time);

      switch (dateFilter) {
        case "today":
          return eventDate >= today;
        case "yesterday":
          return eventDate >= yesterday && eventDate < today;
        case "week":
          return eventDate >= weekStart;
        case "month":
          return eventDate >= monthStart;
        case "custom":
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;

          if (startDate && endDate) {
            endDate.setHours(23, 59, 59, 999);
            return eventDate >= startDate && eventDate <= endDate;
          } else if (startDate) {
            return eventDate >= startDate;
          } else if (endDate) {
            endDate.setHours(23, 59, 59, 999);
            return eventDate <= endDate;
          }
          return true;
        default:
          return true;
      }
    });
  };

  const filteredEvents = filterEventsByDate(eventsList, activeTab).filter(
    (event) =>
      event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEventTypeLabel(event.type)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
          Quản lý sự cố y tế
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
          Theo dõi và xử lý các sự cố y tế trong trường học
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mb-2">
                Tổng số sự kiện hôm nay
              </p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {filterEventsByDate(eventsList, "today").length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
              <FiCalendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mb-2">
                Đang xử lý
              </p>
              <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                {eventsList.filter((e) => e.status === "pending").length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full">
              <FiClock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mb-2">
                Đã xử lý
              </p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {eventsList.filter((e) => e.status === "resolved").length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full">
              <FiCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mb-2">
                Bệnh tật/Chấn thương
              </p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                {
                  eventsList.filter(
                    (e) => e.type === "illness" || e.type === "injury"
                  ).length
                }
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
              <FiAlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex flex-wrap justify-between items-center mb-8">
        <div className="flex space-x-3 mb-4 sm:mb-0 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-6 py-3 rounded-md whitespace-nowrap text-base font-medium ${
              activeTab === "today"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setActiveTab("yesterday")}
            className={`px-6 py-3 rounded-md whitespace-nowrap text-base font-medium ${
              activeTab === "yesterday"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Hôm qua
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-6 py-3 rounded-md whitespace-nowrap text-base font-medium ${
              activeTab === "week"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={`px-6 py-3 rounded-md whitespace-nowrap text-base font-medium ${
              activeTab === "month"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-6 py-3 rounded-md whitespace-nowrap text-base font-medium ${
              activeTab === "custom"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 border border-gray-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Tùy chỉnh
          </button>
        </div>
        <div className="flex w-full sm:w-auto items-center">
          <Link
            to="/nurse/health-events/new"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md mr-3 transition-colors text-base font-medium"
            style={{ height: "48px" }}
          >
            <FiPlus className="mr-2" />
            Tạo lịch mới
          </Link>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-5 py-3 text-base border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Custom Date Range (shows only when custom tab is active) */}
      {activeTab === "custom" && (
        <div className="flex space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
          <div className="self-end">
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700 bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Event Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="min-w-full bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
            <div className="flex flex-row text-sm min-h-[4rem]">
              <div className="w-56 px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center">
                Học sinh
              </div>
              <div className="w-24 px-4 py-4 text-center font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center justify-center">
                Lớp
              </div>
              <div className="w-40 px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center">
                Sự kiện
              </div>
              <div className="flex-1 px-6 py-4 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center">
                Mô tả
              </div>
              <div className="w-48 px-6 py-4 text-center font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center justify-center">
                Thời gian
              </div>
              <div className="w-32 px-4 py-4 text-center font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center justify-center">
                Tài nguyên
              </div>
              <div className="w-32 px-4 py-4 text-center font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider flex items-center justify-center">
                Trạng thái
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-neutral-600 bg-white dark:bg-neutral-800">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-row hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer transition duration-150 border-b border-gray-100 dark:border-neutral-600 min-h-[5rem]"
                  onClick={() =>
                    (window.location.href = `/nurse/health-events/${event.id}`)
                  }
                >
                  <div className="w-56 px-6 py-4 flex items-center">
                    <div className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {event.studentName}
                    </div>
                  </div>
                  <div className="w-24 px-4 py-4 flex items-center justify-center">
                    <div className="text-base font-medium text-gray-700 dark:text-gray-300 text-center">
                      {event.class}
                    </div>
                  </div>
                  <div className="w-40 px-6 py-4 flex items-center">
                    <div className="flex items-center">
                      <span
                        className={`h-3 w-3 rounded-full mr-3 flex-shrink-0 ${
                          event.type === "illness"
                            ? "bg-red-500"
                            : event.type === "injury"
                            ? "bg-orange-500"
                            : event.type === "allergy"
                            ? "bg-purple-500"
                            : "bg-blue-500"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 px-6 py-4 flex items-center">
                    <div
                      className="text-base text-gray-900 dark:text-gray-100 leading-6"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {event.description}
                    </div>
                  </div>
                  <div className="w-48 px-6 py-4 flex items-center justify-center">
                    <div className="flex flex-col items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center mb-1">
                        <FiClock className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">
                          {new Date(event.time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        {new Date(event.time).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="w-32 px-4 py-4 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      {event.hasMedications && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <FiActivity className="h-4 w-4" />
                        </span>
                      )}
                      {event.hasMedicalSupplies && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <FiPackage className="h-4 w-4" />
                        </span>
                      )}
                      {!event.hasMedications && !event.hasMedicalSupplies && (
                        <span className="text-sm text-gray-400 dark:text-gray-500">
                          -
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-32 px-4 py-4 flex items-center justify-center">
                    <div className="flex justify-center">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Không tìm thấy sự kiện nào
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Event Button */}
      <div className="fixed bottom-8 right-8">
        <Link
          to="/nurse/health-events/new"
          className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
        >
          <FiPlus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default HealthEventList;
