import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiPlay,
  FiCheck,
  FiEye,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiActivity,
  FiX,
  FiAlertCircle,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import {
  transformRequestData,
  validateMedicationStart,
} from "../utils/medicationUtils";
import { useMedicationRequests } from "../hooks/useMedicationRequests";
import { getMedicineUnit } from "../../../../utils/medicine/medicineUnits";

const MedicineAdministration = () => {
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadAssignedRequests(), loadCompletedRequests()]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const loadAssignedRequests = async () => {
    try {
      const response = await medicationService.getAssignedMedicationRequests();
      if (response.success) {
        setAssignedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading assigned requests:", error);
    }
  };

  const loadCompletedRequests = async () => {
    try {
      const response = await medicationService.getCompletedMedicationRequests();
      if (response.success) {
        setCompletedRequests(response.data);
      }
    } catch (error) {
      console.error("Error loading completed requests:", error);
    }
  };

  const handleStartAdministration = async () => {
    if (!selectedRequest) {
      alert("Không có yêu cầu được chọn");
      return;
    }

    // Validate if there's already an in-progress request for this student
    const studentId = selectedRequest.student?.studentId;
    const studentName = selectedRequest.student
      ? `${selectedRequest.student.firstName} ${selectedRequest.student.lastName}`
      : "học sinh này";

    const validation = await validateMedicationStart(studentId, studentName);
    if (!validation.canStart) {
      alert(validation.message);
      return;
    }

    try {
      const response = await medicationService.startMedicationAdministration(
        selectedRequest.requestId,
        currentStaffId
      );

      if (response.success) {
        alert("Bắt đầu cho uống thuốc thành công!");
        setShowStartModal(false);
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi bắt đầu cho uống thuốc");
      console.error("Error starting administration:", error);
    }
  };

  const handleCompleteRequest = async () => {
    if (!selectedRequest) {
      alert("Không có yêu cầu được chọn");
      return;
    }

    try {
      const response = await medicationService.completeMedicationRequest(
        selectedRequest.requestId,
        currentStaffId,
        "Hoàn thành cho uống thuốc"
      );

      if (response.success) {
        alert("Hoàn thành yêu cầu thuốc thành công!");
        setShowCompleteModal(false);
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi hoàn thành yêu cầu thuốc");
      console.error("Error completing request:", error);
    }
  };

  const getCurrentData = () => {
    switch (activeSubTab) {
      case "assigned":
        return assignedRequests;
      case "completed":
        return completedRequests;
      default:
        return [];
    }
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = `${request.student?.firstName || ""} ${
        request.student?.lastName || ""
      }`.toLowerCase();
      const medicineName =
        request.medicineRequestItems?.[0]?.medicineName?.toLowerCase() || "";
      const requestId = request.requestId?.toString() || "";

      return (
        studentName.includes(searchLower) ||
        medicineName.includes(searchLower) ||
        requestId.includes(searchLower)
      );
    });
  };

  const getStatusBadge = (status, subTab) => {
    const statusMap = {
      assigned: {
        label: "Chờ cho uống",
        color: "bg-orange-100 text-orange-800",
      },
      completed: {
        label: "Đã hoàn thành",
        color: "bg-green-100 text-green-800",
      },
    };

    const config = statusMap[subTab] || statusMap.assigned;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const isOneTimeFrequency = (frequency) => {
    if (!frequency) return false;
    const freq = frequency.toLowerCase();
    return freq.includes("1 lần") || freq.includes("một lần") || freq === "1";
  };

  const formatTimeOfDay = (timeOfDay) => {
    if (!timeOfDay) return "";

    const timeMap = {
      morning: "Buổi sáng (6:00 - 11:00)",
      noon: "Buổi trưa (11:00 - 14:00)",
      afternoon: "Buổi chiều (14:00 - 18:00)",
      as_needed: "Khi cần thiết",
    };

    // Xử lý trường hợp có nhiều thời điểm ngăn cách bởi dấu phẩy
    if (timeOfDay.includes(",")) {
      const times = timeOfDay.split(",").map((time) => time.trim());
      const vietnameseTimes = times.map(
        (time) => timeMap[time.toLowerCase()] || time
      );
      return vietnameseTimes.join(", ");
    }

    return timeMap[timeOfDay.toLowerCase()] || timeOfDay;
  };

  const currentRequests = filterRequests(getCurrentData());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Cho uống thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bắt đầu và quản lý việc cho học sinh uống thuốc
          </p>
        </div>
        <button
          onClick={loadAllData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 p-1 rounded-lg">
        {[
          { key: "assigned", label: "Chờ cho uống", icon: FiClock },
          { key: "completed", label: "Đã hoàn thành", icon: FiCheck },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              activeSubTab === key
                ? "bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeSubTab === key
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
              }`}
            >
              {key === "assigned"
                ? assignedRequests.length
                : completedRequests.length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên học sinh, thuốc hoặc ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 w-full"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
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
                  Y tá phụ trách
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày gửi yêu cầu
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày uống thuốc
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
              {currentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr
                    key={request.requestId}
                    className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {request.student?.firstName}{" "}
                            {request.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp:{" "}
                            {request.student?.class?.className ||
                              request.className}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {request.medicineRequestItems?.[0]?.medicineName ||
                          "N/A"}
                      </div>
                      {isOneTimeFrequency(
                        request.medicineRequestItems?.[0]?.frequency
                      ) && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          Uống 1 lần
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="ml-2">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {request.staff?.firstName} {request.staff?.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      {request.date
                        ? formatDate(request.date)
                        : formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(request.status, activeSubTab)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>
                        {activeSubTab === "assigned" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowStartModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Bắt đầu cho uống thuốc"
                            >
                              <FiPlay className="h-4 w-4" />
                            </button>
                            {isOneTimeFrequency(
                              request.medicineRequestItems?.[0]?.frequency
                            ) && (
                              <button
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowCompleteModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                title="Hoàn thành ngay (uống 1 lần)"
                              >
                                <FiCheck className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu thuốc #{selectedRequest.requestId}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Học sinh
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.student?.firstName}{" "}
                    {selectedRequest.student?.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.student?.class?.className ||
                      selectedRequest.className}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Y tá phụ trách
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.staff?.firstName}{" "}
                    {selectedRequest.staff?.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày gửi yêu cầu
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedRequest.requestDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày uống thuốc
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedRequest.date)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </label>
                  <p className="mt-1">
                    {getStatusBadge(selectedRequest.status, activeSubTab)}
                  </p>
                </div>
                {activeSubTab === "completed" &&
                  selectedRequest.completedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ngày hoàn thành
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                        {formatDateTime(selectedRequest.completedDate)}
                      </p>
                    </div>
                  )}
              </div>

              {selectedRequest.medicineRequestItems && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thông tin thuốc
                  </label>
                  <div className="space-y-3">
                    {selectedRequest.medicineRequestItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Tên thuốc:
                            </span>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Tổng liều lượng
                            </span>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {item.dosage}{" "}
                              {item.dosageUnit ||
                                getMedicineUnit(item.medicineName)}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Liều lượng mỗi lần
                            </span>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {item.dosage && item.frequency
                                ? `${(item.dosage / item.frequency).toFixed(
                                    item.dosage % item.frequency === 0 ? 0 : 1
                                  )} ${
                                    item.dosageUnit ||
                                    getMedicineUnit(item.medicineName)
                                  }/lần`
                                : `${item.dosagePerTime || "1"} ${
                                    item.dosageUnit ||
                                    getMedicineUnit(item.medicineName)
                                  }/lần`}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Tần suất uống
                            </span>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {item.frequency} lần/ngày
                            </p>
                          </div>
                        </div>

                        {(item.timeOfDay || item.schedule) && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                              Lịch uống thuốc:
                            </span>
                            <p className="text-sm text-gray-900 dark:text-gray-100 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                              {formatTimeOfDay(item.timeOfDay) || item.schedule}
                            </p>
                          </div>
                        )}

                        {item.instructions && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Hướng dẫn:
                            </span>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                              {item.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Start Administration Modal */}
      {showStartModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Bắt đầu cho uống thuốc
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    Bắt đầu cho học sinh uống thuốc:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Thuốc:{" "}
                    {selectedRequest.medicineRequestItems?.[0]?.medicineName}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Bạn sẽ bắt đầu quá trình cho học sinh uống thuốc.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleStartAdministration}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Bắt đầu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Modal */}
      {showCompleteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Hoàn thành cho uống thuốc
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100 inline">
                    Hoàn thành cho học sinh uống thuốc:{" "}
                    <span className="font-medium">
                      {selectedRequest.student?.firstName}{" "}
                      {selectedRequest.student?.lastName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Thuốc:{" "}
                    {selectedRequest.medicineRequestItems?.[0]?.medicineName}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Chỉ dùng cho thuốc uống 1 lần. Học sinh đã uống thuốc thành
                  công và hoàn thành yêu cầu.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCompleteRequest}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineAdministration;
