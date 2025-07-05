import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { medicationService } from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import { transformParentMedicationData } from "../../../utils/api/medication/parentMedicationUtils";
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
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {error || "Không tìm thấy yêu cầu thuốc"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
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
        return "Buổi sáng";
      case "noon":
        return "Buổi trưa";
      case "afternoon":
        return "Buổi chiều";
      case "as_needed":
        return "Khi cần";
      default:
        return timeCode;
    }
  };

  const completedDoses = medication.administrationLog.filter(
    (log) => log.status === "completed"
  ).length;
  const totalDoses = medication.administrationLog.length;
  const progressPercentage = Math.min(100, (completedDoses / totalDoses) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl pt-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
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
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  In
                </button>
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

          <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                  Thông tin học sinh
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Họ và tên học sinh
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.studentName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Mã học sinh
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.studentId}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Lớp
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.class}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                  Thông tin thuốc
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Tên thuốc
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.medicationName}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Liều lượng
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.dosage}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Tần suất
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.frequency === "once"
                          ? "Một lần mỗi ngày"
                          : medication.frequency === "twice"
                          ? "Hai lần mỗi ngày"
                          : medication.frequency === "thrice"
                          ? "Ba lần mỗi ngày"
                          : "Khi cần thiết"}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Thời điểm uống thuốc
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {medication.timeOfDay.map((time) => (
                          <span
                            key={time}
                            className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                          >
                            {getTimeOfDayText(time)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Hướng dẫn đặc biệt
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {medication.specialInstructions || "Không có"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Thời gian sử dụng
                      </h3>
                      <p className="text-base text-gray-900 dark:text-gray-100">
                        {new Date(medication.startDate).toLocaleDateString(
                          "vi-VN"
                        )}{" "}
                        -{" "}
                        {new Date(medication.endDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Tiến độ sử dụng
                      </h3>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {completedDoses}/{totalDoses} liều (
                        {Math.round(progressPercentage)}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                  Lịch sử sử dụng thuốc
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <th className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-6 text-center">
                        Ngày & Thời gian
                      </th>
                      <th className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-6 text-center">
                        Trạng thái
                      </th>
                      <th className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-6 text-center">
                        Người thực hiện
                      </th>
                      <th className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-6 text-center">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {medication.administrationLog.map((log, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                          {new Date(log.date).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getAdministrationStatusBadge(log.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                          {log.administrator || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 dark:text-gray-400">
                          {log.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-lg font-medium text-blue-800 dark:text-blue-300">
                  Ghi chú của nhân viên y tế
                </h2>
              </div>
              <div className="p-6">
                {medication.notes.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    Chưa có ghi chú nào từ nhân viên y tế
                  </p>
                ) : (
                  <div className="space-y-4">
                    {medication.notes.map((note, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {note.author}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              ({note.role})
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(note.date).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {note.content}
                        </p>
                      </div>
                    ))}
                  </div>
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
