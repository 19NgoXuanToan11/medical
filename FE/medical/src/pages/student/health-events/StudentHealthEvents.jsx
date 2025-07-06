import React, { useState, useEffect } from "react";
import { FiActivity, FiCalendar, FiInfo, FiFilter } from "react-icons/fi";

const StudentHealthEvents = () => {
  const [loading, setLoading] = useState(true);
  const [healthEvents, setHealthEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterType, setFilterType] = useState("all");

  // Mock data loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockHealthEvents = [
        {
          id: "EV001",
          title: "Khám sức khỏe định kỳ",
          type: "health-check",
          date: "2025-07-15",
          time: "08:30",
          location: "Phòng y tế trường học",
          description:
            "Khám sức khỏe định kỳ học kỳ 1 năm học 2025-2026. Đo chiều cao, cân nặng, kiểm tra thị lực và thính lực.",
          status: "upcoming",
          notifications: [
            {
              id: 1,
              date: "2025-07-13",
              message: "Nhắc nhở: Khám sức khỏe sau 2 ngày",
              read: true,
            },
            {
              id: 2,
              date: "2025-07-14",
              message: "Nhắc nhở: Khám sức khỏe vào ngày mai",
              read: false,
            },
          ],
        },
        {
          id: "EV002",
          title: "Tiêm vắc-xin phòng cúm",
          type: "vaccination",
          date: "2025-07-22",
          time: "10:00",
          location: "Phòng y tế trường học",
          description:
            "Tiêm phòng cúm mùa theo chương trình tiêm chủng của nhà trường. Phụ huynh vui lòng điền phiếu đồng ý trước khi tiêm.",
          status: "upcoming",
          required: true,
          notifications: [
            {
              id: 3,
              date: "2025-07-19",
              message: "Nhắc nhở: Tiêm vắc-xin sau 3 ngày",
              read: false,
            },
          ],
        },
        {
          id: "EV003",
          title: "Kiểm tra răng miệng",
          type: "dental",
          date: "2025-08-05",
          time: "09:15",
          location: "Phòng y tế trường học",
          description:
            "Khám răng miệng định kỳ do Trung tâm Nha khoa phối hợp với nhà trường thực hiện.",
          status: "upcoming",
          notifications: [],
        },
        {
          id: "EV004",
          title: "Khám mắt",
          type: "eye-check",
          date: "2025-05-10",
          time: "08:00",
          location: "Phòng y tế trường học",
          description: "Kiểm tra thị lực và sức khỏe mắt định kỳ cho học sinh.",
          status: "completed",
          result: "Thị lực bình thường, không cần đeo kính.",
          notifications: [],
        },
        {
          id: "EV005",
          title: "Kiểm tra thể lực",
          type: "physical",
          date: "2025-05-20",
          time: "14:30",
          location: "Sân thể dục trường học",
          description:
            "Đánh giá thể lực học sinh theo tiêu chuẩn của Bộ Giáo dục và Đào tạo.",
          status: "completed",
          result: "Đạt tiêu chuẩn tốt",
          notifications: [],
        },
        {
          id: "EV006",
          title: "Tư vấn dinh dưỡng",
          type: "nutrition",
          date: "2025-06-05",
          time: "13:00",
          location: "Phòng đa năng",
          description:
            "Buổi tư vấn về chế độ dinh dưỡng hợp lý cho học sinh trong độ tuổi học đường.",
          status: "completed",
          result: "Đã tham gia",
          notifications: [],
        },
      ];

      setHealthEvents(mockHealthEvents);

      // Filter upcoming events
      const upcoming = mockHealthEvents.filter(
        (event) => event.status === "upcoming"
      );
      setUpcomingEvents(upcoming);
      setFilteredEvents(upcoming);

      // Filter past events
      const past = mockHealthEvents.filter(
        (event) => event.status === "completed"
      );
      setPastEvents(past);

      setLoading(false);
    }, 1000);
  }, []);

  // Effect to handle filtering
  useEffect(() => {
    let events = activeTab === "upcoming" ? upcomingEvents : pastEvents;

    if (filterType !== "all") {
      events = events.filter((event) => event.type === filterType);
    }

    setFilteredEvents(events);
  }, [activeTab, filterType, upcomingEvents, pastEvents]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Helper function to get event type badge
  const getEventTypeBadge = (type) => {
    switch (type) {
      case "health-check":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Khám sức khỏe
          </span>
        );
      case "vaccination":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Tiêm vắc-xin
          </span>
        );
      case "dental":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Nha khoa
          </span>
        );
      case "eye-check":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Kiểm tra mắt
          </span>
        );
      case "physical":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
            Thể lực
          </span>
        );
      case "nutrition":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Dinh dưỡng
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Khác
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-800 mb-2">
          Sự cố y tế
        </h1>
        <p className="text-neutral-600">
          Lịch khám sức khỏe, tiêm chủng và các hoạt động y tế khác
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-neutral-800">Sự kiện sắp tới</h2>
            <div className="bg-primary-100 p-2 rounded-full">
              <FiCalendar className="h-5 w-5 text-primary-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-neutral-800">
            {upcomingEvents.length}
          </p>
          <p className="text-sm text-neutral-500 mt-1">sự kiện đã lên lịch</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-neutral-800">Hoạt động gần đây</h2>
            <div className="bg-neutral-100 p-2 rounded-full">
              <FiActivity className="h-5 w-5 text-neutral-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-neutral-800">
            {pastEvents.length}
          </p>
          <p className="text-sm text-neutral-500 mt-1">sự kiện đã tham gia</p>
        </div>
      </div>

      {/* Notifications */}
      {upcomingEvents.some(
        (event) =>
          event.notifications &&
          event.notifications.some((notification) => !notification.read)
      ) && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <FiInfo className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 mb-2">
                Thông báo mới
              </h3>
              <ul className="space-y-2">
                {upcomingEvents
                  .filter(
                    (event) =>
                      event.notifications &&
                      event.notifications.some(
                        (notification) => !notification.read
                      )
                  )
                  .map((event) =>
                    event.notifications
                      .filter((notification) => !notification.read)
                      .map((notification) => (
                        <li
                          key={notification.id}
                          className="text-sm text-neutral-700"
                        >
                          <span className="font-medium">{event.title}:</span>{" "}
                          {notification.message}
                        </li>
                      ))
                  )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="mb-6">
        <div className="border-b border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === "upcoming"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                Sắp tới
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  activeTab === "past"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                Đã tham gia
              </button>
            </nav>

            <div className="flex items-center mt-3 sm:mt-0">
              <FiFilter className="text-neutral-400 mr-2" />
              <select
                className="bg-white border border-neutral-200 text-neutral-700 py-1 px-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Tất cả loại</option>
                <option value="health-check">Khám sức khỏe</option>
                <option value="vaccination">Tiêm vắc-xin</option>
                <option value="dental">Nha khoa</option>
                <option value="eye-check">Kiểm tra mắt</option>
                <option value="physical">Thể lực</option>
                <option value="nutrition">Dinh dưỡng</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Event List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="text-lg font-medium text-neutral-800">
            {activeTab === "upcoming"
              ? "Sự kiện sắp tới"
              : "Sự kiện đã tham gia"}
          </h2>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="divide-y divide-neutral-100">
            {filteredEvents.map((event) => (
              <div key={event.id} className="p-4">
                <div className="sm:flex sm:items-center sm:justify-between mb-2">
                  <h3 className="text-lg font-medium text-neutral-800 mb-2 sm:mb-0">
                    {event.title}
                  </h3>
                  {getEventTypeBadge(event.type)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Ngày và giờ</p>
                    <p className="text-sm text-neutral-800">
                      {formatDate(event.date)}, {event.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-1">Địa điểm</p>
                    <p className="text-sm text-neutral-800">{event.location}</p>
                  </div>
                  {event.status === "completed" && event.result && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Kết quả</p>
                      <p className="text-sm text-neutral-800">{event.result}</p>
                    </div>
                  )}
                  {event.required && (
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Yêu cầu</p>
                      <p className="text-sm font-medium text-amber-600">
                        Bắt buộc tham gia
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg">
                  <div className="flex items-start">
                    <FiInfo className="h-4 w-4 text-neutral-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Mô tả</p>
                      <p className="text-sm text-neutral-800">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500">
            {activeTab === "upcoming"
              ? "Không có sự kiện sắp tới nào được tìm thấy."
              : "Không có sự kiện đã tham gia nào được tìm thấy."}
          </div>
        )}
      </div>

      {/* Health Tips Section */}
      <div className="mt-8 bg-primary-50 rounded-lg border border-primary-100 p-4">
        <div className="flex items-start">
          <div className="bg-primary-100 p-2 rounded-full mr-3">
            <FiInfo className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-800 mb-1">
              Lưu ý quan trọng
            </h3>
            <ul className="text-neutral-600 text-sm space-y-2">
              <li>• Luôn đến đúng giờ cho các sự cố y tế</li>
              <li>• Mang theo sổ khám sức khỏe cá nhân (nếu có)</li>
              <li>
                • Thông báo cho y tá trường học nếu bạn không thể tham gia
              </li>
              <li>• Các sự kiện được đánh dấu "Bắt buộc" cần phải tham gia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthEvents;
