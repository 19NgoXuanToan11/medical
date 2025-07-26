import React, { useState } from "react";
import {
  FiActivity,
  FiCheck,
  FiClock,
  FiPlayCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { useMedicationRequests } from "./hooks/useMedicationRequests";
import MedicineVerification from "./pages/MedicineVerification";
import MedicineAdministration from "./pages/MedicineAdministration";
import InProgressManagement from "./pages/InProgressManagement";
import FailedRequestManagement from "./pages/FailedRequestManagement";

const MedicationManagement = () => {
  const [activeTab, setActiveTab] = useState("verification");
  const { stats } = useMedicationRequests();

  const tabs = [
    {
      key: "verification",
      label: "Kiểm tra thuốc",
      icon: FiCheck,
      component: MedicineVerification,
      description: "Kiểm tra và xác nhận/từ chối yêu cầu thuốc",
    },
    {
      key: "administration",
      label: "Cho uống thuốc",
      icon: FiPlayCircle,
      component: MedicineAdministration,
      description: "Bắt đầu quá trình cho học sinh uống thuốc",
    },
    {
      key: "inprogress",
      label: "Đang thực hiện",
      icon: FiClock,
      component: InProgressManagement,
      description: "Theo dõi và ghi nhận tiến độ uống thuốc",
    },
    {
      key: "failed",
      label: "Thất bại & Tạo lại",
      icon: FiAlertTriangle,
      component: FailedRequestManagement,
      description: "Quản lý thất bại và tạo yêu cầu lại",
    },
  ];

  const getCurrentComponent = () => {
    const currentTab = tabs.find((tab) => tab.key === activeTab);
    if (currentTab) {
      const Component = currentTab.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          Quản lý thuốc trường học
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Hệ thống quản lý toàn diện cho việc cho học sinh uống thuốc
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Chờ kiểm tra
              </p>
              <p className="text-lg font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                {stats.pending || 0}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <FiCheck className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Đang thực hiện
              </p>
              <p className="text-lg font-bold mt-1 text-orange-600 dark:text-orange-400">
                {stats.inProgress || 0}
              </p>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <FiClock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700 transition-colors duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Hoàn thành
              </p>
              <p className="text-lg font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completed || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiActivity className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-600">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon
                    className={`mr-2 h-5 w-5 ${
                      activeTab === tab.key
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Description */}
        <div className="mt-4 mb-6">
          {tabs.map((tab) => {
            if (tab.key === activeTab) {
              return (
                <p
                  key={tab.key}
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  {tab.description}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-neutral-700 p-6 transition-colors duration-300">
        {getCurrentComponent()}
      </div>
    </div>
  );
};

export default MedicationManagement;
