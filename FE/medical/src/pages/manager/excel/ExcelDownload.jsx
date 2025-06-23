import React, { useState } from "react";
import { FiDownload, FiFileText, FiAlertCircle } from "react-icons/fi";
import ExcelService from "../../../utils/api/excel/excelService";

const ExcelDownload = () => {
  const [downloadStatus, setDownloadStatus] = useState({
    loading: false,
    error: null,
  });

  const handleDownloadTemplate = async () => {
    try {
      setDownloadStatus({ loading: true, error: null });
      await ExcelService.downloadTemplate();
      setDownloadStatus({ loading: false, error: null });
    } catch (error) {
      setDownloadStatus({
        loading: false,
        error: error.message,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
          <FiFileText className="h-8 w-8 text-blue-600" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Mẫu Excel cho nhập dữ liệu học sinh
        </h3>

        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          File Excel này chứa định dạng chuẩn và hướng dẫn để bạn có thể nhập
          thông tin học sinh một cách chính xác.
        </p>

        <button
          onClick={handleDownloadTemplate}
          disabled={downloadStatus.loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {downloadStatus.loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang tải xuống...
            </>
          ) : (
            <>
              <FiDownload className="mr-2 h-5 w-5" />
              Tải mẫu Excel
            </>
          )}
        </button>

        {downloadStatus.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{downloadStatus.error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelDownload;
