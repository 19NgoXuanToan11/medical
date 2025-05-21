import React from "react";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  // Sample data - in a real application, this would come from an API
  const studentName = "Nguyễn Văn An";
  const studentClass = "Lớp 3A";
  const healthInfo = [
    { title: "Tình trạng sức khỏe", value: "Tốt", status: "good" },
    { title: "Dị ứng", value: "Không", status: "good" },
    { title: "Bệnh mãn tính", value: "Không", status: "good" },
    { title: "Chiều cao", value: "135 cm", status: "normal" },
    { title: "Cân nặng", value: "32 kg", status: "normal" },
  ];

  const medications = [
    {
      id: 1,
      name: "Vitamin D",
      schedule: "Hàng ngày, sau bữa sáng",
      remainingDoses: 24,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Khám sức khỏe định kỳ",
      date: "15/06/2023",
      type: "health-check",
    },
    {
      id: 2,
      title: "Tiêm chủng vắc-xin",
      date: "22/07/2023",
      type: "vaccination",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Xin chào, {studentName}
        </h1>
        <p className="text-gray-600">
          {studentClass} - Thông tin sức khỏe cá nhân
        </p>
      </div>

      {/* Health overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">
                Tổng quan sức khỏe
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthInfo.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{item.title}</p>
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        item.status === "good"
                          ? "bg-green-500"
                          : item.status === "warning"
                          ? "bg-yellow-500"
                          : item.status === "bad"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <p className="text-lg font-medium text-gray-800">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 text-center">
              <Link
                to="/student/health-profile"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Xem chi tiết hồ sơ sức khỏe
                <svg
                  className="w-3.5 h-3.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <h2 className="text-lg font-medium text-blue-800">
                Hành động nhanh
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <Link
                to="/student/report-symptom"
                className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                  <p className="font-medium text-blue-800">
                    Báo cáo triệu chứng
                  </p>
                  <p className="text-xs text-blue-600">
                    Báo cáo khi bạn cảm thấy không khỏe
                  </p>
                </div>
              </Link>
              <Link
                to="/student/request-visit"
                className="bg-green-50 p-4 rounded-lg hover:bg-green-100 transition-colors flex items-center"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">Yêu cầu gặp y tá</p>
                  <p className="text-xs text-green-600">
                    Đặt lịch đến phòng y tế
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Medication reminders */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Nhắc nhở thuốc
            </h2>
          </div>
          {medications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {medications.map((medication) => (
                <div
                  key={medication.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {medication.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {medication.schedule}
                    </p>
                    <p className="text-xs text-gray-500">
                      Còn lại: {medication.remainingDoses} liều
                    </p>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                    Đã uống thuốc
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600">Bạn không có lịch dùng thuốc nào.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming health events */}
      <div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Sự kiện y tế sắp tới
            </h2>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      event.type === "health-check"
                        ? "bg-blue-100"
                        : event.type === "vaccination"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {event.type === "health-check" && (
                      <svg
                        className="w-6 h-6 text-blue-600"
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
                    )}
                    {event.type === "vaccination" && (
                      <svg
                        className="w-6 h-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <p className="text-sm text-gray-600">Ngày: {event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600">
                Không có sự kiện y tế nào sắp tới.
              </p>
            </div>
          )}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
            <Link
              to="/student/health-events"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Xem tất cả sự kiện
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
