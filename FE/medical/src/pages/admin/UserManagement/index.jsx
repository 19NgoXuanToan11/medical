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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <p className="text-gray-600">
          Quản lý tài khoản, vai trò và quyền hạn người dùng trong hệ thống
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`${
                isActive(tab)
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.icon}
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Content area for child routes */}
      <Outlet />
    </div>
  );
};

export default UserManagement;
