import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { medicationService } from "../../../utils/api/medication/medicationService";
import { useAuth } from "../../../utils/auth/AuthContext";
import {
  transformParentMedicationData,
  transformFailedMedicationData,
  getStatusBadge,
  calculateMedicationStats,
  filterMedications,
} from "../../../utils/api/medication/parentMedicationUtils";
import { toast } from "react-toastify";

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
      } else {
        result = await medicationService.getMedicationRequestsByParent(user.id);
      }

      if (result.success) {
        let transformedData;
        if (filterStatus === "failed") {
          transformedData = transformFailedMedicationData(result.data);
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
    filterStatus === "rejected" || filterStatus === "failed"
      ? medications // For rejected and failed tabs, show all data from specific APIs directly
      : filterMedications(medications, filterStatus, searchTerm);

  // Apply filtering logic
  const finalFilteredMedications =
    filterStatus === "rejected" || filterStatus === "failed"
      ? medications.filter((med) => {
          if (!searchTerm) return true; // Show all if no search term
          const matchesSearch =
            (med.medicationName &&
              med.medicationName
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
      : filterMedications(medications, filterStatus, searchTerm);

  // Calculate stats based on current data
  const stats =
    filterStatus === "rejected"
      ? {
          pending: 0,
          active: 0,
          completed: 0,
          rejected: medications.length, // All medications in rejected tab are rejected
          failed: 0,
          total: medications.length,
        }
      : filterStatus === "failed"
      ? {
          pending: 0,
          active: 0,
          completed: 0,
          rejected: 0,
          failed: medications.length, // All medications in failed tab are failed
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Chờ xác nhận
              </p>
              <p className="text-xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <svg
                className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Đang thực hiện
              </p>
              <p className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.active}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg
                className="h-5 w-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Đã hoàn thành
              </p>
              <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Từ chối
              </p>
              <p className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">
                {stats.rejected}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg
                className="h-5 w-5 text-red-600 dark:text-red-400"
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
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Thất bại
              </p>
              <p className="text-xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.failed}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <svg
                className="h-5 w-5 text-orange-600 dark:text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Tổng yêu cầu
              </p>
              <p className="text-xl font-bold mt-1 text-gray-800 dark:text-gray-200">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <svg
                className="h-5 w-5 text-gray-800 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
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
            onClick={() => setFilterStatus("pending")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "pending"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Chờ xác nhận
          </button>
          <button
            onClick={() => setFilterStatus("active")}
            className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-200 ${
              filterStatus === "active"
                ? "bg-blue-600 dark:bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
            }`}
          >
            Đang thực hiện
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

      {/* Data Table */}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
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
                      Học sinh
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
                          Số lần thử
                        </th>
                      </>
                    )}
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    {filterStatus === "rejected" && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Lý do từ chối
                      </th>
                    )}
                    {filterStatus === "failed" && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Lý do thất bại
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {finalFilteredMedications.map((medication) => (
                    <tr
                      key={medication.id}
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
                            {medication.medicationDisplay.map((name, index) => (
                              <div key={index} className="text-sm font-medium">
                                {name}
                              </div>
                            ))}
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Tổng: {medication.medicationCount} loại thuốc
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
                          {new Date(medication.requestDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                      </td>
                      {filterStatus !== "failed" && (
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {new Date(medication.startDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </td>
                      )}
                      {filterStatus === "failed" && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {medication.lastAttemptTime || "N/A"}
                            </div>
                            {medication.administeredTime && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Bắt đầu: {medication.administeredTime}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {medication.failedAttempts}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {medication.currentDayCount}/
                              {medication.timesPerDay} lần
                            </div>
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {renderStatusBadge(medication.status)}
                      </td>
                      {filterStatus === "rejected" && (
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                            {medication.refusalReason || "Không có lý do"}
                          </div>
                          {medication.staffName &&
                            medication.staffName !== "N/A" && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Từ chối bởi: {medication.staffName}
                              </div>
                            )}
                        </td>
                      )}
                      {filterStatus === "failed" && (
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs">
                            {medication.failureReasons ||
                              "Không có lý do cụ thể"}
                          </div>
                          {medication.staffName &&
                            medication.staffName !== "N/A" && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Xử lý bởi: {medication.staffName}
                              </div>
                            )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          to={`/parent/medication/detail/${medication.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MedicationHistory;
