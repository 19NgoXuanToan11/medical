import React from "react";
import {
  FiX,
  FiCheckCircle,
  FiClock,
  FiCheck,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import {
  calculateDosagePerAdministration,
  calculateDosagePerTime,
  formatFrequency,
  formatTotalDosage,
  formatFrequencyDisplay,
  getMedicationSummary,
} from "../../../../utils/api/medication/medicationUtils";
import { getVietnameseStatusText } from "../utils/medicationUtils";
import { getMedicineUnit } from "../../../../utils/medicineUnits";

// Helper function to parse dosage and extract unit
const parseDosage = (dosage) => {
  if (!dosage) return { number: "", unit: "viên" };

  // Check if dosage already contains unit
  const dosageMatch = dosage.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
  if (dosageMatch) {
    return { number: dosageMatch[1], unit: dosageMatch[2] };
  }

  // If no unit found, assume it's just a number and add default unit
  return { number: dosage, unit: "viên" };
};

// Helper function to format dosage with unit
const formatDosageWithUnit = (dosage, dosageUnit, medicineName) => {
  if (!dosage) return "Chưa xác định";

  // Use dosageUnit if available, otherwise get from medicine name
  const unit = dosageUnit || getMedicineUnit(medicineName);
  const { number } = parseDosage(dosage);
  return `${number || dosage} ${unit}`;
};

const MedicationDetailModal = ({
  show,
  request,
  onClose,
  availableNurses,
  selectedNurse,
  setSelectedNurse,
  onAssignRequest,
  onCompleteRequest,
}) => {
  if (!show || !request) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 dark:bg-black bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-4 border border-gray-300 dark:border-gray-600 w-11/12 md:w-3/4 lg:w-3/5 xl:w-1/2 shadow-lg rounded-md bg-white dark:bg-neutral-800 transition-colors duration-300 max-h-[90vh] overflow-y-auto">
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Chi tiết yêu cầu #{request.id}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Thông tin cơ bản - compact grid */}
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Học sinh:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {request.studentName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {request.studentId} • Lớp: {request.className}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Ngày gửi yêu cầu:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Phụ huynh:
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {request.parentName || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Nurse Information Section - Only show for assigned requests */}
            {request.status === "assigned" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Tên nhân viên:
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {request.staffName || "N/A"}
                    </p>
                    {request.staff && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {request.staff.email || "N/A"}
                      </p>
                    )}
                  </div>
                  {request.staff && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Số điện thoại:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {request.staff.phone || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medicine Items Table - Compact */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Danh sách thuốc yêu cầu
              </h4>
              <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        TÊN THUỐC
                      </th>
                      <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        TỔNG LIỀU LƯỢNG
                      </th>
                      <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        TẦN SUẤT UỐNG
                      </th>
                      <th className="w-1/4 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        LIỀU LƯỢNG MỖI LẦN
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {request.medicineRequestItems &&
                    request.medicineRequestItems.length > 0 ? (
                      request.medicineRequestItems.map((item, index) => (
                        <tr key={index}>
                          <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                            {item.medicineName}
                          </td>
                          <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                            {formatTotalDosage(
                              item.dosage,
                              item.dosageUnit ||
                                getMedicineUnit(item.medicineName)
                            )}
                          </td>
                          <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                            {formatFrequencyDisplay(item.frequency)}
                          </td>
                          <td className="w-1/4 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 text-center break-words">
                            {calculateDosagePerTime(
                              item.dosage,
                              item.dosageUnit ||
                                getMedicineUnit(item.medicineName),
                              item.frequency
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center"
                        >
                          Không có thông tin thuốc
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Instructions - Compact */}
              {request.medicineRequestItems &&
                request.medicineRequestItems.some(
                  (item) => item.instructions
                ) && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Hướng dẫn sử dụng
                    </h5>
                    <div className="space-y-1">
                      {request.medicineRequestItems.map(
                        (item, index) =>
                          item.instructions && (
                            <p
                              key={index}
                              className="text-xs text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 rounded"
                            >
                              <strong>{item.medicineName}:</strong>{" "}
                              {item.instructions}
                            </p>
                          )
                      )}
                    </div>
                  </div>
                )}
            </div>

            {/* Medication Schedule Section */}
            {request.medicineRequestItems &&
              request.medicineRequestItems.length > 0 &&
              request.medicineRequestItems.some(
                (item) => item.timeOfDay && item.timeOfDay !== "N/A"
              ) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lịch uống thuốc:
                  </h4>
                  <div className="space-y-3">
                    {request.medicineRequestItems.map(
                      (item, index) =>
                        item.timeOfDay &&
                        item.timeOfDay !== "N/A" && (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                          >
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                              {item.medicineName}
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {(Array.isArray(item.timeOfDay)
                                ? item.timeOfDay
                                : item.timeOfDay.split(", ")
                              ).map((time, timeIndex) => (
                                <div
                                  key={timeIndex}
                                  className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <div className="flex-shrink-0">
                                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                                          {timeIndex + 1}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="font-medium text-green-800 dark:text-green-200 text-xs">
                                        {time.trim() === "morning"
                                          ? "Buổi sáng (6:00 - 11:00)"
                                          : time.trim() === "noon"
                                          ? "Buổi trưa (11:00 - 14:00)"
                                          : time.trim() === "afternoon"
                                          ? "Buổi chiều (14:00 - 18:00)"
                                          : time.trim() === "evening"
                                          ? "Buổi tối (18:00 - 22:00)"
                                          : time.trim()}
                                      </h6>
                                      <p className="text-xs text-green-600 dark:text-green-400">
                                        {calculateDosagePerTime(
                                          item.dosage,
                                          item.dosageUnit ||
                                            getMedicineUnit(item.medicineName),
                                          item.frequency
                                        )}
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

            {/* Trạng thái và hướng dẫn đặc biệt - Compact */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trạng thái:
                </span>
                <div>
                  {request.status === "pending" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                      <FiClock className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText("pending")}
                    </span>
                  ) : request.status === "assigned" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                      <FiCheckCircle className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText("assigned")}
                    </span>
                  ) : request.status === "completed" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                      <FiCheckCircle className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText("completed")}
                    </span>
                  ) : request.status === "refused" ||
                    request.status === "Refused" ||
                    request.status === "rejected" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                      <FiX className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText(request.status)}
                    </span>
                  ) : request.status === "failed" ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200">
                      <FiX className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText("failed")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200">
                      <FiInfo className="h-3 w-3 mr-1" />
                      {getVietnameseStatusText(request.status)}
                    </span>
                  )}
                </div>
              </div>

              {request.instructions && (
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hướng dẫn đặc biệt:
                  </span>
                  <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                    {request.instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Status Details - Compact */}
            {request.status === "approved" && (
              <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-md border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-800 dark:text-green-200">
                  <p>
                    <strong>Phê duyệt bởi:</strong> {request.approvedBy}
                  </p>
                  <p>
                    <strong>Ngày phê duyệt:</strong>{" "}
                    {new Date(request.approvedDate).toLocaleDateString("vi-VN")}
                  </p>
                  {request.approvalNotes && (
                    <p>
                      <strong>Ghi chú:</strong> {request.approvalNotes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {request.status === "rejected" && (
              <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md border border-red-200 dark:border-red-800">
                <div className="text-xs text-red-800 dark:text-red-200">
                  <p>
                    <strong>Từ chối bởi:</strong> {request.rejectedBy}
                  </p>
                  <p>
                    <strong>Ngày từ chối:</strong>{" "}
                    {new Date(request.rejectedDate).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    <strong>Lý do:</strong> {request.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            {(request.status === "refused" ||
              request.status === "Refused" ||
              request.status === "failed") && (
              <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-md border border-red-200 dark:border-red-800">
                <div className="text-xs text-red-800 dark:text-red-200">
                  <p>
                    <strong>Thất bại bởi:</strong>{" "}
                    {(() => {
                      const staffName =
                        request.rejectedBy ||
                        (request.staff?.firstName && request.staff?.lastName
                          ? `${request.staff.firstName} ${request.staff.lastName}`
                          : null) ||
                        "N/A";
                      return typeof staffName === "string"
                        ? staffName
                        : String(staffName);
                    })()}
                  </p>
                  {request.rejectedDate && (
                    <p>
                      <strong>Ngày thất bại:</strong>{" "}
                      {(() => {
                        try {
                          return new Date(
                            request.rejectedDate
                          ).toLocaleDateString("vi-VN");
                        } catch (error) {
                          return String(request.rejectedDate);
                        }
                      })()}
                    </p>
                  )}
                  <p>
                    <strong>Lý do thất bại:</strong>{" "}
                    {(() => {
                      const failureText =
                        request.failureReason ||
                        request.failureReasons ||
                        request.refusalReason ||
                        request.rejectionReason ||
                        "Không có lý do cụ thể";

                      // Function to extract readable text from various formats
                      const extractText = (value) => {
                        if (!value) return "Không có lý do cụ thể";

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
                            : "Không có lý do cụ thể";
                        }

                        return String(value);
                      };

                      return extractText(failureText);
                    })()}
                  </p>
                </div>
              </div>
            )}

            {request.status === "assigned" && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p>
                    <strong>Được giao bởi:</strong>{" "}
                    {request.assignedBy || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày giao:</strong>{" "}
                    {request.assignedDate
                      ? new Date(request.assignedDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  {request.assignmentNotes && (
                    <p>
                      <strong>Ghi chú giao việc:</strong>{" "}
                      {request.assignmentNotes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {request.status === "completed" && (
              <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded-md border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-800 dark:text-green-200">
                  <p>
                    <strong>Hoàn thành bởi:</strong>{" "}
                    {request.completedBy || request.staffName || "N/A"}
                  </p>
                  <p>
                    <strong>Ngày hoàn thành:</strong>{" "}
                    {request.completedDate
                      ? new Date(request.completedDate).toLocaleDateString(
                          "vi-VN"
                        )
                      : "N/A"}
                  </p>
                  {request.completionNotes && (
                    <p>
                      <strong>Ghi chú hoàn thành:</strong>{" "}
                      {request.completionNotes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex justify-end mt-4 space-x-2">
            {request.status === "pending" && (
              <div className="flex items-center space-x-2 w-full">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chọn nhân viên y tế:
                  </label>
                  <select
                    value={selectedNurse}
                    onChange={(e) => setSelectedNurse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {availableNurses.map((nurse) => (
                      <option key={nurse.staffId} value={nurse.staffId}>
                        {nurse.firstName} {nurse.lastName} - {nurse.email}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    onAssignRequest(request.id, selectedNurse);
                    onClose();
                  }}
                  disabled={!selectedNurse}
                  className="px-3 py-2 mt-5 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiCheck className="inline mr-1 h-4 w-4" />
                  Gán
                </button>
              </div>
            )}
            {request.status === "assigned" && (
              <button
                onClick={() => {
                  const confirmed = window.confirm(
                    `Bạn có chắc chắn muốn đánh dấu yêu cầu thuốc cho ${request.studentName} là đã hoàn thành?`
                  );
                  if (confirmed) {
                    onCompleteRequest(request);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <FiCheckCircle className="inline mr-1 h-4 w-4" />
                Hoàn thành
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
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
