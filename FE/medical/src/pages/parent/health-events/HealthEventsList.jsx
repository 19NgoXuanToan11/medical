import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaSyringe,
  FaStethoscope,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useAuth } from "../../../utils/auth/AuthContext";
import useNotificationPolling from "../../../hooks/useNotificationPolling";

const HealthEventsList = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("health_events");

  // Use notification polling hook to get real data
  const { notifications, loading, error, markAsRead, refreshNotifications } =
    useNotificationPolling(user?.id, 10000);

  // Filter notifications to get only health events
  const healthEventNotifications = notifications.filter(
    (notification) => notification.type === "health_event"
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Không xác định";
      }
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Không xác định";
      }
      return format(date, "HH:mm", { locale: vi });
    } catch (error) {
      return "Không xác định";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "emergency":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "severe":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300";
      case "moderate":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "light":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
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

  const parseAdditionalData = (additionalDataString) => {
    try {
      if (!additionalDataString) return null;
      return JSON.parse(additionalDataString);
    } catch (error) {
      console.warn("Error parsing additional data:", error);
      return null;
    }
  };

  const getEventTypeLabel = (eventType) => {
    switch (eventType?.toLowerCase()) {
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

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const renderHealthEventCard = (notification) => {
    const additionalData = parseAdditionalData(notification.additionalData);
    const isUnread = !notification.isRead;

    // Use EventDate from additionalData if available, otherwise fall back to createdAt
    const eventDateTime = additionalData?.EventDate || notification.createdAt;

    // Use Severity from additionalData if available, otherwise fall back to priority
    const severityToShow = additionalData?.Severity || notification.priority;

    return (
      <div
        key={notification.notificationId}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 ${
          isUnread ? "border-l-4 border-l-red-500 dark:border-l-red-400" : ""
        }`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  additionalData?.Severity
                    ? getSeverityColor(additionalData.Severity)
                    : getPriorityColor(notification.priority)
                }`}
              >
                {additionalData?.Severity
                  ? getSeverityText(additionalData.Severity)
                  : getPriorityText(notification.priority)}
              </span>
              {isUnread && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Mới
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaCalendarAlt className="mr-2 text-red-500 dark:text-red-400" />
              {formatDate(eventDateTime)}
            </div>
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              <FaClock className="mr-2 text-red-500 dark:text-red-400" />
              {formatTime(eventDateTime)}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {notification.message}
          </p>

          {notification.studentName && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Học sinh:
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {notification.studentName}
              </p>
            </div>
          )}

          {additionalData && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                Chi tiết sự cố:
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {additionalData.EventType && (
                  <p>
                    <strong>Loại sự cố:</strong>{" "}
                    {getEventTypeLabel(additionalData.EventType)}
                  </p>
                )}
                {additionalData.Symptoms && (
                  <p>
                    <strong>Triệu chứng:</strong> {additionalData.Symptoms}
                  </p>
                )}
                {additionalData.Treatment && (
                  <p>
                    <strong>Xử lý:</strong> {additionalData.Treatment}
                  </p>
                )}
                {additionalData.ClassName && (
                  <p>
                    <strong>Lớp:</strong> {additionalData.ClassName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <div className="text-red-600 dark:text-red-400 mb-2">
              <FaExclamationTriangle className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={refreshNotifications}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sự cố y tế
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Thông tin về các sự cố y tế của con bạn tại trường
          </p>
        </div>

        {/* Health Events List */}
        <div className="space-y-4">
          {healthEventNotifications.length === 0 ? (
            <div className="text-center py-8">
              <FaExclamationTriangle className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Không có sự cố y tế nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Hiện tại chưa có sự cố y tế nào được ghi nhận cho con bạn.
              </p>
            </div>
          ) : (
            healthEventNotifications.map((notification) =>
              renderHealthEventCard(notification)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthEventsList;
