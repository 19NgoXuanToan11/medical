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
  availableNurses,
  selectedNurse,
  setSelectedNurse,
  showActionDropdown,
  toggleActionDropdown,
  onViewDetail,
  onAssignRequest,
  onCompleteRequest,
  onRetryRequest,
  onResubmitRequest,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Học sinh
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thuốc
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Liều lượng
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
                Ngày yêu cầu
              </th>
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
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {request.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {request.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex flex-col justify-center items-center min-h-[60px]">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {request.medicineName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.frequency}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 align-middle text-center">
                  <div className="flex items-center justify-center min-h-[60px]">
                    {request.dosage}
                  </div>
                </td>
                {/* Conditional column for assigned nurse */}
                {(activeTab === "assigned" ||
                  activeTab === "completed" ||
                  activeTab === "failed" ||
                  activeTab === "rejected" ||
                  activeTab === "all") && (
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex flex-col items-center justify-center min-h-[60px]">
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
                      {activeTab === "rejected" && request.rejectedDate && (
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                          Từ chối:{" "}
                          {new Date(request.rejectedDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 align-middle text-center">
                  <div className="flex items-center justify-center min-h-[60px]">
                    {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 align-middle text-center">
                  <div className="flex items-center justify-center min-h-[60px]">
                    {request.status === "pending" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                        <FiClock className="h-4 w-4" />
                        <span className="ml-1">
                          {getVietnameseStatusText("pending")}
                        </span>
                      </span>
                    ) : request.status === "assigned" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                        <FiCheckCircle className="h-4 w-4" />
                        <span className="ml-1">
                          {getVietnameseStatusText("assigned")}
                        </span>
                      </span>
                    ) : request.status === "completed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
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
                    ) : request.status === "refused" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                        <FiXCircle className="h-4 w-4" />
                        <span className="ml-1">
                          {getVietnameseStatusText("refused")}
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
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium align-middle">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => onViewDetail(request)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>
                    {activeTab === "pending" &&
                      request.status === "pending" && (
                        <div className="relative action-dropdown">
                          <button
                            onClick={() => toggleActionDropdown(request.id)}
                            className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          >
                            Chọn hành động
                            <FiChevronDown className="ml-1 h-3 w-3" />
                          </button>
                          {showActionDropdown[request.id] && (
                            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                              <div className="p-3">
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Chọn nhân viên y tế:
                                  </label>
                                  <select
                                    value={selectedNurse}
                                    onChange={(e) =>
                                      setSelectedNurse(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                                  >
                                    <option value="">
                                      -- Chọn nhân viên --
                                    </option>
                                    {availableNurses.map((nurse) => (
                                      <option
                                        key={nurse.staffId}
                                        value={nurse.staffId}
                                      >
                                        {nurse.firstName} {nurse.lastName} -{" "}
                                        {nurse.email}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      onAssignRequest(request.id, selectedNurse)
                                    }
                                    disabled={!selectedNurse}
                                    className="flex-1 px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                  >
                                    <FiCheck className="inline mr-1 h-3 w-3" />
                                    Gán
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {activeTab === "failed" &&
                      request.status === "failed" &&
                      onRetryRequest && (
                        <button
                          onClick={() => onRetryRequest(request)}
                          className="flex items-center px-3 py-1 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors text-sm"
                        >
                          <FiRefreshCw className="mr-1 h-3 w-3" />
                          Thử lại
                        </button>
                      )}
                    {activeTab === "rejected" &&
                      request.status === "rejected" &&
                      onResubmitRequest && (
                        <button
                          onClick={() => onResubmitRequest(request)}
                          className="flex items-center px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
                        >
                          <FiSend className="mr-1 h-3 w-3" />
                          Gửi lại
                        </button>
                      )}
                    {activeTab === "failed" &&
                      request.status === "failed" &&
                      onRetryRequest && (
                        <button
                          onClick={() => onRetryRequest(request)}
                          className="flex items-center px-3 py-1 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors text-sm"
                        >
                          <FiRefreshCw className="mr-1 h-3 w-3" />
                          Thử lại
                        </button>
                      )}
                    {activeTab === "rejected" &&
                      request.status === "rejected" &&
                      onResubmitRequest && (
                        <button
                          onClick={() => onResubmitRequest(request)}
                          className="flex items-center px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
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
