import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFileMedical,
  FaSyringe,
  FaPills,
  FaCalendarCheck,
  FaBell,
  FaChartLine,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaList,
} from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineSchool } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const ParentLayout = () => {
  const location = useLocation();
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [medicationDropdown, setMedicationDropdown] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Placeholder data - in a real app, this would come from an API
  const students = [
    { id: 1, name: "Nguyễn Văn An", class: "10A1" },
    { id: 2, name: "Nguyễn Thị Bình", class: "8B2" },
  ];

  // Current selected student - would be state managed by context in a real app
  const currentStudent = students[0];

  const menuItems = [
    {
      path: "/parent/dashboard",
      label: "Trang chủ",
      icon: <FaHome className="w-5 h-5" />,
    },
    {
      path: "/parent/health-profile",
      label: "Hồ sơ sức khỏe học sinh",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
    {
      type: "dropdown",
      label: "Yêu cầu thuốc",
      icon: <FaPills className="w-5 h-5" />,
      isOpen: medicationDropdown,
      toggleOpen: () => setMedicationDropdown(!medicationDropdown),
      subItems: [
        {
          path: "/parent/medication/request",
          label: "Tạo yêu cầu",
          icon: <FaPlus className="w-4 h-4" />,
        },
        {
          path: "/parent/medication/history",
          label: "Quản lý yêu cầu thuốc",
          icon: <FaList className="w-4 h-4" />,
        },
      ],
    },
    {
      path: "/parent/health-events",
      label: "Sự kiện y tế",
      icon: <MdHealthAndSafety className="w-5 h-5" />,
    },
    {
      path: "/parent/vaccination",
      label: "Tiêm chủng",
      icon: <FaSyringe className="w-5 h-5" />,
    },
    {
      path: "/parent/health-check",
      label: "Kiểm tra y tế định kỳ",
      icon: <FaCalendarCheck className="w-5 h-5" />,
    },
    {
      path: "/parent/notifications",
      label: "Thông báo",
      icon: <FaBell className="w-5 h-5" />,
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
              Medical Parent
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

        {/* Student Selector */}
        {!collapsed && (
          <div className="relative px-3 py-3 border-b border-neutral-100">
            <button
              onClick={() => setStudentDropdown(!studentDropdown)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {currentStudent.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="font-medium">{currentStudent.name}</p>
                  <p className="text-xs text-neutral-500">
                    Lớp {currentStudent.class}
                  </p>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {studentDropdown && (
              <div className="absolute left-0 right-0 z-10 px-3 mt-1">
                <div className="bg-white rounded shadow-md border border-neutral-100">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      onClick={() => setStudentDropdown(false)}
                    >
                      <div className="w-8 h-8 mr-2 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-neutral-500">
                          Lớp {student.class}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item, index) => (
              <div key={item.path || index}>
                {item.type === "dropdown" ? (
                  <div>
                    <button
                      onClick={item.toggleOpen}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm rounded-lg ${
                        item.subItems?.some((subItem) =>
                          location.pathname.startsWith(subItem.path)
                        )
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-600 hover:bg-neutral-100"
                      } ${collapsed ? "justify-center" : "justify-start"}`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`${
                            item.subItems?.some((subItem) =>
                              location.pathname.startsWith(subItem.path)
                            )
                              ? "text-primary-600"
                              : ""
                          }`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="ml-3 font-medium">{item.label}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          {item.isOpen ? (
                            <FaChevronDown className="w-3 h-3 text-neutral-500" />
                          ) : (
                            <FaChevronRight className="w-3 h-3 text-neutral-500" />
                          )}
                        </>
                      )}
                    </button>
                    {item.isOpen && !collapsed && (
                      <div className="mt-1 ml-6 space-y-0.5">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center px-3 py-2 text-sm rounded ${
                              location.pathname === subItem.path
                                ? "bg-primary-50 text-primary-700 font-medium"
                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-700"
                            }`}
                          >
                            <span
                              className={`mr-3 ${
                                location.pathname === subItem.path
                                  ? "text-primary-600"
                                  : "text-neutral-500"
                              }`}
                            >
                              {subItem.icon}
                            </span>
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-lg ${
                      location.pathname.startsWith(item.path)
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-100"
                    } ${collapsed ? "justify-center" : "justify-start"}`}
                  >
                    <span
                      className={`${
                        location.pathname.startsWith(item.path)
                          ? "text-primary-600"
                          : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
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
              {(() => {
                // Find current page title
                for (const item of menuItems) {
                  if (item.type === "dropdown") {
                    const subItem = item.subItems?.find(
                      (sub) => location.pathname === sub.path
                    );
                    if (subItem) return subItem.label;
                    if (
                      item.subItems?.some((sub) =>
                        location.pathname.startsWith(sub.path)
                      )
                    )
                      return item.label;
                  } else if (location.pathname.startsWith(item.path)) {
                    return item.label;
                  }
                }
                return "Trang chủ";
              })()}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100">
              <FaBell className="w-6 h-6" />
            </button>
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-medium text-sm">PH</span>
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

export default ParentLayout;
