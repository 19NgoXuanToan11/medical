import React from "react";
import { FiUsers, FiCalendar, FiMapPin, FiClock } from "react-icons/fi";

const BasicInfoStep = ({
  formData,
  validationErrors,
  onInputChange,
  totalStudents = 0,
}) => {
  // Helper function to format datetime for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "--";
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to validate work hours (7:00 - 17:00)
  const validateWorkHours = (dateTimeString) => {
    if (!dateTimeString) return true;
    const date = new Date(dateTimeString);
    const hour = date.getHours();
    return hour >= 7 && hour <= 17;
  };

  // Get current date and time for min attribute
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  // Helper function to get max time for the selected date
  const getMaxTimeForDate = (dateTimeString) => {
    if (!dateTimeString) return null;
    const selectedDate = new Date(dateTimeString);
    const maxDate = new Date(selectedDate);
    maxDate.setHours(17, 0, 0, 0); // Set to 5:00 PM
    return maxDate.toISOString().slice(0, 16);
  };

  // Helper function to get min time for the selected date
  const getMinTimeForDate = (dateTimeString) => {
    if (!dateTimeString) return minDateTime;
    const selectedDate = new Date(dateTimeString);
    const today = new Date();

    // If it's today, use current time or 7 AM, whichever is later
    if (selectedDate.toDateString() === today.toDateString()) {
      const minTime = new Date(
        Math.max(today, new Date(selectedDate.setHours(7, 0, 0, 0)))
      );
      return minTime.toISOString().slice(0, 16);
    } else {
      // For future dates, start from 7 AM
      const minTime = new Date(selectedDate);
      minTime.setHours(7, 0, 0, 0);
      return minTime.toISOString().slice(0, 16);
    }
  };

  // Handle datetime change with work hours validation
  const handleDateTimeChange = (e) => {
    const dateTimeValue = e.target.value;

    if (dateTimeValue) {
      const selectedDate = new Date(dateTimeValue);
      const hour = selectedDate.getHours();

      // Automatically adjust time if outside work hours
      if (hour < 7) {
        selectedDate.setHours(7, 0, 0, 0);
        const adjustedValue = selectedDate.toISOString().slice(0, 16);
        onInputChange("scheduledDateTime", adjustedValue);
        return;
      } else if (hour > 17) {
        selectedDate.setHours(17, 0, 0, 0);
        const adjustedValue = selectedDate.toISOString().slice(0, 16);
        onInputChange("scheduledDateTime", adjustedValue);
        return;
      }
    }

    onInputChange("scheduledDateTime", dateTimeValue);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiCalendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Ngày & Giờ
              </p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formatDateTime(formData.scheduledDateTime)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiMapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Địa điểm
              </p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {formData.location || "--"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <FiClock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Trạng thái
              </p>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formData.scheduledDateTime &&
                validateWorkHours(formData.scheduledDateTime)
                  ? "Hợp lệ"
                  : "Chưa đặt"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-6">
          Thông tin cơ bản của kế hoạch tiêm chủng
        </h3>

        <div className="space-y-6">
          {/* Title - Full Width */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Tiêu đề kế hoạch *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              placeholder="Vd: Tiêm chủng phòng chống COVID-19 học kỳ I"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                validationErrors.title
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Location and DateTime Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Địa điểm thực hiện *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                placeholder="Vd: Phòng y tế trường, Hội trường, Sân trường..."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                  validationErrors.location
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              />
              {validationErrors.location && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.location}
                </p>
              )}
            </div>

            {/* DateTime - Takes remaining space */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ngày và giờ thực hiện *
                <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                  (7:00 - 17:00)
                </span>
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDateTime}
                onChange={handleDateTimeChange}
                min={
                  formData.scheduledDateTime
                    ? getMinTimeForDate(formData.scheduledDateTime)
                    : minDateTime
                }
                max={
                  formData.scheduledDateTime
                    ? getMaxTimeForDate(formData.scheduledDateTime)
                    : undefined
                }
                step="300" // 5-minute intervals
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                  validationErrors.scheduledDateTime
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              />
              {formData.scheduledDateTime &&
                !validateWorkHours(formData.scheduledDateTime) && (
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ Nên chọn thời gian trong giờ hành chính (7:00 - 17:00)
                  </p>
                )}
              {validationErrors.scheduledDateTime && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationErrors.scheduledDateTime}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Chỉ cho phép chọn thời gian từ 7:00 sáng đến 17:00 chiều
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Mô tả thêm
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Mô tả chi tiết về kế hoạch tiêm chủng, mục đích, yêu cầu đặc biệt..."
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;
