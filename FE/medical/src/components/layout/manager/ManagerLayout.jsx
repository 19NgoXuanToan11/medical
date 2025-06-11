import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiLogOut,
  FiTablet,
  FiUser,
  FiBell,
  FiUpload,
} from "react-icons/fi";

const ManagerLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      path: "/manager/dashboard",
      name: "Tổng quan",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      path: "/manager/parent-management",
      name: "Phụ huynh",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      path: "/manager/student-management",
      name: "Học sinh",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      path: "/manager/medicine-inventory",
      name: "Kho thuốc",
      icon: <FiTablet className="w-5 h-5" />,
    },
    {
      path: "/manager/supply-inventory",
      name: "Vật tư y tế",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      path: "/manager/upload",
      name: "Tải lên Excel",
      icon: <FiUpload className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-neutral-200 ${
          collapsed ? "w-20" : "w-64"
        } flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200">
          {!collapsed && (
            <div className="text-xl font-bold text-primary-700">
              Medical Manager
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-neutral-100 text-neutral-600"
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
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-100"
                  } ${collapsed ? "justify-center" : "justify-start"}`}
                >
                  <span className={`${isActive ? "text-primary-600" : ""}`}>
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
        <div className="p-4 border-t border-neutral-200">
          <button
            className={`flex items-center text-neutral-600 hover:text-neutral-900 ${
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
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-neutral-200">
          <div>
            <h1 className="text-xl font-semibold text-neutral-800">
              {menuItems.find(
                (item) =>
                  location.pathname === item.path ||
                  (location.pathname.startsWith(item.path.split("?")[0]) &&
                    (item.path.includes("?")
                      ? location.search.includes(item.path.split("?")[1])
                      : true))
              )?.name || "Tổng quan"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100">
              <FiBell className="w-6 h-6" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">MG</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
