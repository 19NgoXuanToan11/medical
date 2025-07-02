import React, { useState } from "react";
import {
<<<<<<< HEAD
  FiActivity,
} from "react-icons/fi";
import { useMedicationRequests } from "./hooks/useMedicationRequests";
import MedicineAdministration from "./pages/MedicineAdministration";
=======
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiClipboard,
  FiActivity,
} from "react-icons/fi";
import { useMedicationRequests } from "./hooks/useMedicationRequests";
import PendingRequests from "./pages/PendingRequests";
import AssignedRequests from "./pages/AssignedRequests";
import MedicineAdministration from "./pages/MedicineAdministration";
import CompletedRequests from "./pages/CompletedRequests";
import AllRequests from "./pages/AllRequests";
>>>>>>> f9b18e8 (create "give medicine" interface and get list of student health records)

const MedicationManagement = () => {
  const { stats } = useMedicationRequests();

<<<<<<< HEAD
=======
  // Render current component based on active tab
  const renderCurrentPage = () => {
    switch (activeTab) {
      case "pending":
        return <PendingRequests />;
      case "assigned":
        return <AssignedRequests />;
      case "administration":
        return <MedicineAdministration />;
      case "completed":
        return <CompletedRequests />;
      case "all":
        return <AllRequests />;
      default:
        return <PendingRequests />;
    }
  };

>>>>>>> f9b18e8 (create "give medicine" interface and get list of student health records)
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Cho uống thuốc
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Quản lý việc cho học sinh uống thuốc theo đơn đã được phê duyệt
        </p>
      </div>

<<<<<<< HEAD
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
=======
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
>>>>>>> f9b18e8 (create "give medicine" interface and get list of student health records)
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Cần cho uống thuốc
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.administration || stats.assigned}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã hoàn thành hôm nay
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.today || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
<<<<<<< HEAD
                Tổng đã hoàn thành
=======
                Cho uống thuốc
              </p>
              <p className="text-2xl font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.administration || stats.assigned}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Đã hoàn thành
>>>>>>> f9b18e8 (create "give medicine" interface and get list of student health records)
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Medicine Administration Content */}
      <div>
        <MedicineAdministration />
=======
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
              onClick={() => setActiveTab("administration")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "administration"
                  ? "bg-orange-600 dark:bg-orange-700 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              Cho uống thuốc ({stats.administration || stats.assigned})
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
>>>>>>> f9b18e8 (create "give medicine" interface and get list of student health records)
      </div>
    </div>
  );
};

export default MedicationManagement;

