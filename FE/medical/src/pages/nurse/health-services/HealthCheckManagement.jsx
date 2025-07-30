import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiEye,
  FiEdit,
  FiPlay,
  FiMapPin,
  FiInfo,
  FiAlertCircle,
  FiX,
  FiPlayCircle,
  FiTrendingUp,
  FiUpload,
  FiFile,
  FiDownload,
} from "react-icons/fi";
import { useNurseHealthCheckData } from "./hooks/useNurseHealthCheckData";
import { formatDate } from "../../../utils/report/reportUtils";
import {
  uploadHealthCheckResults,
  downloadHealthCheckTemplate,
  markHealthCheckCompleted,
} from "../../../utils/api/healthCheck/healthCheckService";

const HealthCheckManagement = ({ searchTerm: parentSearchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedHealthCheck, setSelectedHealthCheck] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Use custom hook for data management
  const {
    loading,
    error,
    stats,
    nurseAssignment,
    pendingHealthChecks,
    upcomingHealthChecks,
    completedHealthChecks,
    rejectedHealthChecks,
    fetchHealthCheckSchedules,
  } = useNurseHealthCheckData();

  // Function to translate station codes to Vietnamese names
  const translateStationName = (stationKey) => {
    if (!stationKey || typeof stationKey !== "string") {
      return "Trạm không xác định";
    }

    const stationMap = {
      // Các trạm cơ bản
      height: "Đo chiều cao",
      weight: "Cân nặng",
      "height-weight": "Chiều cao & Cân nặng",
      height_weight: "Chiều cao & Cân nặng",
      vision: "Khám mắt",
      hearing: "Khám tai",
      dental: "Khám răng miệng",

      // Các trạm nâng cao
      "blood-pressure": "Đo huyết áp",
      blood_pressure: "Đo huyết áp",
      cardiovascular: "Tim mạch",
      respiratory: "Hô hấp",
      general: "Khám tổng quát",
      physical: "Thể chất",
      motor: "Vận động",
      neurological: "Thần kinh",
      dermatology: "Da liễu",
      nutrition: "Dinh dưỡng",
      psychology: "Tâm lý",
      spine: "Cột sống",
      reflexes: "Phản xạ",
      coordination: "Phối hợp",
      posture: "Tư thế",
      fitness: "Thể lực",
      laboratory: "Xét nghiệm",
      "lab-tests": "Xét nghiệm",
      lab_tests: "Xét nghiệm",
      blood_test: "Xét nghiệm máu",
      urine_test: "Xét nghiệm nước tiểu",
      imaging: "Chẩn đoán hình ảnh",
      xray: "X-quang",
      ultrasound: "Siêu âm",
      other: "Khác",
    };

    // Tìm mapping chính xác hoặc sử dụng tên mặc định
    const mappedName = stationMap[stationKey.toLowerCase()];
    if (mappedName) {
      return mappedName;
    }

    // Nếu không tìm thấy, cố gắng format tên gốc
    return stationKey
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
      case "đang chờ":
        return "px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded-full";
      case "approved":
      case "đã duyệt":
        return "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full";
      case "scheduled":
      case "đã lên lịch":
        return "px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full";
      case "active":
      case "đang tiến hành":
        return "px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full";
      case "completed":
      case "hoàn thành":
        return "px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full";
      case "rejected":
      case "từ chối":
        return "px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full";
      default:
        return "px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full";
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "scheduled":
        return "Đã lên lịch";
      case "active":
        return "Đang thực hiện";
      case "completed":
        return "Hoàn thành";
      case "rejected":
        return "Từ chối";
      default:
        return status || "Không xác định";
    }
  };

  // Get health checks for current tab
  const getHealthChecksForTab = () => {
    switch (activeTab) {
      case "pending":
        return pendingHealthChecks;
      case "upcoming":
        return upcomingHealthChecks;
      case "completed":
        return completedHealthChecks;
      case "rejected":
        return rejectedHealthChecks;
      default:
        return [];
    }
  };

  // Filter health checks by search term
  const filteredHealthChecks = getHealthChecksForTab().filter((healthCheck) => {
    if (!parentSearchTerm) return true;

    const term = parentSearchTerm.toLowerCase();
    const titleMatch = healthCheck.title?.toLowerCase().includes(term);
    const descriptionMatch = healthCheck.description
      ?.toLowerCase()
      .includes(term);

    let gradesMatch = false;
    if (healthCheck.targetGrades) {
      const gradesArr = Array.isArray(healthCheck.targetGrades)
        ? healthCheck.targetGrades
        : [healthCheck.targetGrades];
      gradesMatch = gradesArr.some((grade) =>
        grade.toLowerCase().includes(term)
      );
    }

    return titleMatch || descriptionMatch || gradesMatch;
  });

  const handleStartHealthCheck = (healthCheckId) => {
    // Refresh data after action
    fetchHealthCheckSchedules();
  };

  const handleCompleteHealthCheck = (healthCheckId) => {
    // Refresh data after action
    fetchHealthCheckSchedules();
  };

  // Upload modal handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadError("");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadHealthCheckTemplate(selectedHealthCheck.formId || selectedHealthCheck.id);
    } catch (error) {
      console.error("Error downloading template:", error);
      setUploadError("Không thể tải mẫu file. Vui lòng thử lại.");
    }
  };

  const handleUpload = async () => {
    if (!uploadFile || !selectedHealthCheck) return;

    setUploading(true);
    setUploadError("");

    try {
      await uploadHealthCheckResults(
        selectedHealthCheck.formId || selectedHealthCheck.id,
        uploadFile
      );
      
      // Close modal and refresh data
      setShowUploadModal(false);
      setUploadFile(null);
      fetchHealthCheckSchedules();
    } catch (error) {
      console.error("Error uploading results:", error);
      setUploadError(error.message || "Không thể upload file. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const renderHealthCheckCard = (healthCheck) => (
    <div
      key={healthCheck.id}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FiActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {healthCheck.title}
            </h3>
          </div>
        </div>
        <span className={getStatusBadge(healthCheck.status)}>
          {getStatusLabel(healthCheck.status)}
        </span>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{formatDate(healthCheck.scheduledDate)}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="w-4 h-4 mr-2" />
          <span>{healthCheck.scheduledTime || healthCheck.startTime}</span>
        </div>
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>
            Khối: {healthCheck.targetGrades?.join(", ") || "Chưa phân công"}
          </span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span>{healthCheck.location}</span>
        </div>
      </div>

      {/* Nurse Assignment Info */}
      {nurseAssignment && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
            <FiInfo className="w-4 h-4 mr-2" />
            <span>Bạn phụ trách: {nurseAssignment.gradeNames}</span>
          </div>
        </div>
      )}

      {healthCheck.status === "active" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Đã hoàn thành</span>
            <span>
              {healthCheck.completedStudents}/{healthCheck.totalStudents}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (healthCheck.completedStudents / healthCheck.totalStudents) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {healthCheck.confirmStatus?.toLowerCase() === "approved" && (
        <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <div className="flex items-start">
            <FiCheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-600 dark:text-green-400" />
            <div className="text-xs text-green-800 dark:text-green-200">
              <p className="font-medium">✅ Đã được Quản lý phê duyệt</p>
              <p>Sẵn sàng để bắt đầu thực hiện khám sức khỏe</p>
              {healthCheck.confirmedDate && (
                <p className="text-green-600 dark:text-green-400 mt-1">
                  Duyệt lúc:{" "}
                  {new Date(healthCheck.confirmedDate).toLocaleString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {healthCheck.confirmStatus?.toLowerCase() === "rejected" && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <div className="flex items-start">
            <FiX className="w-3 h-3 mr-2 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="text-xs text-red-800 dark:text-red-200">
              <p className="font-medium">❌ Đã bị Quản lý từ chối</p>
              <p>Bạn có thể chỉnh sửa và gửi lại yêu cầu</p>
              {healthCheck.confirmedDate && (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  Từ chối lúc:{" "}
                  {new Date(healthCheck.confirmedDate).toLocaleString("vi-VN")}
                </p>
              )}
              {healthCheck.rejectionReason && (
                <p className="text-red-600 dark:text-red-400 mt-1">
                  <strong>Lý do:</strong> {healthCheck.rejectionReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* View/Edit buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/nurse/health-services/detail/${
              healthCheck.formId || healthCheck.id
            }`}
            className="text-xs px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded transition-colors"
          >
            <FiEye className="w-3 h-3 mr-1 inline" />
            Xem chi tiết
          </Link>
          {/* Show edit button for pending, scheduled, or rejected items */}
          {(healthCheck.status === "scheduled" ||
            healthCheck.status === "pending" ||
            healthCheck.confirmStatus?.toLowerCase() === "pending" ||
            healthCheck.confirmStatus?.toLowerCase() === "rejected") && (
            <Link
              to={`/nurse/health-services/edit/${
                healthCheck.formId || healthCheck.id
              }`}
              className="text-xs px-3 py-1 border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <FiEdit className="w-3 h-3 mr-1 inline" />
              {healthCheck.confirmStatus?.toLowerCase() === "rejected"
                ? "Chỉnh sửa & Gửi lại"
                : "Sửa"}
            </Link>
          )}
        </div>

        {/* Action buttons based on status */}
        <div className="flex space-x-2">
          {/* Upload results button for approved health checks */}
          {(healthCheck.confirmStatus?.toLowerCase() === "approved" ||
            healthCheck.status === "approved") && (
            <button
              onClick={() => {
                setSelectedHealthCheck(healthCheck);
                setShowUploadModal(true);
              }}
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <FiUpload className="w-3 h-3 mr-1 inline" />
              Upload kết quả
            </button>
          )}
          {/* Show completion button for active health checks */}
          {healthCheck.status === "active" && (
            <button
              onClick={() =>
                handleCompleteHealthCheck(healthCheck.formId || healthCheck.id)
              }
              className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <FiCheckCircle className="w-3 h-3 mr-1 inline" />
              Hoàn thành
            </button>
          )}
          {healthCheck.confirmStatus?.toLowerCase() === "pending" && (
            <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded">
              <FiClock className="w-3 h-3 mr-1 inline" />
              Chờ Quản lý duyệt
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => {
    const emptyStateConfig = {
      pending: {
        icon: FiClock,
        title: "Không có yêu cầu chờ duyệt",
        message:
          "Tất cả yêu cầu khám sức khỏe đã được xử lý hoặc chưa có yêu cầu nào",
      },
      upcoming: {
        icon: FiCalendar,
        title: "Không có khám sức khỏe nào sắp tới",
        message: "Các lịch khám đã được duyệt sẽ xuất hiện ở đây.",
      },
      completed: {
        icon: FiCheckCircle,
        title: "Chưa có khám sức khỏe nào hoàn thành",
        message: "Lịch sử các buổi khám đã hoàn thành sẽ được hiển thị ở đây.",
      },
      rejected: {
        icon: FiX,
        title: "Không có yêu cầu bị từ chối",
        message: "Chưa có yêu cầu khám sức khỏe nào bị từ chối",
      },
    };

    const config = emptyStateConfig[activeTab] || emptyStateConfig.pending;
    const IconComponent = config.icon;

    return (
      <div className="text-center py-12">
        <IconComponent className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {config.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {config.message}
        </p>
        <Link
          to="/nurse/health-services/create/health_check"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <FiActivity className="w-4 h-4 mr-2" />
          Tạo lịch khám mới
        </Link>
      </div>
    );
  };

  // Upload Modal Component
  const UploadModal = () => {
    if (!showUploadModal || !selectedHealthCheck) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Upload kết quả khám sức khỏe
            </h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Lịch khám:</strong> {selectedHealthCheck.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Ngày khám:</strong>{" "}
              {formatDate(selectedHealthCheck.scheduledDate)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <strong>Khối:</strong> {selectedHealthCheck.targetGrades?.join(", ") || "Chưa phân công"}
            </p>
          </div>

          {/* Download Template Button */}
          <div className="mb-4">
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-colors"
            >
              <FiDownload className="w-4 h-4 mr-2" />
              Tải mẫu file Excel
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tải file mẫu chứa danh sách học sinh và kết quả khám (tai, mắt, mũi, họng, chiều cao, cân nặng)
            </p>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn file kết quả khám
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadFile ? (
                  <div className="text-center">
                    <FiFile className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {uploadFile.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click để chọn file hoặc kéo thả file vào đây
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Hỗ trợ file Excel (.xlsx, .xls)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                {uploadError}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={!uploadFile || uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  Đang upload...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {stats.pending}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-orange-500 dark:text-orange-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sẵn sàng
              </p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {stats.ready}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang tiến hành
              </p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.active}
              </p>
            </div>
            <FiPlayCircle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng học sinh
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: "pending", label: "Chờ duyệt", count: stats.pending },
            { id: "upcoming", label: "Sắp tới", count: stats.upcoming },
            { id: "completed", label: "Đã hoàn thành", count: stats.completed },
            { id: "rejected", label: "Đã từ chối", count: stats.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : filteredHealthChecks.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredHealthChecks.map((healthCheck, index) => (
              <div key={healthCheck.id || index}>
                {renderHealthCheckCard(healthCheck)}
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal />
    </div>
  );
};

export default HealthCheckManagement;
