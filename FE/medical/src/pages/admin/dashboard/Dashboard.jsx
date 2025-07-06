import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiPieChart,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiBell,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    pendingMedications: 0,
    scheduledHealthChecks: 0,
    upcomingVaccinations: 0,
    totalMedicationDispensed: 0,
    alertsNotifications: 0,
    healthEventsToday: 0,
    completedHealthChecks: 0,
    allergyAlerts: 0,
    medicationAdherence: 0,
    healthVisitsByCategory: {},
    medicationsByType: {},
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
        alertsNotifications: 7,
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
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would fetch new data based on the selected range
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700"></div>
          <p className="ml-2 text-neutral-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
                Tổng quan hệ thống
              </h2>
              <p className="text-neutral-600 mb-6">
                Phân tích tổng hợp dữ liệu y tế trường học
              </p>

              {/* Date Range Selector */}
              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleDateRangeChange("today")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "today"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => handleDateRangeChange("week")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "week"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Tuần này
                </button>
                <button
                  onClick={() => handleDateRangeChange("month")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "month"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Tháng này
                </button>
                <button
                  onClick={() => handleDateRangeChange("semester")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    dateRange === "semester"
                      ? "bg-primary-600 text-white"
                      : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  } transition-colors duration-200`}
                >
                  Học kỳ
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Tổng học sinh
                      </div>
                      <div className="text-2xl font-bold text-primary-700">
                        {stats.activeStudents}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        +3.5% so với tháng trước
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <FiUsers className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Yêu cầu thuốc chờ xử lý
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {stats.pendingMedications}
                      </div>
                      <div className="text-xs text-red-600 mt-1 flex items-center">
                        <FiAlertCircle className="h-3 w-3 mr-1" />
                        {stats.pendingMedications} cần phê duyệt
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FiClock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Kiểm tra sức khỏe sắp tới
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {stats.scheduledHealthChecks}
                      </div>
                      <div className="text-xs text-primary-600 mt-1">
                        {stats.completedHealthChecks} đã hoàn thành
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FiCalendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-neutral-600">
                        Sự cố y tế hôm nay
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {stats.healthEventsToday}
                      </div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <FiActivity className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Performance Metrics */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-800">
                  Chỉ số hiệu suất chính
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Tỷ lệ tuân thủ thuốc
                      </span>
                      <span className="text-sm font-medium text-primary-700">
                        {stats.medicationAdherence}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${stats.medicationAdherence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Cảnh báo dị ứng
                      </span>
                      <span className="text-sm font-medium text-red-600">
                        {stats.allergyAlerts} cảnh báo
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${(stats.allergyAlerts / 20) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Mức độ hoàn thành kiểm tra sức khỏe
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        92%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-neutral-700">
                        Mức độ hoàn thiện hồ sơ
                      </span>
                      <span className="text-sm font-medium text-primary-700">
                        87%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-medium text-neutral-800">
                  Hoạt động gần đây
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <FiUsers className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-neutral-800">
                        Yêu cầu thuốc mới
                      </div>
                      <div className="text-xs text-neutral-500">
                        Nguyễn Văn A • Paracetamol 500mg • 5 phút trước
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FiCheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-neutral-800">
                        Hoàn thành khám sức khỏe
                      </div>
                      <div className="text-xs text-neutral-500">
                        Lớp 10A1 • 42 học sinh • 1 giờ trước
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <FiBell className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-neutral-800">
                        Nhắc nhở tiêm chủng
                      </div>
                      <div className="text-xs text-neutral-500">
                        Lớp 8B • 15 học sinh • 3 giờ trước
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FiAlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-neutral-800">
                        Cảnh báo dị ứng
                      </div>
                      <div className="text-xs text-neutral-500">
                        Trần Thị B • Dị ứng đậu phộng • 5 giờ trước
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="#"
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    Xem tất cả hoạt động
                  </Link>
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
