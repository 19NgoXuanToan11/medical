import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiUser,
  FiPhone,
  FiMail,
  FiFileText,
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiDownload,
  FiShare2,
  FiActivity,
  FiTarget,
  FiPackage,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiBarChart,
} from "react-icons/fi";

const VaccinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vaccinationData, setVaccinationData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data for vaccination detail
  useEffect(() => {
    const fetchVaccinationDetail = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData = {
        id: id,
        title: "Tiêm chủng phòng cúm mùa 2024",
        type: "Cúm mùa",
        status: "Đang diễn ra",
        priority: "Cao",
        requestedBy: {
          name: "Y tá Nguyễn Thị Hoa",
          id: "nurse_001",
          phone: "0123456789",
          email: "hoa.nurse@school.edu.vn",
          department: "Phòng Y tế",
        },
        schedule: {
          startDate: "2024-02-15",
          endDate: "2024-02-20",
          startTime: "08:00",
          endTime: "11:00",
          duration: 180,
          location: "Phòng y tế trường",
        },
        target: {
          grades: ["1A", "1B", "1C", "1D"],
          totalStudents: 120,
          completedStudents: 85,
          remainingStudents: 35,
          completionRate: 70.8,
        },
        vaccine: {
          name: "Vắc-xin cúm mùa Influvac",
          manufacturer: "Abbott",
          batchNumber: "INF2024-001",
          expiryDate: "2024-12-31",
          dosage: "0.5ml",
          route: "Tiêm bắp",
          storage: "2-8°C",
        },
        budget: {
          estimatedCost: 3600000,
          actualCost: 2550000,
          costPerStudent: 30000,
          budgetStatus: "Trong ngân sách",
        },
        supplies: [
          {
            name: "Vắc-xin cúm mùa",
            quantity: 120,
            unit: "liều",
            cost: 2400000,
          },
          { name: "Kim tiêm", quantity: 120, unit: "cái", cost: 60000 },
          { name: "Cồn y tế", quantity: 5, unit: "chai", cost: 50000 },
          { name: "Băng cá nhân", quantity: 10, unit: "hộp", cost: 40000 },
        ],
        consent: {
          total: 120,
          agreed: 105,
          disagreed: 8,
          pending: 7,
          agreementRate: 87.5,
        },
        safety: {
          contraindications: [
            "Học sinh đang sốt cao (>38.5°C)",
            "Có tiền sử dị ứng với vắc-xin",
            "Đang trong thời gian ủ bệnh",
            "Suy giảm miễn dịch",
          ],
          sideEffects: [
            "Đau nhẹ tại chỗ tiêm",
            "Sốt nhẹ trong 1-2 ngày",
            "Mệt mỏi",
          ],
          emergencyPlan: "Có sẵn thuốc chống dị ứng và kế hoạch cấp cứu",
        },
        progress: {
          phases: [
            { name: "Chuẩn bị", status: "completed", date: "2024-02-10" },
            {
              name: "Thông báo phụ huynh",
              status: "completed",
              date: "2024-02-12",
            },
            {
              name: "Thu thập đồng ý",
              status: "completed",
              date: "2024-02-14",
            },
            {
              name: "Thực hiện tiêm",
              status: "in-progress",
              date: "2024-02-15",
            },
            {
              name: "Theo dõi sau tiêm",
              status: "pending",
              date: "2024-02-21",
            },
            { name: "Báo cáo kết quả", status: "pending", date: "2024-02-25" },
          ],
        },
        statistics: {
          dailyProgress: [
            { date: "2024-02-15", completed: 25, target: 30 },
            { date: "2024-02-16", completed: 30, target: 30 },
            { date: "2024-02-17", completed: 30, target: 30 },
            { date: "2024-02-18", completed: 0, target: 30 },
          ],
          byGrade: [
            { grade: "1A", total: 30, completed: 25, rate: 83.3 },
            { grade: "1B", total: 30, completed: 30, rate: 100 },
            { grade: "1C", total: 30, completed: 30, rate: 100 },
            { grade: "1D", total: 30, completed: 0, rate: 0 },
          ],
        },
        notes: [
          {
            id: 1,
            author: "Y tá Nguyễn Thị Hoa",
            date: "2024-02-15",
            content:
              "Đã hoàn thành tiêm cho lớp 1A và 1B. Không có phản ứng bất thường.",
            type: "info",
          },
          {
            id: 2,
            author: "Quản lý Y tế",
            date: "2024-02-16",
            content: "Cần theo dõi chặt chẽ học sinh có tiền sử dị ứng.",
            type: "warning",
          },
        ],
      };

      setVaccinationData(mockData);
      setLoading(false);
    };

    fetchVaccinationDetail();
  }, [id]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleExport = () => {
    alert("Đang xuất báo cáo...");
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!vaccinationData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không tìm thấy thông tin tiêm chủng
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vaccinationData.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Mã chương trình: VAC-{vaccinationData.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    vaccinationData.status
                  )}`}
                >
                  {vaccinationData.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                    vaccinationData.priority
                  )}`}
                >
                  Ưu tiên {vaccinationData.priority.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-6">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit3 className="h-4 w-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload className="h-4 w-4" />
                <span>Xuất báo cáo</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
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
                  {vaccinationData.target.totalStudents}
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
                  Đã hoàn thành
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vaccinationData.target.completedStudents}
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
                  {vaccinationData.target.remainingStudents}
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
                  {vaccinationData.target.completionRate}%
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
                { id: "supplies", label: "Vật tư", icon: FiPackage },
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
                      <FiShield className="h-5 w-5 mr-2 text-blue-600" />
                      Thông tin cơ bản
                    </h3>
                    <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Loại vắc-xin:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Người yêu cầu:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.requestedBy.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Phòng ban:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.requestedBy.department}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Liên hệ:
                        </span>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {vaccinationData.requestedBy.phone}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {vaccinationData.requestedBy.email}
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
                          {vaccinationData.schedule.startDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Ngày kết thúc:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.schedule.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Thời gian:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.schedule.startTime} -{" "}
                          {vaccinationData.schedule.endTime}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                          Địa điểm:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {vaccinationData.schedule.location}
                        </span>
                      </div>
                    </div>
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
                    {vaccinationData.progress.phases.map((phase, index) => (
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

                {/* Daily Progress */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tiến độ hàng ngày
                  </h3>
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <div className="space-y-3">
                      {vaccinationData.statistics.dailyProgress.map(
                        (day, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {day.date}
                            </span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${
                                      (day.completed / day.target) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {day.completed}/{day.target}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vaccinationData.statistics.byGrade.map((grade, index) => (
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
                          <span>Đã tiêm: {grade.completed}</span>
                          <span>Tổng: {grade.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tình trạng đồng ý của phụ huynh
                  </h3>
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {vaccinationData.consent.agreed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Đồng ý
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {vaccinationData.consent.disagreed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Không đồng ý
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {vaccinationData.consent.pending}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Chờ phản hồi
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {vaccinationData.consent.agreementRate}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Tỷ lệ đồng ý
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "supplies" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Danh sách vật tư
                  </h3>
                  <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-neutral-700">
                    <table className="w-full table-fixed">
                      <thead className="bg-gray-50 dark:bg-neutral-700">
                        <tr>
                          <th className="w-1/3 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Tên vật tư
                          </th>
                          <th className="w-1/3 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Số lượng
                          </th>
                          <th className="w-1/3 px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-600">
                            Đơn vị
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                        {vaccinationData.supplies.map((supply, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white align-middle">
                              {supply.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                              <span className="inline-flex items-center justify-center min-w-[3rem] h-8 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full font-medium">
                                {supply.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center align-middle">
                              <span className="inline-flex items-center justify-center min-w-[3rem] h-8 px-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full font-medium">
                                {supply.unit}
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

            {activeTab === "safety" && (
              <div className="space-y-6">
                {/* Contraindications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiAlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Chống chỉ định
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {vaccinationData.safety.contraindications.map(
                        (item, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <FiXCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800 dark:text-red-200">
                              {item}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                {/* Side Effects */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiHeart className="h-5 w-5 mr-2 text-yellow-600" />
                    Tác dụng phụ có thể xảy ra
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <ul className="space-y-2">
                      {vaccinationData.safety.sideEffects.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <FiAlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-yellow-800 dark:text-yellow-200">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Plan */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiShield className="h-5 w-5 mr-2 text-green-600" />
                    Kế hoạch cấp cứu
                  </h3>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {vaccinationData.safety.emergencyPlan}
                    </p>
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
                    {vaccinationData.notes.map((note) => (
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

export default VaccinationDetail;
