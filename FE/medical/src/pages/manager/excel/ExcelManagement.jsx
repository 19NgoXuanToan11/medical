import React, { useState, useRef, useEffect } from "react";
import { FiDownload, FiUpload, FiChevronDown } from "react-icons/fi";
import ExcelDownload from "./ExcelDownload";
import ExcelUpload from "./ExcelUpload";

const ExcelManagement = () => {
  const [activeTab, setActiveTab] = useState("download");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tabs = [
    {
      id: "download",
      label: "Tải về",
      icon: <FiDownload className="w-4 h-4" />,
      component: <ExcelDownload />,
    },
    {
      id: "upload",
      label: "Tải lên",
      icon: <FiUpload className="w-4 h-4" />,
      component: <ExcelUpload />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="h-full flex flex-col">
      {/* Header - Center aligned */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
          Quản lý Excel
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Tải xuống mẫu Excel và tải lên dữ liệu học sinh
        </p>
      </div>

      {/* Tab Navigation - Center aligned */}
      <div className="flex justify-center mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 border-b-2 font-medium text-xs flex items-center ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content - Flex grow to fill remaining space */}
      <div className="flex-1 flex items-start justify-center">
        <div className="w-full max-w-4xl">{activeTabData?.component}</div>
      </div>
    </div>
  );
};

export default ExcelManagement;
