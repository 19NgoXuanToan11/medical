import React from "react";
import { FiX, FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning", // warning, danger, success, info
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FiAlertTriangle className="w-6 h-6 text-red-600" />,
          confirmClass: "bg-red-600 hover:bg-red-700 text-white",
          bgClass: "bg-red-50 dark:bg-red-900/20",
        };
      case "success":
        return {
          icon: <FiCheckCircle className="w-6 h-6 text-green-600" />,
          confirmClass: "bg-green-600 hover:bg-green-700 text-white",
          bgClass: "bg-green-50 dark:bg-green-900/20",
        };
      case "info":
        return {
          icon: <FiInfo className="w-6 h-6 text-blue-600" />,
          confirmClass: "bg-blue-600 hover:bg-blue-700 text-white",
          bgClass: "bg-blue-50 dark:bg-blue-900/20",
        };
      default: // warning
        return {
          icon: <FiAlertTriangle className="w-6 h-6 text-orange-600" />,
          confirmClass: "bg-orange-600 hover:bg-orange-700 text-white",
          bgClass: "bg-orange-50 dark:bg-orange-900/20",
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${typeStyles.bgClass}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {typeStyles.icon}
              <h3 className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={loading}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${typeStyles.confirmClass}`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
