import React from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiTablet,
  FiUser,
  FiCalendar,
  FiActivity,
  FiBarChart,
} from "react-icons/fi";
import {
  calculateMedicationProgress,
  formatAdministrationSchedule,
  shouldShowReRequestOption,
} from "../utils/requestResultUtils";
import { calculateDosagePerAdministration } from "../../../../utils/api/medication/medicationUtils";

const RequestResultTable = ({
  results,
  activeTab,
  onViewDetail,
  onMarkAsAdministered,
  onMarkAsFailed,
  onCreateReRequest,
}) => {
  // Render progress bar for frequency-based medications
  const renderProgressBar = (result) => {
    const progress = calculateMedicationProgress(result);

    return (
      <div className="w-full">
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>
            {progress.completed}/{progress.total} lần
          </span>
          <span>{Math.round(progress.progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress.isComplete ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress.progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render schedule info
  const renderScheduleInfo = (result) => {
    const schedule = formatAdministrationSchedule(result);

    return (
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {schedule.nextAdministrationFormatted && (
          <div className="flex items-center">
            <FiClock className="h-3 w-3 mr-1" />
            <span>Tiếp theo: {schedule.nextAdministrationFormatted}</span>
          </div>
        )}
      </div>
    );
  };

  // Render status badge
  const renderStatusBadge = (result) => {
    const statusConfig = {
      pending: {
        color: "yellow",
        icon: FiClock,
        text: "Chờ cấp thuốc",
      },
      administered: {
        color: "green",
        icon: FiCheckCircle,
        text: "Đã cấp thuốc",
      },
      completed: {
        color: "blue",
        icon: FiCheckCircle,
        text: "Hoàn thành",
      },
      failed: {
        color: "red",
        icon: FiXCircle,
        text: "Thất bại",
      },
    };

    const config = statusConfig[result.status] || {
      color: "gray",
      icon: FiTablet,
      text: result.status || "Không xác định",
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 dark:bg-${config.color}-900/30 text-${config.color}-800 dark:text-${config.color}-200`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
        {result.isReRequest && (
          <span className="ml-1 text-orange-600 dark:text-orange-400">
            (Yêu cầu lại)
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Học sinh & Thuốc
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Liều lượng & Tần suất
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tiến độ
              </th>
              {(activeTab === "administered" ||
                activeTab === "failed" ||
                activeTab === "all") && (
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nhân viên thực hiện
                </th>
              )}
              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thời gian
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
            {results.map((result) => (
              <tr
                key={result.resultId}
                className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
              >
                {/* Student & Medicine Info */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {result.studentName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Lớp: {result.className} | ID: {result.studentCode}
                      </div>
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                        {result.medicineName}
                      </div>
                      {result.instructions && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {result.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Dosage & Frequency */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <div className="font-medium">Tổng: {result.dosage}</div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {result.frequency}
                    </div>
                    {result.dosage && result.frequency && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {calculateDosagePerAdministration(
                          result.dosage,
                          result.frequency
                        )}
                      </div>
                    )}
                  </div>
                </td>

                {/* Progress */}
                <td className="px-6 py-4 text-center">
                  <div className="w-full max-w-xs mx-auto">
                    {result.timesPerDay > 1 ? (
                      <div className="space-y-2">
                        {renderProgressBar(result)}
                        {renderScheduleInfo(result)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-center">
                          <FiActivity className="h-4 w-4 mr-1" />
                          Một lần
                        </div>
                      </div>
                    )}
                  </div>
                </td>

                {/* Staff Info (conditional) */}
                {(activeTab === "administered" ||
                  activeTab === "failed" ||
                  activeTab === "all") && (
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm">
                      {result.administeredByStaffName !== "N/A" ? (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {result.administeredByStaffName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {result.administeredByStaffRole}
                          </div>
                          {result.administeredTime && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {new Date(result.administeredTime).toLocaleString(
                                "vi-VN"
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">
                          Chưa có
                        </span>
                      )}
                    </div>
                  </td>
                )}

                {/* Time Info */}
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {result.administeredTime ? (
                      <div>
                        <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                          <FiCalendar className="h-4 w-4 mr-1" />
                          {new Date(result.administeredTime).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(result.administeredTime).toLocaleTimeString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    ) : result.submittedAt ? (
                      <div>
                        <div className="flex items-center justify-center">
                          <FiClock className="h-4 w-4 mr-1" />
                          {new Date(result.submittedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Yêu cầu lúc:{" "}
                          {new Date(result.submittedAt).toLocaleTimeString(
                            "vi-VN"
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">
                        --
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    {renderStatusBadge(result)}
                    {result.failedAttempts > 0 && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Thất bại: {result.failedAttempts} lần
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                    <button
                      onClick={() => onViewDetail(result)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                      title="Xem chi tiết"
                    >
                      <FiEye className="h-4 w-4" />
                    </button>

                    {activeTab === "pending" && result.status === "pending" && (
                      <>
                        <button
                          onClick={() => onMarkAsAdministered(result)}
                          className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                          title="Đánh dấu đã cấp thuốc"
                        >
                          <FiCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onMarkAsFailed(result)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Đánh dấu thất bại"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {shouldShowReRequestOption(result) && (
                      <button
                        onClick={() => onCreateReRequest(result)}
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300"
                        title="Tạo yêu cầu lại"
                      >
                        <FiRefreshCw className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {results.length === 0 && (
          <div className="text-center py-12">
            <FiBarChart className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Không có dữ liệu
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Hiện tại không có kết quả cấp thuốc nào trong danh mục này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestResultTable;
