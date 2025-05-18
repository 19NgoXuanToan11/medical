import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiDollarSign, FiActivity, FiBarChart2 } from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    pendingMedications: 0,
    scheduledHealthChecks: 0,
    totalEvents: 0,
    earnings: 0,
    budget: 0,
  });

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 412,
        activeStudents: 350,
        pendingMedications: 12,
        scheduledHealthChecks: 3,
        totalEvents: 8,
        earnings: 4955.56,
        budget: 16000,
      });
    }, 1000);
  }, []);

  return (
    <div>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {/* Orders Card */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-500 font-medium">Đơn thuốc</h2>
            </div>
            <div className="text-2xl font-bold mb-2">2.56k</div>

            {/* Chart - Yellow bars */}
            <div className="flex items-end h-16 mb-2">
              {[25, 36, 28, 45, 32, 50, 41].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 mx-1 bg-yellow-400 rounded-t-sm"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              Cập nhật mới nhất: hôm nay
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-500 font-medium">Người dùng</h2>
            </div>
            <div className="text-2xl font-bold mb-2">6.25k</div>

            {/* Chart - Blue line */}
            <div className="h-16 mb-2 relative">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path
                  d="M0,15 Q20,5 40,20 T80,15 T100,20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <circle cx="100" cy="20" r="2" fill="#3b82f6" />
              </svg>
            </div>

            <div className="text-xs text-gray-500">
              Cập nhật mới nhất: tuần trước
            </div>
          </div>
        </div>

        {/* Revenue Report Card */}
        <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-500 font-medium">
                Báo cáo doanh thu
              </h2>
              <div className="flex space-x-2 text-xs">
                <span className="text-blue-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                  <span>Đang chờ</span>
                </span>
                <span className="text-purple-500 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                  <span>Hoàn thành</span>
                </span>
              </div>
            </div>

            {/* Chart - Mixed bar chart */}
            <div className="flex items-end h-32 mb-2">
              {/* Month labels on bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
                {[
                  "Tháng 1",
                  "Tháng 2",
                  "Tháng 3",
                  "Tháng 4",
                  "Tháng 5",
                  "Tháng 6",
                  "Tháng 7",
                ].map((month, index) => (
                  <span
                    key={index}
                    className="transform -translate-x-1/2"
                    style={{ left: `${index * 14 + 7}%` }}
                  >
                    {month.slice(0, 3)}
                  </span>
                ))}
              </div>

              {/* Bars */}
              <div className="flex items-end justify-between w-full h-full pt-5 pb-6">
                {[
                  { blue: 40, purple: 70 },
                  { blue: 60, purple: 30 },
                  { blue: 30, purple: 40 },
                  { blue: 70, purple: 50 },
                  { blue: 40, purple: 60 },
                  { blue: 50, purple: 70 },
                  { blue: 60, purple: 40 },
                ].map((bar, index) => (
                  <div key={index} className="flex flex-col items-center w-6">
                    <div
                      className="w-4 bg-blue-500 rounded-t-sm"
                      style={{ height: `${bar.blue}%` }}
                    ></div>
                    <div
                      className="w-4 bg-purple-500 mt-1 rounded-t-sm"
                      style={{ height: `${bar.purple}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Earnings Card */}
        <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-500 font-medium">Doanh thu</h2>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold mr-1">
                ${stats.earnings.toLocaleString()}
              </span>
              <span className="text-xs text-green-500">
                +10% so với tháng trước
              </span>
            </div>

            {/* Chart - Donut chart */}
            <div className="flex justify-center items-center py-5">
              <div className="w-32 h-32 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ddd"
                    strokeWidth="3"
                    strokeDasharray="100, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    strokeDasharray="75, 100"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeDasharray="25, 100"
                    strokeDashoffset="-75"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-lg font-semibold">75%</div>
                  <div className="text-xs text-gray-500">Học phí</div>
                </div>
              </div>
            </div>

            <div className="flex justify-around text-xs text-gray-600">
              <div className="flex flex-col items-center">
                <span className="flex items-center mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></span>
                  <span>Học phí</span>
                </span>
                <span className="font-semibold">75%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="flex items-center mb-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                  <span>Dịch vụ y tế</span>
                </span>
                <span className="font-semibold">25%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Report Card - Large */}
        <div className="bg-white rounded-lg p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm text-gray-500 font-medium">
                Biểu đồ chi phí y tế
              </h2>
            </div>

            <div className="flex justify-between items-baseline mb-3">
              <div>
                <div className="text-2xl font-bold">$25,852</div>
                <div className="text-xs text-gray-500">
                  Ngân sách: ${stats.budget.toLocaleString()}
                </div>
              </div>
              <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                2023
                <svg
                  className="w-4 h-4 inline-block ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Chart - Mixed chart */}
            <div className="h-40 relative">
              {/* Bar chart */}
              <div className="flex items-end justify-between h-28 w-full">
                {[25, 45, 15, 60, 35, 25, 50, 30, 25, 45, 30, 55].map(
                  (height, index) => (
                    <div key={index} className="flex items-end">
                      <div
                        className="w-3 bg-blue-100 rounded-sm mx-1"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  )
                )}
              </div>

              {/* Line chart overlay */}
              <div className="absolute top-0 left-0 w-full h-28">
                <svg
                  viewBox="0 0 100 30"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,15 Q10,5 20,20 T30,15 T40,25 T50,10 T60,20 T70,5 T80,15 T90,10 T100,15"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* Month labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                {[
                  "Tháng 1",
                  "Tháng 2",
                  "Tháng 3",
                  "Tháng 4",
                  "Tháng 5",
                  "Tháng 6",
                  "Tháng 7",
                  "Tháng 8",
                  "Tháng 9",
                  "Tháng 10",
                  "Tháng 11",
                  "Tháng 12",
                ].map((month, index) => (
                  <div
                    key={index}
                    className="text-center"
                    style={{ width: "7%" }}
                  >
                    {month.slice(0, 3)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Browser Stats */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm text-gray-500 font-medium">
              Thống kê trình duyệt
            </h2>
            <span className="text-xs text-gray-400">Hôm nay</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://www.google.com/chrome/static/images/chrome-logo.svg"
                    alt="Chrome"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm">Google Chrome</span>
                </div>
                <span className="text-sm font-medium">54.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: "54.4%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg"
                    alt="Firefox"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm">Mozilla Firefox</span>
                </div>
                <span className="text-sm font-medium">14.6%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: "14.6%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg"
                    alt="Safari"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm">Apple Safari</span>
                </div>
                <span className="text-sm font-medium">18.6%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-400 h-1.5 rounded-full"
                  style={{ width: "18.6%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/95/Internet_Explorer_logo_old.svg"
                    alt="Explorer"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm">Internet Explorer</span>
                </div>
                <span className="text-sm font-medium">4.6%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-blue-800 h-1.5 rounded-full"
                  style={{ width: "4.6%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/49/Opera_2015_icon.svg"
                    alt="Opera"
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm">Opera Mini</span>
                </div>
                <span className="text-sm font-medium">8.4%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-red-500 h-1.5 rounded-full"
                  style={{ width: "8.4%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Overview */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm text-gray-500 font-medium">
              Tổng quan về mục tiêu
            </h2>
            <button className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          {/* Circle progress chart */}
          <div className="flex justify-center mb-6">
            <div className="w-40 h-40 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="3"
                ></circle>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray="100.48"
                  strokeDashoffset="17.08"
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                ></circle>
                <text
                  x="18"
                  y="18.5"
                  textAnchor="middle"
                  fontSize="8"
                  fill="#333"
                  fontWeight="bold"
                >
                  83%
                </text>
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-medium mb-1">Đã hoàn thành 83% mục tiêu</h4>
            <p className="text-sm text-gray-500">
              Còn 42 ngày để hoàn thành các mục tiêu đề ra
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm text-gray-500 font-medium">
              Giao dịch gần đây
            </h2>
            <button className="text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-pink-50 rounded-md mr-3">
                  <svg
                    className="w-5 h-5 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Ví điện tử</div>
                  <div className="text-xs text-gray-500">Nạp tiền</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-500">-$74</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-md mr-3">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Chuyển khoản</div>
                  <div className="text-xs text-gray-500">Thanh toán</div>
                </div>
              </div>
              <div className="text-sm font-medium text-green-500">+$480</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-md mr-3">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Paypal</div>
                  <div className="text-xs text-gray-500">Thanh toán</div>
                </div>
              </div>
              <div className="text-sm font-medium text-green-500">+$590</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-md mr-3">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Thẻ ngân hàng</div>
                  <div className="text-xs text-gray-500">Mua sắm</div>
                </div>
              </div>
              <div className="text-sm font-medium text-red-500">-$12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
