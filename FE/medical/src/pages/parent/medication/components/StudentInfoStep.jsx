import React from "react";
import NurseAssignmentInfo from "../../../../components/common/NurseAssignmentInfo";

const StudentInfoStep = ({
  formData,
  handleInputChange,
  students,
  loadingStudents,
  isValidDate,
  isPastDate,
  isStep1Valid,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="studentCode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Chọn học sinh{" "}
            <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          {loadingStudents ? (
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              Đang tải danh sách học sinh...
            </div>
          ) : students.length === 0 ? (
            <div className="w-full px-4 py-2 border border-orange-300 dark:border-orange-600 rounded-md bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
              Không có học sinh nào được liên kết với tài khoản này. Vui lòng
              liên hệ nhà trường để cập nhật thông tin.
            </div>
          ) : (
            <div>
              <select
                id="studentCode"
                name="studentCode"
                value={formData.studentCode}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                  !formData.studentCode
                    ? "border-red-400 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">-- Chọn học sinh --</option>
                {students.map((student) => (
                  <option key={student.studentCode} value={student.studentCode}>
                    {student.studentCode} - {student.firstName}{" "}
                    {student.lastName}
                  </option>
                ))}
              </select>
              {!formData.studentCode && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                  Vui lòng chọn học sinh
                </p>
              )}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Lớp <span className="text-red-500 dark:text-red-400">*</span>
          </label>
          <input
            type="text"
            id="className"
            name="className"
            value={formData.className}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            placeholder="Lớp sẽ tự động điền khi chọn học sinh"
          />
        </div>
      </div>

      {/* Show nurse assignment info when student is selected */}
      {formData.studentCode && formData.className && (
        <div className="mt-6">
          <NurseAssignmentInfo
            studentCode={formData.studentCode}
            className={formData.className}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Ngày học sinh sẽ uống thuốc{" "}
          <span className="text-red-500 dark:text-red-400">*</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            (Định dạng: năm/tháng/ngày - ví dụ: 2024/12/25)
          </span>
        </label>
        <input
          type="text"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
            !formData.date ||
            !isValidDate(formData.date) ||
            isPastDate(formData.date)
              ? "border-red-400 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="2024/12/25"
        />
        {formData.date && !isValidDate(formData.date) && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng
            năm/tháng/ngày
          </p>
        )}
        {formData.date &&
          isValidDate(formData.date) &&
          isPastDate(formData.date) && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              Không thể chọn ngày trong quá khứ
            </p>
          )}
        {!formData.date && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            Vui lòng nhập ngày học sinh sẽ uống thuốc
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentInfoStep;
