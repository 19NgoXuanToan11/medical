<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 19ec55e (change the look of vaccinations and routine medical checkups)
import React, { useState } from "react";
import { FiShield, FiActivity } from "react-icons/fi";
import VaccinationManagement from "./VaccinationManagement";
import HealthCheckManagement from "./HealthCheckManagement";
<<<<<<< HEAD

const HealthServicesManagement = () => {
  const [activeMainTab, setActiveMainTab] = useState("vaccination"); // vaccination, health_check

  return (
    <div>
      {/* Main Service Type Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              {
                id: "vaccination",
                label: "Tiêm chủng",
                icon: FiShield,
              },
              {
                id: "health_check",
                label: "Y tế định kỳ",
                icon: FiActivity,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeMainTab === tab.id
                    ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
=======
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiShield,
  FiEye,
  FiEdit,
  FiPlay,
  FiPause,
  FiUser,
  FiMapPin,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";
=======
>>>>>>> 19ec55e (change the look of vaccinations and routine medical checkups)

const HealthServicesManagement = () => {
  const [activeMainTab, setActiveMainTab] = useState("vaccination"); // vaccination, health_check

  return (
    <div>
      {/* Main Service Type Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden mb-6">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              {
                id: "vaccination",
                label: "Tiêm chủng",
                icon: FiShield,
              },
              {
                id: "health_check",
                label: "Y tế định kỳ",
                icon: FiActivity,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeMainTab === tab.id
                    ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
<<<<<<< HEAD

        {/* Sub Status Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50">
          <nav className="flex">
            {[
              {
                id: "scheduled",
                label: "Đã lên lịch",
                icon: FiCalendar,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "scheduled"
                ).length,
              },
              {
                id: "active",
                label: "Đang thực hiện",
                icon: FiClock,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "active"
                ).length,
              },
              {
                id: "completed",
                label: "Đã hoàn thành",
                icon: FiCheckCircle,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "completed"
                ).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeSubTab === tab.id
                    ? "bg-white dark:bg-neutral-800 border-b-2 border-primary-500 text-primary-700 dark:text-primary-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-600/50"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">
                    {tab.count}
                  </span>
                )}
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
              </button>
            ))}
          </nav>
        </div>
<<<<<<< HEAD
      </div>

      {/* Tab Content */}
      {activeMainTab === "vaccination" && <VaccinationManagement />}
      {activeMainTab === "health_check" && <HealthCheckManagement />}
=======

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(renderServiceCard)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
      </div>

      {/* Tab Content */}
      {activeMainTab === "vaccination" && <VaccinationManagement />}
      {activeMainTab === "health_check" && <HealthCheckManagement />}
>>>>>>> 19ec55e (change the look of vaccinations and routine medical checkups)
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default HealthServicesManagement;
=======
export default HealthServicesManagement; 
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
export default HealthServicesManagement;
>>>>>>> 512000a (edit nurse role medical service management interface)
