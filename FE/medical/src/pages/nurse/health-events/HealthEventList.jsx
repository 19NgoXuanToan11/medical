import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiClock,
  FiCalendar,
  FiActivity,
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
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Đang xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đã xử lý
          </span>
        );
      default:
        return null;
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý sự kiện y tế
        </h1>
        <p className="text-gray-600 mt-1">
          Theo dõi và xử lý các sự kiện y tế trong trường học
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Tổng số sự kiện hôm nay</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {filterEventsByDate(eventsList, "today").length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiCalendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Đang xử lý</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {eventsList.filter((e) => e.status === "pending").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Đã xử lý</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {eventsList.filter((e) => e.status === "resolved").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiActivity className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Bệnh tật/Chấn thương</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {
                  eventsList.filter(
                    (e) => e.type === "illness" || e.type === "injury"
                  ).length
                }
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiActivity className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "today"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setActiveTab("yesterday")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "yesterday"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Hôm qua
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "week"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setActiveTab("month")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "month"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "custom"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Tùy chỉnh
          </button>
        </div>
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-grow mr-2">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Custom Date Range (shows only when custom tab is active) */}
      {activeTab === "custom" && (
        <div className="flex space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </div>
          <div className="self-end">
            <button
              onClick={() => setDateRange({ start: "", end: "" })}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HỌC SINH
                  </th>
                  <th className="w-2/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SỰ KIỆN
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    THỜI GIAN
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TRẠNG THÁI
                  </th>
                  <th className="w-1/6 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {event.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Lớp {event.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {getEventTypeLabel(event.type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {new Date(event.time).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/nurse/health-events/${event.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </Link>
                        {event.status === "pending" && (
                          <button className="text-green-600 hover:text-green-900 ml-3">
                            Đánh dấu đã xử lý
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
