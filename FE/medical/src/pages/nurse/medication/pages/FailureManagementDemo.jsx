import React, { useState } from "react";
import {
  FiCode,
  FiDatabase,
  FiGlobe,
  FiPlay,
  FiCheck,
  FiX,
  FiInfo,
  FiAlertTriangle,
  FiRepeat,
  FiList,
  FiFileText,
  FiArrowRight,
  FiCopy,
  FiExternalLink,
} from "react-icons/fi";

const FailureManagementDemo = () => {
  const [activeApi, setActiveApi] = useState("report-failure");
  const [showCode, setShowCode] = useState(false);

  const apis = [
    {
      id: "report-failure",
      name: "Báo cáo thất bại",
      endpoint: "POST /api/MedicineRequest/report-failure",
      description: "Báo cáo thất bại cho một buổi cụ thể của yêu cầu thuốc",
      icon: FiAlertTriangle,
      color: "red",
      requestBody: {
        requestResultId: "number",
        medicineRequestItemId: "number",
        period: "string (morning|noon|afternoon|evening)",
        staffId: "number",
        failureReason: "string",
        notes: "string (optional)",
      },
      response: {
        success: "boolean",
        message: "string",
        data: "object",
      },
      example: {
        request: {
          requestResultId: 123,
          medicineRequestItemId: 456,
          period: "morning",
          staffId: 1,
          failureReason: "Học sinh không có mặt tại trường",
          notes: "Đã liên lạc với phụ huynh",
        },
        response: {
          success: true,
          message: "Báo cáo thất bại thành công",
          data: {
            /* updated data */
          },
        },
      },
    },
    {
      id: "period-history",
      name: "Lịch sử trạng thái",
      endpoint:
        "GET /api/MedicineRequest/item/{medicineRequestItemId}/period/{period}/history",
      description: "Xem lịch sử trạng thái của từng buổi cụ thể",
      icon: FiList,
      color: "blue",
      parameters: {
        medicineRequestItemId: "number (path parameter)",
        period: "string (path parameter)",
      },
      response: {
        success: "boolean",
        data: "array of status history objects",
      },
      example: {
        request: "GET /api/MedicineRequest/item/456/period/morning/history",
        response: {
          success: true,
          data: [
            {
              Status: "Pending",
              StaffId: null,
              Timestamp: "2024-01-15T06:00:00Z",
            },
            {
              Status: "Verified",
              StaffId: 1,
              Timestamp: "2024-01-15T07:30:00Z",
            },
            {
              Status: "Failed",
              StaffId: 1,
              Timestamp: "2024-01-15T11:15:00Z",
              FailureReason: "Học sinh không có mặt",
            },
          ],
        },
      },
    },
    {
      id: "rerequest",
      name: "Tạo yêu cầu lại",
      endpoint:
        "POST /api/MedicineRequest/item/{medicineRequestItemId}/rerequest",
      description: "Tạo lại yêu cầu cho buổi đã thất bại (trước 5pm)",
      icon: FiRepeat,
      color: "green",
      parameters: {
        medicineRequestItemId: "number (path parameter)",
        period: "string (query parameter)",
        staffId: "number (query parameter)",
      },
      requestBody: {
        reason: "string (optional)",
      },
      response: {
        success: "boolean",
        message: "string",
      },
      example: {
        request:
          "POST /api/MedicineRequest/item/456/rerequest?period=morning&staffId=1",
        requestBody: {
          reason: "Học sinh đã trở lại trường",
        },
        response: {
          success: true,
          message: "Tạo yêu cầu lại thành công",
        },
      },
    },
    {
      id: "rerequest-info",
      name: "Thông tin tạo lại",
      endpoint:
        "GET /api/MedicineRequest/item/{medicineRequestItemId}/period/{period}/re-request-info",
      description: "Kiểm tra có thể tạo lại không và lấy thông tin chi tiết",
      icon: FiInfo,
      color: "purple",
      parameters: {
        medicineRequestItemId: "number (path parameter)",
        period: "string (path parameter)",
      },
      response: {
        canReRequest: "boolean",
        reason: "string",
        studentCode: "string",
        studentName: "string",
        className: "string",
        medicineName: "string",
        period: "string",
        history: "array",
      },
      example: {
        request:
          "GET /api/MedicineRequest/item/456/period/morning/re-request-info",
        response: {
          canReRequest: true,
          reason: "Có thể tạo lại trước 17:00",
          studentCode: "HS001",
          studentName: "Nguyễn Văn A",
          className: "1A",
          medicineName: "Paracetamol",
          period: "morning",
          history: [
            /* status history */
          ],
        },
      },
    },
    {
      id: "failed-requests",
      name: "Danh sách thất bại",
      endpoint: "GET /api/MedicineRequest/failed",
      description: "Lấy danh sách tất cả yêu cầu có buổi thất bại",
      icon: FiFileText,
      color: "orange",
      parameters: {
        period: "string (optional query parameter)",
        staffId: "number (optional query parameter)",
      },
      response: {
        success: "boolean",
        data: "array of failed requests",
        message: "string",
      },
      example: {
        request: "GET /api/MedicineRequest/failed?period=morning&staffId=1",
        response: {
          success: true,
          data: [
            {
              requestId: 123,
              studentName: "Nguyễn Văn A",
              className: "1A",
              medicineName: "Paracetamol",
              failedPeriods: ["morning"],
              failureReasons: {
                morning: "Học sinh không có mặt",
              },
            },
          ],
          message: "Lấy danh sách thất bại thành công",
        },
      },
    },
  ];

  const currentApi = apis.find((api) => api.id === activeApi);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <FiCode className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              Demo: 5 API Xử lý thất bại & Tạo lại
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Hướng dẫn chi tiết và ví dụ sử dụng các API xử lý nghiệp vụ thất
              bại và tạo lại yêu cầu
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiCode className="h-4 w-4 mr-2" />
              {showCode ? "Ẩn code" : "Hiện code"}
            </button>
          </div>
        </div>
      </div>

      {/* API Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {apis.map((api) => (
              <button
                key={api.id}
                onClick={() => setActiveApi(api.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 whitespace-nowrap ${
                  activeApi === api.id
                    ? `border-${api.color}-500 text-${api.color}-600 dark:text-${api.color}-400`
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <api.icon className="h-4 w-4" />
                <span>{api.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* API Details */}
      {currentApi && (
        <div className="space-y-6">
          {/* API Header */}
          <div
            className={`bg-${currentApi.color}-50 dark:bg-${currentApi.color}-900/20 p-6 rounded-lg border border-${currentApi.color}-200 dark:border-${currentApi.color}-800`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 bg-${currentApi.color}-100 dark:bg-${currentApi.color}-900/30 rounded-lg`}
                >
                  <currentApi.icon
                    className={`h-6 w-6 text-${currentApi.color}-600 dark:text-${currentApi.color}-400`}
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {currentApi.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {currentApi.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full bg-${currentApi.color}-100 text-${currentApi.color}-800 dark:bg-${currentApi.color}-900/30 dark:text-${currentApi.color}-300`}
                >
                  {currentApi.endpoint.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Endpoint */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiGlobe className="h-5 w-5 text-blue-600 mr-2" />
              Endpoint
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                  {currentApi.endpoint}
                </code>
                <button
                  onClick={() => copyToClipboard(currentApi.endpoint)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiCopy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Parameters */}
          {currentApi.parameters && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FiDatabase className="h-5 w-5 text-green-600 mr-2" />
                Parameters
              </h3>
              <div className="space-y-3">
                {Object.entries(currentApi.parameters).map(([key, type]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {key}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({type})
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {type.includes("path")
                        ? "Path Parameter"
                        : "Query Parameter"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {currentApi.requestBody && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FiFileText className="h-5 w-5 text-orange-600 mr-2" />
                Request Body
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
                  {JSON.stringify(currentApi.requestBody, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Response */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiCheck className="h-5 w-5 text-green-600 mr-2" />
              Response
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
                {JSON.stringify(currentApi.response, null, 2)}
              </pre>
            </div>
          </div>

          {/* Example */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiPlay className="h-5 w-5 text-blue-600 mr-2" />
              Ví dụ sử dụng
            </h3>

            {/* Request Example */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                Request:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    cURL
                  </span>
                  <button
                    onClick={() => copyToClipboard(currentApi.example.request)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                </div>
                <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
                  {typeof currentApi.example.request === "string"
                    ? currentApi.example.request
                    : JSON.stringify(currentApi.example.request, null, 2)}
                </pre>
              </div>
            </div>

            {/* Response Example */}
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                Response:
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    JSON
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(currentApi.example.response, null, 2)
                      )
                    }
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiCopy className="h-4 w-4" />
                  </button>
                </div>
                <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
                  {JSON.stringify(currentApi.example.response, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <FiExternalLink className="h-5 w-5 text-purple-600 mr-2" />
              Hướng dẫn tích hợp
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  1. Authentication
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Tất cả API yêu cầu xác thực. Đảm bảo gửi token trong header
                  Authorization.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  2. Error Handling
                </h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Luôn kiểm tra response.success và xử lý lỗi phù hợp. Các lỗi
                  thường gặp: 400 (Bad Request), 401 (Unauthorized), 403
                  (Forbidden), 404 (Not Found).
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  3. Validation
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  Validate dữ liệu trước khi gửi request. Đặc biệt chú ý format
                  của period (morning, noon, afternoon, evening) và staffId phải
                  là số nguyên.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                  4. Rate Limiting
                </h4>
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  API có giới hạn số request. Không gửi quá 100 request/phút để
                  tránh bị block.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveApi("report-failure")}
            className="p-4 border border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 dark:hover:border-red-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Báo cáo thất bại
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ghi nhận thất bại cho buổi
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveApi("period-history")}
            className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FiList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Xem lịch sử
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Lịch sử trạng thái buổi
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveApi("rerequest")}
            className="p-4 border border-green-200 dark:border-green-800 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FiRepeat className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Tạo lại
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tạo yêu cầu lại
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveApi("rerequest-info")}
            className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FiInfo className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Kiểm tra
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Thông tin tạo lại
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveApi("failed-requests")}
            className="p-4 border border-orange-200 dark:border-orange-800 rounded-lg hover:border-orange-300 dark:hover:border-orange-700 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <FiFileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Danh sách
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Yêu cầu thất bại
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailureManagementDemo;
