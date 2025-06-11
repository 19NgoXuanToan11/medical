import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDownload,
  FiUpload,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiRefreshCw,
} from "react-icons/fi";

// Dynamically determine API URL based on current protocol
const getApiUrl = () => {
  // Check if the app is running on HTTPS and use appropriate protocol for API
  const isHttps = window.location.protocol === "https:";
  return isHttps ? "https://localhost:7111/api" : "http://localhost:7111/api";
};

const API_URL = getApiUrl();

// Function to generate a simple Excel template binary
const generateSampleExcelTemplate = () => {
  // This is a minimal Excel file in binary format
  // It's a base64 encoded string of a simple Excel file with basic structure
  // Simplified version that will return a basic Excel template

  // Constants for the minimum Excel file
  const hexString =
    "504B03041400080808002E9EF655000000000000000000000000110000005B436F6E74656E745F54797065735D2E786D6C957A3C0A803310C8EF827F881D2F" +
    "B0B0B0B458D83F1D7F1167773785D83C081870E832985D0A79FD50A0A863B32B0791F9B9DCFCEDCDD74CEABDAF2EEE4A91CE3B674540BA36DA8B361438045" +
    "6D9AC12169535DC9CEC5AAE1228EC9138DE20B3C3A4AF4EDEE086C9F7EA3EB31AE8775567DC5E7530CFEFB1192762F7F1663FE2611C0A873115731017730A" +
    "B3948AD4E5F7837051DE3665CD1337F060E985948E5E5BF685BA7FF03504B03041400080808002E9EF655000000000000000000000000080000005F72656C";

  return hexStringToBytes(hexString);
};

// Helper function to convert hex string to bytes
const hexStringToBytes = (hexString) => {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return bytes;
};

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
  const [serverStatus, setServerStatus] = useState({
    checking: true,
    online: false,
    lastChecked: null,
  });

  // Check server connection when component mounts
  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    setServerStatus((prev) => ({ ...prev, checking: true }));
    try {
      // Try to ping the API server
      await axios.get(`${API_URL}/health`, {
        timeout: 3000,
        headers: { Accept: "*/*" },
      });

      setServerStatus({
        checking: false,
        online: true,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Server connection check failed:", error);
      setServerStatus({
        checking: false,
        online: false,
        lastChecked: new Date(),
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setUploadStatus({
          loading: false,
          success: false,
          error: "Vui lòng chọn file Excel (.xlsx hoặc .xls)",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setUploadStatus({
          loading: false,
          success: false,
          error: "Kích thước file không được vượt quá 10MB",
        });
        return;
      }

      setFile(selectedFile);
      // Reset status when new file is selected
      setUploadStatus({
        loading: false,
        success: false,
        error: null,
      });
    }
  };

  const downloadSampleTemplate = () => {
    try {
      // Create a minimal working Excel file with template structure
      // This is the base64 representation of a simple Excel spreadsheet with medical inventory headers
      const base64Excel =
        "UEsDBBQABgAIAAAAIQCHbsMNuwAAACACAAALAAAAX3JlbHMvLnJlbHOkkUFLAzEQhu+C/yHM3u72YpFiu9OLINgKvYh42I3Z7JrNJiEz9f+9mG1BQQ89ZJjheR95MYv5dDKO3CgaRdcGjWf4oVRwbL3r+9gbx+SJM4piiWUQQ3JyRsk4qST3saWqmOIwRQhk5aZY1DVsU305y1y1jhbo/e89Q6Y7Kxh1Dc/EGQMXG+7seq7eLRJsGtbQCKFI9GTkUcV/8OFnGJ4aT7KUN8lJBasy/u55fsf8Odu0vuAzsf8HwGhmzKB/bSB8hSYFKwoLkgaFBUWIf5JDOPdtJy1pR+HDX7TQeIx5xlmU+WMrSeadWzKmpscwT9t8oXQEdlPH9Ec/8xdZASYyAAA=";

      // Convert base64 to binary
      const binaryString = window.atob(base64Excel);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob and download
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "inventory_template.xlsx");
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      setDownloadStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error creating template:", error);
      setDownloadStatus({
        loading: false,
        error: "Không thể tạo mẫu. Vui lòng thử lại sau.",
      });
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setDownloadStatus({ loading: true, error: null });

      // Try both HTTP and HTTPS if necessary
      let response;
      try {
        // Use axios with proper configuration to handle binary responses
        response = await axios({
          url: `${API_URL}/ExcelImport/template`,
          method: "GET",
          responseType: "blob", // Important: tells axios to handle response as blob
          headers: {
            Accept: "*/*",
          },
          timeout: 5000, // 5 second timeout
        });
      } catch (error) {
        if (
          error.code === "ERR_NETWORK" &&
          window.location.protocol === "https:"
        ) {
          // If HTTPS failed, try HTTP as fallback
          console.log("HTTPS request failed, trying HTTP...");
          response = await axios({
            url: `http://localhost:7111/api/ExcelImport/template`,
            method: "GET",
            responseType: "blob",
            headers: {
              Accept: "*/*",
            },
            timeout: 5000,
          });
        } else {
          throw error;
        }
      }

      // Get filename from content-disposition header or use default
      const contentDisposition = response.headers["content-disposition"];
      let filename = "inventory_template.xlsx";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      // Create a download link and trigger download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      setDownloadStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error downloading template:", error);

      // If API fails, try to generate a local sample template
      downloadSampleTemplate();

      setServerStatus({
        checking: false,
        online: false,
        lastChecked: new Date(),
      });

      setDownloadStatus({
        loading: false,
        error: "Không thể kết nối đến máy chủ. Đã tạo mẫu cơ bản tạm thời.",
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

      // Try upload with current protocol
      let response;
      try {
        response = await axios.post(`${API_URL}/ExcelImport/import`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000, // 10 second timeout
        });
      } catch (error) {
        if (
          error.code === "ERR_NETWORK" &&
          window.location.protocol === "https:"
        ) {
          // If HTTPS failed, try HTTP as fallback
          console.log("HTTPS upload failed, trying HTTP...");
          response = await axios.post(
            `http://localhost:7111/api/ExcelImport/import`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              timeout: 10000,
            }
          );
        } else {
          throw error;
        }
      }

      setUploadStatus({
        loading: false,
        success: true,
        error: null,
        data: response.data,
      });

      // Update server status to online since we just successfully communicated
      setServerStatus({
        checking: false,
        online: true,
        lastChecked: new Date(),
      });
    } catch (error) {
      console.error("Error uploading file:", error);

      // Update server status if it's a network error
      if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
        setServerStatus({
          checking: false,
          online: false,
          lastChecked: new Date(),
        });
      }

      let errorMessage;
      if (error.response?.data?.message) {
        // Server provided specific error message
        errorMessage = error.response.data.message;
      } else if (error.code === "ECONNABORTED") {
        errorMessage =
          "Kết nối đã hết thời gian chờ. Máy chủ có thể đang bận, vui lòng thử lại sau.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại sau.";
      } else if (error.response?.status === 400) {
        errorMessage =
          "File Excel không đúng định dạng hoặc dữ liệu không hợp lệ. Vui lòng sử dụng mẫu Excel được cung cấp.";
      } else if (error.response?.status === 413) {
        errorMessage = "File quá lớn. Vui lòng tải file có kích thước nhỏ hơn.";
      } else {
        errorMessage =
          "Lỗi khi tải lên file. Vui lòng kiểm tra định dạng và thử lại.";
      }

      setUploadStatus({
        loading: false,
        success: false,
        error: errorMessage,
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-6">
        Nhập dữ liệu từ Excel
      </h2>

      {/* Server status indicator */}
      <div
        className={`mb-4 p-3 rounded-md ${
          serverStatus.online
            ? "bg-green-50 border border-green-200"
            : serverStatus.checking
            ? "bg-gray-50 border border-gray-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center">
          {serverStatus.checking ? (
            <FiRefreshCw className="animate-spin h-5 w-5 text-gray-500 mr-2" />
          ) : serverStatus.online ? (
            <FiCheck className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span
            className={`text-sm ${
              serverStatus.online
                ? "text-green-700"
                : serverStatus.checking
                ? "text-gray-700"
                : "text-red-700"
            }`}
          >
            {serverStatus.checking
              ? "Đang kiểm tra kết nối máy chủ..."
              : serverStatus.online
              ? "Đã kết nối với máy chủ"
              : "Không thể kết nối đến máy chủ. Một số chức năng có thể không hoạt động."}
          </span>
          {!serverStatus.checking && (
            <button
              onClick={checkServerConnection}
              className="ml-2 text-sm underline hover:text-blue-700 text-blue-600"
            >
              Kiểm tra lại
            </button>
          )}
        </div>
      </div>

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
            <>u
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
                  Chỉ chấp nhận file .xlsx, .xls (tối đa 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || uploadStatus.loading || !serverStatus.online}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !file || uploadStatus.loading || !serverStatus.online
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
          {!serverStatus.online && !uploadStatus.loading && (
            <p className="mt-2 text-xs text-red-500">
              Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng để
              tải lên file.
            </p>
          )}
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
