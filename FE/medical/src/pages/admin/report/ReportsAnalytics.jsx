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
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
          <p className="text-gray-500">
            [Ở đây sẽ hiển thị biểu đồ {chartType} của {title}]
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value], index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border-b border-gray-100"
            >
              <span className="text-sm text-gray-600">{key}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Báo cáo và phân tích
        </h1>
        <p className="text-gray-600">
          Dữ liệu thống kê và báo cáo từ hệ thống y tế trường học
        </p>
      </div>

      {/* Report Period Selector */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <span className="text-sm font-medium text-gray-700">
              Thời gian:
            </span>
            <div className="inline-flex shadow-sm rounded-md">
              <button
                onClick={() => setReportPeriod("week")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  reportPeriod === "week"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                Tuần
              </button>
              <button
                onClick={() => setReportPeriod("month")}
                className={`px-4 py-2 text-sm font-medium ${
                  reportPeriod === "month"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
              >
                Tháng
              </button>
              <button
                onClick={() => setReportPeriod("quarter")}
                className={`px-4 py-2 text-sm font-medium ${
                  reportPeriod === "quarter"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border-t border-b border-gray-300`}
              >
                Quý
              </button>
              <button
                onClick={() => setReportPeriod("year")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  reportPeriod === "year"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
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
      <div className="mb-6">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("health")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "health"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sự kiện y tế
          </button>
          <button
            onClick={() => setActiveTab("medication")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "medication"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Quản lý thuốc
          </button>
          <button
            onClick={() => setActiveTab("vaccination")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "vaccination"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tiêm chủng
          </button>
          <button
            onClick={() => setActiveTab("healthCheck")}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === "healthCheck"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Kiểm tra y tế
          </button>
        </nav>
      </div>

      {/* Stats Cards for selected report */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Đang tải dữ liệu báo cáo...</p>
        </div>
      ) : (
        <div>
          {/* Health Events Report */}
          {activeTab === "health" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tổng lượt thăm khám
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.health.totalVisits}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Số học sinh đến khám
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.health.uniqueStudents}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Số học sinh khám riêng biệt
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Trung bình mỗi ngày
                  </h3>
                  <p className="text-2xl font-bold">
                    {(reportData.health.totalVisits / 15).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lượt thăm khám mỗi ngày
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold">Sốt/Cảm/Cúm</p>
                  <p className="text-xs text-gray-500 mt-1">
                    32% tổng lượt khám
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.health.visitsByType,
                "Phân loại sự kiện y tế",
                "tròn"
              )}

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Lượt khám theo ngày
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
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
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tổng yêu cầu thuốc
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.medication.totalRequests}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Yêu cầu hoạt động
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.medication.activeRequests}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chưa xử lý hoàn tất
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tỷ lệ hoàn thành
                  </h3>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (reportData.medication.completedRequests /
                        reportData.medication.totalRequests) *
                        100
                    )}
                    %
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Yêu cầu đã hoàn thành
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Thuốc phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold">Paracetamol</p>
                  <p className="text-xs text-gray-500 mt-1">33% tổng yêu cầu</p>
                </div>
              </div>

              {renderChart(
                reportData.medication.medicationTypes,
                "Phân loại thuốc được sử dụng",
                "tròn"
              )}

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Yêu cầu thuốc theo thời gian
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
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
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tổng lượt tiêm chủng
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.vaccination.totalVaccinations}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tỷ lệ phụ huynh đồng ý
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.vaccination.consentRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đồng ý với tiêm chủng
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Tỷ lệ hoàn thành
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.vaccination.completionRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hoàn thành tiêm chủng
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Vắc-xin phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold">Sởi-Rubella</p>
                  <p className="text-xs text-gray-500 mt-1">
                    37% tổng lượt tiêm
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.vaccination.byVaccineType,
                "Phân bổ tiêm chủng theo loại vắc-xin",
                "tròn"
              )}

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Tiêm chủng theo lớp
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
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
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Đợt kiểm tra y tế
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.healthCheck.completedChecks}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Học sinh đã kiểm tra
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.healthCheck.studentsExamined}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Tổng số học sinh</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Phát hiện bất thường
                  </h3>
                  <p className="text-2xl font-bold">
                    {reportData.healthCheck.abnormalFindings}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(
                      (reportData.healthCheck.abnormalFindings /
                        reportData.healthCheck.studentsExamined) *
                        100
                    )}
                    % tổng số học sinh
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-500">
                    Vấn đề phổ biến nhất
                  </h3>
                  <p className="text-2xl font-bold">Thị lực</p>
                  <p className="text-xs text-gray-500 mt-1">
                    43% tổng phát hiện
                  </p>
                </div>
              </div>

              {renderChart(
                reportData.healthCheck.byFinding,
                "Phân loại phát hiện bất thường",
                "tròn"
              )}

              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  So sánh kết quả theo lớp
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">
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
