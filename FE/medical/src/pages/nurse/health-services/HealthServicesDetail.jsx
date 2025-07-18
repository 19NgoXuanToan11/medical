import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiUser,
  FiFileText,
  FiActivity,
  FiSettings,
  FiInfo,
  FiEdit,
  FiPrinter,
  FiDownload,
  FiShare2,
  FiHeart,
  FiEye,
  FiZap,
  FiTarget,
} from "react-icons/fi";
import { getHealthCheckScheduleById } from "../../../utils/api/healthCheck/healthCheckService";

const HealthServicesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthService, setHealthService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHealthServiceDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id && id !== "undefined") {
          console.log("Loading health service detail with formId:", id);
          const data = await getHealthCheckScheduleById(id);
          console.log("API response data:", data);
          setHealthService(data);
        } else {
          console.log("No formId provided, showing mock data");
          setHealthService(mockHealthServiceData);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu từ API:", err);
        setError(err.message);
        console.log("Using mock data due to API error");
        setHealthService(mockHealthServiceData);
      }
      setLoading(false);
    };

    loadHealthServiceDetail();
  }, [id]);

  const mockHealthServiceData = {
    formId: 1,
    title: "Khám sức khỏe học kỳ 1",
    scheduledDate: "2025-08-05T00:00:00",
    startTime: "09:00:00",
    estimatedDuration: 60,
    description: "Khám sức khỏe định kỳ cho học sinh",
    location: "Phòng y tế trường",
    studentId: null,
    parentId: null,
    createdDate: "2025-07-07T06:54:56.977",
    consentStatus: "đang chờ",
    consentDate: null,
    confirmStatus: "đang chờ",
    confirmedBy: null,
    confirmedDate: null,
    className: null,
    gradeIds: '["grade-2"]',
    totalStudents: 80,
    notifyParents: true,
    autoAdvance: true,
    saveResults: true,
    generateReport: true,
    requireParentConfirmation: true,
    selectedStations:
      '["height_weight", "vision", "hearing", "dental", "cardiovascular"]',
    staffAssigned: "",
    status: "đang chờ",
    estimatedEndTime: "10:00:00",
    student: null,
    parent: null,
    confirmedByStaff: null,
    results: [],
    grades: ["Khối 2"],
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

    switch (status?.toLowerCase()) {
      case "đang chờ":
      case "đang chờ duyệt":
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300`;
      case "đã duyệt":
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "đang thực hiện":
      case "active":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      case "hoàn thành":
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case "đã hủy":
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      "đang chờ": "Đang chờ duyệt",
      "đang chờ duyệt": "Đang chờ duyệt",
      pending: "Đang chờ duyệt",
      "đã duyệt": "Đã được duyệt",
      approved: "Đã được duyệt",
      "đang thực hiện": "Đang thực hiện",
      active: "Đang thực hiện",
      "hoàn thành": "Đã hoàn thành",
      completed: "Đã hoàn thành",
      "đã hủy": "Đã hủy bỏ",
      cancelled: "Đã hủy bỏ",
    };
    return statusMap[status?.toLowerCase()] || status || "Không xác định";
  };

  const parseJsonField = (field) => {
    try {
      return Array.isArray(field) ? field : JSON.parse(field || "[]");
    } catch (error) {
      return [];
    }
  };

  const formatGradesList = (gradeIds, grades) => {
    let gradesList = [];

    if (grades && Array.isArray(grades) && grades.length > 0) {
      gradesList = grades;
    } else if (gradeIds) {
      gradesList = parseJsonField(gradeIds);
    }

    if (gradesList.length === 0) {
      return "Tất cả";
    }

    return gradesList
      .map((grade) => {
        if (typeof grade === "string" && grade.match(/^grade-[0-9]+$/)) {
          const gradeNumber = grade.replace("grade-", "");
          return `Khối ${gradeNumber}`;
        }
        if (typeof grade === "string" && grade.match(/^[0-9]+[A-Z]?$/)) {
          return `Lớp ${grade}`;
        }
        return grade;
      })
      .join(", ");
  };

  const getStationNameInVietnamese = (stationKey) => {
    if (!stationKey || typeof stationKey !== "string") {
      return "Trạm không xác định";
    }

    const stationMap = {
      height_weight: "Chiều cao & Cân nặng",
      vision: "Khám mắt",
      hearing: "Khám tai",
      dental: "Khám răng miệng",
      cardiovascular: "Khám tim mạch",
      respiratory: "Khám hô hấp",
      general: "Khám tổng quát",
      physical: "Thể lực",
      blood_pressure: "Đo huyết áp",
      temperature: "Đo nhiệt độ",
      bmi: "Chỉ số BMI",
      spine: "Khám cột sống",
      posture: "Kiểm tra tư thế",
      reflexes: "Kiểm tra phản xạ",
      coordination: "Phối hợp vận động",
      mental_health: "Sức khỏe tâm thần",
      skin: "Khám da liễu",
      neurological: "Khám thần kinh",
      musculoskeletal: "Khám xương khớp",
    };

    if (stationMap[stationKey]) {
      return stationMap[stationKey];
    }

    if (stationKey.includes("_")) {
      const parts = stationKey.split("_");
      const translatedParts = parts.map((part) => stationMap[part] || part);
      return translatedParts.join(" & ");
    }

    return stationKey.charAt(0).toUpperCase() + stationKey.slice(1);
  };

  const getStationIcon = (stationKey) => {
    const iconMap = {
      height_weight: FiTarget,
      vision: FiEye,
      hearing: FiZap,
      dental: FiUser,
      cardiovascular: FiHeart,
      respiratory: FiActivity,
      general: FiClipboard,
    };
    return iconMap[stationKey] || FiCheckCircle;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Chưa xác định";
    try {
      // Convert "09:00:00" to "Sáng (9h-10h)" or "14:00:00" to "Chiều (14h-15h)"
      const hour = parseInt(timeString.split(':')[0]);
      if (hour === 9) {
        return "Sáng (9h-10h)";
      } else if (hour === 14) {
        return "Chiều (14h-15h)";
      }
      return timeString.slice(0, 5);
    } catch (error) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  if (!healthService) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <FiInfo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin lịch khám sức khỏe
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <FiArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Chi tiết lịch khám sức khỏe
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {id || "demo"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to={`/nurse/health-services/edit/${id || "new"}`}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </Link>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors">
                <FiPrinter className="h-4 w-4 mr-2" />
                In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
            <div className="flex">
              <FiInfo className="h-5 w-5 text-orange-400 dark:text-orange-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Thông báo:</strong> Không thể tải dữ liệu từ API (ID: {id}). Hiển thị dữ liệu mẫu để demo.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FiClipboard className="h-5 w-5 mr-2 text-blue-600" />
                    Thông tin cơ bản
                  </h2>
                  <span className={getStatusBadge(healthService.status)}>
                    {getStatusText(healthService.status)}
                  </span>
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tiêu đề
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {healthService.title || "Chưa có tiêu đề"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Địa điểm
                    </label>
                    <p className="text-base text-gray-900 dark:text-white flex items-center">
                      <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {healthService.location || "Chưa xác định"}
                    </p>
                  </div>
                </div>
                {healthService.description && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mô tả
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {healthService.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiCalendar className="h-5 w-5 mr-2 text-green-600" />
                  Lịch trình
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ngày thực hiện
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {formatDate(healthService.scheduledDate)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buổi thực hiện
                    </label>
                    <p className="text-base text-gray-900 dark:text-white flex items-center">
                      <FiClock className="h-4 w-4 mr-2 text-gray-400" />
                      {formatTime(healthService.startTime)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Thời lượng dự kiến
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {healthService.estimatedDuration || 0} phút
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Check Stations */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiActivity className="h-5 w-5 mr-2 text-red-600" />
                  Các trạm khám sức khỏe
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                    {parseJsonField(healthService.selectedStations).length} trạm
                  </span>
                </h2>
              </div>
              <div className="px-6 py-4">
                {parseJsonField(healthService.selectedStations).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parseJsonField(healthService.selectedStations).map(
                      (station, index) => {
                        const IconComponent = getStationIcon(station);
                        return (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                              <IconComponent className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="ml-3 text-sm font-medium text-green-800 dark:text-green-300">
                              {getStationNameInVietnamese(station)}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiActivity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có trạm khám nào được chọn
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Class Information */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiUsers className="h-5 w-5 mr-2 text-purple-600" />
                  Thông tin lớp
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Khối/Lớp tham gia
                    </label>
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                      <p className="text-base font-medium text-purple-800 dark:text-purple-300">
                        {formatGradesList(healthService.gradeIds, healthService.grades)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tổng số học sinh
                    </label>
                    <div className="flex items-center">
                      <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {healthService.totalStudents || 0}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        học sinh
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiSettings className="h-5 w-5 mr-2 text-gray-600" />
                  Cài đặt
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Thông báo phụ huynh
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      healthService.notifyParents 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                      {healthService.notifyParents ? "Bật" : "Tắt"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Lưu kết quả
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      healthService.saveResults 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                      {healthService.saveResults ? "Bật" : "Tắt"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Tạo báo cáo
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      healthService.generateReport 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                      {healthService.generateReport ? "Bật" : "Tắt"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiInfo className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin thêm
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Ngày tạo:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {healthService.createdDate 
                        ? new Date(healthService.createdDate).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long", 
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "Không xác định"
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Trạng thái đồng ý:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getStatusText(healthService.consentStatus)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Trạng thái xác nhận:</span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getStatusText(healthService.confirmStatus)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {healthService.results && healthService.results.length > 0 && (
          <div className="mt-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiFileText className="h-5 w-5 mr-2 text-purple-600" />
                  Kết quả khám sức khỏe
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="text-center py-8">
                  <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kết quả sẽ được hiển thị khi quá trình khám sức khỏe hoàn tất
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthServicesDetail;
