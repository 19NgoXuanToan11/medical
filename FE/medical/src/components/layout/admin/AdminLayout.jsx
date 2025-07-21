import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiBell,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../../../utils/auth/AuthContext";
import ThemeToggle from "../../common/ThemeToggle";
import NotificationDropdown from "../../common/NotificationDropdown";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      name: "Tổng quan",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: "/admin/staff",
      name: "Quản lý nhân viên",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      path: "/admin/nurse-grades",
      name: "Phân công Y tá",
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      path: "/admin/reports",
      name: "Báo cáo",
      icon: <FiBarChart2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
          {!collapsed && (
            <div className="text-xl font-bold text-primary-700 dark:text-primary-400">
              Medical Admin
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
                  className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                      : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  } ${collapsed ? "justify-center" : "justify-start"}`}
                >
                  <span
                    className={`${
                      isActive ? "text-primary-600 dark:text-primary-400" : ""
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
            className={`flex items-center text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 transition-colors ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <FiLogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
            <NotificationDropdown userRole="admin" />
            <div className="h-8 w-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">AD</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900 p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
