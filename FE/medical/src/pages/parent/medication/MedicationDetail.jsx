import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { medicationService } from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import { transformParentMedicationData } from "../../../utils/api/medication/parentMedicationUtils";
import {
  calculateDosagePerAdministration,
  formatFrequency,
} from "../../../utils/api/medication/medicationUtils";
import { toast } from "react-toastify";

const MedicationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medication, setMedication] = useState(null);
  const [error, setError] = useState(null);

  // Fetch medication data from API
  const fetchMedicationDetail = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      // First get all parent medication requests
      const result = await medicationService.getMedicationRequestsByParent(
        user.id
      );

      if (result.success) {
        const transformedData = transformParentMedicationData(result.data);

        // Find the specific medication by ID
        const medicationId = id.replace("MED", ""); // Remove MED prefix
        const foundMedication = transformedData.find(
          (med) => med.requestId.toString() === medicationId || med.id === id
        );

        if (foundMedication) {
          // Enhance with additional detail data
          const enhancedMedication = {
            ...foundMedication,
            studentId: foundMedication.studentCode,
            specialInstructions: foundMedication.instructions,
            timeOfDay: foundMedication.timeOfDay.split(", ").map((time) => {
              switch (time.toLowerCase()) {
                case "morning":
                case "sáng":
                  return "morning";
                case "afternoon":
                case "chiều":
                  return "afternoon";
                case "noon":
                case "trưa":
                  return "noon";
                default:
                  return "as_needed";
              }
            }),
            administrationLog: foundMedication.progress.map((p) => ({
              date: p.administeredTime,
              status:
                p.status === "Completed"
                  ? "completed"
                  : p.status === "Failed"
                  ? "missed"
                  : "upcoming",
              administrator:
                p.administeredByStaff?.firstName &&
                p.administeredByStaff?.lastName
                  ? `${p.administeredByStaff.firstName} ${p.administeredByStaff.lastName}`
                  : "N/A",
              notes: p.reRequestReason || "Không có ghi chú",
            })),
            notes: [], // API doesn't provide notes, so empty array
          };

          setMedication(enhancedMedication);
        } else {
          setError("Không tìm thấy yêu cầu thuốc");
        }
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching medication detail:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicationDetail();
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !medication)) {
    return (
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {error || "Không tìm thấy yêu cầu thuốc"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {error ||
              `Yêu cầu thuốc với mã #${id} không tồn tại hoặc đã bị xóa`}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={fetchMedicationDetail}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Thử lại
            </button>
            <Link
              to="/parent/medication/history"
              className="px-4 py-2 bg-gray-600 dark:bg-gray-500 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getAdministrationStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
            Đã uống
          </span>
        );
      case "missed":
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
            Đã bỏ lỡ
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
            Sắp tới
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
            Đang thực hiện
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs font-medium">
            Đã hoàn thành
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
            Chờ xác nhận
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getTimeOfDayText = (timeCode) => {
    switch (timeCode) {
      case "morning":
        return "Buổi sáng (6:00 - 11:00)";
      case "noon":
        return "Buổi trưa (11:00 - 14:00)";
      case "afternoon":
        return "Buổi chiều (14:00 - 18:00)";
      case "as_needed":
        return "Khi cần thiết";
      default:
        return timeCode;
    }
  };

  const completedDoses = medication.administrationLog.filter(
    (log) => log.status === "completed"
  ).length;
  const totalDoses = medication.administrationLog.length;
  const progressPercentage =
    totalDoses > 0 ? Math.min(100, (completedDoses / totalDoses) * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to="/parent/medication/history"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chi tiết yêu cầu thuốc
                  </h1>
                  {getStatusBadge(medication.status)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Mã yêu cầu: #{medication.id} | Ngày tạo:{" "}
                  {new Date(medication.requestDate).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/parent/medication/edit/${medication.id}`}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Chỉnh sửa
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Combined Student and Medication Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* Student Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 border-b border-blue-200 dark:border-blue-800">
                  <h2 className="text-base font-medium text-blue-800 dark:text-blue-300">
                    Thông tin học sinh
                  </h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Họ và tên học sinh
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {medication.studentName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Lớp
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {medication.class}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Mã học sinh
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {medication.studentId}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Thời gian sử dụng
                      </h3>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(medication.startDate).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Medication Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="bg-green-50 dark:bg-green-900/30 p-3 border-b border-green-200 dark:border-green-800">
                  <h2 className="text-base font-medium text-green-800 dark:text-green-300">
                    Danh sách thuốc yêu cầu
                  </h2>
                </div>
                <div className="p-4">
                  {medication.medicineRequestItems &&
                  medication.medicineRequestItems.length > 0 ? (
                    <div className="space-y-6">
                      {medication.medicineRequestItems.map(
                        (medicine, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {medicine.medicineName}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                Thuốc #{index + 1}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Tổng liều lượng
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {medicine.dosage && medicine.dosage !== "N/A"
                                    ? `${medicine.dosage} ${
                                        medicine.dosageUnit || "viên"
                                      }`
                                    : "Chưa xác định"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Tần suất uống thuốc
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {medicine.frequency &&
                                  medicine.frequency !== "N/A"
                                    ? formatFrequency(medicine.frequency)
                                    : "Chưa xác định"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Liều lượng mỗi lần
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {medicine.dosage &&
                                  medicine.frequency &&
                                  medicine.dosage !== "N/A" &&
                                  medicine.frequency !== "N/A"
                                    ? calculateDosagePerAdministration(
                                        `${medicine.dosage} ${
                                          medicine.dosageUnit || "viên"
                                        }`,
                                        medicine.frequency
                                      )
                                    : "Chưa xác định"}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                  Thời gian uống
                                </h4>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {medicine.timeOfDay &&
                                  medicine.timeOfDay !== "N/A"
                                    ? Array.isArray(medicine.timeOfDay)
                                      ? medicine.timeOfDay
                                          .map((time) =>
                                            getTimeOfDayText(time.trim())
                                          )
                                          .join(", ")
                                      : getTimeOfDayText(medicine.timeOfDay)
                                    : "Chưa xác định"}
                                </p>
                              </div>
                            </div>
                            {medicine.instructions &&
                              medicine.instructions !== "N/A" && (
                                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                                  <h4 className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-1">
                                    Hướng dẫn sử dụng
                                  </h4>
                                  <p className="text-sm text-amber-800 dark:text-amber-200">
                                    {medicine.instructions}
                                  </p>
                                </div>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Không có thông tin thuốc
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medication Schedule */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 border-b border-purple-200 dark:border-purple-800">
                <h2 className="text-base font-medium text-purple-800 dark:text-purple-300">
                  Lịch trình uống thuốc dự kiến
                </h2>
              </div>
              <div className="p-4">
                {medication.medicineRequestItems &&
                medication.medicineRequestItems.length > 0 ? (
                  <div className="space-y-6">
                    {medication.medicineRequestItems.map((medicine, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                          {medicine.medicineName}
                        </h3>
                        {medicine.timeOfDay && medicine.timeOfDay !== "N/A" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {(Array.isArray(medicine.timeOfDay)
                              ? medicine.timeOfDay
                              : medicine.timeOfDay.split(", ")
                            ).map((time, timeIndex) => (
                              <div
                                key={timeIndex}
                                className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-green-600 dark:text-green-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                                      {getTimeOfDayText(time.trim())}
                                    </h4>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      {medicine.dosage &&
                                      medicine.frequency &&
                                      medicine.dosage !== "N/A" &&
                                      medicine.frequency !== "N/A"
                                        ? calculateDosagePerAdministration(
                                            `${medicine.dosage} ${
                                              medicine.dosageUnit || "viên"
                                            }`,
                                            medicine.frequency
                                          )
                                        : "Chưa xác định"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-4">
                            Chưa có lịch trình uống thuốc được xác định
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-4">
                    Chưa có lịch trình uống thuốc được xác định
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;
