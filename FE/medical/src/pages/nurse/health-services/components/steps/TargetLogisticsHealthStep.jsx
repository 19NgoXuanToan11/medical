import React from "react";
import {
  FiUsers,
  FiCalendar,
  FiClock,
  FiClipboard,
  FiMail,
  FiAlertCircle,
  FiUser,
  FiCheckCircle,
  FiTarget,
  FiInfo,
} from "react-icons/fi";
import { formatDuration } from "../../utils/healthCheckHelpers";

const TargetLogisticsHealthStep = ({
  formData,
  validationErrors,
  onInputChange,
  onGradeSelection,
  totalStudents,
  sessions,
  resourceReqs,
  availableGrades,
}) => {
  return (
    <div className="space-y-8">
      {/* Logistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Tổng số học sinh
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
                Khối lớp đã chọn
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {formData.targetGrades.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUser className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Nhân viên y tế
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {resourceReqs?.staffNeeded ?? 0}
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
                {resourceReqs?.totalTime
                  ? Math.ceil(resourceReqs.totalTime / 60)
                  : 0}
                h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationErrors.targetGrades && (
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 mr-2" />
            <p className="text-sm text-error-600 dark:text-error-400">
              {validationErrors.targetGrades}
            </p>
          </div>
        </div>
      )}

      {/* Target Grade Selection */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiTarget className="mr-2" />
            Chọn khối lớp tham gia
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Chọn một khối lớp sẽ tham gia kế hoạch khám sức khỏe (chỉ được chọn 1 khối)
          </p>
        </div>

        <div className="p-6">
          {!availableGrades || availableGrades.length === 0 ? (
            <div className="text-center py-12">
              <FiInfo className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chưa có dữ liệu khối lớp
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hiện tại chưa có dữ liệu khối lớp nào được tải.
                <br />
                Vui lòng thử lại hoặc liên hệ quản trị viên.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.targetGrades.includes(grade.id)
                        ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800"
                    }`}
                    onClick={() => {
                      // Single selection logic - replace current selection
                      onInputChange("targetGrades", [grade.id]);
                    }}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="gradeSelection"
                        checked={formData.targetGrades.includes(grade.id)}
                        onChange={() => {
                          // Single selection logic - replace current selection
                          onInputChange("targetGrades", [grade.id]);
                        }}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 mt-1 bg-white dark:bg-neutral-900"
                      />
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {grade.name}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                          {grade.studentCount} học sinh
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          Lớp: {grade.classes ? grade.classes.join(", ") : "N/A"}
                        </p>
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        {grade.ageRange}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Selected Grade Summary */}
              {formData.targetGrades.length > 0 && (
                <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                    Khối lớp đã chọn
                  </h4>
                  {formData.targetGrades.map((gradeId) => {
                    const grade = availableGrades.find((g) => g.id === gradeId);
                    return grade ? (
                      <div key={gradeId} className="flex items-center justify-between py-2 px-3 bg-primary-50 dark:bg-primary-900/20 rounded border border-primary-200 dark:border-primary-800">
                        <div>
                          <span className="font-medium text-primary-900 dark:text-primary-200">
                            {grade.name}
                          </span>
                          <span className="text-sm text-primary-700 dark:text-primary-300 ml-2">
                            ({grade.classes ? grade.classes.join(", ") : "N/A"})
                          </span>
                        </div>
                        <span className="text-sm text-primary-600 dark:text-primary-400">
                          {grade.studentCount} học sinh
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Approval Requirements */}
      {formData.requiresApproval && (
        <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
          <div className="px-6 py-4 border-b border-warning-200 dark:border-warning-800">
            <h3 className="text-lg font-medium text-warning-900 dark:text-warning-200 flex items-center">
              <FiClipboard className="mr-2" />
              Yêu cầu phê duyệt
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-start">
              <FiAlertCircle className="flex-shrink-0 h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-warning-800 dark:text-warning-300">
                  Kế hoạch này cần được phê duyệt bởi{" "}
                  <strong>
                    {formData.approvalLevel === "manager"
                      ? "Quản lý"
                      : "Trưởng khoa y tế"}
                  </strong>{" "}
                  do số lượng học sinh lớn.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Settings */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 flex items-center">
            <FiMail className="mr-2" />
            Thông báo và liên lạc
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Thông báo cho phụ huynh
            </label>
            <textarea
              rows={4}
              value={formData.parentNotificationMessage}
              onChange={(e) =>
                onInputChange("parentNotificationMessage", e.target.value)
              }
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              placeholder="Nội dung thông báo gửi đến phụ huynh..."
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Tin nhắn này sẽ được gửi qua SMS/email
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Ghi chú thêm
            </label>
            <textarea
              rows={3}
              value={formData.additionalNotes}
              onChange={(e) => onInputChange("additionalNotes", e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              placeholder="Các ghi chú thêm cho kế hoạch khám sức khỏe..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetLogisticsHealthStep;
