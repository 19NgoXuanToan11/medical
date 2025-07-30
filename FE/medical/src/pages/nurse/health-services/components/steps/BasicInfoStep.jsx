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

  // Get minimum date (3 days from now)
  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3); // 3 days from today
    return minDate.toISOString().split("T")[0];
  };

  // Time slots configuration
  const timeSlots = [
    { value: "08:00", label: "Sáng (8:00 - 11:00)", period: "morning" },
    { value: "14:00", label: "Chiều (14:00 - 16:00)", period: "afternoon" },
  ];

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    onInputChange("scheduledDate", selectedDate);

    // Update scheduledDateTime if both date and time are selected
    if (selectedDate && formData.scheduledTime) {
      const dateTime = `${selectedDate}T${formData.scheduledTime}:00`;
      onInputChange("scheduledDateTime", dateTime);
    }
  };

  // Handle time change
  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    onInputChange("scheduledTime", selectedTime);

    // Update scheduledDateTime if both date and time are selected
    if (formData.scheduledDate && selectedTime) {
      const dateTime = `${formData.scheduledDate}T${selectedTime}:00`;
      onInputChange("scheduledDateTime", dateTime);
    }
  };

  // Extract date and time from scheduledDateTime for display
  const getDisplayDate = () => {
    if (formData.scheduledDateTime) {
      return formData.scheduledDateTime.split("T")[0];
    }
    return formData.scheduledDate || "";
  };

  const getDisplayTime = () => {
    if (formData.scheduledDateTime) {
      const time = formData.scheduledDateTime.split("T")[1]?.substring(0, 5);
      return time;
    }
    return formData.scheduledTime || "";
  };

  return (
    <div className="space-y-6">
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

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Địa điểm thực hiện *
            </label>
            <input
              type="text"
              value={formData.location || "Phòng y tế trường"}
              onChange={(e) => onInputChange("location", e.target.value)}
              placeholder="Phòng y tế trường"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                validationErrors.location
                  ? "border-red-500"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
              readOnly
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Địa điểm mặc định cho tất cả các buổi tiêm chủng
            </p>
            {validationErrors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {validationErrors.location}
              </p>
            )}
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ngày thực hiện *
              </label>
              <input
                type="date"
                value={getDisplayDate()}
                onChange={handleDateChange}
                min={getMinDate()}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                  validationErrors.scheduledDateTime ||
                  validationErrors.scheduledDate
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Thời gian thực hiện *
              </label>
              <select
                value={getDisplayTime()}
                onChange={handleTimeChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${
                  validationErrors.scheduledDateTime ||
                  validationErrors.scheduledTime
                    ? "border-red-500"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              >
                <option value="">Chọn thời gian</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Error Messages */}
          {(validationErrors.scheduledDateTime ||
            validationErrors.scheduledDate ||
            validationErrors.scheduledTime) && (
            <div className="mt-2">
              <p className="text-sm text-red-600 dark:text-red-400">
                {validationErrors.scheduledDateTime ||
                  validationErrors.scheduledDate ||
                  validationErrors.scheduledTime}
              </p>
            </div>
          )}

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
