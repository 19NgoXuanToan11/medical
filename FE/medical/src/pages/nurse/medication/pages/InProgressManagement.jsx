import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiCheck,
  FiX,
  FiActivity,
  FiAlertTriangle,
  FiTarget,
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";

const InProgressManagement = () => {
  const [inProgressResults, setInProgressResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAdministerModal, setShowAdministerModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [selectedMedicineItem, setSelectedMedicineItem] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [administerNotes, setAdministerNotes] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const { user } = useAuth();
  const currentStaffId = user?.id || 1; // Fallback to 1 if no user

  useEffect(() => {
    loadInProgressData();
  }, []);

  const loadInProgressData = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getRequestResults();
      if (response.success) {
        // Filter only In Progress results
        const inProgressOnly = response.data.filter(
          (result) =>
            result.status === "In Progress" || result.status === "in progress"
        );
        setInProgressResults(inProgressOnly);
      }
    } catch (error) {
      console.error("Error loading in progress data:", error);
    }
    setLoading(false);
  };

  const handleAdministerMedicine = async () => {
    if (!selectedResult || !selectedMedicineItem || !selectedFrequency) {
      alert("Vui lòng chọn đầy đủ thông tin");
      return;
    }

    try {
      const response = await medicationService.administerMedicineByFrequency(
        selectedResult.resultId,
        selectedMedicineItem.medicineRequestItemId,
        selectedFrequency,
        currentStaffId,
        administerNotes
      );

      if (response.success) {
        alert("Ghi nhận cho uống thuốc thành công!");
        setShowAdministerModal(false);
        setAdministerNotes("");
        setSelectedFrequency("");
        setSelectedMedicineItem(null);
        loadInProgressData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi ghi nhận cho uống thuốc");
      console.error("Error administering medicine:", error);
    }
  };

  const handleReportFailure = async () => {
    if (
      !selectedResult ||
      !selectedMedicineItem ||
      !selectedFrequency ||
      !failureReason.trim()
    ) {
      alert("Vui lòng nhập đầy đủ thông tin và lý do thất bại");
      return;
    }

    try {
      const response = await medicationService.reportMedicineFailure(
        selectedResult.resultId,
        selectedMedicineItem.medicineRequestItemId,
        selectedFrequency,
        failureReason,
        currentStaffId
      );

      if (response.success) {
        alert("Báo cáo thất bại thành công!");
        setShowFailureModal(false);
        setFailureReason("");
        setSelectedFrequency("");
        setSelectedMedicineItem(null);
        loadInProgressData();
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi báo cáo thất bại");
      console.error("Error reporting failure:", error);
    }
  };

  const handleCompleteRequest = async (result) => {
    const confirmed = window.confirm(
      `Xác nhận hoàn thành yêu cầu thuốc cho học sinh ${result.request?.student?.firstName} ${result.request?.student?.lastName}?`
    );

    if (confirmed) {
      try {
        const response = await medicationService.completeMedicationRequest(
          result.requestId,
          currentStaffId,
          "Hoàn thành tất cả buổi uống thuốc"
        );

        if (response.success) {
          alert("Hoàn thành yêu cầu thuốc thành công!");
          loadInProgressData();
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("Có lỗi xảy ra khi hoàn thành yêu cầu thuốc");
        console.error("Error completing request:", error);
      }
    }
  };

  const filterResults = (results) => {
    return results.filter((result) => {
      const searchLower = searchTerm.toLowerCase();
      const studentName = `${result.request?.student?.firstName || ""} ${
        result.request?.student?.lastName || ""
      }`.toLowerCase();
      const medicineName =
        result.request?.medicineRequestItems?.[0]?.medicineName?.toLowerCase() ||
        "";
      const resultId = result.resultId?.toString() || "";

      return (
        studentName.includes(searchLower) ||
        medicineName.includes(searchLower) ||
        resultId.includes(searchLower)
      );
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getFrequencyOptions = (frequency) => {
    if (!frequency) return [];

    const freq = frequency.toLowerCase();
    if (freq.includes("3") || freq.includes("ba")) {
      return ["Sáng", "Trưa", "Tối"];
    } else if (freq.includes("2") || freq.includes("hai")) {
      return ["Sáng", "Tối"];
    } else if (freq.includes("4") || freq.includes("bốn")) {
      return ["Sáng", "Trưa", "Chiều", "Tối"];
    } else {
      return ["Sáng"];
    }
  };

  const getProgressStatus = (administeredFrequencies, frequency) => {
    try {
      const administered = Array.isArray(administeredFrequencies)
        ? administeredFrequencies
        : JSON.parse(administeredFrequencies || "[]");
      const totalFrequencies = getFrequencyOptions(frequency);
      return {
        completed: administered.length,
        total: totalFrequencies.length,
        percentage:
          totalFrequencies.length > 0
            ? (administered.length / totalFrequencies.length) * 100
            : 0,
      };
    } catch (error) {
      console.error("Error parsing administered frequencies:", error);
      return { completed: 0, total: 1, percentage: 0 };
    }
  };

  const filteredResults = filterResults(inProgressResults);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Quản lý In Progress
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi và ghi nhận quá trình cho uống thuốc
          </p>
        </div>
        <button
          onClick={loadInProgressData}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Làm mới
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

      {/* Results Table */}
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
                  Tiến độ
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày bắt đầu
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
              {filteredResults.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => {
                  const medicineItem =
                    result.request?.medicineRequestItems?.[0];
                  const progress = getProgressStatus(
                    result.administeredFrequencies,
                    medicineItem?.frequency
                  );

                  return (
                    <tr
                      key={result.resultId}
                      className="hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {result.request?.student?.firstName}{" "}
                              {result.request?.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Lớp:{" "}
                              {result.request?.student?.class?.className ||
                                result.request?.className}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {medicineItem?.medicineName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {progress.completed}/{progress.total} lần
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                        {formatDate(result.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          Đang thực hiện
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Xem chi tiết"
                          >
                            <FiEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setSelectedMedicineItem(medicineItem);
                              setShowAdministerModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                            title="Ghi nhận cho uống"
                          >
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setSelectedMedicineItem(medicineItem);
                              setShowFailureModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Báo cáo thất bại"
                          >
                            <FiAlertTriangle className="h-4 w-4" />
                          </button>
                          {progress.percentage === 100 && (
                            <button
                              onClick={() => handleCompleteRequest(result)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              title="Hoàn thành"
                            >
                              <FiTarget className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết tiến độ #{selectedResult.resultId}
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
                    {selectedResult.request?.student?.firstName}{" "}
                    {selectedResult.request?.student?.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedResult.request?.student?.class?.className ||
                      selectedResult.request?.className}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày bắt đầu
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(selectedResult.submittedAt)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày uống thuốc
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(
                      selectedResult.request?.medicineRequestItems?.[0]
                        ?.timeOfDay
                    )}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </label>
                  <span className="mt-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    Đang thực hiện
                  </span>
                </div>
              </div>

              {selectedResult.request?.medicineRequestItems && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thông tin thuốc và tiến độ
                  </label>
                  <div className="space-y-3">
                    {selectedResult.request.medicineRequestItems.map(
                      (item, index) => {
                        const progress = getProgressStatus(
                          selectedResult.administeredFrequencies,
                          item.frequency
                        );
                        const frequencyOptions = getFrequencyOptions(
                          item.frequency
                        );
                        const administeredList = Array.isArray(
                          selectedResult.administeredFrequencies
                        )
                          ? selectedResult.administeredFrequencies
                          : JSON.parse(
                              selectedResult.administeredFrequencies || "[]"
                            );

                        return (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                                  Liều lượng:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.dosage}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Tần suất:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {item.frequency}
                                </p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Tiến độ: {progress.completed}/{progress.total}{" "}
                                  buổi
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {Math.round(progress.percentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress.percentage}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
                                Chi tiết các buổi:
                              </span>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {frequencyOptions.map((freq) => (
                                  <div
                                    key={freq}
                                    className={`px-3 py-2 rounded-lg text-center text-sm ${
                                      administeredList.includes(freq)
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                    }`}
                                  >
                                    <div className="flex items-center justify-center">
                                      {administeredList.includes(freq) ? (
                                        <FiCheck className="h-4 w-4 mr-1" />
                                      ) : (
                                        <FiClock className="h-4 w-4 mr-1" />
                                      )}
                                      {freq}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Administer Modal */}
      {showAdministerModal && selectedResult && selectedMedicineItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Ghi nhận cho uống thuốc
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Học sinh: {selectedResult.request?.student?.firstName}{" "}
                  {selectedResult.request?.student?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Thuốc: {selectedMedicineItem.medicineName}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chọn buổi uống *
                </label>
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">-- Chọn buổi --</option>
                  {getFrequencyOptions(selectedMedicineItem.frequency).map(
                    (freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={administerNotes}
                  onChange={(e) => setAdministerNotes(e.target.value)}
                  placeholder="Ghi chú về việc cho uống thuốc..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-green-500 focus:border-green-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAdministerModal(false);
                    setSelectedFrequency("");
                    setAdministerNotes("");
                    setSelectedMedicineItem(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAdministerMedicine}
                  disabled={!selectedFrequency}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300"
                >
                  Ghi nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailureModal && selectedResult && selectedMedicineItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Báo cáo thất bại
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                  Học sinh: {selectedResult.request?.student?.firstName}{" "}
                  {selectedResult.request?.student?.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Thuốc: {selectedMedicineItem.medicineName}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Buổi thất bại *
                </label>
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">-- Chọn buổi thất bại --</option>
                  {getFrequencyOptions(selectedMedicineItem.frequency).map(
                    (freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lý do thất bại *
                </label>
                <textarea
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="Mô tả lý do thất bại (ví dụ: học sinh từ chối, nghỉ học...)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100"
                  rows="3"
                  required
                />
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Báo cáo thất bại sẽ được ghi nhận và có thể tạo yêu cầu lại
                  nếu cần.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowFailureModal(false);
                    setSelectedFrequency("");
                    setFailureReason("");
                    setSelectedMedicineItem(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReportFailure}
                  disabled={!selectedFrequency || !failureReason.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300"
                >
                  Báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InProgressManagement;
