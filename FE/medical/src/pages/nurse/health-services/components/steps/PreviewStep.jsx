import React from "react";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiAlertCircle,
  FiCheckCircle,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const PreviewStep = ({
  formData,
  totalStudents,
  scheduleConflicts,
  availableGrades,
  assignedClasses = [],
}) => {
  const hasHighSeverityConflicts = scheduleConflicts.some(
    (c) => c.severity === "error"
  );
  const hasWarnings = scheduleConflicts.some((c) => c.severity === "warning");

  // Helper function to format datetime
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Chưa đặt";
    const date = new Date(dateTimeString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-8 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <FiCalendar className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
          Thông tin cơ bản
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tiêu đề:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
              {formData.title}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Ngày và giờ thực hiện:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatDateTime(formData.scheduledDateTime)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Địa điểm:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
              {formData.location}
            </span>
          </div>
          {formData.description && (
            <div className="pt-2 border-t border-gray-200 dark:border-neutral-600">
              <span className="text-gray-600 dark:text-gray-400 block mb-1">
                Mô tả:
              </span>
              <span className="text-gray-900 dark:text-gray-100 text-sm">
                {formData.description}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Target Classes - Full Width */}
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <FiShield className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
          Thông tin vắc xin
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Tên vaccine:
            </span>
            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
              {formData.vaccineName || "Chưa chọn"}
            </span>
          </div>
          {formData.vaccineInfo && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Nhà sản xuất:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                  {formData.vaccineInfo.manufacturer || "Chưa xác định"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Liều lượng:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                  {formData.vaccineInfo.dose || "Theo hướng dẫn"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Cách tiêm:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                  {formData.vaccineInfo.administrationMethod || "Tiêm bắp"}
                </span>
              </div>
              {formData.vaccineInfo.batchNumber && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Lô sản xuất:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData.vaccineInfo.batchNumber}
                    </span>
                  </div>
                  {formData.vaccineInfo.expiryDate && (
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Hạn sử dụng:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(
                          formData.vaccineInfo.expiryDate
                        ).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Target Classes */}
      <div className="flex-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-8 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <FiUsers className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
          Lớp học tham gia
        </h3>
        
        {/* Khối lớp tham gia */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Khối lớp tham gia
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.targetGrades.map((gradeId) => {
              const grade = availableGrades.find((g) => g.id === gradeId);
              if (!grade) return null;
              
              // Tính số học sinh cho lớp này từ assignedClasses
              const classesInGrade = assignedClasses?.filter(
                (cls) => `${cls.gradeLevel}` === `${grade.gradeLevel}`
              ) || [];
              const studentCount = classesInGrade.reduce(
                (total, cls) => total + (cls.students?.length || 0),
                0
              );
              
              return (
                <div key={gradeId} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
                        {grade.name}
                      </h5>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {studentCount}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        học sinh
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tổng kết đối tượng khám */}
        <div className="bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Tổng kết đối tượng khám
            </h4>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Xem chi tiết
            </button>
          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalStudents}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Học sinh
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formData.targetGrades.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Lớp học
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Communication Details */}
      {(formData.parentNotificationMessage ||
        formData.teacherInstructions ||
        formData.notes) && (
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Thông tin giao tiếp
          </h3>
          <div className="space-y-4">
            {formData.parentNotificationMessage && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Thông báo phụ huynh:
                </h4>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                  {formData.parentNotificationMessage}
                </p>
              </div>
            )}
            {formData.teacherInstructions && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Hướng dẫn giáo viên:
                </h4>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                  {formData.teacherInstructions}
                </p>
              </div>
            )}
            {formData.notes && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Ghi chú:
                </h4>
                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                  {formData.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approval Requirements */}
      {formData.requiresApproval && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Yêu cầu phê duyệt
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Kế hoạch này cần được phê duyệt bởi{" "}
                <span className="font-medium">
                  {formData.approvalLevel === "manager"
                    ? "Ban Giám hiệu"
                    : "Y tá trưởng"}
                </span>{" "}
                trước khi thực hiện do quy mô lớn.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewStep;
