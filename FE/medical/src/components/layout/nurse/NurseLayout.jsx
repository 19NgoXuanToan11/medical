import React, { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiTablet,
  FiPackage,
  FiCalendar,
  FiActivity,
  FiClipboard,
  FiLogOut,
  FiBell,
  FiChevronDown,
  FiSettings,
  FiEdit,
} from "react-icons/fi";
import { useAuth } from "../../../utils/auth/AuthContext";
import ThemeToggle from "../../common/ThemeToggle";

const NurseLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    {
      path: "/nurse/dashboard",
      name: "Tổng quan",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: "/nurse/schedule",
      name: "Lịch trình hôm nay",
      icon: <FiBell className="w-5 h-5" />,
    },
    {
      path: "/nurse/health-records",
      name: "Hồ sơ sức khỏe học sinh",
      icon: <FiClipboard className="w-5 h-5" />,
    },
    {
      path: "/nurse/medication",
      name: "Yêu cầu thuốc",
      icon: <FiTablet className="w-5 h-5" />,
    },
    {
      path: "/nurse/health-events",
      name: "Sự kiện y tế",
      icon: <FiActivity className="w-5 h-5" />,
    },
    {
      path: "/nurse/health-services",
      name: "Dịch vụ Y tế",
      icon: <FiCalendar className="w-5 h-5" />,
      description: "Quản lý Tiêm chủng & Khám sức khỏe",
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 ${collapsed ? "w-20" : "w-64"
          } flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
          {!collapsed && (
            <div className="text-xl font-bold text-primary-700 dark:text-primary-400">
              Medical Nurse
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          >
            {collapsed ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg ${isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    } ${collapsed ? "justify-center" : "justify-start"}`}
                >
                  <span
                    className={`${isActive ? "text-primary-600 dark:text-primary-400" : ""
                      }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleLogout}
            className={`flex items-center text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors ${collapsed ? "justify-center w-full" : ""
              }`}
          >
            <FiLogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <header className="bg-white dark:bg-neutral-800 shadow-sm py-4 px-6 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 transition-colors duration-300">
          <div>
            <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
              {menuItems.find((item) => item.path === location.pathname)
                ?.name || "Tổng quan"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <FiBell className="w-6 h-6" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0) || "Y"}
                    {user?.lastName?.charAt(0) || "T"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Xin chào, {user?.firstName || "Y Tá"}!
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Y tá trường học
                  </p>
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-neutral-400 dark:text-neutral-500 hidden md:block transition-transform ${profileDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {user?.firstName || "Y Tá"}{" "}
                      {user?.lastName || "Chuyên Nghiệp"}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Y tá trường học
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                      Phòng Y Tế Trường
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/nurse/profile"
                      className="flex items-center px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FiUsers className="w-4 h-4 mr-3 text-neutral-500 dark:text-neutral-400" />
                      Hồ sơ cá nhân
                    </Link>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-700 py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="bg-neutral-50 dark:bg-neutral-900 p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NurseLayout;
