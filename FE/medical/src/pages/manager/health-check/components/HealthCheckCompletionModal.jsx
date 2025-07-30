import React, { useState } from "react";
import {
  FiEye,
  FiX,
  FiDownload,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const HealthCheckCompletionModal = ({
  showModal,
  onClose,
  selectedRequest,
  onSuccess,
}) => {
  const [error, setError] = useState(null);

  const handleClose = () => {
    setError(null);
    onClose();
  };

  const viewResults = () => {
    // Navigate to results view page for this health check
    console.log("Viewing results for health check:", selectedRequest?.formId || selectedRequest?.id);
    // TODO: Implement navigation to results view
  };

  // NOTE: Download template functionality removed from Manager
  // Only nurses should be able to download and use templates for uploading results

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Chi tiết khám sức khỏe
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedRequest?.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Health Check Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ngày khám:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedRequest?.scheduledDate ? new Date(selectedRequest.scheduledDate).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Trạng thái:</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  selectedRequest?.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : selectedRequest?.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {selectedRequest?.status === 'completed' ? 'Hoàn thành' : 
                   selectedRequest?.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ xử lý'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng học sinh:</span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {selectedRequest?.totalStudents || 0} học sinh
                </span>
              </div>
            </div>
          </div>

          {/* Manager Notice */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Quản lý chỉ được xem kết quả
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Việc upload kết quả khám sức khỏe chỉ được thực hiện bởi y tá. 
                  Quản lý có thể xem và theo dõi tiến độ.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Đóng
          </button>
          <button
            onClick={viewResults}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <FiEye className="h-4 w-4" />
            Xem kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckCompletionModal; 