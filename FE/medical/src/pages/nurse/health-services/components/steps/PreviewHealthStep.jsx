import React from "react";
import {
  FiUsers,
  FiCalendar,
  FiClock,
  FiTool,
  FiClipboard,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";
import { formatDuration } from "../../utils/healthCheckHelpers";

const PreviewHealthStep = ({
  formData,
  totalStudents,
  sessions,
  scheduleConflicts,
  availableGrades,
  healthCheckItems,
}) => {
  const selectedGrades = availableGrades.filter((grade) =>
    formData.targetGrades.includes(grade.id)
  );

  const selectedHealthItems = healthCheckItems.filter((item) =>
    formData.checkItems.includes(item.id)
  );

  const criticalConflicts = scheduleConflicts.filter(
    (c) => c.severity === "error"
  );
  const warningConflicts = scheduleConflicts.filter(
    (c) => c.severity === "warning"
  );

  const getCategoryName = (category) => {
    const names = {
      physical: "Khám thể lực",
      vision: "Khám mắt",
      cardiovascular: "Khám tim mạch",
      growth: "Đo tăng trưởng",
      general: "Khám tổng quát",
    };
    return names[category] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiCheckCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100">
              Xem trước kế hoạch khám sức khỏe
            </h2>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              Kiểm tra lại thông tin trước khi tạo kế hoạch
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiInfo className="mr-2" />
            Thông tin cơ bản
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Tiêu đề
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {formData.title}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Ngày thực hiện
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {new Date(formData.date).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Thời gian
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {formData.time}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Địa điểm
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {formData.location}
              </p>
            </div>
          </div>
          {formData.description && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Mô tả
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                {formData.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Health Check Items */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiClipboard className="mr-2" />
            Hạng mục khám ({selectedHealthItems.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedHealthItems.map((item) => (
              <div
                key={item.id}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                        <FiClock className="w-3 h-3 mr-1" />
                        {item.estimatedTime} phút
                      </div>
                      <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                        <FiTool className="w-3 h-3 mr-1" />
                        {item.equipment?.length || 0} thiết bị
                      </div>
                    </div>
                  </div>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      item.category === "physical"
                        ? "bg-info-100 dark:bg-info-900/20 text-info-800 dark:text-info-300"
                        : item.category === "sensory"
                        ? "bg-success-100 dark:bg-success-900/20 text-success-800 dark:text-success-300"
                        : item.category === "cardiovascular"
                        ? "bg-error-100 dark:bg-error-900/20 text-error-800 dark:text-error-300"
                        : item.category === "oral"
                        ? "bg-warning-100 dark:bg-warning-900/20 text-warning-800 dark:text-warning-300"
                        : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300"
                    }`}
                  >
                    {getCategoryName(item.category)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Grades */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiUsers className="mr-2" />
            Khối lớp tham gia ({selectedGrades.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedGrades.map((grade) => (
              <div
                key={grade.id}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-700"
              >
                <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Lớp {grade.name}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {grade.studentCount} học sinh
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewHealthStep;
