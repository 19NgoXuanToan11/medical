import React from "react";
import { Link } from "react-router-dom";

const ParentDashboard = () => {
  // Sample data - in a real application, this would come from an API
  const activeMedications = 2;
  const pendingMedications = 1;
  const studentName = "Nguyễn Văn An";
  const notificationCount = 3;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Xin chào, phụ huynh của {studentName}
        </h1>
        <p className="text-gray-600">
          Theo dõi sức khỏe và các yêu cầu của con bạn tại trường
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Thuốc đang sử dụng
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {activeMedications} yêu cầu
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Các yêu cầu thuốc đang được thực hiện tại trường
            </p>
            <Link
              to="/parent/medication/history"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Xem chi tiết
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-yellow-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Yêu cầu chờ xác nhận
              </h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {pendingMedications} yêu cầu
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Các yêu cầu thuốc đang chờ xác nhận từ nhân viên y tế
            </p>
            <Link
              to="/parent/medication/history?status=pending"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Xem chi tiết
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-green-500">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">
                Thông báo mới
              </h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {notificationCount} thông báo
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Thông báo từ trường học về sức khỏe và thuốc của con bạn
            </p>
            <Link
              to="/parent/notifications"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Xem tất cả
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">Quản lý thuốc</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors group">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/medication/request"
                  className="text-blue-700 font-medium text-center group-hover:text-blue-900"
                >
                  Gửi yêu cầu thuốc mới
                </Link>
                <p className="text-sm text-blue-600 text-center mt-1">
                  Tạo một yêu cầu mới để gửi thuốc đến trường
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors group">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/medication/history"
                  className="text-blue-700 font-medium text-center group-hover:text-blue-900"
                >
                  Lịch sử yêu cầu
                </Link>
                <p className="text-sm text-blue-600 text-center mt-1">
                  Xem tất cả các yêu cầu thuốc trước đây
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors group">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/medication/reports"
                  className="text-blue-700 font-medium text-center group-hover:text-blue-900"
                >
                  Báo cáo sử dụng thuốc
                </Link>
                <p className="text-sm text-blue-600 text-center mt-1">
                  Xem báo cáo về việc sử dụng thuốc của học sinh
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors group">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <svg
                    className="w-7 h-7 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/medication/faq"
                  className="text-blue-700 font-medium text-center group-hover:text-blue-900"
                >
                  Câu hỏi thường gặp
                </Link>
                <p className="text-sm text-blue-600 text-center mt-1">
                  Thông tin hữu ích về quy trình sử dụng thuốc
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-50 p-4 border-b border-blue-100">
            <h2 className="text-lg font-medium text-blue-800">
              Hồ sơ sức khỏe
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors group">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                  <svg
                    className="w-7 h-7 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/health-profile"
                  className="text-green-700 font-medium text-center group-hover:text-green-900"
                >
                  Xem hồ sơ sức khỏe
                </Link>
                <p className="text-sm text-green-600 text-center mt-1">
                  Thông tin sức khỏe chi tiết của học sinh
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors group">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                  <svg
                    className="w-7 h-7 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/health-profile/new"
                  className="text-green-700 font-medium text-center group-hover:text-green-900"
                >
                  Cập nhật thông tin
                </Link>
                <p className="text-sm text-green-600 text-center mt-1">
                  Cập nhật thông tin sức khỏe của học sinh
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors group">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                  <svg
                    className="w-7 h-7 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <Link
                  to="/parent/health-records"
                  className="text-green-700 font-medium text-center group-hover:text-green-900"
                >
                  Lịch sử khám sức khỏe
                </Link>
                <p className="text-sm text-green-600 text-center mt-1">
                  Xem lịch sử khám sức khỏe định kỳ
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-green-100 transition-colors group">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-200">
                  <svg
                    className="w-7 h-7 text-green-600"
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
                <Link
                  to="/parent/health-schedule"
                  className="text-green-700 font-medium text-center group-hover:text-green-900"
                >
                  Lịch khám sắp tới
                </Link>
                <p className="text-sm text-green-600 text-center mt-1">
                  Xem lịch khám sức khỏe sắp tới
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
