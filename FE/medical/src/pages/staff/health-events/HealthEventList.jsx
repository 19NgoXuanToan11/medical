import React, { useState } from "react";
import { Link } from "react-router-dom";

const HealthEventList = () => {
  // Sample data - in a real application, this would come from an API
  const [healthEvents, setHealthEvents] = useState([
    {
      id: "EV123456",
      studentName: "Nguyễn Văn An",
      studentId: "ST123456",
      class: "3A",
      eventType: "accident",
      eventDate: "2023-10-15T09:30:00",
      description: "Té ngã ở sân chơi, bị trầy xước đầu gối",
      status: "resolved",
      severity: "minor",
      location: "Sân chơi",
      treatedBy: "Nguyễn Thị Hương",
      notifiedParent: true,
      parentResponse: "Đã thông báo, phụ huynh ghi nhận",
    },
    {
      id: "EV123457",
      studentName: "Trần Minh Đức",
      studentId: "ST123789",
      class: "5B",
      eventType: "illness",
      eventDate: "2023-10-16T10:15:00",
      description: "Sốt nhẹ 38°C, đau đầu",
      status: "monitoring",
      severity: "moderate",
      location: "Phòng học 5B",
      treatedBy: "Nguyễn Thị Hương",
      notifiedParent: true,
      parentResponse: "Phụ huynh đang trên đường đến đón",
    },
    {
      id: "EV123458",
      studentName: "Lê Thị Hoa",
      studentId: "ST128456",
      class: "2C",
      eventType: "injury",
      eventDate: "2023-10-16T11:45:00",
      description: "Té ngã khi chơi, bị bầm tím nhẹ ở cánh tay",
      status: "resolved",
      severity: "minor",
      location: "Khu vực cầu thang",
      treatedBy: "Phạm Văn Nam",
      notifiedParent: true,
      parentResponse: "Đã thông báo, phụ huynh ghi nhận",
    },
    {
      id: "EV123459",
      studentName: "Phạm Tuấn Anh",
      studentId: "ST145236",
      class: "4A",
      eventType: "disease",
      eventDate: "2023-10-17T08:30:00",
      description: "Phát hiện nổi mẩn đỏ trên da, nghi ngờ bệnh thủy đậu",
      status: "urgent",
      severity: "major",
      location: "Phòng học 4A",
      treatedBy: "Nguyễn Thị Hương",
      notifiedParent: true,
      parentResponse: "Phụ huynh đang đến đón",
    },
    {
      id: "EV123460",
      studentName: "Ngô Gia Huy",
      studentId: "ST162345",
      class: "1B",
      eventType: "accident",
      eventDate: "2023-10-17T14:20:00",
      description: "Va đập nhẹ với bạn khi chơi, bị chảy máu mũi",
      status: "resolved",
      severity: "moderate",
      location: "Sân chơi",
      treatedBy: "Phạm Văn Nam",
      notifiedParent: true,
      parentResponse: "Đã thông báo, phụ huynh ghi nhận và cảm ơn",
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterEventType, setFilterEventType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Filter health events based on selected filters
  const filteredEvents = healthEvents.filter((event) => {
    const matchesStatus =
      filterStatus === "all" || event.status === filterStatus;
    const matchesSeverity =
      filterSeverity === "all" || event.severity === filterSeverity;
    const matchesEventType =
      filterEventType === "all" || event.eventType === filterEventType;
    const matchesSearch =
      event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    // For date filtering
    const eventDate = new Date(event.eventDate).toISOString().split("T")[0];
    const matchesDate = selectedDate === "" || eventDate === selectedDate;

    return (
      matchesStatus &&
      matchesSeverity &&
      matchesEventType &&
      matchesSearch &&
      matchesDate
    );
  });

  // Group events by class for easier management
  const eventsByClass = filteredEvents.reduce((acc, event) => {
    if (!acc[event.class]) {
      acc[event.class] = [];
    }
    acc[event.class].push(event);
    return acc;
  }, {});

  const sortedClasses = Object.keys(eventsByClass).sort();

  const getEventTypeBadge = (type) => {
    switch (type) {
      case "accident":
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            Tai nạn
          </span>
        );
      case "illness":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Ốm đau
          </span>
        );
      case "injury":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Chấn thương
          </span>
        );
      case "disease":
        return (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            Dịch bệnh
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            Khác
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Đã xử lý
          </span>
        );
      case "monitoring":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Đang theo dõi
          </span>
        );
      case "urgent":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Khẩn cấp
          </span>
        );
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "minor":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Nhẹ
          </span>
        );
      case "moderate":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Trung bình
          </span>
        );
      case "major":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Nặng
          </span>
        );
      default:
        return null;
    }
  };

  // Format time for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Count statistics
  const urgentEventsCount = healthEvents.filter(
    (event) => event.status === "urgent"
  ).length;

  const todayEventsCount = healthEvents.filter((event) => {
    const eventDate = new Date(event.eventDate).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    return eventDate === today;
  }).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Quản lý sự kiện y tế
          </h1>
          <p className="text-gray-600">
            Ghi nhận và xử lý các sự kiện y tế xảy ra trong trường học
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/staff/health-events/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sự kiện mới
          </Link>
          <Link
            to="/staff/health-events/report"
            className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md shadow-sm border border-green-200 hover:bg-green-200 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Báo cáo thống kê
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <svg
                className="h-6 w-6 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng số sự kiện</p>
              <p className="text-xl font-bold">{healthEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Đã xử lý</p>
              <p className="text-xl font-bold">
                {healthEvents.filter((e) => e.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sự kiện hôm nay</p>
              <p className="text-xl font-bold">{todayEventsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sự kiện khẩn cấp</p>
              <p className="text-xl font-bold">{urgentEventsCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Bộ lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm kiếm
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Tên học sinh, lớp, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại sự kiện
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filterEventType}
                onChange={(e) => setFilterEventType(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="accident">Tai nạn</option>
                <option value="illness">Ốm đau</option>
                <option value="injury">Chấn thương</option>
                <option value="disease">Dịch bệnh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="monitoring">Đang theo dõi</option>
                <option value="resolved">Đã xử lý</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mức độ
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="minor">Nhẹ</option>
                <option value="moderate">Trung bình</option>
                <option value="major">Nặng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {sortedClasses.length > 0 ? (
        sortedClasses.map((className) => (
          <div key={className} className="mb-8">
            <h2 className="text-lg font-semibold mb-4 bg-blue-50 text-blue-800 py-2 px-4 rounded-md inline-block">
              Lớp {className}
            </h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Học sinh
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Thời gian
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loại sự kiện
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mô tả
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Trạng thái
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Mức độ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventsByClass[className].map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {event.studentName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {event.studentId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDateTime(event.eventDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getEventTypeBadge(event.eventType)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {event.description}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Địa điểm: {event.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(event.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getSeverityBadge(event.severity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <Link
                              to={`/staff/health-events/${event.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </Link>
                            <Link
                              to={`/staff/health-events/edit/${event.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
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
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy sự kiện y tế nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Điều chỉnh bộ lọc hoặc thêm sự kiện mới.
          </p>
          <div className="mt-6">
            <Link
              to="/staff/health-events/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm sự kiện mới
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthEventList;
