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
} from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineSchool } from "react-icons/md";

const ParentLayout = () => {
  const location = useLocation();
  const [studentDropdown, setStudentDropdown] = useState(false);
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
    label: "Hồ sơ sức khỏe",
      icon: <FaFileMedical className="w-5 h-5" />,
    },
    {
      path: "/parent/vaccination",
      label: "Tiêm chủng",
      icon: <FaSyringe className="w-5 h-5" />,
    },
    {
      path: "/parent/health-check",
      label: "Kiểm tra định kỳ",
      icon: <FaCalendarCheck className="w-5 h-5" />,
    },
    {
      path: "/parent/health-events",
      label: "Sự kiện y tế",
      icon: <MdHealthAndSafety className="w-5 h-5" />,
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
        className={`fixed inset-y-0 left-0 z-20 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex flex-col w-64 h-full bg-white border-r border-neutral-100">
          {/* Student Selector */}
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

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-3 overflow-y-auto">
            <ul className="space-y-0.5">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm rounded ${
                      location.pathname.startsWith(item.path)
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                  >
                    <span
                      className={`mr-3 ${
                        location.pathname.startsWith(item.path)
                          ? "text-primary-600"
                          : "text-neutral-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Menu */}
          <div className="p-3 border-t border-neutral-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center text-neutral-600 font-medium">
                PH
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-700">
                  Phụ huynh
                </p>
                <button className="text-xs text-neutral-500 hover:text-primary-600">
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-neutral-50">
          <div className="py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
