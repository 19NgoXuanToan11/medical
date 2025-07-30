import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiCheck,
  FiUser,
  FiCalendar,
  FiTablet,
  FiClock,
  FiX,
  FiUsers, // Thêm icon cho phụ huynh
  FiHash, // Thêm icon cho ID
} from "react-icons/fi";
import { medicationService } from "../../../../utils/api/medication/medicationService";
import { useAuth } from "../../../../utils/auth/AuthContext";
import { getMedicineUnit } from "../../../../utils/medicine/medicineUnits";

const CompletedMedication = () => {
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadCompletedRequests();

    // Cleanup function to clear data when component unmounts
    return () => {
      setCompletedRequests([]);
    };
  }, []);

  const loadCompletedRequests = async () => {
    setLoading(true);
    // Clear any existing data first to ensure fresh data
    setCompletedRequests([]);

    try {
      const response = await medicationService.getCompletedMedicationRequests();
      if (response.success) {
        // Ensure we always have an array, even if API returns null/undefined
        let processedData = response.data || [];

        // Only process period-based data if we actually have data
        if (
          Array.isArray(processedData) &&
          processedData.length > 0 &&
          processedData[0] &&
          processedData[0].period
        ) {
          processedData = processedData.map((periodData) => ({
            // Tạo request object từ period data
            requestId:
              periodData.completedItems?.[0]?.requestId ||
              `period-${periodData.period}`,
            period: periodData.period,
            completedItems: periodData.completedItems || [],
            // Lấy thông tin chung từ item đầu tiên
            studentName: periodData.completedItems?.[0]?.studentName || "",
            studentCode: periodData.completedItems?.[0]?.studentCode || "",
            className: periodData.completedItems?.[0]?.className || "",
            parentName: periodData.completedItems?.[0]?.parentName || "",
            parentId: periodData.completedItems?.[0]?.parentId || "",
            date: periodData.completedItems?.[0]?.date || "",
            verifiedTimestamp:
              periodData.completedItems?.[0]?.verifiedTimestamp || "",
            verifiedStatus:
              periodData.completedItems?.[0]?.verifiedStatus || "",
            verifiedStaffId:
              periodData.completedItems?.[0]?.verifiedStaffId || "",
          }));
        }

        // Always set the processed data, even if it's an empty array
        setCompletedRequests(processedData);
      } else {
        console.error("Error loading completed requests:", response.message);
        // If API call fails, ensure state is cleared
        setCompletedRequests([]);
      }
    } catch (error) {
      console.error("Error loading completed requests:", error);
      // If there's an error, ensure state is cleared
      setCompletedRequests([]);
    }
    setLoading(false);
  };

  const filterRequests = (requests) => {
    return requests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();

      // Lấy tên học sinh từ dữ liệu đã xử lý
      const studentName = (
        request.studentName ||
        (request.completedItems && request.completedItems.length > 0
          ? request.completedItems[0].studentName
          : `${request.student?.firstName || ""} ${
              request.student?.lastName || ""
            }`)
      ).toLowerCase();

      // Lấy tên thuốc từ completedItems
      const medicineNames = (request.completedItems || [])
        .map((item) => item.medicineName?.toLowerCase() || "")
        .join(" ");

      const requestId = request.requestId?.toString() || "";

      // Lấy tên lớp từ dữ liệu đã xử lý
      const className = (
        request.className ||
        (request.completedItems && request.completedItems.length > 0
          ? request.completedItems[0].className
          : request.student?.class?.className || "")
      ).toLowerCase();

      // Lấy mã học sinh từ dữ liệu đã xử lý
      const studentCode = (
        request.studentCode ||
        (request.completedItems && request.completedItems.length > 0
          ? request.completedItems[0].studentCode
          : request.student?.studentCode || "")
      ).toLowerCase();

      // Lấy tên phụ huynh từ dữ liệu đã xử lý
      const parentName = (
        request.parentName ||
        (request.completedItems && request.completedItems.length > 0
          ? request.completedItems[0].parentName
          : request.parent
          ? `${request.parent.firstName} ${request.parent.lastName}`
          : "")
      ).toLowerCase();

      return (
        studentName.includes(searchLower) ||
        medicineNames.includes(searchLower) ||
        requestId.includes(searchLower) ||
        className.includes(searchLower) ||
        studentCode.includes(searchLower) ||
        parentName.includes(searchLower)
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

  const currentRequests = filterRequests(completedRequests);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Yêu cầu thuốc đã hoàn thành
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Danh sách các yêu cầu thuốc đã được hoàn thành thành công với đầy đủ
            thông tin xác minh
          </p>
        </div>
        <button
          onClick={loadCompletedRequests}
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
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên học sinh, mã học sinh, phụ huynh, thuốc hoặc ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 w-full"
        />
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table
            key={`completed-requests-${completedRequests.length}-${loading}`}
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
                  Buổi hoàn thành
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thời gian xác minh
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
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : currentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có yêu cầu đã hoàn thành
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
                            {/* Hiển thị tên học sinh từ dữ liệu đã xử lý */}
                            {request.studentName ||
                              (request.completedItems &&
                              request.completedItems.length > 0
                                ? request.completedItems[0].studentName
                                : `${request.student?.firstName || ""} ${
                                    request.student?.lastName || ""
                                  }`)}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Lớp:{" "}
                            {request.className ||
                              (request.completedItems &&
                              request.completedItems.length > 0
                                ? request.completedItems[0].className
                                : request.student?.class?.className || "N/A")}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Thuốc & Liều lượng */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {/* Hiển thị từ completedItems nếu có (cấu trúc mới) */}
                        {request.completedItems
                          ? request.completedItems.map((item, index) => (
                              <div
                                key={index}
                                className="text-sm border-l-2 border-green-400 pl-2"
                              >
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.medicineName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.dosage} {item.dosageUnit} -{" "}
                                  {item.frequency} lần/ngày
                                </div>
                                {item.instructions && (
                                  <div className="text-xs text-blue-600 dark:text-blue-400 italic">
                                    {item.instructions}
                                  </div>
                                )}
                              </div>
                            ))
                          : /* Fallback cho cấu trúc cũ */
                            (
                              request.assignedItems ||
                              request.medicineRequestItems ||
                              []
                            ).map((item, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {item.medicineName}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.dosage} {item.dosageUnit} -{" "}
                                  {item.frequency} lần/ngày
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

                    {/* Buổi hoàn thành */}
                    <td className="px-6 py-4 text-center">
                      <div className="space-y-1">
                        {/* Hiển thị từ completedItems nếu có */}
                        {request.completedItems ? (
                          <div className="inline-block">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {request.period}
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {request.completedItems.length} thuốc hoàn thành
                            </div>
                          </div>
                        ) : (
                          /* Fallback cho cấu trúc cũ */
                          (request.assignedItems || []).map(
                            (item, itemIndex) => (
                              <div key={itemIndex}>
                                {(item.assignedPeriods || [])
                                  .filter(
                                    (period) => period.status === "Completed"
                                  )
                                  .map((period, periodIndex) => (
                                    <div
                                      key={periodIndex}
                                      className="inline-block mr-1 mb-1"
                                    >
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {period.period}
                                      </span>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {formatDateTime(period.timestamp)}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )
                          )
                        )}
                      </div>
                    </td>

                    {/* Thời gian xác minh */}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                      <div>
                        {/* Ưu tiên hiển thị từ completedItems */}
                        {request.completedItems &&
                        request.completedItems.length > 0 ? (
                          <>
                            <div className="font-medium">
                              {formatDateTime(
                                request.completedItems[0].verifiedTimestamp
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              {formatDate(
                                request.completedDate || request.date
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Yêu cầu: {formatDate(request.requestDate)}
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Đã hoàn thành
                      </span>
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
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Chi tiết yêu cầu thuốc đã hoàn thành #
                  {selectedRequest.requestId}
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
              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Học sinh
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {/* Hiển thị tên học sinh từ dữ liệu đã xử lý */}
                    {selectedRequest.studentName ||
                      (selectedRequest.completedItems &&
                      selectedRequest.completedItems.length > 0
                        ? selectedRequest.completedItems[0].studentName
                        : `${selectedRequest.student?.firstName || ""} ${
                            selectedRequest.student?.lastName || ""
                          }`)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {selectedRequest.className ||
                      (selectedRequest.completedItems &&
                      selectedRequest.completedItems.length > 0
                        ? selectedRequest.completedItems[0].className
                        : selectedRequest.student?.class?.className || "N/A")}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày yêu cầu
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                    {/* Hiển thị ngày từ dữ liệu đã xử lý */}
                    {formatDate(
                      selectedRequest.date ||
                        (selectedRequest.completedItems &&
                        selectedRequest.completedItems.length > 0
                          ? selectedRequest.completedItems[0].date
                          : selectedRequest.requestDate || selectedRequest.date)
                    )}
                  </p>
                </div>
              </div>

              {/* Thông tin thuốc đã hoàn thành - Cấu trúc mới */}
              {selectedRequest.completedItems &&
                selectedRequest.completedItems.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <FiTablet className="h-4 w-4 mr-2" />
                      Chi tiết thuốc đã hoàn thành (
                      {selectedRequest.completedItems.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedRequest.completedItems.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                        >
                          {/* Header với tên thuốc và ID */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {item.medicineName}
                              </h5>
                            </div>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {item.verifiedStatus}
                            </span>
                          </div>

                          {/* Chi tiết thuốc */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                Liều lượng:
                              </span>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.dosage} {item.dosageUnit}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                Tần suất:
                              </span>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.frequency} lần/ngày
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                Thời gian uống:
                              </span>
                              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                {item.timeOfDay}
                              </p>
                            </div>
                          </div>

                          {/* Hướng dẫn sử dụng */}
                          {item.instructions && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-300 block mb-1">
                                Hướng dẫn sử dụng:
                              </span>
                              <p className="text-sm text-blue-800 dark:text-blue-200 italic">
                                {item.instructions}
                              </p>
                            </div>
                          )}

                          {/* Thông tin xác minh chi tiết */}
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                  Thời gian hoàn thành:
                                </span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {formatDateTime(item.verifiedTimestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Fallback cho cấu trúc cũ - Assigned Items Information */}
              {(!selectedRequest.completedItems ||
                selectedRequest.completedItems.length === 0) &&
                selectedRequest.assignedItems &&
                selectedRequest.assignedItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Thông tin thuốc đã hoàn thành (Cấu trúc cũ)
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

                          {/* Completed Periods */}
                          {item.assignedPeriods &&
                            item.assignedPeriods.length > 0 && (
                              <div>
                                <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  Buổi đã hoàn thành:
                                </h5>
                                <div className="space-y-2">
                                  {item.assignedPeriods
                                    .filter(
                                      (period) => period.status === "Completed"
                                    )
                                    .map((period, periodIndex) => (
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
                                            Hoàn thành lúc:
                                          </div>
                                          <div className="text-xs text-gray-900 dark:text-gray-100">
                                            {formatDateTime(period.timestamp)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Footer với button đóng */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-neutral-700">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedMedication;
