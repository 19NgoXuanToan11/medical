import React, { useState } from "react";
import { FiShield, FiActivity } from "react-icons/fi";
import VaccinationManagement from "./VaccinationManagement";
import HealthCheckManagement from "./HealthCheckManagement";

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
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeMainTab === tab.id
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
      </div>

      {/* Tab Content */}
      {activeMainTab === "vaccination" && <VaccinationManagement />}
      {activeMainTab === "health_check" && <HealthCheckManagement />}
    </div>
  );
};

export default HealthServicesManagement;
