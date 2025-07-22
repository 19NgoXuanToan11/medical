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
  FiEye,
  FiEdit,
  FiMail,
  FiUserCheck,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import {
  getAllHealthEvents,
  getHealthEventsByNurseGrade,
  mapHealthEventFromAPI,
} from "../../../utils/api/health-events/healthEventService";
import { useAuth } from "../../../utils/auth/AuthContext";

const HealthEventList = () => {
  const { user } = useAuth(); // Get current user info
  const [activeTab, setActiveTab] = useState("today");
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showMyGradeOnly, setShowMyGradeOnly] = useState(true); // New state for filtering

  // Load health events from API
  useEffect(() => {
    const fetchHealthEvents = async () => {
      try {
        setLoading(true);
        let apiData;

        // Use different API based on filter preference and user role
        if (showMyGradeOnly && user?.id && user?.role === "nurse") {
          // Get only health events for students in nurse's assigned grades
          apiData = await getHealthEventsByNurseGrade(user.id);
        } else {
          // Get all health events (fallback)
          apiData = await getAllHealthEvents();
        }

        const mappedEvents = apiData.map(mapHealthEventFromAPI);
        setEventsList(mappedEvents);
      } catch (error) {
        console.error("Failed to fetch health events:", error);
        // Fallback to empty array or show error message
        setEventsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthEvents();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealthEvents();
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [showMyGradeOnly, user]); // Re-fetch when filter or user changes

  // Manual refresh function
  const handleRefresh = async () => {
    try {
      setLoading(true);
      let apiData;

      if (showMyGradeOnly && user?.id && user?.role === "nurse") {
        apiData = await getHealthEventsByNurseGrade(user.id);
      } else {
        apiData = await getAllHealthEvents();
      }

      const mappedEvents = apiData.map(mapHealthEventFromAPI);
      setEventsList(mappedEvents);
    } catch (error) {
      console.error("Failed to refresh health events:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "illness":
        return <FiActivity className="h-4 w-4 text-red-500" />;
      case "injury":
        return <FiAlertTriangle className="h-4 w-4 text-orange-500" />;
      case "allergy":
        return <FiActivity className="h-4 w-4 text-purple-500" />;
      case "chronic":
        return <FiClock className="h-4 w-4 text-blue-500" />;
      default:
        return <FiActivity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            <FiClock className="mr-1 h-3 w-3" />
            Đang xử lý
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            <FiCheck className="mr-1 h-3 w-3" />
            Đã xử lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
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

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý sự cố y tế
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user?.role === "nurse" && showMyGradeOnly
              ? "Theo dõi và xử lý các sự cố y tế trong khối mình phụ trách"
              : "Theo dõi và xử lý các sự cố y tế trong trường học"}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <FiRefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
          <Link
            to="/nurse/health-events/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Tạo sự cố mới
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Hôm nay
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filterEventsByDate(eventsList, "today").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đang xử lý
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {eventsList.filter((e) => e.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Đã xử lý
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {eventsList.filter((e) => e.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Danh sách sự cố ({filteredEvents.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Loại sự cố
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Triệu chứng
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Y tá xử lý
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phụ huynh
                </th>
                <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span>Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <FiActivity className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-lg font-medium">Không có sự cố nào</p>
                      <p className="text-sm">
                        Thử thay đổi bộ lọc hoặc tìm kiếm khác
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Lớp {event.class}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {getEventTypeLabel(event.type)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                        <div className="truncate" title={event.symptoms}>
                          {event.symptoms ||
                            event.description ||
                            "Không có mô tả"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(event.time)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(event.time)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {event.nurseName || "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                      {event.followUpRequired && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300">
                            <FiClock className="mr-1 h-3 w-3" />
                            Theo dõi
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {event.parentNotified ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                            <FiCheck className="mr-1 h-3 w-3" />
                            Đã thông báo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                            <FiX className="mr-1 h-3 w-3" />
                            Chưa thông báo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/nurse/health-events/${event.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded transition-colors duration-150"
                          title="Xem chi tiết"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/nurse/health-events/${event.id}/edit`}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 p-1 rounded transition-colors duration-150"
                          title="Chỉnh sửa"
                        >
                          <FiEdit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthEventList;
