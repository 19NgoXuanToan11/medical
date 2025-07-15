import React, { useState } from "react";
import {
  FiX,
  FiUser,
  FiCalendar,
  FiClock,
  FiTablet,
  FiFileText,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiMapPin,
  FiActivity,
  FiBarChart,
} from "react-icons/fi";
import {
  calculateMedicationProgress,
  formatAdministrationHistory,
  shouldShowReRequestOption,
  getStatusDisplayText,
} from "../utils/requestResultUtils";
import { getVietnameseStatusText } from "../utils/medicationUtils";

const RequestResultDetailModal = ({
  result,
  isOpen,
  onClose,
  onMarkAsAdministered,
  onMarkAsFailed,
  onCreateReRequest,
}) => {
  const [activeSection, setActiveSection] = useState("overview");

  if (!isOpen || !result) return null;

  const progress = calculateMedicationProgress(result);
  const history = formatAdministrationHistory(result);

  const renderProgressSection = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <FiBarChart className="h-5 w-5 mr-2" />
        Tiến độ cấp thuốc
      </h4>

      {result.timesPerDay > 1 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Đã cấp: {progress.completed}/{progress.total} lần
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progress.progress)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                progress.isComplete ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${progress.progress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-gray-700 p-3 rounded">
              <div className="text-gray-500 dark:text-gray-400">Còn lại</div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {progress.remaining} lần
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded">
              <div className="text-gray-500 dark:text-gray-400">Trạng thái</div>
              <div
                className={`font-semibold ${
                  progress.isComplete ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {progress.isComplete ? "Hoàn thành" : "Đang thực hiện"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <FiActivity className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Thuốc chỉ cần cấp một lần
          </p>
        </div>
      )}
    </div>
  );

  const renderStudentInfo = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <FiUser className="h-5 w-5 mr-2" />
        Thông tin học sinh
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Họ tên
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.studentName}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Mã học sinh
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.studentCode}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Lớp
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.className}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Khối
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.gradeLevel || "N/A"}
          </p>
        </div>
        {result.studentGender && (
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Giới tính
            </label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {result.studentGender}
            </p>
          </div>
        )}
        {result.studentDateOfBirth && (
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Ngày sinh
            </label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {new Date(result.studentDateOfBirth).toLocaleDateString("vi-VN")}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderParentInfo = () => (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <FiUser className="h-5 w-5 mr-2" />
        Thông tin phụ huynh
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Họ tên
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.parentName}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Mối quan hệ
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.parentRelationship || "N/A"}
          </p>
        </div>
        {result.parentPhone && (
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Điện thoại
            </label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              <FiPhone className="h-4 w-4 mr-1 inline-block align-text-top" />
              {result.parentPhone}
            </p>
          </div>
        )}
        {result.parentEmail && (
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Email
            </label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              <FiMail className="h-4 w-4 mr-1 inline-block align-text-top" />
              {result.parentEmail}
            </p>
          </div>
        )}
        {/* <div className="md:col-span-2">
          <div className="flex space-x-4">
            {result.isMainContact && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                Liên hệ chính
              </span>
            )}
            {result.isEmergencyContact && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                Liên hệ khẩn cấp
              </span>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );

  const renderMedicationInfo = () => (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <FiTablet className="h-5 w-5 mr-2" />
        Thông tin thuốc
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Tên thuốc
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.medicineName}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Liều lượng
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.dosage}
          </p>
        </div>
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400">
            Tần suất
          </label>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {result.frequency}
          </p>
        </div>
        {result.instructions && (
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500 dark:text-gray-400">
              Hướng dẫn sử dụng
            </label>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {result.instructions}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <FiClock className="h-5 w-5 mr-2" />
        Lịch sử thực hiện
      </h4>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 pb-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  item.type === "administered"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : item.type === "failed"
                    ? "bg-red-100 dark:bg-red-900/30"
                    : "bg-orange-100 dark:bg-orange-900/30"
                }`}
              >
                {item.type === "administered" ? (
                  <FiCheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : item.type === "failed" ? (
                  <FiAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                ) : (
                  <FiRefreshCw className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {item.type === "administered"
                      ? "Đã cấp thuốc"
                      : item.type === "failed"
                      ? "Thất bại"
                      : "Yêu cầu lại"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString("vi-VN")}
                  </p>
                  {item.staff && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Bởi: {item.staff}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {item.notes}
                    </p>
                  )}
                  {item.attempts && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Lần thử thứ {item.attempts}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <FiClock className="h-8 w-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có lịch sử thực hiện
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-600">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chi tiết cấp thuốc
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ID: {result.resultId} | Yêu cầu: {result.requestId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-neutral-700">
          <nav className="px-6 flex space-x-2">
            {[
              { id: "overview", label: "Tổng quan", icon: FiInfo },
              { id: "student", label: "Học sinh", icon: FiUser },
              { id: "medication", label: "Thuốc", icon: FiTablet },
              { id: "history", label: "Lịch sử", icon: FiClock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`relative px-4 py-3 text-sm font-medium transition-all duration-200 rounded-t-lg ${
                  activeSection === tab.id
                    ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm border-t-2 border-blue-500 border-x border-gray-200 dark:border-gray-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-600 rounded-lg"
                }`}
              >
                <tab.icon className="inline h-4 w-4 mr-1" />
                {tab.label}
                {activeSection === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeSection === "overview" && (
            <div className="space-y-6">
              {renderProgressSection()}

              {/* Status and Actions */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Trạng thái hiện tại
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          result.status === "administered"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : result.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                            : result.status === "failed"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200"
                        }`}
                      >
                        {result.status === "administered"
                          ? "Đã cấp thuốc"
                          : result.status === "pending"
                          ? "Chờ cấp thuốc"
                          : result.status === "failed"
                          ? getVietnameseStatusText("failed")
                          : result.status === "refused"
                          ? getVietnameseStatusText("refused")
                          : getVietnameseStatusText(result.status)}
                      </span>
                      {result.isReRequest && (
                        <span className="text-orange-600 dark:text-orange-400 text-sm">
                          (Yêu cầu lại)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {result.status === "pending" && (
                      <>
                        <button
                          onClick={() => onMarkAsAdministered(result)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheckCircle className="h-4 w-4 mr-1" />
                          Đã cấp thuốc
                        </button>
                        <button
                          onClick={() => onMarkAsFailed(result)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiAlertTriangle className="h-4 w-4 mr-1" />
                          Đánh dấu thất bại
                        </button>
                      </>
                    )}

                    {shouldShowReRequestOption(result) && (
                      <button
                        onClick={() => onCreateReRequest(result)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <FiRefreshCw className="h-4 w-4 mr-1" />
                        Tạo yêu cầu lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "student" && (
            <div className="space-y-6">
              {renderStudentInfo()}
              {renderParentInfo()}
            </div>
          )}

          {activeSection === "medication" && (
            <div className="space-y-6">{renderMedicationInfo()}</div>
          )}

          {activeSection === "history" && renderHistory()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestResultDetailModal;
