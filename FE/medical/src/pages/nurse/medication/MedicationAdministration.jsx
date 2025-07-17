import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiRefreshCw,
  FiClipboard,
  FiInfo,
} from "react-icons/fi";
import { useRequestResults } from "./hooks/useRequestResults";
import { medicationService } from "../../../utils/api/medication/medicationService";
import PendingAdministrations from "./pages/PendingAdministrations";
import CompletedAdministrations from "./pages/CompletedAdministrations";
import FailedAdministrations from "./pages/FailedAdministrations";
import AllAdministrations from "./pages/AllAdministrations";

const MedicationAdministration = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [currentTime, setCurrentTime] = useState(new Date());

  const { stats, loading, refreshData } = useRequestResults();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Check if current time is after 17:00
  const isAfterCutoffTime = () => {
    const cutoffHour = 17; // 5 PM
    const currentHour = currentTime.getHours();
    return currentHour >= cutoffHour;
  };

  // Enhanced refresh function with time-based status update
  const handleRefreshWithTimeCheck = async () => {
    // Call the time-based status update API using medicationService
    await medicationService.updateTimeBasedStatus();

    // Always refresh data regardless of API call result
    await refreshData();
  };

  // Get button text and style based on time
  const getRefreshButtonConfig = () => {
    if (isAfterCutoffTime()) {
      return {
        text: "Cập nhật trạng thái",
        className:
          "flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg transition-colors duration-200",
        tooltip: "Sau 17h: Cập nhật trạng thái và khóa yêu cầu mới",
      };
    } else {
      return {
        text: "Làm mới dữ liệu",
        className:
          "flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200",
        tooltip: "Làm mới dữ liệu hiện tại",
      };
    }
  };

  const buttonConfig = getRefreshButtonConfig();

  // Render current component based on active tab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case "pending":
        return <PendingAdministrations />;
      case "administered":
        return <CompletedAdministrations />;
      case "failed":
        return <FailedAdministrations />;
      case "all":
        return <AllAdministrations />;
      default:
        return <PendingAdministrations />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Quản lý uống thuốc
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Theo dõi và quản lý việc uống thuốc cho học sinh
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleRefreshWithTimeCheck}
              disabled={loading}
              className={buttonConfig.className}
              title={buttonConfig.tooltip}
            >
              <FiRefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              {buttonConfig.text}
            </button>

            {/* Time-based notification */}
            {isAfterCutoffTime() && (
              <div className="flex items-center text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                <FiInfo className="h-3 w-3 mr-1" />
                Sau 17h: Không nhận yêu cầu mới
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time Status Banner */}
      {isAfterCutoffTime() && (
        <div className="mb-6 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center">
            <FiClock className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Thời gian giới hạn đã qua (17:00)
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Hệ thống đã ngừng nhận yêu cầu thuốc mới. Chỉ xử lý các yêu cầu
                đã có sẵn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Pending Administrations */}
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đang uống thuốc
              </p>
              <p className="text-xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Administered */}
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tiến độ
              </p>
              <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.administered}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Failed Administrations */}
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Thất bại
              </p>
              <p className="text-xl font-bold mt-1 text-red-600 dark:text-red-400">
                {stats.failed}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Re-requests */}
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Yêu cầu lại
              </p>
              <p className="text-xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.reRequests}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiRefreshCw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6 transition-colors duration-300">
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === "pending"
                  ? "bg-yellow-600 dark:bg-yellow-700 text-white shadow-lg shadow-yellow-200 dark:shadow-yellow-900/50"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiClock className="inline h-4 w-4 mr-1" />
              Đang uống thuốc ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab("administered")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === "administered"
                  ? "bg-green-600 dark:bg-green-700 text-white shadow-lg shadow-green-200 dark:shadow-green-900/50"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiCheckCircle className="inline h-4 w-4 mr-1" />
              Tiến độ ({stats.administered})
            </button>
            <button
              onClick={() => setActiveTab("failed")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === "failed"
                  ? "bg-red-600 dark:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-red-900/50"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiAlertTriangle className="inline h-4 w-4 mr-1" />
              Thất bại ({stats.failed})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === "all"
                  ? "bg-blue-600 dark:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <FiClipboard className="inline h-4 w-4 mr-1" />
              Tất cả ({stats.total})
            </button>
          </div>
        </div>
      </div>

      {/* Current Page Content */}
      {renderCurrentPage()}
    </div>
  );
};

export default MedicationAdministration;
