import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiCalendar,
  FiUsers,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiDownload,
  FiActivity,
  FiTarget,
  FiPackage,
  FiEye,
  FiTrendingUp,
  FiBarChart,
  FiFileText,
  FiThermometer,
  FiEyeOff,
  FiSmile,
} from "react-icons/fi";

const HealthCheckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheckData, setHealthCheckData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for health check detail
  useEffect(() => {
    const fetchHealthCheckDetail = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = {
        id: id,
        title: "Khám sức khỏe định kỳ học kỳ 2",
        type: "Khám định kỳ",
        status: "Đang diễn ra",
        priority: "Cao",
        requestedBy: {
          name: "Y tá Nguyễn Thị Hoa",
          department: "Phòng Y tế",
          phone: "0123456789",
          email: "hoa.nurse@school.edu.vn",
        },
        schedule: {
          startDate: "2024-02-20",
          endDate: "2024-02-25",
          startTime: "08:00",
          endTime: "11:30",
          location: "Phòng y tế trường",
        },
        target: {
          grades: ["2A", "2B", "2C"],
          totalStudents: 90,
          completedStudents: 65,
          remainingStudents: 25,
          completionRate: 72.2,
        },
        checkItems: [
          { name: "Chiều cao", completed: 65, total: 90, rate: 72.2 },
          { name: "Cân nặng", completed: 65, total: 90, rate: 72.2 },
          { name: "Thị lực", completed: 60, total: 90, rate: 66.7 },
          { name: "Răng miệng", completed: 55, total: 90, rate: 61.1 },
          { name: "Tim mạch", completed: 62, total: 90, rate: 68.9 },
        ],
        budget: {
          estimatedCost: 2700000,
          actualCost: 1950000,
          costPerStudent: 30000,
          budgetStatus: "Trong ngân sách",
        },
        equipment: [
          { name: "Thước đo chiều cao", status: "Sẵn sàng", condition: "Tốt" },
          { name: "Cân điện tử", status: "Sẵn sàng", condition: "Tốt" },
          { name: "Bảng đo thị lực", status: "Sẵn sàng", condition: "Tốt" },
          { name: "Đèn khám", status: "Sẵn sàng", condition: "Tốt" },
          { name: "Ống nghe", status: "Sẵn sàng", condition: "Tốt" },
        ],
        results: {
          summary: {
            excellent: 25,
            good: 30,
            average: 8,
            needsAttention: 2,
          },
          healthIssues: [
            { issue: "Cận thị", count: 8, percentage: 12.3 },
            { issue: "Sâu răng", count: 12, percentage: 18.5 },
            { issue: "Thiếu cân", count: 5, percentage: 7.7 },
            { issue: "Thừa cân", count: 3, percentage: 4.6 },
          ],
          recommendations: [
            "Tăng cường hoạt động thể chất ngoài trời",
            "Khuyến khích vệ sinh răng miệng đúng cách",
            "Theo dõi chế độ dinh dưỡng của học sinh",
            "Kiểm tra mắt định kỳ cho học sinh có dấu hiệu cận thị",
          ],
        },
        progress: {
          phases: [
            {
              name: "Chuẩn bị thiết bị",
              status: "completed",
              date: "2024-02-18",
            },
            {
              name: "Thông báo phụ huynh",
              status: "completed",
              date: "2024-02-19",
            },
            {
              name: "Khám sức khỏe",
              status: "in-progress",
              date: "2024-02-20",
            },
            { name: "Nhập kết quả", status: "in-progress", date: "2024-02-22" },
            { name: "Tư vấn phụ huynh", status: "pending", date: "2024-02-26" },
            { name: "Báo cáo tổng kết", status: "pending", date: "2024-02-28" },
          ],
        },
        statistics: {
          byGrade: [
            { grade: "2A", total: 30, completed: 25, rate: 83.3 },
            { grade: "2B", total: 30, completed: 25, rate: 83.3 },
            { grade: "2C", total: 30, completed: 15, rate: 50.0 },
          ],
          byCheckItem: [
            { item: "Chiều cao", completed: 65, abnormal: 2 },
            { item: "Cân nặng", completed: 65, abnormal: 8 },
            { item: "Thị lực", completed: 60, abnormal: 8 },
            { item: "Răng miệng", completed: 55, abnormal: 12 },
            { item: "Tim mạch", completed: 62, abnormal: 1 },
          ],
        },
        notes: [
          {
            id: 1,
            author: "Y tá Nguyễn Thị Hoa",
            date: "2024-02-20",
            content:
              "Đã hoàn thành khám cho lớp 2A và 2B. Phát hiện 3 trường hợp cần theo dõi thêm.",
            type: "info",
          },
          {
            id: 2,
            author: "Bác sĩ Trần Văn Nam",
            date: "2024-02-21",
            content:
              "Cần thông báo phụ huynh về các trường hợp học sinh có vấn đề về thị lực.",
            type: "warning",
          },
          {
            id: 3,
            author: "Y tá Lê Thị Mai",
            date: "2024-02-22",
            content:
              "Đã cập nhật kết quả khám vào hệ thống. Chuẩn bị tư liệu tư vấn cho phụ huynh.",
            type: "info",
          },
        ],
      };

      setHealthCheckData(mockData);
      setLoading(false);
    };

    fetchHealthCheckDetail();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "text-green-600 bg-green-50 border-green-200";
      case "Đang diễn ra":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Chờ duyệt":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Đã hủy":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "text-red-600 bg-red-50 border-red-200";
      case "Trung bình":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Thấp":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50";
      case "good":
        return "text-blue-600 bg-blue-50";
      case "average":
        return "text-yellow-600 bg-yellow-50";
      case "needsAttention":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!healthCheckData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy thông tin khám sức khỏe
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                    {healthCheckData.title}
                  </h1>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Chi tiết thông tin khám sức khỏe và tiến độ thực hiện
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    healthCheckData.status
                  )}`}
                >
                  {healthCheckData.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                    healthCheckData.priority
                  )}`}
                >
                  Ưu tiên {healthCheckData.priority.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-6">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiEdit3 className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <FiTrash2 className="h-4 w-4" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tổng học sinh
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {healthCheckData.target.totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Đã khám
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {healthCheckData.target.completedStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <FiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Còn lại
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {healthCheckData.target.remainingStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Tỷ lệ hoàn thành
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {healthCheckData.target.completionRate}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6">
          <div className="border-b border-gray-200 dark:border-neutral-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Tổng quan", icon: FiActivity },
                { id: "students", label: "Học sinh", icon: FiUsers },
                { id: "equipment", label: "Thiết bị", icon: FiPackage },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FiHeart className="h-5 w-5 mr-2 text-blue-600" />
                      Thông tin cơ bản
                    </h3>
                    <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Loại khám:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Người yêu cầu:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.requestedBy.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Phòng ban:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.requestedBy.department}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Liên hệ:
                        </span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {healthCheckData.requestedBy.phone}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {healthCheckData.requestedBy.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <FiCalendar className="h-5 w-5 mr-2 text-green-600" />
                      Lịch trình
                    </h3>
                    <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Ngày bắt đầu:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.schedule.startDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Ngày kết thúc:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.schedule.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Thời gian:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.schedule.startTime} -{" "}
                          {healthCheckData.schedule.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Địa điểm:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {healthCheckData.schedule.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Check Items */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiTarget className="h-5 w-5 mr-2 text-purple-600" />
                    Hạng mục khám
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {healthCheckData.checkItems.map((item, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </h4>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {item.rate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>Đã khám: {item.completed}</span>
                          <span>Tổng: {item.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "progress" && (
              <div className="space-y-6">
                {/* Progress Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tiến độ thực hiện
                  </h3>
                  <div className="space-y-4">
                    {healthCheckData.progress.phases.map((phase, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {phase.status === "completed" && (
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              <FiCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                          {phase.status === "in-progress" && (
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <FiClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}
                          {phase.status === "pending" && (
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {phase.name}
                            </h4>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {phase.date}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                phase.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : phase.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {phase.status === "completed"
                                ? "Hoàn thành"
                                : phase.status === "in-progress"
                                ? "Đang thực hiện"
                                : "Chờ thực hiện"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "results" && (
              <div className="space-y-6">
                {/* Health Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tổng quan kết quả sức khỏe
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {healthCheckData.results.summary.excellent}
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-200">
                        Xuất sắc
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {healthCheckData.results.summary.good}
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        Tốt
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {healthCheckData.results.summary.average}
                      </div>
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">
                        Trung bình
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {healthCheckData.results.summary.needsAttention}
                      </div>
                      <div className="text-sm text-red-800 dark:text-red-200">
                        Cần chú ý
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Issues */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Vấn đề sức khỏe phổ biến
                  </h3>
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {healthCheckData.results.healthIssues.map(
                        (issue, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-900 dark:text-white">
                              {issue.issue}
                            </span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${issue.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {issue.count} ({issue.percentage}%)
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div className="space-y-6">
                {/* Student Statistics by Grade */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thống kê theo lớp
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {healthCheckData.statistics.byGrade.map((grade, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Lớp {grade.grade}
                          </h4>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {grade.rate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${grade.rate}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>Đã khám: {grade.completed}</span>
                          <span>Tổng: {grade.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics by Check Item */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thống kê theo hạng mục
                  </h3>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-700">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Hạng mục
                          </th>
                          <th className="w-1/4 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Đã khám
                          </th>
                          <th className="w-1/4 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Bất thường
                          </th>
                          <th className="w-1/4 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Tỷ lệ bất thường
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                        {healthCheckData.statistics.byCheckItem.map(
                          (item, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                            >
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-middle">
                                {item.item}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                                <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                                  {item.completed}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                                <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full font-medium">
                                  {item.abnormal}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                                <span className="inline-flex items-center justify-center min-w-[3rem] h-8 px-3 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-full font-medium">
                                  {(
                                    (item.abnormal / item.completed) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "equipment" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Danh sách thiết bị
                  </h3>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-700">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          <th className="w-1/3 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Tên thiết bị
                          </th>
                          <th className="w-1/3 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Trạng thái
                          </th>
                          <th className="w-1/3 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Tình trạng
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                        {healthCheckData.equipment.map((item, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-middle">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-center align-middle">
                              <span className="inline-flex items-center justify-center min-w-[4rem] h-8 px-3 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                              <span className="inline-flex items-center justify-center min-w-[3rem] h-8 px-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full font-medium">
                                {item.condition}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Ghi chú và cập nhật
                  </h3>
                  <div className="space-y-4">
                    {healthCheckData.notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          note.type === "info"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                            : note.type === "warning"
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                            : "bg-gray-50 dark:bg-gray-700 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {note.author}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {note.date}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            note.type === "info"
                              ? "text-blue-800 dark:text-blue-200"
                              : note.type === "warning"
                              ? "text-yellow-800 dark:text-yellow-200"
                              : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckDetail;
