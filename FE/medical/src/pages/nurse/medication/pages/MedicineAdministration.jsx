import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiPlay,
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
  FiInfo,
  FiCheck,
  FiXCircle,
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
  const [selectedMedicineItem, setSelectedMedicineItem] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [failureFormData, setFailureFormData] = useState({
    medicineRequestItemId: 0,
    period: "",
    staffId: 0,
    failureReason: "",
    notes: "",
  });

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  useEffect(() => {
    loadAllData();

    // Cleanup function to clear data when component unmounts
    return () => {
      setAssignedRequests([]);
    };
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    // Clear any existing data first to ensure fresh data
    setAssignedRequests([]);
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
        // Ensure we always set the data, even if it's an empty array
        setAssignedRequests(response.data || []);
      } else {
        // If API call fails, clear the data
        setAssignedRequests([]);
      }
    } catch (error) {
      console.error("Error loading assigned requests:", error);
      // If there's an error, clear the data
      setAssignedRequests([]);
    }
  };

  const handleStartAdministration = async () => {
    if (!selectedRequest) {
      alert("Không có yêu cầu được chọn");
      return;
    }

    if (!selectedMedicineItem) {
      alert("Vui lòng chọn thuốc cần cho uống");
      return;
    }

    if (!selectedPeriod) {
      alert("Vui lòng chọn buổi uống thuốc");
      return;
    }

    // Validate if there's already an in-progress request for this student
    const studentId = selectedRequest.student?.studentId;
    const studentName = selectedRequest.student
      ? `${selectedRequest.student.firstName} ${selectedRequest.student.lastName}`
      : selectedRequest.studentName || "học sinh này";

    const validation = await validateMedicationStart(studentId, studentName);
    if (!validation.canStart) {
      alert(validation.message);
      return;
    }

    try {
      // Use the correct parameters: medicineRequestItemId, staffId, period
      const response = await medicationService.completeMedicationRequest(
        selectedMedicineItem.medicineRequestItemId,
        currentStaffId,
        selectedPeriod
      );

      if (response.success) {
        alert("Bắt đầu cho uống thuốc thành công!");
        setShowStartModal(false);
        setSelectedMedicineItem(null);
        setSelectedPeriod("");
        loadAllData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi bắt đầu cho uống thuốc");
      console.error("Error starting administration:", error);
    }
  };

  const handleReportFailure = () => {
    if (!selectedRequest) {
      alert("Không có yêu cầu được chọn");
      return;
    }

    if (!selectedMedicineItem) {
      alert("Vui lòng chọn thuốc cần báo cáo thất bại");
      return;
    }

    if (!selectedPeriod) {
      alert("Vui lòng chọn buổi uống thuốc");
      return;
    }

    // Initialize failure form data
    setFailureFormData({
      medicineRequestItemId: selectedMedicineItem.medicineRequestItemId,
      period: selectedPeriod,
      staffId: currentStaffId,
      failureReason: "",
      notes: "",
    });

    setShowFailureModal(true);
  };

  const handleFailureFormSubmit = async () => {
    if (!failureFormData.failureReason.trim()) {
      alert("Vui lòng nhập lý do thất bại");
      return;
    }

    try {
      const response = await medicationService.reportMedicationFailure(
        failureFormData
      );

      if (response.success) {
        alert("Báo cáo thất bại thành công");
        setShowFailureModal(false);
        setFailureFormData({
          medicineRequestItemId: 0,
          period: "",
          staffId: 0,
          failureReason: "",
          notes: "",
        });
        // Refresh data
        loadAllData();
      } else {
        alert(response.message || "Không thể báo cáo thất bại");
      }
    } catch (error) {
      console.error("Error reporting failure:", error);
      alert("Có lỗi xảy ra khi báo cáo thất bại");
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
          <table
            key={`assigned-requests-${assignedRequests.length}-${loading}`}
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
          >
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : currentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có dữ liệu
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
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setSelectedMedicineItem(null);
                              setSelectedPeriod("");
                              setShowStartModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Bắt đầu cho uống thuốc"
                          >
                            <FiPlay className="h-4 w-4" />
                          </button>
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

      {/* Detail Modal - Enhanced with Full Schema */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
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

            <div className="px-6 py-4 space-y-6">
              {/* Request Overview */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                  <FiFileText className="mr-2" />
                  Thông tin yêu cầu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedRequest.status, activeSubTab)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                      Ngày uống thuốc
                    </label>
                    <p className="mt-1 text-sm text-blue-900 dark:text-blue-100">
                      {formatDate(selectedRequest.date)}
                    </p>
                  </div>
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

              {/* Assigned Items - Comprehensive Display */}
              {selectedRequest.assignedItems &&
                selectedRequest.assignedItems.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <FiTablet className="mr-2" />
                      Danh sách thuốc được phân công (
                      {selectedRequest.assignedItems.length} loại)
                    </h4>
                    <div className="space-y-4">
                      {selectedRequest.assignedItems.map((item, index) => (
                        <div
                          key={item.medicineRequestItemId || index}
                          className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-neutral-700"
                        >
                          {/* Medicine Header */}
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {item.medicineName}
                            </h5>
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
                                <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                                  <FiClock className="mr-2" />
                                  Lịch trình phân công (
                                  {item.assignedPeriods.length} buổi)
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {item.assignedPeriods.map(
                                    (period, periodIndex) => (
                                      <div
                                        key={periodIndex}
                                        className={`p-3 rounded border ${
                                          period.verificationStatus === "failed"
                                            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                                            : period.verificationStatus ===
                                              "completed"
                                            ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                                            : "bg-white dark:bg-neutral-600 border-gray-200 dark:border-gray-500"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-3">
                                            <div className="flex flex-col space-y-1">
                                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                {period.period}
                                              </span>
                                              {period.verificationStatus && (
                                                <span
                                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    period.verificationStatus ===
                                                    "failed"
                                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                      : period.verificationStatus ===
                                                        "completed"
                                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                      : period.verificationStatus ===
                                                        "pending"
                                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                                  }`}
                                                >
                                                  {period.verificationStatus ===
                                                  "failed"
                                                    ? "Thất bại"
                                                    : period.verificationStatus ===
                                                      "completed"
                                                    ? "Hoàn thành"
                                                    : period.verificationStatus ===
                                                      "pending"
                                                    ? "Chờ xử lý"
                                                    : period.verificationStatus}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              Thời gian:
                                            </div>
                                            <div className="text-xs text-gray-900 dark:text-gray-100 font-mono">
                                              {formatDateTime(period.timestamp)}
                                            </div>
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
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center">
                      <FiAlertCircle className="mr-2" />
                      Thông tin thuốc (Schema cũ)
                    </h4>
                    <div className="space-y-3">
                      {selectedRequest.medicineRequestItems.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="border border-yellow-200 dark:border-yellow-600 rounded-lg p-3 bg-white dark:bg-neutral-700"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Tên thuốc:
                                </span>
                                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                                  {item.medicineName}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Tổng liều lượng:
                                </span>
                                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                  {item.dosage}{" "}
                                  {item.dosageUnit ||
                                    getMedicineUnit(item.medicineName)}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Tần suất uống:
                                </span>
                                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                  {item.frequency} lần/ngày
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Thời gian uống:
                                </span>
                                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                                  {item.timeOfDay || "N/A"}
                                </p>
                              </div>
                            </div>
                            {item.instructions && (
                              <div className="mt-2">
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                  Hướng dẫn:
                                </span>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                {activeSubTab === "assigned" && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedMedicineItem(null);
                      setSelectedPeriod("");
                      setShowStartModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center"
                  >
                    <FiPlay className="mr-2 h-4 w-4" />
                    Bắt đầu cho uống thuốc
                  </button>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Administration Modal - Enhanced with Full Details */}
      {showStartModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <FiPlay className="mr-2 text-green-600" />
                  Bắt đầu cho uống thuốc
                </h3>
                <button
                  onClick={() => {
                    setShowStartModal(false);
                    setSelectedMedicineItem(null);
                    setSelectedPeriod("");
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Request Summary */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="grid grid-cols-3 items-center gap-4">
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Yêu cầu:
                    </span>
                    <p className="text-green-900 dark:text-green-100">
                      #{selectedRequest.requestId}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div>
                      <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                        {selectedRequest.studentName ||
                          `${selectedRequest.student?.firstName || ""} ${
                            selectedRequest.student?.lastName || ""
                          }`.trim() ||
                          "N/A"}
                      </h4>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Lớp: {selectedRequest.className} • Mã:{" "}
                        {selectedRequest.studentCode}
                      </p>
                    </div>
                  </div>
                  {/* Request ID */}

                  {/* Date */}
                  <div>
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Ngày uống:
                    </span>
                    <p className="text-green-900 dark:text-green-100">
                      {formatDate(selectedRequest.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medicine Selection */}
              {selectedRequest.assignedItems &&
              selectedRequest.assignedItems.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <FiTablet className="mr-2 text-blue-600" />
                    Chọn thuốc cần cho uống (
                    {selectedRequest.assignedItems.length} loại)
                  </h4>

                  {selectedRequest.assignedItems.map((item, index) => (
                    <div
                      key={item.medicineRequestItemId || index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedMedicineItem?.medicineRequestItemId ===
                        item.medicineRequestItemId
                          ? "border-blue-500 bg-blue-100 dark:bg-blue-900/40"
                          : "border-blue-200 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setSelectedMedicineItem(item);
                        setSelectedPeriod(""); // Reset period when medicine changes
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="selectedMedicine"
                            checked={
                              selectedMedicineItem?.medicineRequestItemId ===
                              item.medicineRequestItemId
                            }
                            onChange={() => {
                              setSelectedMedicineItem(item);
                              setSelectedPeriod(""); // Reset period when medicine changes
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <h5 className="text-base font-semibold text-blue-900 dark:text-blue-100">
                            {item.medicineName}
                          </h5>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          #{item.medicineRequestItemId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                        <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                          <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                            Liều lượng
                          </label>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {item.dosage} {item.dosageUnit}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                          <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                            Tần suất
                          </label>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {item.frequency} lần/ngày
                          </p>
                        </div>
                        <div className="bg-white dark:bg-neutral-700 p-2 rounded">
                          <label className="block text-xs font-medium text-blue-700 dark:text-blue-300">
                            Thời gian
                          </label>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            {item.timeOfDay}
                          </p>
                        </div>
                      </div>

                      {item.instructions && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border border-amber-200 dark:border-amber-800 mb-3">
                          <label className="block text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                            <FiInfo className="inline mr-1" />
                            Hướng dẫn sử dụng:
                          </label>
                          <p className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap">
                            {item.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback for old schema */
                selectedRequest.medicineRequestItems && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                      <FiTablet className="mr-2 text-yellow-600" />
                      Danh sách thuốc cần cho uống (Schema cũ)
                    </h4>

                    {selectedRequest.medicineRequestItems.map((item, index) => (
                      <div
                        key={index}
                        className="border border-yellow-200 dark:border-yellow-600 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20"
                      >
                        <h5 className="text-base font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                          {item.medicineName}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-yellow-700 dark:text-yellow-300">
                              Liều lượng
                            </label>
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              {item.dosage}{" "}
                              {item.dosageUnit ||
                                getMedicineUnit(item.medicineName)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-yellow-700 dark:text-yellow-300">
                              Tần suất
                            </label>
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              {item.frequency} lần/ngày
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-yellow-700 dark:text-yellow-300">
                              Thời gian
                            </label>
                            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                              {item.timeOfDay || "N/A"}
                            </p>
                          </div>
                        </div>
                        {item.instructions && (
                          <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                            <label className="block text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                              Hướng dẫn:
                            </label>
                            <p className="text-sm text-amber-900 dark:text-amber-100">
                              {item.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* Period Selection */}
              {selectedMedicineItem && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                    <FiClock className="mr-2 text-purple-600" />
                    Chọn buổi uống thuốc
                  </h4>

                  {selectedMedicineItem.assignedPeriods &&
                  selectedMedicineItem.assignedPeriods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMedicineItem.assignedPeriods
                        .filter((period) => period.status === "Assigned") // Only show assigned periods
                        .map((period, periodIndex) => (
                          <div
                            key={periodIndex}
                            className={`border rounded-lg p-3 cursor-pointer transition-all ${
                              selectedPeriod === period.period
                                ? "border-purple-500 bg-purple-100 dark:bg-purple-900/40"
                                : "border-purple-200 dark:border-purple-600 bg-white dark:bg-neutral-700 hover:border-purple-300"
                            }`}
                            onClick={() => setSelectedPeriod(period.period)}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="selectedPeriod"
                                value={period.period}
                                checked={selectedPeriod === period.period}
                                onChange={(e) =>
                                  setSelectedPeriod(e.target.value)
                                }
                                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <div>
                                  <span className="px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    {period.period}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Phân công lúc:
                                </div>
                                <div className="text-xs text-gray-900 dark:text-gray-100 font-mono">
                                  {formatDateTime(period.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        Không có buổi uống thuốc nào được phân công cho thuốc
                        này
                      </p>
                    </div>
                  )}

                  {selectedPeriod && (
                    <div className="mt-3 p-3 bg-purple-100 dark:bg-purple-900/30 rounded border border-purple-300 dark:border-purple-700">
                      <div className="flex items-center space-x-2">
                        <FiCheck className="text-purple-600 dark:text-purple-400 h-4 w-4" />
                        <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                          Đã chọn buổi: {selectedPeriod}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Message */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <FiCheck className="text-green-600 dark:text-green-400 h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
                      Xác nhận bắt đầu cho uống thuốc
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                      Bạn sẽ bắt đầu quá trình cho học sinh uống thuốc theo đúng
                      hướng dẫn trên. Vui lòng đảm bảo đã kiểm tra kỹ thông tin
                      thuốc và liều lượng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => {
                    setShowStartModal(false);
                    setSelectedMedicineItem(null);
                    setSelectedPeriod("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReportFailure}
                  disabled={!selectedMedicineItem || !selectedPeriod}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                    selectedMedicineItem && selectedPeriod
                      ? "text-white bg-red-600 hover:bg-red-700"
                      : "text-gray-400 bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  Báo cáo thất bại
                </button>
                <button
                  onClick={handleStartAdministration}
                  disabled={!selectedMedicineItem || !selectedPeriod}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center ${
                    selectedMedicineItem && selectedPeriod
                      ? "text-white bg-green-600 hover:bg-green-700"
                      : "text-gray-400 bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  <FiPlay className="mr-2 h-4 w-4" />
                  Bắt đầu cho uống thuốc
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
