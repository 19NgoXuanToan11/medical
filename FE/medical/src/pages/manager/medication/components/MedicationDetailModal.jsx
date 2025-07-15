import React from "react";
import {
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiInfo,
  FiUser,
  FiCalendar,
  FiTablet,
} from "react-icons/fi";
import { getVietnameseStatusText } from "../utils/medicationUtils";
import { calculateDosagePerAdministration } from "../../../../utils/api/medication/medicationUtils";

// Helper function to format dosage with units
const formatDosageWithUnit = (dosage, dosageUnit = "viên") => {
  if (!dosage || dosage === "N/A") return "Chưa xác định";
  return `${dosage} ${dosageUnit}`;
};

// Helper function to format frequency
const formatFrequency = (frequency) => {
  if (!frequency || frequency === "N/A") return "Chưa xác định";

  // If it's already formatted
  if (typeof frequency === "string" && frequency.includes("lần/ngày")) {
    return frequency;
  }

  // If it's a number or number string
  const numericFrequency = parseInt(frequency);
  if (!isNaN(numericFrequency) && numericFrequency > 0) {
    return `${numericFrequency} lần/ngày`;
  }

  // Handle special cases
  if (frequency === "as_needed") return "Khi cần thiết";

  return frequency;
};

const MedicationDetailModal = ({ show, request, onClose }) => {
  if (!show || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay - đen mờ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-lg shadow-xl transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Chi tiết yêu cầu thuốc #{request.id}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Thông tin chi tiết về yêu cầu cấp thuốc
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Student Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <FiUser className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Thông tin học sinh
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Họ tên:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.studentName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Lớp:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.className || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phụ huynh:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.parentName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mã học sinh:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.studentCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Information */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <FiCalendar className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                  Thông tin yêu cầu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ngày gửi yêu cầu:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.requestDate
                        ? new Date(request.requestDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ngày uống thuốc:
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.date
                        ? new Date(request.date).toLocaleDateString("vi-VN")
                        : request.requestDate
                        ? new Date(request.requestDate).toLocaleDateString(
                            "vi-VN"
                          )
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Trạng thái:
                    </label>
                    <div className="mt-1">
                      {request.status === "pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                          <FiClock className="h-4 w-4 mr-1" />
                          {getVietnameseStatusText("pending")}
                        </span>
                      ) : request.status === "assigned" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          <FiCheckCircle className="h-4 w-4 mr-1" />
                          {getVietnameseStatusText("assigned")}
                        </span>
                      ) : request.status === "completed" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          <FiCheckCircle className="h-4 w-4 mr-1" />
                          {getVietnameseStatusText("completed")}
                        </span>
                      ) : request.status === "failed" ||
                        request.status === "refused" ||
                        request.status === "Refused" ||
                        request.status === "rejected" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                          <FiXCircle className="h-4 w-4 mr-1" />
                          {getVietnameseStatusText(request.status)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200">
                          <FiInfo className="h-4 w-4 mr-1" />
                          {getVietnameseStatusText(request.status) ||
                            request.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Reason - Hiển thị rõ ràng */}
              {(request.status === "refused" ||
                request.status === "Refused" ||
                request.status === "rejected" ||
                request.status === "failed") && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="text-lg font-medium text-red-800 dark:text-red-200 mb-3 flex items-center">
                    <FiXCircle className="h-5 w-5 mr-2" />
                    Lý do từ chối
                  </h4>
                  <div className="bg-white dark:bg-red-900/30 p-3 rounded border border-red-300 dark:border-red-700">
                    <p className="text-red-700 dark:text-red-300 font-medium">
                      {request.refusalReason ||
                        request.rejectionReason ||
                        request.reason ||
                        "Không có lý do cụ thể"}
                    </p>
                  </div>
                  {/* Additional rejection info */}
                  {(request.rejectedBy || request.rejectedDate) && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {request.rejectedBy && (
                        <div>
                          <label className="text-sm font-medium text-red-700 dark:text-red-300">
                            Người từ chối:
                          </label>
                          <p className="text-red-800 dark:text-red-200">
                            {request.rejectedBy}
                          </p>
                        </div>
                      )}
                      {request.rejectedDate && (
                        <div>
                          <label className="text-sm font-medium text-red-700 dark:text-red-300">
                            Ngày từ chối:
                          </label>
                          <p className="text-red-800 dark:text-red-200">
                            {new Date(request.rejectedDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Nurse Information - Only for assigned requests */}
              {request.status === "assigned" &&
                (request.staffName || request.staff) && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <FiUser className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Thông tin nhân viên phụ trách
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tên nhân viên:
                        </label>
                        <p className="text-gray-900 dark:text-gray-100">
                          {request.staffName || request.staff?.name || "N/A"}
                        </p>
                      </div>
                      {request.staff?.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email:
                          </label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {request.staff.email}
                          </p>
                        </div>
                      )}
                      {request.staff?.phone && (
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Số điện thoại:
                          </label>
                          <p className="text-gray-900 dark:text-gray-100">
                            {request.staff.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Medicine Information */}
              <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <FiTablet className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Danh sách thuốc yêu cầu
                </h4>

                {request.medicineRequestItems &&
                request.medicineRequestItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tên thuốc
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tổng liều lượng
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tần suất
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Liều mỗi lần
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                        {request.medicineRequestItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                              {formatDosageWithUnit(
                                item.dosage,
                                item.dosageUnit
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                              {formatFrequency(item.frequency)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">
                              {item.dosage &&
                              item.frequency &&
                              item.dosage !== "N/A" &&
                              item.frequency !== "N/A"
                                ? calculateDosagePerAdministration(
                                    formatDosageWithUnit(
                                      item.dosage,
                                      item.dosageUnit
                                    ),
                                    item.frequency
                                  )
                                : "Chưa xác định"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FiTablet className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Không có thông tin thuốc
                    </p>
                  </div>
                )}

                {/* Instructions */}
                {request.medicineRequestItems &&
                  request.medicineRequestItems.some(
                    (item) => item.instructions
                  ) && (
                    <div className="mt-4">
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hướng dẫn sử dụng
                      </h5>
                      <div className="space-y-2">
                        {request.medicineRequestItems.map(
                          (item, index) =>
                            item.instructions && (
                              <div
                                key={index}
                                className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-800"
                              >
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  <strong className="text-blue-800 dark:text-blue-200">
                                    {item.medicineName}:
                                  </strong>{" "}
                                  {item.instructions}
                                </p>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Schedule Information */}
              {request.medicineRequestItems &&
                request.medicineRequestItems.some(
                  (item) => item.timeOfDay && item.timeOfDay !== "N/A"
                ) && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <FiClock className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Lịch uống thuốc
                    </h4>
                    <div className="space-y-4">
                      {request.medicineRequestItems.map(
                        (item, index) =>
                          item.timeOfDay &&
                          item.timeOfDay !== "N/A" && (
                            <div
                              key={index}
                              className="bg-white dark:bg-green-900/30 p-3 rounded border border-green-300 dark:border-green-700"
                            >
                              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                                {item.medicineName}
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {(Array.isArray(item.timeOfDay)
                                  ? item.timeOfDay
                                  : item.timeOfDay.split(", ")
                                ).map((time, timeIndex) => (
                                  <div
                                    key={timeIndex}
                                    className="bg-green-100 dark:bg-green-800/50 p-2 rounded border border-green-300 dark:border-green-600"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FiClock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      <div>
                                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                          {time.trim() === "morning"
                                            ? "Buổi sáng (6:00 - 11:00)"
                                            : time.trim() === "noon"
                                            ? "Buổi trưa (11:00 - 14:00)"
                                            : time.trim() === "afternoon"
                                            ? "Buổi chiều (14:00 - 18:00)"
                                            : time.trim() === "evening"
                                            ? "Buổi tối (18:00 - 22:00)"
                                            : time.trim()}
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                          {item.dosage &&
                                          item.frequency &&
                                          item.dosage !== "N/A" &&
                                          item.frequency !== "N/A"
                                            ? calculateDosagePerAdministration(
                                                formatDosageWithUnit(
                                                  item.dosage,
                                                  item.dosageUnit
                                                ),
                                                item.frequency
                                              )
                                            : "Chưa xác định"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailModal;
