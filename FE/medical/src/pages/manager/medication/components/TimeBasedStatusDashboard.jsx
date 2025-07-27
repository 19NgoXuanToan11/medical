import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiPlay,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";

const TimeBasedStatusDashboard = () => {
  const [statusInfo, setStatusInfo] = useState({
    lastUpdateTime: null,
    nextUpdateTime: null,
    affectedRequests: 0,
    failedPeriods: [],
  });
  const [loading, setLoading] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  // Thời gian cập nhật tự động theo Note.txt
  const updateSchedule = [
    { time: "11:15", label: "Sáng (11:15 AM)" },
    { time: "14:15", label: "Trưa (2:15 PM)" },
    { time: "18:15", label: "Chiều (6:15 PM)" },
    { time: "19:00", label: "Tối (7:00 PM)" },
  ];

  // Periods và thời gian theo Note.txt
  const periodTimes = {
    Sáng: { start: "06:00", end: "11:00" },
    Trưa: { start: "11:00", end: "14:00" },
    Chiều: { start: "14:00", end: "18:00" },
  };

  useEffect(() => {
    loadStatusInfo();

    // Set up auto refresh every 15 minutes
    const interval = setInterval(() => {
      if (autoUpdateEnabled) {
        loadStatusInfo();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [autoUpdateEnabled]);

  const loadStatusInfo = async () => {
    setLoading(true);
    try {
      // Lấy thông tin về failed periods và time-based updates
      const response = await medicationService.getTimeBasedStatusInfo();
      if (response.success) {
        setStatusInfo(response.data);
      }
    } catch (error) {
      console.error("Error loading status info:", error);
      // Mock data để demo
      setStatusInfo({
        lastUpdateTime: new Date().toISOString(),
        nextUpdateTime: getNextUpdateTime(),
        affectedRequests: Math.floor(Math.random() * 10),
        failedPeriods: [
          { period: "Sáng", count: 2, lastUpdate: new Date().toISOString() },
          { period: "Trưa", count: 1, lastUpdate: new Date().toISOString() },
        ],
      });
    }
    setLoading(false);
  };

  const getNextUpdateTime = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    for (const schedule of updateSchedule) {
      const [hours, minutes] = schedule.time.split(":").map(Number);
      const scheduleTime = hours * 100 + minutes;

      if (currentTime < scheduleTime) {
        const nextUpdate = new Date();
        nextUpdate.setHours(hours, minutes, 0, 0);
        return nextUpdate.toISOString();
      }
    }

    // Nếu đã qua tất cả lịch hôm nay, lấy lịch đầu tiên ngày mai
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [hours, minutes] = updateSchedule[0].time.split(":").map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);
    return tomorrow.toISOString();
  };

  const getCurrentPeriod = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    if (currentTime >= 600 && currentTime < 1100) return "Sáng";
    if (currentTime >= 1100 && currentTime < 1400) return "Trưa";
    if (currentTime >= 1400 && currentTime < 1800) return "Chiều";
    return "Ngoài giờ";
  };

  const handleManualUpdate = async () => {
    setLoading(true);
    try {
      const response = await medicationService.updateTimeBasedStatus();
      if (response.success) {
        await loadStatusInfo();
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
    setLoading(false);
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString("vi-VN");
    } catch (error) {
      return timestamp;
    }
  };

  const getTimeUntilNext = () => {
    if (!statusInfo.nextUpdateTime) return "";

    const now = new Date();
    const next = new Date(statusInfo.nextUpdateTime);
    const diff = next - now;

    if (diff <= 0) return "Đang cập nhật...";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) return `${hours} giờ ${minutes} phút`;
    return `${minutes} phút`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Cập nhật trạng thái tự động theo thời gian
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Hệ thống tự động cập nhật failed status mỗi 15 phút
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleManualUpdate}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiPlay className="h-4 w-4" />
            <span>Cập nhật ngay</span>
          </button>
          <button
            onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              autoUpdateEnabled
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-gray-100 text-gray-800 border border-gray-200"
            }`}
          >
            <FiRefreshCw
              className={`h-4 w-4 ${autoUpdateEnabled ? "animate-spin" : ""}`}
            />
            <span>{autoUpdateEnabled ? "Tự động ON" : "Tự động OFF"}</span>
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-300">
              Buổi hiện tại
            </h4>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getCurrentPeriod()}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h4 className="font-medium text-green-800 dark:text-green-300">
              Cập nhật cuối
            </h4>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            {formatDateTime(statusInfo.lastUpdateTime)}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiClock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h4 className="font-medium text-orange-800 dark:text-orange-300">
              Cập nhật tiếp
            </h4>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-400">
            {getTimeUntilNext()}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h4 className="font-medium text-red-800 dark:text-red-300">
              Requests bị ảnh hưởng
            </h4>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {statusInfo.affectedRequests}
          </p>
        </div>
      </div>

      {/* Update Schedule */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
          Lịch cập nhật tự động
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {updateSchedule.map((schedule, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
            >
              <div className="text-center">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {schedule.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {schedule.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failed Periods */}
      {statusInfo.failedPeriods && statusInfo.failedPeriods.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">
            Periods đã bị đánh dấu Failed
          </h4>
          <div className="space-y-2">
            {statusInfo.failedPeriods.map((failed, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <span className="font-medium text-red-800 dark:text-red-300">
                      {failed.period}
                    </span>
                    <span className="text-sm text-red-600 dark:text-red-400">
                      ({failed.count} request{failed.count > 1 ? "s" : ""})
                    </span>
                  </div>
                  <span className="text-xs text-red-500 dark:text-red-400">
                    {formatDateTime(failed.lastUpdate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default TimeBasedStatusDashboard;
