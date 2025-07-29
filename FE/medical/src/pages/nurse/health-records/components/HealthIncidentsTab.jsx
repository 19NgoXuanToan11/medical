import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiActivity,
  FiHeart,
  FiShield,
  FiUser,
  FiFileText,
  FiEdit,
  FiPlus,
  FiTrendingUp,
} from "react-icons/fi";

import { getCriticalIncidentsByStudent } from "../../../../utils/api/health-events/healthEventService";
import { formatNotificationTime } from "../../../../utils/timeUtils";
import FollowUpTimeline from "../../../../components/health-events/FollowUpTimeline";

const HealthIncidentsTab = ({
  healthProfile,
  criticalIncidents = [],
  loadingIncidents = false,
}) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setLoading(true);
        // Fetch critical incidents from API
        const result = await getCriticalIncidentsByStudent(
          healthProfile.studentCode
        );
        if (result.success) {
          // Transform API data to match the expected format
          const transformedRecords = result.data.incidents.map(
            (incident, index) => ({
              recordId: incident.incidentId,
              title: `Sự cố y tế - ${getSeverityLabel(incident.severityLevel)}`,
              eventType: getEventTypeFromSeverity(incident.severityLevel),
              severity: incident.severityLevel,
              description: incident.description,
              treatment: incident.actionsTaken || "Chưa có thông tin",
              outcome: "Đang theo dõi",
              eventDate: incident.timestamp,
              createdAt: incident.timestamp,
              createdByStaff: {
                firstName: incident.handledBy?.split(" ")[0] || "Chưa",
                lastName:
                  incident.handledBy?.split(" ").slice(1).join(" ") ||
                  "xác định",
              },
              notes: incident.notifiedParent
                ? "Đã thông báo phụ huynh"
                : "Chưa thông báo phụ huynh",
            })
          );
          setHealthRecords(transformedRecords);
        } else {
          console.error("Error fetching critical incidents:", result.error);
          setError("Không thể tải dữ liệu sự cố y tế");
        }
      } catch (err) {
        console.error("Error fetching health records:", err);
        setError("Không thể tải dữ liệu sự cố y tế");
      } finally {
        setLoading(false);
      }
    };

    if (healthProfile?.studentCode) {
      fetchHealthRecords();
    }
  }, [healthProfile]);

  const getSeverityLabel = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "emergency":
        return "Cấp cứu";
      case "severe":
        return "Nặng";
      case "moderate":
        return "Trung bình";
      case "light":
        return "Nhẹ";
      default:
        return severityLevel || "Không xác định";
    }
  };

  const getEventTypeFromSeverity = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case "emergency":
        return "emergency";
      case "severe":
        return "injury";
      case "moderate":
        return "illness";
      case "light":
        return "illness";
      default:
        return "other";
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

  const getEventTypeIcon = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "illness":
        return <FiActivity className="h-5 w-5 text-red-600" />;
      case "injury":
        return <FiAlertTriangle className="h-5 w-5 text-orange-600" />;
      case "allergy":
        return <FiShield className="h-5 w-5 text-purple-600" />;
      case "chronic":
        return <FiHeart className="h-5 w-5 text-blue-600" />;
      default:
        return <FiActivity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case "emergency":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Cấp cứu
          </span>
        );
      case "severe":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
            Nặng
          </span>
        );
      case "moderate":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Trung bình
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Nhẹ
          </span>
        );
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Không xác định";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <FiAlertTriangle className="mx-auto h-12 w-12 text-red-600 dark:text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
          Lỗi tải dữ liệu
        </h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Sự cố y tế nghiêm trọng
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các sự cố y tế mức độ nặng và cấp cứu đã được lưu vào hồ
            sơ sức khỏe
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tổng cộng: {healthRecords.length} sự cố
        </div>
      </div>

      {healthRecords.length === 0 ? (
        <div className="text-center py-12">
          <FiHeart className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không có sự cố y tế nghiêm trọng
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Học sinh chưa có sự cố y tế nào ở mức độ nặng hoặc cấp cứu được ghi
            nhận.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {healthRecords.map((record) => (
            <div
              key={record.recordId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getEventTypeIcon(record.eventType)}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {record.title}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getEventTypeLabel(record.eventType)}
                        </span>
                        {getSeverityBadge(record.severity)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 mr-1" />
                      {formatDateTime(record.eventDate)}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Mô tả sự cố:
                    </h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {record.description}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Điều trị:
                    </h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {record.treatment || "Chưa có thông tin điều trị"}
                    </div>
                  </div>
                </div>

                {record.outcome && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Kết quả:
                    </h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {record.outcome}
                    </div>
                  </div>
                )}

                {record.notes && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                      Ghi chú:
                    </h5>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {record.notes}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiUser className="h-3 w-3 mr-1" />
                      Tạo bởi: {record.createdByStaff?.firstName}{" "}
                      {record.createdByStaff?.lastName}
                    </div>
                    <div>Ngày tạo: {formatDateTime(record.createdAt)}</div>
                  </div>
                </div>

                {/* Follow-up Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-3">
                    <FiTrendingUp className="h-4 w-4 text-green-600" />
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Lịch sử cập nhật tình trạng:
                    </h5>
                  </div>
                  <FollowUpTimeline eventId={record.recordId} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthIncidentsTab;
