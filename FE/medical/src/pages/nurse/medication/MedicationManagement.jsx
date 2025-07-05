import React, { useState } from "react";
import { FiActivity } from "react-icons/fi";
import { useMedicationRequests } from "./hooks/useMedicationRequests";
import MedicineAdministration from "./pages/MedicineAdministration";

const MedicationManagement = () => {
  const { stats } = useMedicationRequests();

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý cho uống thuốc
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bắt đầu và quản lý việc cho học sinh uống thuốc theo đơn đã được phê
          duyệt
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Cần bắt đầu cho uống thuốc
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
      </div>

      {/* Medication Administration Content */}
      <MedicineAdministration />
    </div>
  );
};

export default MedicationManagement;
