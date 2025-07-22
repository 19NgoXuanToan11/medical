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
} from "react-icons/fi";

const HealthIncidentsTab = ({ healthProfile }) => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch health records for student
        // const records = await healthRecordService.getByStudentCode(healthProfile.studentCode);

        // Mock data for now
        const mockRecords = [
          {
            recordId: 1,
            title: "Sự cố y tế - Chấn thương",
            eventType: "injury",
            severity: "severe",
            description:
              "Triệu chứng: Té ngã trong sân trường, đau chân phải\nĐánh giá: Có thể bị bong gân",
            treatment: "Băng bó, chườm lạnh, chuyển viện kiểm tra",
            outcome: "Đã hồi phục hoàn toàn sau 2 tuần",
            eventDate: "2025-07-15T10:30:00",
            createdAt: "2025-07-15T10:45:00",
            createdByStaff: {
              firstName: "Ngô",
              lastName: "Hoàng Tuấn",
            },
            notes: "Học sinh cần theo dõi thêm 1 tuần",
          },
          {
            recordId: 2,
            title: "Sự cố y tế - Dị ứng",
            eventType: "allergy",
            severity: "emergency",
            description:
              "Triệu chứng: Phát ban đỏ toàn thân, khó thở\nĐánh giá: Dị ứng thức ăn nghiêm trọng",
            treatment: "Tiêm thuốc chống dị ứng, gọi cấp cứu",
            outcome: "Đã ổn định, cần tránh các thực phẩm gây dị ứng",
            eventDate: "2025-07-10T14:20:00",
            createdAt: "2025-07-10T14:25:00",
            createdByStaff: {
              firstName: "Nguyễn",
              lastName: "Thị Lan",
            },
            notes: "Cần thông báo cho giáo viên về tình trạng dị ứng",
          },
        ];

        setHealthRecords(mockRecords);
        setError(null);
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthIncidentsTab;
