import React, { useState } from "react";
import {
  FaChartLine,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("health");
  const [selectedPeriod, setSelectedPeriod] = useState("semester");
  const [selectedChild, setSelectedChild] = useState("all");

  const reportTypes = [
    { id: "health", name: "Báo cáo sức khỏe tổng quát" },
    { id: "medication", name: "Báo cáo sử dụng thuốc" },
    { id: "vaccination", name: "Báo cáo tiêm chủng" },
    { id: "checkups", name: "Báo cáo khám sức khỏe định kỳ" },
    { id: "growth", name: "Báo cáo phát triển thể chất" },
  ];

  const periods = [
    { id: "month", name: "Tháng này" },
    { id: "semester", name: "Học kỳ hiện tại" },
    { id: "year", name: "Năm học" },
    { id: "custom", name: "Tùy chỉnh" },
  ];

  const children = [
    { id: "all", name: "Tất cả học sinh" },
    { id: "1", name: "Nguyễn Văn An" },
    { id: "2", name: "Nguyễn Thị Bình" },
  ];

  // Sample report data - in a real app, this would come from an API
  const healthReport = {
    title: "Báo cáo sức khỏe tổng quát - Học kỳ 1 (2023-2024)",
    summary:
      "Tổng quan về sức khỏe của học sinh trong học kỳ 1 năm học 2023-2024",
    lastUpdated: "15/07/2023",
    charts: [
      {
        title: "Chỉ số BMI",
        data: {
          labels: [
            "T8/2022",
            "T10/2022",
            "T12/2022",
            "T2/2023",
            "T4/2023",
            "T6/2023",
          ],
          values: [19.2, 19.4, 19.8, 20.1, 20.2, 20.3],
          healthyRange: { min: 18.5, max: 24.9 },
          unit: "kg/m²",
        },
      },
      {
        title: "Chiều cao",
        data: {
          labels: [
            "T8/2022",
            "T10/2022",
            "T12/2022",
            "T2/2023",
            "T4/2023",
            "T6/2023",
          ],
          values: [160, 161, 162, 163, 163.5, 164],
          unit: "cm",
        },
      },
      {
        title: "Cân nặng",
        data: {
          labels: [
            "T8/2022",
            "T10/2022",
            "T12/2022",
            "T2/2023",
            "T4/2023",
            "T6/2023",
          ],
          values: [49.2, 50.3, 51.8, 53.4, 54.1, 54.7],
          unit: "kg",
        },
      },
    ],
    events: [
      {
        title: "Khám sức khỏe răng miệng",
        date: "10/03/2023",
        status: "Đã khám",
        result:
          "Sức khỏe răng miệng tốt, cần chú ý vệ sinh răng miệng thường xuyên",
      },
      {
        title: "Khám sức khỏe định kỳ học kỳ 1",
        date: "15/12/2022",
        status: "Đã khám",
        result: "Sức khỏe tổng quát tốt, thị lực bình thường",
      },
    ],
    recommendations: [
      "Duy trì chế độ ăn uống đầy đủ dinh dưỡng",
      "Tăng cường hoạt động thể chất, nên tập thể dục ít nhất 30 phút mỗi ngày",
      "Giữ lịch khám răng định kỳ 6 tháng/lần",
    ],
  };

  const renderChart = (chart) => {
    // In a real application, this would render an actual chart using a library like Chart.js or Recharts
    // Here we'll just show a simplified representation
    const maxValue = Math.max(...chart.data.values);
    const minValue = Math.min(...chart.data.values);
    const range = maxValue - minValue;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {chart.title}
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="h-40 flex items-end relative mb-2">
            {chart.data.values.map((value, index) => {
              const height = ((value - minValue) / range) * 80 + 10; // 10-90% height
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full max-w-[30px] rounded-t ${
                      chart.data.healthyRange
                        ? value >= chart.data.healthyRange.min &&
                          value <= chart.data.healthyRange.max
                          ? "bg-green-500"
                          : "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              );
            })}

            {/* Healthy Range Indicator */}
            {chart.data.healthyRange && (
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="border-t border-dashed border-green-600 absolute left-0 right-0"
                  style={{
                    bottom: `${
                      ((chart.data.healthyRange.max - minValue) / range) * 80 +
                      10
                    }%`,
                  }}
                ></div>
                <div
                  className="border-t border-dashed border-green-600 absolute left-0 right-0"
                  style={{
                    bottom: `${
                      ((chart.data.healthyRange.min - minValue) / range) * 80 +
                      10
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>

          <div className="flex text-xs text-gray-500">
            {chart.data.labels.map((label, index) => (
              <div key={index} className="flex-1 text-center">
                <div>{label}</div>
                <div className="font-medium text-gray-700 mt-1">
                  {chart.data.values[index]} {chart.data.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          {chart.data.healthyRange && (
            <div className="mt-3 text-xs text-gray-500 flex items-center">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-sm mr-1"></span>
              <span>
                Trong ngưỡng khỏe mạnh ({chart.data.healthyRange.min} -{" "}
                {chart.data.healthyRange.max} {chart.data.unit})
              </span>
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded-sm ml-4 mr-1"></span>
              <span>Ngoài ngưỡng khỏe mạnh</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Báo cáo</h1>
        <p className="text-gray-600">
          Xem các báo cáo sức khỏe chi tiết và lịch sử y tế của con bạn
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="report-type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại báo cáo
            </label>
            <select
              id="report-type"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Khoảng thời gian
            </label>
            <select
              id="period"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="child"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Học sinh
            </label>
            <select
              id="child"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaFilter className="mr-2" />
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {healthReport.title}
              </h2>
              <p className="text-gray-600 mt-1">{healthReport.summary}</p>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật lần cuối: {healthReport.lastUpdated}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaDownload className="mr-2" />
              Tải xuống PDF
            </button>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" />
              Biểu đồ chỉ số sức khỏe
            </h3>
            <div className="space-y-6">
              {healthReport.charts.map((chart, index) => (
                <div key={index}>{renderChart(chart)}</div>
              ))}
            </div>
          </div>

          {/* Health Events */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Sự cố y tế trong kỳ báo cáo
            </h3>
            <div className="space-y-4">
              {healthReport.events.map((event, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {event.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{event.result}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Khuyến nghị từ nhân viên y tế
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {healthReport.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
