import React from "react";
import {
  FiUsers,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiBell,
  FiCheckCircle,
} from "react-icons/fi";
import { formatDuration } from "../../utils/healthCheckHelpers";

const BasicInfoHealthStep = ({
  formData,
  validationErrors,
  onInputChange,
  totalStudents,
  sessions,
  resourceReqs,
}) => {
  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Tổng học sinh
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCalendar className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Số buổi khám
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {sessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Nhân viên y tế
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {resourceReqs.staffNeeded}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiClock className="h-8 w-8 text-info-600 dark:text-info-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Thời gian dự kiến
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formatDuration(formData.estimatedDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiInfo className="mr-2" />
            Thông tin cơ bản
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Tên kế hoạch khám sức khỏe *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                validationErrors.title
                  ? "border-error-300 dark:border-error-600"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
              placeholder="VD: Khám sức khỏe định kỳ - Học kỳ I 2024"
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ngày thực hiện *
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => onInputChange("scheduledDate", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.scheduledDate
                    ? "border-error-300 dark:border-error-600"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              />
              {validationErrors.scheduledDate && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {validationErrors.scheduledDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Thời gian bắt đầu *
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => onInputChange("scheduledTime", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.scheduledTime
                    ? "border-error-300 dark:border-error-600"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              />
              {validationErrors.scheduledTime && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {validationErrors.scheduledTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Thời gian kết thúc
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => onInputChange("endTime", e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                readOnly
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Tự động tính toán
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Địa điểm thực hiện *
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => onInputChange("location", e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  validationErrors.location
                    ? "border-error-300 dark:border-error-600"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
                placeholder="VD: Phòng y tế trường, Hội trường A"
              />
            </div>
            {validationErrors.location && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {validationErrors.location}
              </p>
            )}
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                validationErrors.description
                  ? "border-error-300 dark:border-error-600"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
              placeholder="Mô tả chi tiết về kế hoạch khám sức khỏe..."
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                {validationErrors.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoHealthStep;
