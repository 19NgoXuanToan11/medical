import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { medicationService } from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import {
  transformParentMedicationData,
  transformFailedMedicationData,
  transformRejectedMedicationData,
  getStatusBadge,
  calculateMedicationStats,
  filterMedications,
  getMedicationStatusFromVerifiedStatus,
  normalizeVerifiedStatus,
} from "../../../utils/api/medication/parentMedicationUtils";
import { toast } from "react-toastify";
import RejectedMedicationTab from "./RejectedMedicationTab";

const MedicationHistory = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize filterStatus based on URL parameter
  const [filterStatus, setFilterStatus] = useState(() => {
    const statusParam = searchParams.get("status");
    return statusParam || "all";
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch medication data from API
  const fetchMedicationData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      let result;

      // Use specific API based on filter status
      if (filterStatus === "rejected") {
        result = await medicationService.getRefusedMedicineRequestsByParent(
          user.id
        );
      } else if (filterStatus === "failed") {
        result = await medicationService.getFailedMedicationRequestsByParent(
          user.id
        );
      } else if (filterStatus === "completed") {
        result = await medicationService.getCompletedMedicineRequestsByParent(
          user.id
        );
      } else if (filterStatus === "confirmed") {
        // For confirmed status, we'll filter from the main API data
        result = await medicationService.getMedicationRequestsByParent(user.id);
      } else {
        result = await medicationService.getMedicationRequestsByParent(user.id);
      }

      if (result.success) {
        let transformedData;
        if (filterStatus === "failed") {
          transformedData = transformFailedMedicationData(result.data);
        } else if (filterStatus === "rejected") {
          transformedData = transformRejectedMedicationData(result.data);
        } else if (filterStatus === "completed") {
          transformedData = transformParentMedicationData(result.data);
        } else {
          transformedData = transformParentMedicationData(result.data);
        }
        setMedications(transformedData);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching medication data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu");
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when user changes
  useEffect(() => {
    fetchMedicationData();
  }, [user?.id, filterStatus]); // Add filterStatus dependency to refetch when tab changes

  // Update filter status when URL parameter changes
  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && statusParam !== filterStatus) {
      setFilterStatus(statusParam);
    }
  }, [searchParams]);

  const filteredMedications =
    filterStatus === "failed" ||
    filterStatus === "rejected" ||
    filterStatus === "completed"
      ? medications // For failed, rejected, and completed tabs, show all data from specific API directly
      : filterMedications(medications, filterStatus, searchTerm);

  // Apply filtering logic for failed, rejected, and completed tabs
  const finalFilteredMedications =
    filterStatus === "failed" ||
    filterStatus === "rejected" ||
    filterStatus === "completed"
      ? medications.filter((med) => {
          if (!searchTerm) return true; // Show all if no search term

          const medicationName =
            filterStatus === "rejected"
              ? med.medicineName || med.medicationName
              : med.medicationName;

          const matchesSearch =
            (medicationName &&
              medicationName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (med.id &&
              med.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (med.studentName &&
              med.studentName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (med.medicationDisplay &&
              med.medicationDisplay.some((name) =>
                name.toLowerCase().includes(searchTerm.toLowerCase())
              ));
          return matchesSearch;
        })
      : filteredMedications;

  // Calculate stats based on current data
  const stats =
    filterStatus === "rejected"
      ? {
          confirmed: 0,
          active: 0,
          completed: 0,
          rejected: medications.length, // All medications in rejected tab are rejected
          failed: 0,
          total: medications.length,
        }
      : filterStatus === "failed"
      ? {
          confirmed: 0,
          active: 0,
          completed: 0,
          rejected: 0,
          failed: medications.length, // All medications in failed tab are failed
          total: medications.length,
        }
      : filterStatus === "completed"
      ? {
          confirmed: 0,
          active: 0,
          completed: medications.length, // All medications in completed tab are completed
          rejected: 0,
          failed: 0,
          total: medications.length,
        }
      : calculateMedicationStats(medications);

  const renderStatusBadge = (status) => {
    const badge = getStatusBadge(status);
    return <span className={badge.className}>{badge.text}</span>;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Lịch sử yêu cầu thuốc
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Theo dõi tình trạng và lịch sử uống thuốc của học sinh
            </p>
          </div>
        </div>
      </div>
      {/* Filter Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "all"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "active"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Tiến độ
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "completed"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Đã hoàn thành
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "rejected"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Từ chối
          </button>
          <button
            onClick={() => setFilterStatus("failed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "failed"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Thất bại
          </button>
        </div>
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Tìm kiếm theo tên thuốc, mã yêu cầu hoặc tên học sinh"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="h-8 w-8 text-red-400 dark:text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchMedicationData}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && finalFilteredMedications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
            <svg
              className="h-8 w-8 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
            Không tìm thấy yêu cầu nào
          </h3>
          <Link
            to="/parent/medication/request"
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tạo yêu cầu mới
          </Link>
        </div>
      ) : (
        !loading &&
        !error && (
          <>
            {filterStatus === "rejected" ? (
              <RejectedMedicationTab
                medications={medications}
                searchTerm={searchTerm}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                {filterStatus === "completed" ? (
                  // Enhanced display for completed medications showing all schema fields
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Mã học sinh
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Học sinh & Lớp
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Thuốc
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Thời gian uống
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Hướng dẫn
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Thời gian hoàn thành
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {finalFilteredMedications.map((medication, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {medication.originalData?.studentCode ||
                                  medication.studentCode ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {medication.originalData?.studentName ||
                                  medication.studentName ||
                                  "N/A"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {medication.originalData?.className ||
                                  medication.class ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {medication.originalData?.medicineName ||
                                  medication.medicationName ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {medication.originalData?.timeOfDay ||
                                  medication.timeOfDay ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center max-w-xs">
                              <div
                                className="text-sm text-gray-900 dark:text-gray-100 truncate"
                                title={
                                  medication.originalData?.instructions ||
                                  medication.instructions ||
                                  "N/A"
                                }
                              >
                                {medication.originalData?.instructions ||
                                  medication.instructions ||
                                  "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-1 ring-green-600/20 dark:ring-green-400/20">
                                {medication.originalData?.status ===
                                  "Completed" ||
                                medication.status === "Completed"
                                  ? "Đã hoàn thành"
                                  : medication.originalData?.status ||
                                    medication.status ||
                                    "Đã hoàn thành"}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-gray-100">
                                {medication.originalData?.timestamp
                                  ? new Date(
                                      medication.originalData.timestamp
                                    ).toLocaleString("vi-VN")
                                  : medication.timestamp
                                  ? new Date(
                                      medication.timestamp
                                    ).toLocaleString("vi-VN")
                                  : "N/A"}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Original table for other statuses
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Mã yêu cầu
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Học sinh & Lớp
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Thuốc
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            Ngày gửi yêu cầu
                          </th>
                          {filterStatus !== "failed" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Ngày uống thuốc
                            </th>
                          )}
                          {filterStatus === "failed" && (
                            <>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                              >
                                Thời gian thất bại
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                              >
                                Hướng dẫn dùng thuốc
                              </th>
                            </>
                          )}
                          {filterStatus === "failed" && (
                            <th
                              scope="col"
                              className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                            >
                              Lý do thất bại
                            </th>
                          )}
                          {filterStatus !== "failed" &&
                            filterStatus !== "completed" && (
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                              >
                                Hành động
                              </th>
                            )}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {finalFilteredMedications.map((medication, idx) => {
                          // Normalize verifiedStatus for each medicine item
                          const normalizedMedicineItems =
                            medication.medicineItems?.map((item) => ({
                              ...item,
                              verifiedStatus: normalizeVerifiedStatus(
                                item.verifiedStatus
                              ),
                            })) || [];

                          // Get status for display
                          // For completed and failed tabs, use the medication's status directly
                          // For other tabs, calculate from Status
                          const displayStatus =
                            filterStatus === "completed" ||
                            filterStatus === "failed"
                              ? medication.status
                              : getMedicationStatusFromVerifiedStatus(
                                  normalizedMedicineItems
                                );

                          return (
                            <tr
                              key={idx}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-blue-600 dark:text-blue-400">
                                #{medication.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {medication.studentName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {medication.class}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {medication.medicationCount >= 2 ? (
                                  <div className="space-y-1">
                                    {medication.medicationDisplay.map(
                                      (name, index) => (
                                        <div
                                          key={index}
                                          className="text-sm font-medium"
                                        >
                                          {name}
                                        </div>
                                      )
                                    )}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      Tổng: {medication.medicationCount} loại
                                      thuốc
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {medication.medicationName}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {new Date(
                                    medication.requestDate
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                              </td>
                              {filterStatus !== "failed" && (
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {new Date(
                                      medication.startDate
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                </td>
                              )}
                              {filterStatus === "failed" && (
                                <>
                                  <td className="px-6 py-4 text-center">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                      {medication.timestamp
                                        ? new Date(
                                            medication.timestamp
                                          ).toLocaleString("vi-VN")
                                        : "N/A"}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-center max-w-xs">
                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                      {medication.instructions ||
                                        "Không có hướng dẫn"}
                                    </div>
                                  </td>
                                </>
                              )}
                              {filterStatus === "failed" && (
                                <td className="px-6 py-4 text-center">
                                  <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                                    {medication.failureReason ||
                                      "Không có lý do cụ thể"}
                                  </div>
                                  {medication.notes && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                                      Ghi chú: {medication.notes}
                                    </div>
                                  )}
                                </td>
                              )}
                              {filterStatus !== "failed" &&
                                filterStatus !== "completed" && (
                                  <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {medication.id &&
                                    medication.id !== "undefined" &&
                                    !medication.id.includes("undefined") ? (
                                      <Link
                                        to={`/parent/medication/detail/${medication.id}`}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                      >
                                        Chi tiết
                                      </Link>
                                    ) : (
                                      <span className="text-gray-400 cursor-not-allowed">
                                        Chi tiết
                                      </span>
                                    )}
                                  </td>
                                )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default MedicationHistory;
