import React, { useState } from "react";
import axios from "axios";
import {
  FiDownload,
  FiUpload,
  FiAlertCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";

const API_URL = "http://localhost:7111/api";

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [downloadStatus, setDownloadStatus] = useState({
    loading: false,
    error: null,
  });

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset status when new file is selected
      setUploadStatus({
        loading: false,
        success: false,
        error: null,
      });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloadStatus({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/ExcelImport/template`, {
        responseType: "blob",
      });

      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloadStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error downloading template:", error);
      setDownloadStatus({
        loading: false,
        error: "Không thể tải mẫu. Vui lòng thử lại sau.",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        loading: false,
        success: false,
        error: "Vui lòng chọn file trước khi tải lên.",
      });
      return;
    }

    try {
      setUploadStatus({ loading: true, success: false, error: null });

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/ExcelImport/import`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus({
        loading: false,
        success: true,
        error: null,
        data: response.data,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus({
        loading: false,
        success: false,
        error:
          error.response?.data?.message ||
          "Lỗi khi tải lên file. Vui lòng kiểm tra định dạng và thử lại.",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        Nhập dữ liệu từ Excel
      </h2>

      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Bước 1: Tải về mẫu Excel
        </h3>
        <p className="text-gray-600 mb-4">
          Tải về mẫu Excel để đảm bảo dữ liệu của bạn được định dạng chính xác
          trước khi nhập vào hệ thống.
        </p>
        <button
          onClick={handleDownloadTemplate}
          disabled={downloadStatus.loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {downloadStatus.loading ? (
            <>
              <span className="animate-spin mr-2">⌛</span> Đang tải...
            </>
          ) : (
            <>
              <FiDownload className="mr-2" /> Tải mẫu Excel
            </>
          )}
        </button>
        {downloadStatus.error && (
          <div className="mt-2 text-sm text-red-600">
            {downloadStatus.error}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6 mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-3">
          Bước 2: Tải lên file Excel
        </h3>
        <p className="text-gray-600 mb-4">
          Tải lên file Excel đã điền thông tin. Hệ thống sẽ tự động xử lý và cập
          nhật dữ liệu.
        </p>

        <div className="mt-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-2 rounded mb-2 max-w-md overflow-hidden">
                  <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFile(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Chọn file khác
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 0H8m12 0a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Chọn file
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Chỉ chấp nhận file .xlsx, .xls
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || uploadStatus.loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !file || uploadStatus.loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            }`}
          >
            {uploadStatus.loading ? (
              <>
                <span className="animate-spin mr-2">⌛</span> Đang xử lý...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" /> Tải lên và xử lý
              </>
            )}
          </button>
        </div>

        {uploadStatus.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{uploadStatus.error}</span>
            </div>
          </div>
        )}

        {uploadStatus.success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <FiCheck className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-green-700">
                Tải lên thành công! Dữ liệu đã được cập nhật.
              </span>
            </div>
            {uploadStatus.data && (
              <div className="mt-2 text-sm text-gray-700">
                <p>Tổng số mục: {uploadStatus.data.totalItems || 0}</p>
                <p>Thành công: {uploadStatus.data.successCount || 0}</p>
                <p>Lỗi: {uploadStatus.data.errorCount || 0}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <p className="text-sm text-yellow-700">
                <strong>Lưu ý:</strong> Việc nhập dữ liệu sẽ cập nhật hoặc thêm
                mới các mục trong kho thuốc và vật tư y tế. Đảm bảo rằng dữ liệu
                của bạn chính xác trước khi tải lên.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImport;
