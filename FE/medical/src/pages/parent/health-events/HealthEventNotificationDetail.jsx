import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiPackage,
  FiPhone,
  FiMail,
  FiMapPin,
  FiUserCheck,
  FiUsers,
  FiHeart,
  FiTrendingUp,
  FiPackage as FiPill,
  FiShield,
  FiClock as FiTime,
} from "react-icons/fi";
import { useAuth } from "../../../utils/auth/AuthContext";
import useNotificationPolling from "../../../hooks/useNotificationPolling";
import notificationService from "../../../utils/api/notification/notificationService";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateWithContext,
  formatDuration,
  formatRelativeTime,
  formatNotificationTime,
} from "../../../utils/timeUtils";

const HealthEventNotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null); // event detail from additionalData

  // Use notification polling hook to get real data
  const { notifications } = useNotificationPolling(user?.id, 10000);

  useEffect(() => {
    const fetchNotificationDetail = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotificationById(id);
        setNotification(data);
        // Parse additionalData
        let eventData = {};
        if (data.additionalData) {
          try {
            eventData = JSON.parse(data.additionalData);
          } catch (e) {
            eventData = {};
          }
        }
        setEvent({
          ...eventData,
          studentName: data.studentName,
          staffName: data.staffName,
          createdAt: data.createdAt,
          status: data.status,
          message: data.message,
          title: data.title,
        });
      } catch (error) {
        setError("Không thể tải thông tin sự cố y tế");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchNotificationDetail();
    }
  }, [id]);

  const getEventTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "illness":
        return <FiActivity className="h-5 w-5 text-red-600" />;
      case "injury":
        return <FiAlertCircle className="h-5 w-5 text-orange-600" />;
      case "allergy":
        return <FiShield className="h-5 w-5 text-purple-600" />;
      case "chronic":
        return <FiHeart className="h-5 w-5 text-blue-600" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case "illness":
        return "Bệnh tật";
      case "injury":
        return "Chấn thương";
      case "allergy":
        return "Dị ứng";
      case "chronic":
        return "Bệnh mãn tính";
      default:
        return "Khác";
    }
  };

  const getStatusBadge = (treatment) => {
    if (treatment && treatment.trim() !== "") {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
          <FiCheckCircle className="mr-1 h-4 w-4" />
          Đã xử lý
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300">
          <FiClock className="mr-1 h-4 w-4" />
          Đang xử lý
        </span>
      );
    }
  };

  const getSeverityText = (severity) => {
    switch (severity?.toLowerCase()) {
      case "emergency":
        return "Cấp cứu";
      case "severe":
        return "Nặng";
      case "moderate":
        return "Trung bình";
      case "light":
        return "Nhẹ";
      default:
        return "Trung bình";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "urgent":
        return "Khẩn cấp";
      case "high":
        return "Quan trọng";
      case "medium":
        return "Bình thường";
      case "low":
        return "Thấp";
      default:
        return "Bình thường";
    }
  };

  // formatDateTime function is now imported from timeUtils

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div className="flex flex-col items-center justify-center h-64">
            <FiAlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">{error}</p>
            <Link
              to="/parent/health-events"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div className="flex flex-col items-center justify-center h-64">
            <FiFileText className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Không tìm thấy thông báo sự cố y tế
            </p>
            <Link
              to="/parent/health-events"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Link
                to="/parent/health-events"
                className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.title || "Chi tiết sự cố y tế"}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ngày tạo:{" "}
                  {event.EventDate
                    ? formatNotificationTime(event.EventDate)
                    : event.createdAt
                    ? formatNotificationTime(event.createdAt)
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FiActivity className="h-5 w-5 text-red-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {event.EventType
                          ? getEventTypeLabel(event.EventType)
                          : "Sự cố y tế"}
                      </h2>
                    </div>
                  </div>
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                    {event.status === "read" ? (
                      <FiCheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <FiClock className="mr-1 h-4 w-4" />
                    )}{" "}
                    {event.status === "read" ? "Đã đọc" : "Chưa đọc"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Triệu chứng
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.Symptoms || "Không có mô tả"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Xử lý
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.Treatment || "-"}
                    </p>
                  </div>
                </div>
                {event.message && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Nội dung thông báo
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Right Column - Student & Staff Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiUser className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Thông tin học sinh
                  </h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Họ và tên
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.studentName || "-"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Lớp
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.ClassName || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FiUserCheck className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Nhân viên y tế xử lý
                  </h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Họ và tên
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {event.staffName || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getEventTypeLabel(type) {
  switch (type?.toLowerCase()) {
    case "illness":
      return "Bệnh tật";
    case "injury":
      return "Chấn thương";
    case "allergy":
      return "Dị ứng";
    case "chronic":
      return "Bệnh mãn tính";
    default:
      return "Khác";
  }
}

export default HealthEventNotificationDetail;
