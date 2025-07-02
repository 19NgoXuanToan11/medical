import React, { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiClipboard,
} from "react-icons/fi";
import { useMedicationRequests } from "./hooks/useMedicationRequests";
import PendingRequests from "./pages/PendingRequests";
import AssignedRequests from "./pages/AssignedRequests";
import CompletedRequests from "./pages/CompletedRequests";
import AllRequests from "./pages/AllRequests";

const MedicationManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const { stats } = useMedicationRequests();

  // Render current component based on active tab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case "pending":
        return <PendingRequests />;
      case "assigned":
        return <AssignedRequests />;
      case "completed":
        return <CompletedRequests />;
      case "all":
        return <AllRequests />;
      default:
        return <PendingRequests />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý yêu cầu thuốc
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Xem xét và phê duyệt các yêu cầu cấp thuốc từ phụ huynh
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chờ xử lý
              </p>
              <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã giao
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.assigned}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Tất cả</p>
              <p className="text-2xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiClipboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 mb-6 transition-colors duration-300">
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "pending"
                  ? "bg-yellow-600 dark:bg-yellow-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Chờ xử lý ({stats.pending})
            </button>
            <button
              onClick={() => setActiveTab("assigned")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "assigned"
                  ? "bg-green-600 dark:bg-green-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Đã giao ({stats.assigned})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "completed"
                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Đã hoàn thành ({stats.completed})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-purple-600 dark:bg-purple-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Tất cả ({stats.total})
            </button>
          </div>
        </div>
      </div>

      {/* Current Page Content */}
      <div>{renderCurrentPage()}</div>
    </div>
  );
};

export default MedicationManagement;
