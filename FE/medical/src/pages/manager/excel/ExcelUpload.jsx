import React, { useState, useRef } from "react";
import {
  FiUpload,
  FiFile,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import ExcelService from "../../../utils/api/excel/excelService";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    success: false,
    error: null,
    result: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus({
        loading: false,
        success: false,
        error: null,
        result: null,
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      setUploadStatus({
        loading: true,
        success: false,
        error: null,
        result: null,
      });
      const result = await ExcelService.importFile(file);

      setUploadStatus({
        loading: false,
        success: true,
        error: null,
        result,
      });
    } catch (error) {
      setUploadStatus({
        loading: false,
        success: false,
        error: error.message,
        result: null,
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus({
      loading: false,
      success: false,
      error: null,
      result: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetUpload = () => {
    removeFile();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {!uploadStatus.success ? (
        <>
          {/* File Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : file
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <FiFile className="h-12 w-12 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiX className="mr-1 h-3 w-3" />
                  Chọn file khác
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <FiUpload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Kéo và thả file Excel vào đây, hoặc{" "}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      chọn file
                    </button>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Chỉ chấp nhận file .xlsx, .xls (tối đa 10MB)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Upload Button */}
          {file && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={uploadStatus.loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploadStatus.loading ? (
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
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2 h-5 w-5" />
                    Tải lên và xử lý
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Success State */
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <FiCheck className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Tải lên thành công!
          </h3>
          <p className="text-gray-600 mb-6">
            File Excel của bạn đã được xử lý thành công.
          </p>

          {/* Upload Results */}
          {uploadStatus.result && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {uploadStatus.result.totalRows || 0}
                  </div>
                  <div className="text-gray-600">Tổng số dòng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {uploadStatus.result.successfullyImported || 0}
                  </div>
                  <div className="text-gray-600">Thành công</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {uploadStatus.result.failedRows || 0}
                  </div>
                  <div className="text-gray-600">Thất bại</div>
                </div>
              </div>

              {uploadStatus.result.errors &&
                uploadStatus.result.errors.length > 0 && (
                  <div className="mt-4 text-left">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Lỗi chi tiết:
                    </h4>
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-xs text-red-700 max-h-32 overflow-y-auto">
                      {uploadStatus.result.errors.map((error, index) => (
                        <div key={index} className="mb-1">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          <button
            onClick={resetUpload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="mr-2 h-4 w-4" />
            Tải lên file khác
          </button>
        </div>
      )}

      {/* Error Display */}
      {uploadStatus.error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{uploadStatus.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
