import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiClock,
  FiCalendar,
  FiActivity,
  FiCheck,
  FiAlertTriangle,
  FiEye,
  FiEdit,
  FiUser,
  FiHeart,
  FiThermometer,
  FiTrendingUp,
  FiBell,
  FiRefreshCw,
} from "react-icons/fi";

const HealthEventMonitoring = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setTimeout(() => {
      setEventsList([
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          class: "3A",
          type: "illness",
          description: "Sốt nhẹ 37.8°C",
          time: "2023-06-15T09:30:00",
          status: "monitoring",
          priority: "medium",
          assignedToMe: true,
          lastUpdate: "2023-06-15T10:00:00",
          vitals: {
            temperature: "37.8°C",
            pulse: "85 bpm",
            status: "stable",
          },
        },
        {
          id: 2,
          studentName: "Lê Thị Bình",
          class: "2B",
          type: "injury",
          description: "Xây xát đầu gối",
          time: "2023-06-15T10:15:00",
          status: "completed",
          priority: "low",
          assignedToMe: true,
          lastUpdate: "2023-06-15T10:30:00",
          vitals: {
            temperature: "36.5°C",
            pulse: "78 bpm",
            status: "normal",
          },
        },
        {
          id: 3,
          studentName: "Trần Văn Cường",
          class: "5C",
          type: "allergy",
          description: "Phát ban sau bữa trưa",
          time: "2023-06-15T12:30:00",
          status: "urgent",
          priority: "high",
          assignedToMe: false,
          lastUpdate: "2023-06-15T12:45:00",
          vitals: {
            temperature: "37.2°C",
            pulse: "92 bpm",
            status: "monitoring",
          },
        },
        {
          id: 4,
          studentName: "Phạm Thị Dung",
          class: "4A",
          type: "chronic",
          description: "Hen suyễn - khó thở nhẹ",
          time: "2023-06-15T14:20:00",
          status: "monitoring",
          priority: "medium",
          assignedToMe: true,
          lastUpdate: "2023-06-15T14:35:00",
          vitals: {
            temperature: "36.8°C",
            pulse: "88 bpm",
            status: "stable",
          },
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
      case "urgent":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 w-28 h-8">
            <FiAlertTriangle className="h-3 w-3 mr-1" />
            Khẩn cấp
          </span>
        );
      case "monitoring":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 w-28 h-8">
            <FiClock className="h-3 w-3 mr-1" />
            Theo dõi
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 w-28 h-8">
            <FiCheck className="h-3 w-3 mr-1" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 inline-flex items-center justify-center text-sm leading-5 font-semibold rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 w-28 h-8">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            Cao
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            Trung bình
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            Thấp
          </span>
        );
      default:
        return null;
    }
  };

  const getVitalStatus = (status) => {
    switch (status) {
      case "normal":
        return (
          <span className="text-green-600 dark:text-green-400">
            Bình thường
          </span>
        );
      case "stable":
        return (
          <span className="text-yellow-600 dark:text-yellow-400">Ổn định</span>
        );
      case "monitoring":
        return (
          <span className="text-orange-600 dark:text-orange-400">
            Cần theo dõi
          </span>
        );
      case "critical":
        return (
          <span className="text-red-600 dark:text-red-400">Nguy hiểm</span>
        );
      default:
        return (
          <span className="text-gray-600 dark:text-gray-400">
            Không xác định
          </span>
        );
    }
  };

  const filterEventsByDate = (events, dateFilter) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter((event) => {
      const eventDate = new Date(event.time);

      switch (dateFilter) {
        case "today":
          return eventDate >= today;
        case "assigned":
          return event.assignedToMe;
        case "urgent":
          return event.status === "urgent";
        case "monitoring":
          return event.status === "monitoring";
        default:
          return true;
      }
    });
  };

  const filteredEvents = filterEventsByDate(eventsList, activeTab).filter(
    (event) => {
      const matchesSearch =
        event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getEventTypeLabel(event.type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const myAssignedEvents = eventsList.filter((event) => event.assignedToMe);
  const urgentEvents = eventsList.filter((event) => event.status === "urgent");
  const monitoringEvents = eventsList.filter(
    (event) => event.status === "monitoring"
  );

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
              Theo dõi sự kiện y tế
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
              Theo dõi và xử lý các sự kiện y tế được phân công
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <Link
              to="/nurse/health-events/report"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="h-4 w-4" />
              Báo cáo sự kiện
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Được phân công
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {myAssignedEvents.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Khẩn cấp
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {urgentEvents.length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <FiAlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Đang theo dõi
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {monitoringEvents.length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Hoàn thành hôm nay
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {eventsList.filter((e) => e.status === "completed").length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <FiCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Tab Filter */}
          <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
            {[
              { key: "today", label: "Hôm nay" },
              { key: "assigned", label: "Được phân công" },
              { key: "urgent", label: "Khẩn cấp" },
              { key: "monitoring", label: "Đang theo dõi" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="urgent">Khẩn cấp</option>
            <option value="monitoring">Đang theo dõi</option>
            <option value="completed">Hoàn thành</option>
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm học sinh, lớp, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
            <p className="text-neutral-500 dark:text-neutral-400">
              Không có sự kiện nào
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`bg-white dark:bg-neutral-800 rounded-lg shadow-md border-l-4 ${
                event.status === "urgent"
                  ? "border-l-red-500"
                  : event.status === "monitoring"
                  ? "border-l-yellow-500"
                  : "border-l-green-500"
              } border-r border-t border-b border-gray-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {event.studentName}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Lớp {event.class}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      {getEventTypeLabel(event.type)}
                    </span>
                    {getPriorityBadge(event.priority)}
                    {event.assignedToMe && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300">
                        Được phân công
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiClock className="h-4 w-4" />
                      <span>
                        {new Date(event.time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiThermometer className="h-4 w-4" />
                      <span>{event.vitals.temperature}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiHeart className="h-4 w-4" />
                      <span>{event.vitals.pulse}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiTrendingUp className="h-4 w-4" />
                      {getVitalStatus(event.vitals.status)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(event.status)}
                  <div className="flex gap-2">
                    <Link
                      to={`/nurse/health-events/${event.id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                    {event.assignedToMe && (
                      <Link
                        to={`/nurse/health-events/${event.id}/update`}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      >
                        <FiEdit className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthEventMonitoring;
