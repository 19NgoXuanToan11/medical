import React, { useState, useEffect } from "react";
import { FiShield, FiActivity, FiPlus, FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VaccinationManagement from "./VaccinationManagement";
import HealthCheckManagement from "./HealthCheckManagement";

const HealthServicesManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for URL parameter to set initial tab
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    return tabParam === "vaccination" ? "vaccination" : "health_check";
  };

  const [activeMainTab, setActiveMainTab] = useState(getInitialTab());
  const [searchTerm, setSearchTerm] = useState("");

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveMainTab(tabId);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tabId);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  // Update tab when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newTab = getInitialTab();
    if (newTab !== activeMainTab) {
      setActiveMainTab(newTab);
    }
  }, [location.search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dịch vụ Y tế
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tiêm chủng và khám sức khỏe định kỳ
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <Link
            to={`/nurse/health-services/create/${activeMainTab}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Tạo mới
          </Link>
        </div>
      </div>

      {/* Service Type Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            {
              id: "health_check",
              label: "Khám sức khỏe",
              icon: FiActivity,
            },
            {
              id: "vaccination",
              label: "Tiêm chủng",
              icon: FiShield,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeMainTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeMainTab === "vaccination" && (
          <VaccinationManagement searchTerm={searchTerm} />
        )}
        {activeMainTab === "health_check" && (
          <HealthCheckManagement searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
};

export default HealthServicesManagement;
