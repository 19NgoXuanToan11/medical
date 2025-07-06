import React, { useState, useEffect } from "react";

const ReportsAnalytics = () => {
  const [activeTab, setActiveTab] = useState("health");
  const [loading, setLoading] = useState(true);
  const [reportPeriod, setReportPeriod] = useState("month");
  const [reportData, setReportData] = useState({});

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReportData({
        health: {
          visitsByType: {
            "Sốt/Cảm/Cúm": 32,
            "Đau đầu": 18,
            "Đau bụng": 15,
            "Chấn thương": 12,
            "Dị ứng": 8,
            Khác: 15,
          },
          visitsPerDay: [8, 12, 7, 10, 15, 0, 0, 6, 9, 11, 5, 8, 12, 0, 0],
          totalVisits: 100,
          uniqueStudents: 75,
        },
        medication: {
          totalRequests: 45,
          activeRequests: 18,
          completedRequests: 27,
          medicationTypes: {
            Paracetamol: 15,
            "Vitamin C": 10,
            "Thuốc ho": 8,
            "Thuốc dị ứng": 6,
            Khác: 6,
          },
        },
        vaccination: {
          totalVaccinations: 320,
          consentRate: 95,
          completionRate: 98,
          byVaccineType: {
            "Sởi-Rubella": 120,
            "Viêm gan B": 85,
            "Bại liệt": 65,
            BCG: 50,
          },
        },
        healthCheck: {
          completedChecks: 3,
          studentsExamined: 310,
          abnormalFindings: 28,
          byFinding: {
            "Thị lực": 12,
            "Thính lực": 3,
            "Tăng huyết áp": 2,
            "Răng miệng": 8,
            Khác: 3,
          },
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Function to render charts (in a real application, this would use a charting library like Chart.js or Recharts)
  const renderChart = (data, title, chartType) => {
    // This is a placeholder for real chart rendering
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
          {title}
        </h3>
        <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded">
          <p className="text-neutral-500 dark:text-neutral-400">
            [Ở đây sẽ hiển thị biểu đồ {chartType} của {title}]
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value], index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border-b border-neutral-100 dark:border-neutral-600"
            >
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {key}
              </span>
              <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-8 transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
            Báo cáo và phân tích
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Dữ liệu thống kê và báo cáo từ hệ thống y tế trường học
          </p>
        </div>
      </div>

      {/* Report Period Selector */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 transition-colors duration-300">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Thời gian:
            </span>
            <div className="inline-flex shadow-sm rounded-md">
              <button
                onClick={() => setReportPeriod("week")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  reportPeriod === "week"
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                } border border-neutral-300 dark:border-neutral-600`}
              >
                Tuần
              </button>
              <button
                onClick={() => setReportPeriod("month")}
                className={`px-4 py-2 text-sm font-medium ${
                  reportPeriod === "month"
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                } border-t border-b border-neutral-300 dark:border-neutral-600`}
              >
                Tháng
              </button>
              <button
                onClick={() => setReportPeriod("quarter")}
                className={`px-4 py-2 text-sm font-medium ${
                  reportPeriod === "quarter"
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                } border-t border-b border-neutral-300 dark:border-neutral-600`}
              >
                Quý
              </button>
              <button
                onClick={() => setReportPeriod("year")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  reportPeriod === "year"
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                } border border-neutral-300 dark:border-neutral-600`}
              >
                Năm
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg
                className="h-5 w-5 inline-block mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Xuất Excel
            </button>
            <button className="px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <svg
                className="h-5 w-5 inline-block mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Xuất PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 transition-colors duration-300">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("health")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "health"
                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Sự cố y tế
          </button>
          <button
            onClick={() => setActiveTab("medication")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "medication"
                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Quản lý thuốc
          </button>
          <button
            onClick={() => setActiveTab("vaccination")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "vaccination"
                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Tiêm chủng
          </button>
          <button
            onClick={() => setActiveTab("healthCheck")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "healthCheck"
                ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Kiểm tra y tế
          </button>
        </nav>
      </div>

      {/* Stats Cards for selected report */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 dark:border-primary-400"></div>
          <p className="ml-2 text-neutral-500 dark:text-neutral-400">
            Đang tải dữ liệu báo cáo...
          </p>
        </div>
      ) : (
        <div>
          {/* Health Events Report */}
          {activeTab === "health" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tổng lượt thăm khám
                  </h3>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                    {reportData.health.totalVisits}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Thời gian:{" "}
                    {reportPeriod === "week"
                      ? "Tuần này"
                      : reportPeriod === "month"
                      ? "Tháng này"
                      : reportPeriod === "quarter"
                      ? "Quý này"
                      : "Năm nay"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Số học sinh đến khám
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {reportData.health.uniqueStudents}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Số học sinh khám riêng biệt
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Trung bình mỗi ngày
                  </h3>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {(reportData.health.totalVisits / 15).toFixed(1)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Lượt thăm khám mỗi ngày
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Sốt/Cảm/Cúm
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    32% tổng lượt khám
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.health.visitsByType,
                "Phân loại sự cố y tế",
                "tròn"
              )}

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  Lượt khám theo ngày
                </h3>
                <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    [Ở đây sẽ hiển thị biểu đồ cột thể hiện lượt khám theo ngày]
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Medication Management Report */}
          {activeTab === "medication" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tổng yêu cầu thuốc
                  </h3>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                    {reportData.medication.totalRequests}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Thời gian:{" "}
                    {reportPeriod === "week"
                      ? "Tuần này"
                      : reportPeriod === "month"
                      ? "Tháng này"
                      : reportPeriod === "quarter"
                      ? "Quý này"
                      : "Năm nay"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Yêu cầu hoạt động
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {reportData.medication.activeRequests}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Chưa xử lý hoàn tất
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tỷ lệ hoàn thành
                  </h3>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {Math.round(
                      (reportData.medication.completedRequests /
                        reportData.medication.totalRequests) *
                        100
                    )}
                    %
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Yêu cầu đã hoàn thành
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Thuốc phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Paracetamol
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    33% tổng yêu cầu
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.medication.medicationTypes,
                "Phân loại thuốc được sử dụng",
                "tròn"
              )}

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  Yêu cầu thuốc theo thời gian
                </h3>
                <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    [Ở đây sẽ hiển thị biểu đồ đường thể hiện yêu cầu thuốc theo
                    thời gian]
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Vaccination Report */}
          {activeTab === "vaccination" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tổng lượt tiêm chủng
                  </h3>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                    {reportData.vaccination.totalVaccinations}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Thời gian:{" "}
                    {reportPeriod === "week"
                      ? "Tuần này"
                      : reportPeriod === "month"
                      ? "Tháng này"
                      : reportPeriod === "quarter"
                      ? "Quý này"
                      : "Năm nay"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tỷ lệ phụ huynh đồng ý
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {reportData.vaccination.consentRate}%
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Đồng ý với tiêm chủng
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Tỷ lệ hoàn thành
                  </h3>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {reportData.vaccination.completionRate}%
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Hoàn thành tiêm chủng
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Vắc-xin phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Sởi-Rubella
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    37% tổng lượt tiêm
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.vaccination.byVaccineType,
                "Phân bổ tiêm chủng theo loại vắc-xin",
                "tròn"
              )}

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  Tiêm chủng theo lớp
                </h3>
                <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    [Ở đây sẽ hiển thị biểu đồ cột thể hiện phân bổ tiêm chủng
                    theo lớp]
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Health Check Report */}
          {activeTab === "healthCheck" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Đợt kiểm tra y tế
                  </h3>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                    {reportData.healthCheck.completedChecks}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Thời gian:{" "}
                    {reportPeriod === "week"
                      ? "Tuần này"
                      : reportPeriod === "month"
                      ? "Tháng này"
                      : reportPeriod === "quarter"
                      ? "Quý này"
                      : "Năm nay"}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Học sinh đã kiểm tra
                  </h3>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {reportData.healthCheck.studentsExamined}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Tổng số học sinh
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Phát hiện bất thường
                  </h3>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                    {reportData.healthCheck.abnormalFindings}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {Math.round(
                      (reportData.healthCheck.abnormalFindings /
                        reportData.healthCheck.studentsExamined) *
                        100
                    )}
                    % tổng số học sinh
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Vấn đề phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                    Thị lực
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    43% tổng phát hiện
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.healthCheck.byFinding,
                "Phân loại phát hiện bất thường",
                "tròn"
              )}

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 p-6 mb-6 transition-colors duration-300">
                <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                  So sánh kết quả theo lớp
                </h3>
                <div className="h-64 flex items-center justify-center bg-neutral-100 dark:bg-neutral-700 rounded">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    [Ở đây sẽ hiển thị biểu đồ cột thể hiện phát hiện bất thường
                    theo lớp]
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
