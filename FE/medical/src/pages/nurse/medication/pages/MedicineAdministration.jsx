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
      await loadAssignedRequests();
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
      const response = await medicationService.completeMedicationRequest(
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
      // Get the first medicine request item
      const medicineItem =
        selectedRequest.medicineRequestItems?.[0] ||
        selectedRequest.assignedItems?.[0];
      if (!medicineItem) {
        alert("Không tìm thấy thông tin thuốc");
        return;
      }

      // Get the correct medicineRequestItemId
      const medicineRequestItemId =
        medicineItem.medicineRequestItemId ||
        medicineItem.id ||
        medicineItem.itemId;

      if (!medicineRequestItemId) {
        alert("Không tìm thấy ID của medicine request item");
        console.error("No valid ID found in medicineItem:", medicineItem);
        return;
      }

      // Determine period based on timeOfDay - use Vietnamese format as backend requires
      let period = "sáng"; // default
      if (medicineItem.timeOfDay) {
        const timeOfDay = medicineItem.timeOfDay.toLowerCase().trim();
        if (timeOfDay.includes("trưa") || timeOfDay.includes("noon")) {
          period = "trưa";
        } else if (
          timeOfDay.includes("chiều") ||
          timeOfDay.includes("afternoon")
        ) {
          period = "chiều";
        } else if (timeOfDay.includes("tối") || timeOfDay.includes("evening")) {
          period = "tối";
        }
      }

      const response = await medicationService.completeMedicationRequest(
        medicineRequestItemId, // medicineRequestItemId
        currentStaffId,
        period
        // Removed notes parameter
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
    return assignedRequests;
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      // Use studentName from new schema or fallback to student object
      const studentName = (
        request.studentName ||
        `${request.student?.firstName || ""} ${request.student?.lastName || ""}`
      ).toLowerCase();

      // Get medicine names from assignedItems or medicineRequestItems
      const medicineNames = (
        request.assignedItems ||
        request.medicineRequestItems ||
        []
      )
        .map((item) => item.medicineName?.toLowerCase() || "")
        .join(" ");

      const requestId = request.requestId?.toString() || "";
      const className = request.className?.toLowerCase() || "";

      return (
        studentName.includes(searchLower) ||
        medicineNames.includes(searchLower) ||
        requestId.includes(searchLower) ||
        className.includes(searchLower)
      );
    });
  };

  const getStatusBadge = (status, subTab) => {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
        Chờ cho uống
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
        <button
          onClick={() => setActiveSubTab("assigned")}
          className="flex items-center px-4 py-2 rounded-md transition-colors duration-200 bg-white dark:bg-neutral-600 text-blue-600 dark:text-blue-400 shadow-sm"
        >
          <FiClock className="h-4 w-4 mr-2" />
          Chờ cho uống
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            {assignedRequests.length}
          </span>
        </button>
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
                  Học sinh & Lớp
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thuốc & Liều lượng
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Buổi được phân công
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Y tá phụ trách
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
                    {/* Học sinh & Lớp */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {request.studentName ||
                              `${request.student?.firstName || ""} ${
                                request.student?.lastName || ""
                              }`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp:{" "}
                            {request.className ||
                              request.student?.class?.className ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Thuốc & Liều lượng */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {(
                          request.assignedItems ||
                          request.medicineRequestItems ||
                          []
                        ).map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.dosage} {item.dosageUnit} - {item.frequency}{" "}
                              lần/ngày
                            </div>
                            {item.instructions && (
                              <div className="text-xs text-blue-600 dark:text-blue-400 italic">
                                {item.instructions}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Buổi được phân công */}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        {(request.assignedItems || []).map(
                          (item, itemIndex) => (
                            <div key={itemIndex}>
                              {(item.assignedPeriods || []).map(
                                (period, periodIndex) => (
                                  <div
                                    key={periodIndex}
                                    className="inline-block mr-1 mb-1"
                                  >
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      {period.period}
                                    </span>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {formatDateTime(period.timestamp)}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        )}
                        {/* Fallback for old schema */}
                        {(!request.assignedItems ||
                          request.assignedItems.length === 0) &&
                          (request.medicineRequestItems || []).map(
                            (item, index) => (
                              <div
                                key={index}
                                className="inline-block mr-1 mb-1"
                              >
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                  {item.timeOfDay || "N/A"}
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    </td>

                    {/* Y tá phụ trách */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="ml-2">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {request.staff?.firstName} {request.staff?.lastName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ngày uống thuốc */}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      <div>{formatDate(request.date)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Yêu cầu cấp thuốc: {formatDate(request.requestDate)}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(request.status, activeSubTab)}
                    </td>

                    {/* Thao tác */}
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
                              (request.assignedItems ||
                                request.medicineRequestItems)?.[0]?.frequency
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
                    {selectedRequest.studentName ||
                      `${selectedRequest.student?.firstName || ""} ${
                        selectedRequest.student?.lastName || ""
                      }`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.className ||
                      selectedRequest.student?.class?.className ||
                      "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mã học sinh
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.studentCode || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phụ huynh
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.parentName || "N/A"}
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
              </div>

              {/* Student Information */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                  <FiUser className="mr-2" />
                  Thông tin học sinh
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-green-700 dark:text-green-300">
                      Họ và tên
                    </label>
                    <p className="mt-1 text-sm font-medium text-green-900 dark:text-green-100">
                      {selectedRequest.studentName ||
                        `${selectedRequest.student?.firstName || ""} ${
                          selectedRequest.student?.lastName || ""
                        }`.trim() ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 dark:text-green-300">
                      Mã học sinh
                    </label>
                    <p className="mt-1 text-sm font-mono text-green-900 dark:text-green-100">
                      {selectedRequest.studentCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-green-700 dark:text-green-300">
                      Lớp học
                    </label>
                    <p className="mt-1 text-sm text-green-900 dark:text-green-100">
                      {selectedRequest.className ||
                        selectedRequest.student?.class?.className ||
                        "N/A"}
                    </p>
                  </div>
                  {selectedRequest.studentId && (
                    <div>
                      <label className="block text-xs font-medium text-green-700 dark:text-green-300">
                        ID học sinh
                      </label>
                      <p className="mt-1 text-sm font-mono text-green-900 dark:text-green-100">
                        {selectedRequest.studentId}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Request Management Information */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                  <FiActivity className="mr-2" />
                  Thông tin quản lý yêu cầu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedRequest.requestedById && (
                    <div>
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Người yêu cầu
                      </label>
                      <p className="mt-1 text-sm text-purple-900 dark:text-purple-100">
                        {selectedRequest.requestedByName ||
                          `ID: ${selectedRequest.requestedById}`}
                      </p>
                    </div>
                  )}
                  {selectedRequest.approvedById && (
                    <div>
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Người phê duyệt
                      </label>
                      <p className="mt-1 text-sm text-purple-900 dark:text-purple-100">
                        {selectedRequest.approvedByName ||
                          `ID: ${selectedRequest.approvedById}`}
                      </p>
                    </div>
                  )}
                  {selectedRequest.assignedStaffId && (
                    <div>
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Y tá được phân công
                      </label>
                      <p className="mt-1 text-sm text-purple-900 dark:text-purple-100">
                        {selectedRequest.assignedStaffName ||
                          `ID: ${selectedRequest.assignedStaffId}`}
                      </p>
                    </div>
                  )}
                  {selectedRequest.createdAt && (
                    <div>
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Ngày tạo yêu cầu
                      </label>
                      <p className="mt-1 text-sm font-mono text-purple-900 dark:text-purple-100">
                        {formatDateTime(selectedRequest.createdAt)}
                      </p>
                    </div>
                  )}
                  {selectedRequest.updatedAt && (
                    <div>
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Cập nhật lần cuối
                      </label>
                      <p className="mt-1 text-sm font-mono text-purple-900 dark:text-purple-100">
                        {formatDateTime(selectedRequest.updatedAt)}
                      </p>
                    </div>
                  )}
                  {selectedRequest.notes && (
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                        Ghi chú
                      </label>
                      <p className="mt-1 text-sm text-purple-900 dark:text-purple-100 whitespace-pre-wrap">
                        {selectedRequest.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.assignedItems &&
                selectedRequest.assignedItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Thông tin thuốc được phân công
                    </label>
                    <div className="space-y-4">
                      {selectedRequest.assignedItems.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-neutral-700"
                        >
                          {/* Medicine Info */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                              {item.medicineName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Liều lượng:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.dosage} {item.dosageUnit}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Tần suất:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.frequency} lần/ngày
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Thời gian:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.timeOfDay}
                                </p>
                              </div>
                            </div>
                            {item.instructions && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Hướng dẫn sử dụng:
                                </span>
                                <p className="text-sm text-blue-600 dark:text-blue-400 italic">
                                  {item.instructions}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Medicine Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded">
                              <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                                Liều lượng
                              </label>
                              <p className="mt-1 text-sm font-medium text-blue-900 dark:text-blue-100">
                                {item.dosage} {item.dosageUnit}
                              </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded">
                              <label className="block text-xs font-medium text-green-700 dark:text-green-300">
                                Tần suất
                              </label>
                              <p className="mt-1 text-sm font-medium text-green-900 dark:text-green-100">
                                {item.frequency} lần/ngày
                              </p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded">
                              <label className="block text-xs font-medium text-yellow-700 dark:text-yellow-300">
                                Thời gian uống
                              </label>
                              <p className="mt-1 text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                {item.timeOfDay}
                              </p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded">
                              <label className="block text-xs font-medium text-purple-700 dark:text-purple-300">
                                Kỳ uống thuốc
                              </label>
                              <p className="mt-1 text-sm font-medium text-purple-900 dark:text-purple-100">
                                {item.period || "N/A"}
                              </p>
                            </div>
                            {item.medicineRequestItemId && (
                              <div className="bg-gray-50 dark:bg-gray-900/30 p-3 rounded">
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                                  ID mục thuốc
                                </label>
                                <p className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100">
                                  {item.medicineRequestItemId}
                                </p>
                              </div>
                            )}
                            {item.medicineId && (
                              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded">
                                <label className="block text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                  ID thuốc
                                </label>
                                <p className="mt-1 text-sm font-mono text-indigo-900 dark:text-indigo-100">
                                  {item.medicineId}
                                </p>
                              </div>
                            )}
                            {item.status && (
                              <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded">
                                <label className="block text-xs font-medium text-orange-700 dark:text-orange-300">
                                  Trạng thái mục
                                </label>
                                <p className="mt-1 text-sm font-medium text-orange-900 dark:text-orange-100">
                                  {item.status === "assigned"
                                    ? "Đã phân công"
                                    : item.status === "completed"
                                    ? "Hoàn thành"
                                    : item.status === "failed"
                                    ? "Thất bại"
                                    : item.status}
                                </p>
                              </div>
                            )}
                            {item.totalDoses && (
                              <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded">
                                <label className="block text-xs font-medium text-teal-700 dark:text-teal-300">
                                  Tổng số liều
                                </label>
                                <p className="mt-1 text-sm font-medium text-teal-900 dark:text-teal-100">
                                  {item.totalDoses}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Instructions */}
                          {item.instructions && (
                            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                              <label className="block text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                                Hướng dẫn sử dụng:
                              </label>
                              <p className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap">
                                {item.instructions}
                              </p>
                            </div>
                          )}

                          {/* Assigned Periods - Enhanced Display */}

                          {item.assignedPeriods &&
                            item.assignedPeriods.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Buổi được phân công:
                                </h5>
                                <div className="space-y-2">
                                  {item.assignedPeriods.map(
                                    (period, periodIndex) => (
                                      <div
                                        key={periodIndex}
                                        className="flex items-center justify-between p-2 bg-white dark:bg-neutral-600 rounded border"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {period.period}
                                          </span>
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            {period.status}
                                          </span>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Phân công lúc:
                                          </div>
                                          <div className="text-xs text-gray-900 dark:text-gray-100">
                                            {formatDateTime(period.timestamp)}
                                          </div>
                                        </div>

                                        {/* Failure Reports Display */}
                                        {period.failureReports &&
                                          period.failureReports.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700">
                                              <h7 className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center">
                                                <FiXCircle className="mr-1 h-3 w-3" />
                                                Báo cáo thất bại (
                                                {period.failureReports.length})
                                              </h7>
                                              <div className="space-y-2">
                                                {period.failureReports.map(
                                                  (report, reportIndex) => (
                                                    <div
                                                      key={reportIndex}
                                                      className="bg-red-100 dark:bg-red-900/50 p-2 rounded text-xs"
                                                    >
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        <div>
                                                          <span className="font-medium text-red-700 dark:text-red-300">
                                                            Lý do:
                                                          </span>
                                                          <p className="text-red-900 dark:text-red-100">
                                                            {
                                                              report.failureReason
                                                            }
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <span className="font-medium text-red-700 dark:text-red-300">
                                                            Người báo cáo:
                                                          </span>
                                                          <p className="text-red-900 dark:text-red-100">
                                                            {report.reportedByName ||
                                                              `ID: ${report.reportedById}`}
                                                          </p>
                                                        </div>
                                                        <div>
                                                          <span className="font-medium text-red-700 dark:text-red-300">
                                                            Thời gian báo cáo:
                                                          </span>
                                                          <p className="text-red-900 dark:text-red-100 font-mono">
                                                            {formatDateTime(
                                                              report.reportedAt
                                                            )}
                                                          </p>
                                                        </div>
                                                        {report.notes && (
                                                          <div>
                                                            <span className="font-medium text-red-700 dark:text-red-300">
                                                              Ghi chú:
                                                            </span>
                                                            <p className="text-red-900 dark:text-red-100">
                                                              {report.notes}
                                                            </p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {/* Additional Period Status Information */}
                                        {period.status &&
                                          period.status !==
                                            period.verificationStatus && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                              <div className="text-xs">
                                                <span className="font-medium text-gray-600 dark:text-gray-400">
                                                  Trạng thái:
                                                </span>
                                                <span
                                                  className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    period.status ===
                                                    "completed"
                                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                      : period.status ===
                                                        "failed"
                                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                  }`}
                                                >
                                                  {period.status === "completed"
                                                    ? "Đã hoàn thành"
                                                    : period.status === "failed"
                                                    ? "Thất bại"
                                                    : period.status}
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Fallback for old schema */}
              {(!selectedRequest.assignedItems ||
                selectedRequest.assignedItems.length === 0) &&
                selectedRequest.medicineRequestItems && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thông tin thuốc (Schema cũ)
                    </label>
                    <div className="space-y-3">
                      {selectedRequest.medicineRequestItems.map(
                        (item, index) => (
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
                                  Tần suất uống
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.frequency} lần/ngày
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Thời gian uống
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.timeOfDay || "N/A"}
                                </p>
                              </div>
                            </div>
                            {item.instructions && (
                              <div className="mt-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Hướng dẫn:
                                </span>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                  {item.instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      )}
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

      {/* Failure Reporting Modal */}
      {showFailureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <FiXCircle className="mr-2 text-red-600" />
                  Báo cáo thất bại cho uống thuốc
                </h3>
                <button
                  onClick={() => {
                    setShowFailureModal(false);
                    setFailureFormData({
                      medicineRequestItemId: 0,
                      period: "",
                      staffId: 0,
                      failureReason: "",
                      notes: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Request Information */}
              {selectedRequest && selectedMedicineItem && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Thông tin yêu cầu
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Học sinh:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedRequest.studentName ||
                          `${selectedRequest.student?.firstName || ""} ${
                            selectedRequest.student?.lastName || ""
                          }`}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Lớp:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedRequest.className ||
                          selectedRequest.student?.className ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Thuốc:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedMedicineItem.medicineName}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Buổi:
                      </span>
                      <p className="text-gray-900 dark:text-gray-100">
                        {selectedPeriod}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Failure Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lý do thất bại <span className="text-red-500">*</span>
                </label>
                <select
                  value={failureFormData.failureReason}
                  onChange={(e) =>
                    setFailureFormData((prev) => ({
                      ...prev,
                      failureReason: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100"
                  required
                >
                  <option value="">Chọn lý do thất bại</option>
                  <option value="Học sinh vắng mặt">Học sinh vắng mặt</option>
                  <option value="Học sinh từ chối uống thuốc">
                    Học sinh từ chối uống thuốc
                  </option>
                  <option value="Thuốc hết hạn">Thuốc hết hạn</option>
                  <option value="Thuốc bị hư hỏng">Thuốc bị hư hỏng</option>
                  <option value="Không đủ thuốc">Không đủ thuốc</option>
                  <option value="Học sinh có phản ứng phụ">
                    Học sinh có phản ứng phụ
                  </option>
                  <option value="Sự cố kỹ thuật">Sự cố kỹ thuật</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú thêm
                </label>
                <textarea
                  value={failureFormData.notes}
                  onChange={(e) =>
                    setFailureFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Mô tả chi tiết về tình huống thất bại..."
                />
              </div>

              {/* Warning Message */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <FiAlertCircle className="text-red-600 dark:text-red-400 h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">
                      Xác nhận báo cáo thất bại
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                      Việc báo cáo thất bại sẽ được ghi nhận vào hệ thống và
                      thông báo đến các bên liên quan. Vui lòng đảm bảo thông
                      tin chính xác trước khi xác nhận.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setShowFailureModal(false);
                    setFailureFormData({
                      medicineRequestItemId: 0,
                      period: "",
                      staffId: 0,
                      failureReason: "",
                      notes: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleFailureFormSubmit}
                  disabled={!failureFormData.failureReason.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                    failureFormData.failureReason.trim()
                      ? "text-white bg-red-600 hover:bg-red-700"
                      : "text-gray-400 bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  Xác nhận báo cáo thất bại
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
