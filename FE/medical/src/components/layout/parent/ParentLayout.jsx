import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  FaUser,
} from "react-icons/fa";
import { MdHealthAndSafety, MdOutlineSchool } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../../utils/auth/AuthContext";
import { useParent } from "../../../utils/auth/ParentContext";
import ThemeToggle from "../../common/ThemeToggle";

const ParentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { students, selectedStudent, loading, selectStudent } = useParent();
  const [studentDropdown, setStudentDropdown] = useState(false);
  const [medicationDropdown, setMedicationDropdown] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle student selection
  const handleStudentSelect = (student) => {
    selectStudent(student);
    setStudentDropdown(false);
  };

  // Current selected student
  const currentStudent = selectedStudent;

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
      path: "/parent/health-services",
      label: "Dịch vụ Y tế",
      icon: <FaSyringe className="w-5 h-5" />,
<<<<<<< HEAD
<<<<<<< HEAD
      description: "Tiêm chủng & Khám sức khỏe định kỳ",
=======
      description: "Tiêm chủng & Khám sức khỏe định kỳ"
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
      description: "Tiêm chủng & Khám sức khỏe định kỳ",
>>>>>>> 512000a (edit nurse role medical service management interface)
    },
    {
      path: "/parent/notifications",
      label: "Thông báo",
      icon: <FaBell className="w-5 h-5" />,
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
              Medical Parent
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

        {/* Student Selector */}
        {!collapsed && (
          <div className="relative px-3 py-3 border-b border-neutral-100 dark:border-neutral-700">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Đang tải...
                </span>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Không có thông tin con em
                </p>
              </div>
            ) : currentStudent ? (
              <>
                <button
                  onClick={() => setStudentDropdown(!studentDropdown)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {currentStudent.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{currentStudent.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Lớp {currentStudent.class}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
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
                    <div className="bg-white dark:bg-neutral-800 rounded shadow-md border border-neutral-100 dark:border-neutral-600">
                      {students.map((student) => (
                        <button
                          key={student.studentId}
                          className={`flex items-center w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                            currentStudent?.studentId === student.studentId
                              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                              : ""
                          }`}
                          onClick={() => handleStudentSelect(student)}
                        >
                          <div className="w-8 h-8 mr-2 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div className="text-left">
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Lớp {student.class} - {student.studentCode}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}
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
                          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
                                ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium"
                                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-700 dark:hover:text-neutral-200"
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
                        ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
            <ThemeToggle />
            <button className="p-1 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <FaBell className="w-6 h-6" />
            </button>

            {/* User Profile Section */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.firstName?.charAt(0) || "P"}
                    {user?.lastName?.charAt(0) || "H"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Xin chào, {user?.firstName || "Phụ huynh"}!
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Phụ huynh học sinh
                  </p>
                </div>
                <FaChevronDown
                  className={`w-3 h-3 text-neutral-400 hidden md:block transition-transform ${
                    userDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {user?.firstName || "Phụ huynh"} {user?.lastName || ""}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user?.email || "parent@medical.com"}
                    </p>
                  </div>

                  <Link
                    to="/parent/profile"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <FaUser className="w-4 h-4 mr-3 text-neutral-500" />
                    Hồ sơ cá nhân
                  </Link>

                  <div className="border-t border-neutral-100 dark:border-neutral-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900 p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;
