import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiUsers, FiKey, FiShield } from "react-icons/fi";

const UserManagement = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    {
      name: "Danh sách người dùng",
      path: "/admin/users",
      icon: <FiUsers className="mr-2" />,
      exact: true,
    },
    {
      name: "Vai trò người dùng",
      path: "/admin/users/roles",
      icon: <FiKey className="mr-2" />,
    },
    {
      name: "Phân quyền hệ thống",
      path: "/admin/users/permissions",
      icon: <FiShield className="mr-2" />,
    },
  ];

  const isActive = (tab) => {
    if (tab.exact) {
      return currentPath === tab.path;
    }
    return currentPath.startsWith(tab.path);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
            Quản lý người dùng
          </h2>
          <p className="text-neutral-600 mb-6">
            Quản lý tài khoản, vai trò và quyền hạn người dùng trong hệ thống
          </p>

          {/* Navigation Tabs */}
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`${
                    isActive(tab)
                      ? "border-primary-600 text-primary-700"
                      : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
                >
                  {isActive(tab) ? (
                    <span className="text-primary-600">{tab.icon}</span>
                  ) : (
                    tab.icon
                  )}
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content area for child routes */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserManagement;
