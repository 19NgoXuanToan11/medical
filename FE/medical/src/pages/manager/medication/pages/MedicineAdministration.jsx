import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiActivity,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import {
  transformRequestData,
  validateMedicationStart,
} from "../utils/medicationUtils";
import { useMedicationRequests } from "../hooks/useMedicationRequests";

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

const MedicineAdministration = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAdministrationModal, setShowAdministrationModal] = useState(false);
  const [administrationData, setAdministrationData] = useState({
    administeredTime: "",
    status: "administered",
    frequency: "",
    timesPerDay: 1,
    currentDayCount: 1,
    administeredFrequencies: [],
    failedFrequencies: [],
    failureReasons: {},
    notes: "",
    isReRequest: false,
    reRequestReason: "",
  });
  const [expandedRequest, setExpandedRequest] = useState(null);

  const { loading, setLoading, loadAllStats } = useMedicationRequests();

  // Load assigned requests ready for administration
  const loadAdministrationRequests = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getAssignedMedicationRequests();
      if (response.success) {
        // Filter only assigned requests that haven't been administered yet
        const assignedRequests = response.data.filter(
          (req) => req.status === "Assigned" || req.status === "assigned"
        );
        setRequests(assignedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error loading administration requests:", error);
      setRequests([]);
    }
    setLoading(false);
  };

  // Handle start administration
  const handleStartAdministration = async (request) => {
    // Validate if there's already an in-progress request for this student
    const studentId = request.student?.studentId;
    const studentName = request.student
      ? `${request.student.firstName} ${request.student.lastName}`
      : "học sinh này";

    const validation = await validateMedicationStart(studentId, studentName);
    if (!validation.canStart) {
      alert(validation.message);
      return;
    }

    try {
      // Call the new API endpoint to start medication administration
      const response = await medicationService.startMedicationAdministration(
        request.requestId || request.id,
        request.staffId || request.staff?.staffId
      );

      if (response.success) {
        alert("Đã bắt đầu quá trình cho uống thuốc thành công!");

        // After starting administration, open the modal for recording the actual administration
        setSelectedRequest(request);
        setAdministrationData({
          ...administrationData,
          administeredTime: new Date().toISOString(),
          frequency: request.medicineRequestItems?.[0]?.frequency || "",
          timesPerDay: getTimesPerDay(
            request.medicineRequestItems?.[0]?.frequency
          ),
        });
        setShowAdministrationModal(true);

        // Refresh the data
        loadAdministrationRequests();
        loadAllStats();
      } else {
        alert(
          "Có lỗi xảy ra: " +
            (response.message || "Không thể bắt đầu quá trình")
        );
      }
    } catch (error) {
      console.error("Error starting administration:", error);
      alert("Có lỗi xảy ra khi bắt đầu quá trình cho uống thuốc!");
    }
  };

  // Get times per day from frequency
  const getTimesPerDay = (frequency) => {
    if (!frequency) return 1;
    const freq = frequency.toLowerCase();
    if (freq.includes("3") || freq.includes("three")) return 3;
    if (freq.includes("2") || freq.includes("two")) return 2;
    if (freq.includes("4") || freq.includes("four")) return 4;
    return 1;
  };

  // Handle administration submission
  const handleSubmitAdministration = async () => {
    try {
      if (!selectedRequest) return;

      const submissionData = {
        resultId: 0,
        requestId: selectedRequest.requestId || selectedRequest.id,
        administeredTime: administrationData.administeredTime,
        status: administrationData.status,
        submittedAt: new Date().toISOString(),
        frequency: administrationData.frequency,
        timesPerDay: administrationData.timesPerDay,
        currentDayCount: administrationData.currentDayCount,
        currentDate: new Date().toISOString().split("T")[0],
        administeredFrequencies: administrationData.administeredFrequencies,
        failedFrequencies: administrationData.failedFrequencies,
        failureReasons: administrationData.failureReasons,
        isReRequest: administrationData.isReRequest,
        originalRequestResultId: 0,
        lastAttemptTime: new Date().toISOString(),
        failedAttempts: administrationData.failedFrequencies.length,
        reRequestReason: administrationData.reRequestReason,
        request: selectedRequest,
        administeredByStaff: {
          staffId: selectedRequest.staffId || selectedRequest.staff?.staffId,
        },
        actionByStaff: {
          staffId: selectedRequest.staffId || selectedRequest.staff?.staffId,
        },
      };

      console.log("Submitting administration data:", submissionData);

      // Call API to record administration
      const response = await medicationService.recordMedicineAdministration(
        submissionData
      );

      if (response.success) {
        alert("Đã ghi nhận việc cho uống thuốc thành công!");
        setShowAdministrationModal(false);
        setSelectedRequest(null);
        loadAdministrationRequests();
        loadAllStats();
      } else {
        alert("Có lỗi xảy ra: " + (response.message || "Không thể ghi nhận"));
      }
    } catch (error) {
      console.error("Error submitting administration:", error);
      alert("Có lỗi xảy ra khi ghi nhận việc cho uống thuốc!");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadAllStats();
    loadAdministrationRequests();
  };

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchTerm === "" ||
      request.student?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.student?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.medicineRequestItems?.some((item) =>
        item.medicineName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesDate =
      filterDate === "" ||
      new Date(request.requestDate).toISOString().split("T")[0] === filterDate;

    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    loadAdministrationRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý cho uống thuốc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bắt đầu và ghi nhận quá trình cho học sinh uống thuốc
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên học sinh hoặc thuốc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
            <FiActivity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Không có yêu cầu cần cho uống thuốc
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.requestId || request.id}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6"
            >
              {/* Request Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FiUser className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {request.student?.firstName} {request.student?.lastName}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      Lớp {request.student?.className}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      {new Date(request.requestDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiFileText className="h-4 w-4" />
                      ID: {request.requestId || request.id}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleStartAdministration(request)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiActivity className="h-4 w-4" />
                  Bắt đầu cho uống thuốc
                </button>
              </div>

              {/* Medicine Items */}
              <div className="space-y-3">
                {request.medicineRequestItems?.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Tên thuốc
                        </label>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          {item.medicineName}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Liều lượng
                          </label>
                          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                            {formatDosageWithUnit(item.dosage, item.dosageUnit)}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Tần suất
                          </label>
                          <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                            {formatFrequency(item.frequency)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {item.instructions && (
                      <div className="mt-3">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Hướng dẫn sử dụng
                        </label>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                          {item.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Toggle Details */}
              <button
                onClick={() =>
                  setExpandedRequest(
                    expandedRequest === request.requestId
                      ? null
                      : request.requestId
                  )
                }
                className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                {expandedRequest === request.requestId ? (
                  <>
                    <FiChevronUp className="h-4 w-4" />
                    Ẩn chi tiết
                  </>
                ) : (
                  <>
                    <FiChevronDown className="h-4 w-4" />
                    Xem chi tiết
                  </>
                )}
              </button>

              {/* Expanded Details */}
              {expandedRequest === request.requestId && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Thông tin phụ huynh
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.parent?.firstName} {request.parent?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.parent?.phone} | {request.parent?.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        Nhân viên phụ trách
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.staff?.firstName} {request.staff?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {request.staff?.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Administration Modal */}
      {showAdministrationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Ghi nhận kết quả cho uống thuốc
                </h3>
                <button
                  onClick={() => setShowAdministrationModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Patient Info */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Thông tin học sinh
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  {selectedRequest.student?.firstName}{" "}
                  {selectedRequest.student?.lastName} - Lớp{" "}
                  {selectedRequest.student?.className}
                </p>
              </div>

              {/* Administration Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thời gian cho uống
                    </label>
                    <input
                      type="datetime-local"
                      value={administrationData.administeredTime.slice(0, 16)}
                      onChange={(e) =>
                        setAdministrationData({
                          ...administrationData,
                          administeredTime: e.target.value + ":00.000Z",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={administrationData.status}
                      onChange={(e) =>
                        setAdministrationData({
                          ...administrationData,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="administered">
                        Đã cho uống thành công
                      </option>
                      <option value="failed">Không thể cho uống</option>
                      <option value="partial">Cho uống một phần</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Số lần/ngày
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={administrationData.timesPerDay}
                      onChange={(e) =>
                        setAdministrationData({
                          ...administrationData,
                          timesPerDay: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lần thứ (hôm nay)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={administrationData.timesPerDay}
                      value={administrationData.currentDayCount}
                      onChange={(e) =>
                        setAdministrationData({
                          ...administrationData,
                          currentDayCount: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={administrationData.notes}
                    onChange={(e) =>
                      setAdministrationData({
                        ...administrationData,
                        notes: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Ghi chú về quá trình cho uống thuốc..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {administrationData.status === "failed" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lý do không thể cho uống
                    </label>
                    <textarea
                      value={administrationData.reRequestReason}
                      onChange={(e) =>
                        setAdministrationData({
                          ...administrationData,
                          reRequestReason: e.target.value,
                        })
                      }
                      rows="2"
                      placeholder="Mô tả lý do không thể cho học sinh uống thuốc..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAdministrationModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitAdministration}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FiCheck className="h-4 w-4" />
                  Ghi nhận
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
