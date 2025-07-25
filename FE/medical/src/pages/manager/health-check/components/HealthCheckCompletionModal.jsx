import React, { useState } from "react";
import {
  FiUpload,
  FiX,
  FiFile,
  FiCheck,
  FiAlertCircle,
  FiDownload,
} from "react-icons/fi";
import { uploadHealthCheckResults } from "../../../../utils/api/healthCheck/healthCheckService";

const HealthCheckCompletionModal = ({
  showModal,
  onClose,
  selectedRequest,
  onSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setSuccess(false);

    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedRequest) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadHealthCheckResults(selectedRequest.formId || selectedRequest.id, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess?.(result);
        handleClose();
      }, 1500);

    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Có lỗi xảy ra khi upload file");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    setUploading(false);
    onClose();
  };

  const downloadTemplate = () => {
    // Create a link to download the template
    const link = document.createElement('a');
    link.href = '/templates/health-check-results-template.xlsx'; // You need to add this file to public/templates/
    link.download = 'health-check-results-template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Hoàn thành khám sức khỏe
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedRequest?.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={uploading}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Template Download */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Tải template mẫu
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  Sử dụng file mẫu để nhập kết quả khám
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-2"
              >
                <FiDownload className="h-4 w-4" />
                Tải về
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload file kết quả khám sức khỏe
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Nhấp để chọn file Excel
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Hỗ trợ .xlsx, .xls (tối đa 10MB)
                </span>
              </label>
            </div>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center gap-3">
              <FiFile className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {!uploading && (
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Đang upload...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
              <FiCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Upload thành công! Đang chuyển hướng...
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || success}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang upload...
              </>
            ) : success ? (
              <>
                <FiCheck className="h-4 w-4" />
                Hoàn thành
              </>
            ) : (
              <>
                <FiUpload className="h-4 w-4" />
                Upload kết quả
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckCompletionModal; 