import React from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiCheck,
  FiChevronDown,
  FiTablet,
  FiInfo,
  FiRefreshCw,
  FiSend,
} from "react-icons/fi";
import { getVietnameseStatusText } from "../utils/medicationUtils";

const MedicationRequestTable = ({
  requests,
  activeTab,
  onViewDetail,
  onResubmitRequest,
}) => {
  // Helper function to get failure info from request
  const getFailureInfo = (request) => {
    try {
      // Parse failedFrequencies - array of failed time periods
      let failedFrequencies = [];
      if (request.failedFrequencies) {
        if (Array.isArray(request.failedFrequencies)) {
          failedFrequencies = request.failedFrequencies;
        } else if (typeof request.failedFrequencies === "string") {
          failedFrequencies = JSON.parse(request.failedFrequencies);
        }
      }

      // Parse failureReasons - object with time period as key and reason as value
      let failureReasons = {};
      if (request.failureReasons) {
        if (
          typeof request.failureReasons === "object" &&
          !Array.isArray(request.failureReasons)
        ) {
          failureReasons = request.failureReasons;
        } else if (typeof request.failureReasons === "string") {
          failureReasons = JSON.parse(request.failureReasons);
        }
      }

      return { failedFrequencies, failureReasons };
    } catch (error) {
      console.error("Error parsing failure info:", error);
      return { failedFrequencies: [], failureReasons: {} };
    }
  };
  // Helper function to render all medicines in a request
  const renderMedicines = (medicineRequestItems) => {
    if (!medicineRequestItems || medicineRequestItems.length === 0) {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Không có thông tin thuốc
        </div>
      );
    }

    // If there's only one medicine, show it simply
    if (medicineRequestItems.length === 1) {
      return (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          {medicineRequestItems[0].medicineName}
        </div>
      );
    }

    // If there are multiple medicines, show all of them
    return (
      <div className="space-y-1">
        {medicineRequestItems.map((item, index) => (
          <div key={index} className="flex items-center text-sm">
            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium mr-2">
              {index + 1}
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              {item.medicineName}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Học sinh
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thuốc
              </th>
              {/* Conditional column for assigned nurse */}
              {(activeTab === "assigned" ||
                activeTab === "completed" ||
                activeTab === "failed" ||
                activeTab === "rejected" ||
                activeTab === "all") && (
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nhân viên Y tế
                </th>
              )}
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ngày gửi yêu cầu
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ngày uống thuốc
              </th>
              {/* Show failure reason column only for failed tab */}
              {activeTab === "failed" && (
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                  Lý do thất bại
                </th>
              )}
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-600">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                style={{ height: "80px" }}
              >
                {/* Student Information Column */}
                <td className="px-6 py-4 text-left align-middle">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {request.studentName}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Lớp: {request.className}
                  </div>
                </td>

                {/* Medicine Information Column */}
                <td className="px-6 py-4 text-left align-middle">
                  {renderMedicines(request.medicineRequestItems)}
                </td>

                {/* Conditional column for assigned nurse */}
                {(activeTab === "assigned" ||
                  activeTab === "completed" ||
                  activeTab === "failed" ||
                  activeTab === "rejected" ||
                  activeTab === "all") && (
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {request.staffName || "N/A"}
                    </div>
                    {request.staff?.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {request.staff.email}
                      </div>
                    )}
                    {request.assignedDate && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {new Date(request.assignedDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    )}
                    {activeTab === "completed" && request.completedDate && (
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        Hoàn thành:{" "}
                        {new Date(request.completedDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    )}
                    {activeTab === "failed" && request.failedDate && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Thất bại:{" "}
                        {new Date(request.failedDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    )}
                  </td>
                )}

                <td className="px-6 py-4 text-center align-middle">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {request.date
                      ? new Date(request.date).toLocaleDateString("vi-VN")
                      : new Date(request.requestDate).toLocaleDateString(
                          "vi-VN"
                        )}
                  </div>
                </td>
                {/* Show failure reason column only for failed tab */}
                {activeTab === "failed" && (
                  <td className="px-6 py-4 text-left align-middle min-w-[200px]">
                    {(() => {
                      // Function to extract readable text from various formats
                      const extractText = (value) => {
                        if (!value) return "Không xác định";

                        if (typeof value === "string") {
                          // If it's a JSON string, try to parse and extract
                          try {
                            const parsed = JSON.parse(value);
                            return extractText(parsed);
                          } catch {
                            return value;
                          }
                        }

                        if (typeof value === "object") {
                          // Extract values from object
                          const values = Object.values(value).filter(
                            (v) => v && typeof v === "string" && v.trim() !== ""
                          );
                          return values.length > 0
                            ? values.join(", ")
                            : "Không xác định";
                        }

                        return String(value);
                      };

                      // Get failure reason with same priority as modal
                      const failureText =
                        request.failureReason ||
                        request.failureReasons ||
                        request.refusalReason ||
                        request.rejectionReason ||
                        request.reason ||
                        "Không xác định";

                      const shortReason = extractText(failureText);

                      return (
                        <div
                          className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-4 border-red-500"
                          title={shortReason}
                        >
                          <p className="break-words">{shortReason}</p>
                        </div>
                      );
                    })()}
                  </td>
                )}
                <td className="px-6 py-4 text-center align-middle">
                  {request.status === "pending" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                      <FiClock className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText("pending")}
                      </span>
                    </span>
                  ) : request.status === "assigned" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      <FiInfo className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText("assigned")}
                      </span>
                    </span>
                  ) : request.status === "completed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      <FiCheckCircle className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText("completed")}
                      </span>
                    </span>
                  ) : request.status === "rejected" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                      <FiXCircle className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText("rejected")}
                      </span>
                    </span>
                  ) : request.status === "failed" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                      <FiXCircle className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText("failed")}
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200">
                      <FiTablet className="h-4 w-4" />
                      <span className="ml-1">
                        {getVietnameseStatusText(request.status)}
                      </span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => onViewDetail(request)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1"
                      title="Xem chi tiết"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>

                    {activeTab === "rejected" &&
                      request.status === "rejected" &&
                      onResubmitRequest && (
                        <button
                          onClick={() => onResubmitRequest(request)}
                          className="flex items-center px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
                          title="Gửi lại"
                        >
                          <FiSend className="mr-1 h-3 w-3" />
                          Gửi lại
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-12">
          <FiTablet className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            Không có yêu cầu nào
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {activeTab === "pending"
              ? "Chưa có yêu cầu thuốc nào đang chờ xử lý."
              : activeTab === "assigned"
              ? "Chưa có yêu cầu thuốc nào đã được gán cho nhân viên y tế."
              : activeTab === "completed"
              ? "Chưa có yêu cầu thuốc nào đã hoàn thành."
              : activeTab === "failed"
              ? "Chưa có yêu cầu thuốc nào thất bại."
              : activeTab === "rejected"
              ? "Chưa có yêu cầu thuốc nào bị từ chối."
              : "Chưa có yêu cầu thuốc nào trong hệ thống."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicationRequestTable;
