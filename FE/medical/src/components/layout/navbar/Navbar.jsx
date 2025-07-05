import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../public/logo/logo.png";

const Navbar = () => {
  // Dropdown states
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Dropdown refs
  const dropdownRefs = {
    healthProfile: useRef(null),
    medication: useRef(null),
    healthEvent: useRef(null),
    vaccination: useRef(null),
    healthCheck: useRef(null),
    parent: useRef(null),
    nurse: useRef(null),
    manager: useRef(null),
    admin: useRef(null),
    student: useRef(null),
  };

  // Timers for dropdown delay closing
  const dropdownTimers = {
    healthProfile: useRef(null),
    medication: useRef(null),
    healthEvent: useRef(null),
    vaccination: useRef(null),
    healthCheck: useRef(null),
    parent: useRef(null),
    nurse: useRef(null),
    manager: useRef(null),
    admin: useRef(null),
    student: useRef(null),
  };

  // Handle dropdown mouse enter
  const handleDropdownMouseEnter = (dropdown) => {
    if (dropdownTimers[dropdown].current) {
      clearTimeout(dropdownTimers[dropdown].current);
      dropdownTimers[dropdown].current = null;
    }
    setActiveDropdown(dropdown);
  };

  // Handle dropdown mouse leave
  const handleDropdownMouseLeave = (dropdown) => {
    dropdownTimers[dropdown].current = setTimeout(() => {
      if (activeDropdown === dropdown) {
        setActiveDropdown(null);
      }
    }, 300); // 300ms delay before closing
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (
          dropdownRefs[key].current &&
          !dropdownRefs[key].current.contains(event.target)
        ) {
          if (activeDropdown === key) {
            setActiveDropdown(null);
          }
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending timers on unmount
      Object.keys(dropdownTimers).forEach((key) => {
        if (dropdownTimers[key].current) {
          clearTimeout(dropdownTimers[key].current);
        }
      });
    };
  }, [activeDropdown]);

  // Define role-based menu items
  const roleMenuItems = {
    parent: [
      {
        label: "Hồ sơ sức khỏe",
        children: [
          { label: "Danh sách hồ sơ sức khỏe", path: "/parent/health-profile" },
          {
            label: "Khai báo hồ sơ sức khỏe",
            path: "/parent/health-profile/new",
          },
        ],
      },
      {
        label: "Gửi thuốc",
        children: [
          { label: "Gửi thuốc", path: "/parent/medication/request" },
          { label: "Lịch sử gửi thuốc", path: "/parent/medication/history" },
          { label: "Bảng điều khiển", path: "/parent/dashboard" },
        ],
      },
      {
        label: "Tiêm chủng",
        children: [
          {
            label: "Phiếu đồng ý tiêm chủng",
            path: "/parent/vaccination/consent/new",
          },
        ],
      },
      {
        label: "Sự kiện y tế",
        children: [
          { label: "Danh sách sự kiện", path: "/parent/health-events" },
        ],
      },
      {
        label: "Kiểm tra y tế",
        children: [
          { label: "Xác nhận kiểm tra", path: "/parent/health-check" },
          { label: "Kết quả kiểm tra", path: "/parent/health-check/results" },
        ],
      },
    ],
    nurse: [
      {
        label: "Quản lý thuốc",
        children: [{ label: "Danh sách thuốc", path: "/nurse/medication" }],
      },
      {
        label: "Kiểm tra y tế",
        children: [
          { label: "Danh sách kiểm tra", path: "/nurse/health-check" },
          { label: "Tạo kiểm tra mới", path: "/nurse/health-check/new" },
        ],
      },
      {
        label: "Sự kiện y tế",
        children: [
          { label: "Danh sách sự kiện", path: "/nurse/health-events" },
          { label: "Tạo sự kiện mới", path: "/nurse/health-events/new" },
        ],
      },
      {
        label: "Tiêm chủng",
        children: [{ label: "Quản lý tiêm chủng", path: "/nurse/vaccination" }],
      },
    ],
    manager: [
      {
        label: "Bảng điều khiển",
        path: "/manager/dashboard",
      },
      {
        label: "Quản lý người dùng",
        children: [
          { label: "Quản lý phụ huynh", path: "/manager/parent-management" },
          { label: "Quản lý học sinh", path: "/manager/student-management" },
        ],
      },
      {
        label: "Kho",
        children: [
          { label: "Kho thuốc", path: "/manager/medicine-inventory" },
          { label: "Kho vật tư y tế", path: "/manager/supply-inventory" },
        ],
      },
    ],
    admin: [
      {
        label: "Bảng điều khiển",
        path: "/admin/dashboard",
      },
      {
        label: "Quản lý người dùng",
        children: [
          { label: "Danh sách người dùng", path: "/admin/users" },
          { label: "Vai trò người dùng", path: "/admin/users/roles" },
          { label: "Quyền hạn", path: "/admin/users/permissions" },
        ],
      },
      {
        label: "Báo cáo & Phân tích",
        path: "/admin/reports",
      },
    ],
    student: [
      {
        label: "Bảng điều khiển",
        path: "/student/dashboard",
      },
      {
        label: "Thuốc của tôi",
        path: "/student/medication",
      },
      {
        label: "Sự kiện y tế",
        path: "/student/health-events",
      },
      {
        label: "Tài liệu sức khỏe",
        path: "/student/resources",
      },
    ],
  };

  // Function to render dropdown menu
  const renderDropdownMenu = (dropdownId, title, icon, menuItems) => {
    return (
      <div
        className="relative"
        ref={dropdownRefs[dropdownId]}
        onMouseEnter={() => handleDropdownMouseEnter(dropdownId)}
        onMouseLeave={() => handleDropdownMouseLeave(dropdownId)}
      >
        <button className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 flex items-center group whitespace-nowrap">
          {icon}
          <span className="whitespace-nowrap">{title}</span>
          <svg
            className={`ml-1 h-4 w-4 transition-transform duration-300 ${
              activeDropdown === dropdownId ? "rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown menu with transition */}
        <div
          className={`absolute mt-1 w-64 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black dark:ring-neutral-600 ring-opacity-5 z-50 transition-all duration-200 ${
            activeDropdown === dropdownId
              ? "opacity-100 transform translate-y-0 pointer-events-auto"
              : "opacity-0 transform -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {menuItems.map((item, index) => {
              // If item has children, render section
              if (item.children) {
                return (
                  <div key={index}>
                    {index > 0 && (
                      <div className="border-t border-gray-100 dark:border-neutral-700 my-1"></div>
                    )}
                    {item.label && (
                      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                        {item.label}
                      </div>
                    )}
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              } else {
                // If item has no children, render direct link
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    role="menuitem"
                  >
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  };

  return <></>;
};

export default Navbar;
