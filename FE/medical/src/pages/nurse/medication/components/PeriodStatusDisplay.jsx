import React from "react";
import {
  FiCheck,
  FiX,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";

const PeriodStatusDisplay = ({ medicineRequestItem }) => {
  // Parse PeriodVerificationStatus từ JSON
  const parsePeriodStatus = (periodVerificationStatus) => {
    if (!periodVerificationStatus) return {};

    try {
      // Xử lý nếu là string JSON
      if (typeof periodVerificationStatus === "string") {
        return JSON.parse(periodVerificationStatus);
      }

      // Xử lý nếu đã là object
      if (typeof periodVerificationStatus === "object") {
        return periodVerificationStatus;
      }

      return {};
    } catch (error) {
      console.error("Error parsing PeriodVerificationStatus:", error);
      return {};
    }
  };

  const periodStatuses = parsePeriodStatus(
    medicineRequestItem.periodVerificationStatus
  );
  const availablePeriods = ["Sáng", "Trưa", "Chiều"];

  // Mapping status colors và icons
  const getStatusConfig = (status) => {
    const statusMap = {
      Pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: FiClock,
        text: "Chờ xử lý",
      },
      Verified: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheck,
        text: "Đã xác thực",
      },
      Refused: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FiX,
        text: "Đã từ chối",
      },
      Assigned: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: FiCheck,
        text: "Đã phân công",
      },
      Completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: FiCheck,
        text: "Hoàn thành",
      },
      Failed: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: FiAlertTriangle,
        text: "Thất bại",
      },
      Redo: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: FiRefreshCw,
        text: "Làm lại",
      },
    };

    return (
      statusMap[status] || {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: FiClock,
        text: status || "Không xác định",
      }
    );
  };

  // Lấy status cuối cùng của period
  const getLatestStatus = (periodData) => {
    if (!periodData) return null;

    // Nếu periodData là array, lấy item cuối cùng
    if (Array.isArray(periodData)) {
      return periodData[periodData.length - 1];
    }

    // Nếu là object, return trực tiếp
    return periodData;
  };

  // Format thời gian
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleString("vi-VN");
    } catch (error) {
      return timestamp;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
        Trạng thái theo từng buổi
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availablePeriods.map((period) => {
          const periodData = periodStatuses[period];
          const latestStatus = getLatestStatus(periodData);
          const statusConfig = getStatusConfig(latestStatus?.Status);
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={period}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700 dark:text-gray-300">
                  {period}
                </h5>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}
                >
                  <div className="flex items-center space-x-1">
                    <StatusIcon className="h-3 w-3" />
                    <span>{statusConfig.text}</span>
                  </div>
                </div>
              </div>

              {latestStatus && (
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  {latestStatus.StaffId && (
                    <p>
                      <strong>Nurse ID:</strong> {latestStatus.StaffId}
                    </p>
                  )}
                  {latestStatus.Timestamp && (
                    <p>
                      <strong>Thời gian:</strong>{" "}
                      {formatDateTime(latestStatus.Timestamp)}
                    </p>
                  )}
                  {latestStatus.Reason && (
                    <p>
                      <strong>Lý do:</strong> {latestStatus.Reason}
                    </p>
                  )}
                </div>
              )}

              {!periodData && (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Chưa có dữ liệu
                </p>
              )}

              {/* Hiển thị lịch sử nếu có multiple statuses */}
              {Array.isArray(periodData) && periodData.length > 1 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Lịch sử ({periodData.length} thay đổi):
                  </p>
                  <div className="max-h-20 overflow-y-auto space-y-1">
                    {periodData.slice(0, -1).map((status, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-400 dark:text-gray-500"
                      >
                        {status.Status} - {formatDateTime(status.Timestamp)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeriodStatusDisplay;
