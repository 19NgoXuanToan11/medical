import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    pendingMedications: 0,
    scheduledHealthChecks: 0,
    upcomingVaccinations: 0,
    totalMedicationDispensed: 0,
    healthEventsToday: 0,
    completedHealthChecks: 0,
    allergyAlerts: 0,
    medicationAdherence: 0,
  });

  const [dateRange, setDateRange] = useState("week");
  const [loading, setLoading] = useState(true);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1248,
        activeStudents: 895,
        pendingMedications: 32,
        scheduledHealthChecks: 3,
        upcomingVaccinations: 2,
        totalMedicationDispensed: 512,
        healthEventsToday: 8,
        completedHealthChecks: 42,
        allergyAlerts: 15,
        medicationAdherence: 94,
        healthVisitsByCategory: {
          "Sốt/Cảm/Cúm": 32,
          "Đau đầu": 18,
          "Đau bụng": 15,
          "Chấn thương": 12,
          "Dị ứng": 8,
          Khác: 15,
        },
        medicationsByType: {
          "Kháng sinh": 28,
          "Giảm đau": 35,
          "Hạ sốt": 42,
          Vitamin: 22,
          "Thuốc dị ứng": 18,
          Khác: 10,
        },
      });
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would fetch new data based on the selected range
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <p className="text-gray-600">
          Phân tích tổng hợp dữ liệu y tế trường học
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => handleDateRangeChange("today")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              dateRange === "today"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => handleDateRangeChange("week")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              dateRange === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => handleDateRangeChange("month")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              dateRange === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => handleDateRangeChange("semester")}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              dateRange === "semester"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Học kỳ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <FiUsers className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Tổng học sinh
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.activeStudents}
                  </p>
                  <p className="text-xs text-green-600">
                    +3.5% so với tháng trước
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <FiClock className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Yêu cầu thuốc chờ xử lý
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.pendingMedications}
                  </p>
                  <div className="flex items-center text-xs">
                    <span className="flex items-center text-red-500">
                      <FiAlertCircle className="h-3 w-3 mr-1" />
                      {stats.pendingMedications > 0
                        ? `${stats.pendingMedications} yêu cầu cần phê duyệt`
                        : "Không có yêu cầu"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <FiCalendar className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Kiểm tra sức khỏe sắp tới
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.scheduledHealthChecks}
                  </p>
                  <p className="text-xs text-blue-600">
                    {stats.completedHealthChecks} đã hoàn thành trong 30 ngày
                    qua
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <FiActivity className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Sự kiện y tế hôm nay
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.healthEventsToday}
                  </p>
                  <p className="text-xs text-purple-600">
                    {stats.upcomingVaccinations} buổi tiêm chủng sắp diễn ra
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* More Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Health Visits by Category */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-700">
                  Lần thăm khám theo danh mục
                </h3>
                <Link
                  to="/admin/reports"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Xem chi tiết
                </Link>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.healthVisitsByCategory).map(
                  ([category, count], index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {category}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (count /
                                Object.values(
                                  stats.healthVisitsByCategory
                                ).reduce((a, b) => a + b, 0)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Medication Dispensed by Type */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-700">
                  Thuốc đã cấp theo loại
                </h3>
                <Link
                  to="/admin/reports"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Xem chi tiết
                </Link>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.medicationsByType).map(
                  ([type, count], index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {type}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{
                            width: `${
                              (count /
                                Object.values(stats.medicationsByType).reduce(
                                  (a, b) => a + b,
                                  0
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Chỉ số hiệu suất chính
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Tỷ lệ tuân thủ thuốc
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {stats.medicationAdherence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        stats.medicationAdherence > 90
                          ? "bg-green-600"
                          : stats.medicationAdherence > 75
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${stats.medicationAdherence}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Cảnh báo dị ứng
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {stats.allergyAlerts}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (stats.allergyAlerts / stats.activeStudents) * 100 * 5
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Tổng thuốc đã cấp
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {stats.totalMedicationDispensed}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-green-600 flex items-center">
                      <FiTrendingUp className="h-3 w-3 mr-1" />
                      Tăng 12% so với tháng trước
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Mức độ hoàn thành kiểm tra sức khỏe
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      92%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                      <FiClock className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Yêu cầu thuốc mới
                    </p>
                    <p className="text-xs text-gray-500">
                      Nguyễn Văn A - Paracetamol 500mg - 5 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                      <FiCheckCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Hoàn thành kiểm tra sức khỏe
                    </p>
                    <p className="text-xs text-gray-500">
                      Lớp 5A - Kiểm tra định kỳ - 30 phút trước
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                      <FiUsers className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Người dùng mới đăng ký
                    </p>
                    <p className="text-xs text-gray-500">
                      Trần Thị B (Phụ huynh) - 1 giờ trước
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-yellow-600">
                      <FiAlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      Cảnh báo dị ứng
                    </p>
                    <p className="text-xs text-gray-500">
                      Lê Văn C - Dị ứng hải sản - 2 giờ trước
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/admin/reports"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Xem tất cả hoạt động
                </Link>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-base font-medium text-gray-700 mb-4">
                Sức khỏe hệ thống
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Mức độ hoàn thiện hồ sơ
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      87%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    118 học sinh cần cập nhật thông tin y tế
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Trạng thái phê duyệt thuốc
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      32 đang chờ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      458 đã phê duyệt
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      32 đang chờ
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      12 từ chối
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Tình trạng tiêm chủng
                    </span>
                    <span className="text-sm font-medium text-green-700">
                      94% đã tiêm đủ
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    53 học sinh cần cập nhật tiêm chủng
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Tổng quan nhân viên y tế
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">8 nhân viên</p>
                      <p className="text-xs text-gray-500">đang hoạt động</p>
                    </div>
                    <div>
                      <p className="font-medium">42 giờ/tuần</p>
                      <p className="text-xs text-gray-500">
                        thời gian trung bình
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">98%</p>
                      <p className="text-xs text-gray-500">tỷ lệ xử lý</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
