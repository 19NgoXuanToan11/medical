import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiFileText,
  FiCheck,
  FiX,
  FiInfo,
  FiPlus,
} from "react-icons/fi";
import {
  calculateDosagePerAdministration,
  formatFrequency,
} from "../../../utils/api/medication/medicationUtils";

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
const formatDosageWithUnit = (dosage) => {
  const { number, unit } = parseDosage(dosage);
  return `${number} ${unit}`;
};

const StaffMedicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medication, setMedication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    administered: true,
    notes: "",
  });

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockMedications = [
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          class: "3A",
          medication: "Paracetamol",
          dosage: "1 viên",
          frequency: "Khi sốt trên 38°C",
          requestDate: "2023-06-15",
          status: "pending",
          parentNote: "Con bị sốt nhẹ sáng nay, đã uống 1 viên lúc 7h.",
          medicalCondition: "Sốt nhẹ",
          allergyHistory: "Không",
          currentMedications: "Không có",
          parentName: "Nguyễn Văn Bình",
          parentPhone: "0987654321",
          administrationInstructions:
            "Uống sau khi ăn. Không uống quá 4 viên một ngày.",
          sideEffects: "Buồn ngủ, có thể gây khó chịu dạ dày.",
          requestHistory: [
            {
              date: "2023-06-15T08:30:00",
              action: "Yêu cầu đã được tạo bởi phụ huynh",
            },
            { date: "2023-06-15T09:15:00", action: "Y tá nhận được yêu cầu" },
          ],
          administrationLogs: [],
        },
        {
          id: 2,
          studentName: "Trần Thị Bình",
          class: "2B",
          medication: "Cetirizine",
          dosage: "5ml",
          frequency: "Sáng 1 lần",
          requestDate: "2023-06-14",
          status: "approved",
          parentNote: "Con bị dị ứng phấn hoa, cần uống thuốc mỗi sáng.",
          medicalCondition: "Dị ứng theo mùa",
          allergyHistory: "Dị ứng phấn hoa, bụi nhà",
          currentMedications: "Không có",
          parentName: "Trần Văn Cường",
          parentPhone: "0912345678",
          administrationInstructions: "Uống trước bữa sáng 30 phút.",
          sideEffects: "Buồn ngủ, khô miệng.",
          approvedBy: "Lê Thị Hoa",
          approvedDate: "2023-06-14T14:20:00",
          requestHistory: [
            {
              date: "2023-06-14T10:30:00",
              action: "Yêu cầu đã được tạo bởi phụ huynh",
            },
            { date: "2023-06-14T11:15:00", action: "Y tá nhận được yêu cầu" },
            {
              date: "2023-06-14T14:20:00",
              action: "Yêu cầu đã được duyệt bởi Lê Thị Hoa",
            },
          ],
        },
        {
          id: 3,
          studentName: "Lê Minh Cường",
          class: "5C",
          medication: "Ventolin",
          dosage: "2 nhát xịt",
          frequency: "Khi khó thở",
          requestDate: "2023-06-10",
          status: "completed",
          parentNote: "Con bị hen suyễn, cần mang theo thuốc xịt khi khó thở.",
          medicalCondition: "Hen suyễn",
          allergyHistory: "Dị ứng với bụi, lông động vật",
          currentMedications: "Fluticasone (dùng mỗi tối)",
          parentName: "Lê Văn Dũng",
          parentPhone: "0978123456",
          administrationInstructions:
            "Xịt khi có triệu chứng khó thở. Chờ ít nhất 1 phút giữa các lần xịt.",
          sideEffects: "Có thể gây tim đập nhanh, run tay.",
          approvedBy: "Phạm Văn Hùng",
          approvedDate: "2023-06-11T09:30:00",
          completedBy: "Phạm Văn Hùng",
          completedDate: "2023-06-17T15:45:00",
          administrationLogs: [
            {
              date: "2023-06-12T10:30:00",
              administered: true,
              notes: "Học sinh khó thở sau giờ thể dục",
            },
            {
              date: "2023-06-15T13:15:00",
              administered: true,
              notes: "Học sinh có triệu chứng nhẹ",
            },
          ],
          requestHistory: [
            {
              date: "2023-06-10T08:30:00",
              action: "Yêu cầu đã được tạo bởi phụ huynh",
            },
            { date: "2023-06-10T09:45:00", action: "Y tá nhận được yêu cầu" },
            {
              date: "2023-06-11T09:30:00",
              action: "Yêu cầu đã được duyệt bởi Phạm Văn Hùng",
            },
            { date: "2023-06-17T15:45:00", action: "Yêu cầu đã hoàn thành" },
          ],
        },
        {
          id: 4,
          studentName: "Phạm Thị Dung",
          class: "4A",
          medication: "Probiotics",
          dosage: "1 gói",
          frequency: "Sau bữa trưa",
          requestDate: "2023-06-13",
          status: "rejected",
          parentNote: "Con bị đau bụng, cần uống men vi sinh sau bữa trưa.",
          medicalCondition: "Đau bụng, tiêu chảy nhẹ",
          allergyHistory: "Không",
          currentMedications: "Không có",
          parentName: "Phạm Văn Enh",
          parentPhone: "0923456789",
          rejectedBy: "Nguyễn Thị Lan",
          rejectedDate: "2023-06-13T16:20:00",
          rejectReason: "Cần giấy chỉ định của bác sĩ",
          requestHistory: [
            {
              date: "2023-06-13T10:30:00",
              action: "Yêu cầu đã được tạo bởi phụ huynh",
            },
            { date: "2023-06-13T11:45:00", action: "Y tá nhận được yêu cầu" },
            {
              date: "2023-06-13T16:20:00",
              action: "Yêu cầu đã bị từ chối bởi Nguyễn Thị Lan",
            },
          ],
        },
      ];

      const foundMedication = mockMedications.find(
        (med) => med.id === parseInt(id)
      );
      setMedication(foundMedication || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApprove = () => {
    setProcessingAction(true);
    // Simulate API call
    setTimeout(() => {
      setMedication((prev) => ({
        ...prev,
        status: "approved",
        approvedBy: "Nguyễn Thị Y Tá",
        approvedDate: new Date().toISOString(),
        requestHistory: [
          ...prev.requestHistory,
          {
            date: new Date().toISOString(),
            action: "Yêu cầu đã được duyệt bởi Nguyễn Thị Y Tá",
          },
        ],
      }));
      setProcessingAction(false);
    }, 1000);
  };

  const handleReject = () => {
    setProcessingAction(true);
    // Simulate API call
    setTimeout(() => {
      setMedication((prev) => ({
        ...prev,
        status: "rejected",
        rejectedBy: "Nguyễn Thị Y Tá",
        rejectedDate: new Date().toISOString(),
        rejectReason: "Không đủ thông tin",
        requestHistory: [
          ...prev.requestHistory,
          {
            date: new Date().toISOString(),
            action: "Yêu cầu đã bị từ chối bởi Nguyễn Thị Y Tá",
          },
        ],
      }));
      setProcessingAction(false);
    }, 1000);
  };

  const handleComplete = () => {
    setProcessingAction(true);
    // Simulate API call
    setTimeout(() => {
      setMedication((prev) => ({
        ...prev,
        status: "completed",
        completedBy: "Nguyễn Thị Y Tá",
        completedDate: new Date().toISOString(),
        requestHistory: [
          ...prev.requestHistory,
          {
            date: new Date().toISOString(),
            action: "Yêu cầu đã hoàn thành",
          },
        ],
      }));
      setProcessingAction(false);
    }, 1000);
  };

  const handleAdminFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdminFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAdministrationLog = () => {
    setProcessingAction(true);
    // Simulate API call
    setTimeout(() => {
      const newLog = { ...adminFormData };
      setMedication((prev) => ({
        ...prev,
        administrationLogs: prev.administrationLogs
          ? [...prev.administrationLogs, newLog]
          : [newLog],
        requestHistory: [
          ...prev.requestHistory,
          {
            date: new Date().toISOString(),
            action: `Thuốc đã được cấp ${
              newLog.administered ? "thành công" : "nhưng không thực hiện"
            }`,
          },
        ],
      }));
      setShowAdminForm(false);
      setAdminFormData({
        date: new Date().toISOString().slice(0, 16),
        administered: true,
        notes: "",
      });
      setProcessingAction(false);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            Chờ xử lý
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            Đã duyệt
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            Hoàn thành
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  // Calculate medication statistics based on administration logs
  const calculateStatistics = (logs) => {
    if (!logs || logs.length === 0) {
      return {
        totalAdministered: 0,
        totalSkipped: 0,
        administrationRate: 0,
        lastAdministered: null,
      };
    }

    const administered = logs.filter((log) => log.administered).length;
    const skipped = logs.filter((log) => !log.administered).length;
    const rate = (administered / logs.length) * 100;

    // Find the most recent administration
    const administeredLogs = logs.filter((log) => log.administered);
    const lastLog =
      administeredLogs.length > 0
        ? administeredLogs.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0].date
        : null;

    return {
      totalAdministered: administered,
      totalSkipped: skipped,
      administrationRate: rate.toFixed(0),
      lastAdministered: lastLog,
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800">
          Không tìm thấy thông tin thuốc
        </h2>
        <p className="mt-2 text-gray-600">
          Yêu cầu thuốc có ID {id} không tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={() => navigate("/nurse/medication")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="mr-2" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/nurse/medication")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Chi tiết yêu cầu thuốc
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Yêu cầu #{medication.id} - Ngày tạo:{" "}
              {new Date(medication.requestDate).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Trạng thái
              </div>
              <div className="mt-1">{getStatusBadge(medication.status)}</div>
            </div>
            <div className="mx-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Ngày gửi yêu cầu
              </div>
              <div className="mt-1 font-medium">
                {new Date(medication.requestDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {medication.status === "pending" && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={processingAction}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheck className="mr-2" /> Duyệt
                </button>
                <button
                  onClick={handleReject}
                  disabled={processingAction}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiX className="mr-2" /> Từ chối
                </button>
              </>
            )}
            {medication.status === "approved" && (
              <button
                onClick={handleComplete}
                disabled={processingAction}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCheck className="mr-2" /> Đánh dấu hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Student and Medication Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Student Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <FiUser className="mr-2 text-blue-500 dark:text-blue-400" /> Thông
              tin học sinh
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Họ và tên
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.studentName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Lớp
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.class}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tình trạng y tế
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.medicalCondition}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tiền sử dị ứng
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.allergyHistory}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Thuốc đang sử dụng
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.currentMedications}
                </div>
              </div>
            </div>
          </div>

          {/* Medication Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <FiFileText className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
              Thông tin thuốc
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tên thuốc
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.medication}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Liều lượng
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDosageWithUnit(medication.dosage)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tần suất
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {formatFrequency(medication.frequency)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Liều lượng mỗi lần
                </div>
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  {medication.dosage && medication.frequency
                    ? calculateDosagePerAdministration(
                        formatDosageWithUnit(medication.dosage),
                        medication.frequency
                      )
                    : "N/A"}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hướng dẫn sử dụng
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.administrationInstructions}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Tác dụng phụ
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.sideEffects}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ghi chú của phụ huynh
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.parentNote}
                </div>
              </div>
            </div>
          </div>

          {/* Medication Statistics */}
          {medication.status === "approved" &&
            medication.administrationLogs && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-neutral-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <FiInfo className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
                  Thống kê sử dụng thuốc
                </h2>

                {(() => {
                  const stats = calculateStatistics(
                    medication.administrationLogs
                  );
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Tổng số lần cấp thuốc
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {stats.totalAdministered}
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Số lần bỏ qua
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {stats.totalSkipped}
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Tỷ lệ cấp thuốc
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {stats.administrationRate}%
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Lần cấp gần nhất
                        </div>
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {stats.lastAdministered
                            ? new Date(
                                stats.lastAdministered
                              ).toLocaleDateString("vi-VN")
                            : "Chưa có"}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

          {/* Administration Logs (if completed or approved) */}
          {(medication.status === "completed" ||
            medication.status === "approved") && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FiClock className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
                  Nhật ký cấp thuốc
                </div>
                {!showAdminForm && (
                  <button
                    onClick={() => setShowAdminForm(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    <FiPlus className="mr-1" /> Thêm nhật ký
                  </button>
                )}
              </h2>

              {showAdminForm && (
                <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-md mb-4 border border-gray-200 dark:border-neutral-600">
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Thêm nhật ký cấp thuốc mới
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Thời gian cấp thuốc
                      </label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={adminFormData.date}
                        onChange={handleAdminFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="administered"
                        name="administered"
                        checked={adminFormData.administered}
                        onChange={handleAdminFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-neutral-600 rounded"
                      />
                      <label
                        htmlFor="administered"
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        Đã cấp thuốc thành công
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="notes"
                      value={adminFormData.notes}
                      onChange={handleAdminFormChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                      placeholder="Nhập ghi chú về việc cấp thuốc..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAdminForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleAddAdministrationLog}
                      disabled={processingAction}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingAction ? "Đang xử lý..." : "Lưu nhật ký"}
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                {medication.administrationLogs &&
                medication.administrationLogs.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thời gian
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Trạng thái
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Ghi chú
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {medication.administrationLogs.map((log, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(log.date).toLocaleString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.administered ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Đã cấp thuốc
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Chưa cấp thuốc
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {log.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Chưa có nhật ký cấp thuốc nào. Hãy thêm nhật ký khi bạn cấp
                    thuốc cho học sinh.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Parent Info and History */}
        <div className="space-y-6">
          {/* Parent Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <FiUser className="mr-2 text-blue-500 dark:text-blue-400" /> Thông
              tin phụ huynh
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Họ và tên
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.parentName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Số điện thoại
                </div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {medication.parentPhone}
                </div>
              </div>
            </div>
          </div>

          {/* Status-specific information */}
          {medication.status === "approved" && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <FiInfo className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
                Thông tin duyệt
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Người duyệt
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {medication.approvedBy}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian duyệt
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(medication.approvedDate).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {medication.status === "rejected" && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <FiInfo className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
                Thông tin từ chối
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Người từ chối
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {medication.rejectedBy}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian từ chối
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(medication.rejectedDate).toLocaleString("vi-VN")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Lý do từ chối
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {medication.rejectReason}
                  </div>
                </div>
              </div>
            </div>
          )}

          {medication.status === "completed" && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <FiInfo className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
                Thông tin hoàn thành
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Người xác nhận
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {medication.completedBy}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Thời gian hoàn thành
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(medication.completedDate).toLocaleString("vi-VN")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request History */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
              <FiCalendar className="mr-2 text-blue-500 dark:text-blue-400" />{" "}
              Lịch sử yêu cầu
            </h2>
            <div className="relative">
              {medication.requestHistory.map((history, index) => (
                <div
                  key={index}
                  className="relative pl-6 pb-4 border-l-2 border-blue-200"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(history.date).toLocaleString("vi-VN")}
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {history.action}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMedicationDetail;
