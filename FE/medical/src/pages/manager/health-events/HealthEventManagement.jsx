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
  FiEdit,
  FiEye,
  FiTrash2,
  FiDownload,
  FiUser,
  FiUsers,
  FiBarChart,
} from "react-icons/fi";

const HealthEventManagement = () => {
  const [activeTab, setActiveTab] = useState("today");
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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
          nurseName: "Y tá Nguyễn Thị Hoa",
          severity: "medium",
          followUpRequired: false,
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
          nurseName: "Y tá Trần Văn Nam",
          severity: "low",
          followUpRequired: true,
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
          nurseName: "Y tá Lê Thị Mai",
          severity: "high",
          followUpRequired: true,
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
          nurseName: "Y tá Nguyễn Thị Hoa",
          severity: "medium",
          followUpRequired: false,
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
          nurseName: "Y tá Trần Văn Nam",
          severity: "medium",
          followUpRequired: true,
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

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "low":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
            Nhẹ
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
            Trung bình
          </span>
        );
      case "high":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300">
            Nghiêm trọng
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300">
            Không xác định
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
    (event) => {
      const matchesSearch =
        event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.nurseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getEventTypeLabel(event.type)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesType = typeFilter === "all" || event.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    }
  );

  const handleExportData = () => {
    // Logic to export data
    console.log("Exporting health events data...");
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      setEventsList((prev) => prev.filter((event) => event.id !== eventId));
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
              Quản lý sự kiện y tế
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-2">
              Quản lý và theo dõi tất cả các sự kiện y tế trong trường học
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiDownload className="h-4 w-4" />
              Xuất báo cáo
            </button>
            <Link
              to="/manager/health-events/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="h-4 w-4" />
              Tạo sự kiện mới
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Tổng số sự kiện
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {eventsList.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <FiActivity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Hôm nay
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {filterEventsByDate(eventsList, "today").length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <FiCalendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
                Đang xử lý
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {eventsList.filter((e) => e.status === "pending").length}
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
                Nghiêm trọng
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {eventsList.filter((e) => e.severity === "high").length}
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
                Cần theo dõi
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {eventsList.filter((e) => e.followUpRequired).length}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <FiUsers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Filter Tabs */}
          <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1">
            {[
              { key: "today", label: "Hôm nay" },
              { key: "yesterday", label: "Hôm qua" },
              { key: "week", label: "Tuần này" },
              { key: "month", label: "Tháng này" },
              { key: "custom", label: "Tùy chỉnh" },
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

          {/* Custom Date Range */}
          {activeTab === "custom" && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
              <span className="text-neutral-500">đến</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang xử lý</option>
            <option value="resolved">Đã xử lý</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả loại</option>
            <option value="illness">Bệnh tật</option>
            <option value="injury">Chấn thương</option>
            <option value="allergy">Dị ứng</option>
            <option value="chronic">Bệnh mãn tính</option>
          </select>

          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên học sinh, lớp, mô tả, y tá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Loại sự kiện
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Y tá xử lý
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Mức độ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400"
                  >
                    Không tìm thấy sự kiện nào
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {new Date(event.time).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(event.time).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {event.studentName}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        Lớp {event.class}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                        {getEventTypeLabel(event.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100 max-w-xs truncate">
                        {event.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {event.nurseName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(event.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/manager/health-events/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FiEye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/manager/health-events/${event.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          <FiEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
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

export default HealthEventManagement;
