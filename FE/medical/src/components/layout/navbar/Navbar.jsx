import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../public/logo/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [healthProfileDropdownOpen, setHealthProfileDropdownOpen] =
    useState(false);
  const [medicationDropdownOpen, setMedicationDropdownOpen] = useState(false);
  const [healthEventDropdownOpen, setHealthEventDropdownOpen] = useState(false);
  const [vaccinationDropdownOpen, setVaccinationDropdownOpen] = useState(false);
  const [healthCheckDropdownOpen, setHealthCheckDropdownOpen] = useState(false);
  const healthDropdownRef = useRef(null);
  const medicationDropdownRef = useRef(null);
  const healthEventDropdownRef = useRef(null);
  const vaccinationDropdownRef = useRef(null);
  const healthCheckDropdownRef = useRef(null);

  // Add timers to control delayed closing of dropdowns
  const healthDropdownTimer = useRef(null);
  const medicationDropdownTimer = useRef(null);
  const healthEventDropdownTimer = useRef(null);
  const vaccinationDropdownTimer = useRef(null);
  const healthCheckDropdownTimer = useRef(null);

  const handleHealthMouseEnter = () => {
    if (healthDropdownTimer.current) {
      clearTimeout(healthDropdownTimer.current);
      healthDropdownTimer.current = null;
    }
    setHealthProfileDropdownOpen(true);
  };

  const handleHealthMouseLeave = () => {
    healthDropdownTimer.current = setTimeout(() => {
      setHealthProfileDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleMedicationMouseEnter = () => {
    if (medicationDropdownTimer.current) {
      clearTimeout(medicationDropdownTimer.current);
      medicationDropdownTimer.current = null;
    }
    setMedicationDropdownOpen(true);
  };

  const handleMedicationMouseLeave = () => {
    medicationDropdownTimer.current = setTimeout(() => {
      setMedicationDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleHealthEventMouseEnter = () => {
    if (healthEventDropdownTimer.current) {
      clearTimeout(healthEventDropdownTimer.current);
      healthEventDropdownTimer.current = null;
    }
    setHealthEventDropdownOpen(true);
  };

  const handleHealthEventMouseLeave = () => {
    healthEventDropdownTimer.current = setTimeout(() => {
      setHealthEventDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleVaccinationMouseEnter = () => {
    if (vaccinationDropdownTimer.current) {
      clearTimeout(vaccinationDropdownTimer.current);
      vaccinationDropdownTimer.current = null;
    }
    setVaccinationDropdownOpen(true);
  };

  const handleVaccinationMouseLeave = () => {
    vaccinationDropdownTimer.current = setTimeout(() => {
      setVaccinationDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  const handleHealthCheckMouseEnter = () => {
    if (healthCheckDropdownTimer.current) {
      clearTimeout(healthCheckDropdownTimer.current);
      healthCheckDropdownTimer.current = null;
    }
    setHealthCheckDropdownOpen(true);
  };

  const handleHealthCheckMouseLeave = () => {
    healthCheckDropdownTimer.current = setTimeout(() => {
      setHealthCheckDropdownOpen(false);
    }, 300); // 300ms delay before closing
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        healthDropdownRef.current &&
        !healthDropdownRef.current.contains(event.target)
      ) {
        setHealthProfileDropdownOpen(false);
      }

      if (
        medicationDropdownRef.current &&
        !medicationDropdownRef.current.contains(event.target)
      ) {
        setMedicationDropdownOpen(false);
      }

      if (
        healthEventDropdownRef.current &&
        !healthEventDropdownRef.current.contains(event.target)
      ) {
        setHealthEventDropdownOpen(false);
      }

      if (
        vaccinationDropdownRef.current &&
        !vaccinationDropdownRef.current.contains(event.target)
      ) {
        setVaccinationDropdownOpen(false);
      }

      if (
        healthCheckDropdownRef.current &&
        !healthCheckDropdownRef.current.contains(event.target)
      ) {
        setHealthCheckDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending timers on unmount
      if (healthDropdownTimer.current)
        clearTimeout(healthDropdownTimer.current);
      if (medicationDropdownTimer.current)
        clearTimeout(medicationDropdownTimer.current);
      if (healthEventDropdownTimer.current)
        clearTimeout(healthEventDropdownTimer.current);
      if (vaccinationDropdownTimer.current)
        clearTimeout(vaccinationDropdownTimer.current);
      if (healthCheckDropdownTimer.current)
        clearTimeout(healthCheckDropdownTimer.current);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="w-full px-0">
        <div className="flex items-center h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0 pl-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="logo" className="h-8 w-8 mr-2" />
              <span className="text-blue-600 font-bold text-xl tracking-tight">
                Med<span className="text-blue-800">School</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Middle */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center justify-center space-x-12">
              <Link
                to="/"
                className="text-blue-600 font-medium px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="whitespace-nowrap">Trang chủ</span>
              </Link>
              {/* Hồ sơ sức khỏe with dropdown */}
              <div
                className="relative"
                ref={healthDropdownRef}
                onMouseEnter={handleHealthMouseEnter}
                onMouseLeave={handleHealthMouseLeave}
              >
                <button className="text-gray-600 hover:text-blue-600 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center group whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Hồ sơ sức khỏe</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      healthProfileDropdownOpen ? "rotate-180" : ""
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
                  className={`absolute mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    healthProfileDropdownOpen
                      ? "opacity-100 transform translate-y-0 pointer-events-auto"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/parent/health-profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Danh sách hồ sơ sức khỏe
                    </Link>
                    <Link
                      to="/parent/health-profile/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Khai báo hồ sơ sức khỏe
                    </Link>
                  </div>
                </div>
              </div>
              <div
                className="relative"
                ref={vaccinationDropdownRef}
                onMouseEnter={handleVaccinationMouseEnter}
                onMouseLeave={handleVaccinationMouseLeave}
              >
                <button className="text-gray-600 hover:text-blue-600 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center group whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5m0 0l9-5-9-5-9 5 9 5m0 0v6"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Tiêm chủng</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      vaccinationDropdownOpen ? "rotate-180" : ""
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

                {/* Dropdown menu for vaccination */}
                <div
                  className={`absolute mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    vaccinationDropdownOpen
                      ? "opacity-100 transform translate-y-0 pointer-events-auto"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                      Phụ huynh
                    </div>
                    <Link
                      to="/parent/vaccination/consent/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Phiếu đồng ý tiêm chủng
                    </Link>

                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-t border-gray-100">
                      Nhân viên y tế
                    </div>
                    <Link
                      to="/staff/vaccination"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Quản lý tiêm chủng
                    </Link>
                    <Link
                      to="/staff/vaccination/flow"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Quy trình tiêm chủng
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quản lý thuốc dropdown */}
              <div
                className="relative"
                ref={medicationDropdownRef}
                onMouseEnter={handleMedicationMouseEnter}
                onMouseLeave={handleMedicationMouseLeave}
              >
                <button className="text-gray-600 hover:text-blue-600 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center group whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Thuốc</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      medicationDropdownOpen ? "rotate-180" : ""
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

                {/* Dropdown menu */}
                <div
                  className={`absolute mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    medicationDropdownOpen
                      ? "opacity-100 transform translate-y-0 pointer-events-auto"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                      Phụ huynh
                    </div>
                    <Link
                      to="/parent/medication/request"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Gửi thuốc
                    </Link>
                    <Link
                      to="/parent/medication/history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Lịch sử gửi thuốc
                    </Link>
                    <Link
                      to="/parent/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Bảng điều khiển
                    </Link>

                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-t border-gray-100">
                      Nhân viên y tế
                    </div>
                    <Link
                      to="/staff/medication"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Quản lý thuốc
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sự kiện y tế dropdown */}
              <div
                className="relative"
                ref={healthEventDropdownRef}
                onMouseEnter={handleHealthEventMouseEnter}
                onMouseLeave={handleHealthEventMouseLeave}
              >
                <button className="text-gray-600 hover:text-blue-600 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center group whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Sự kiện y tế</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      healthEventDropdownOpen ? "rotate-180" : ""
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

                {/* Dropdown menu for health events */}
                <div
                  className={`absolute mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    healthEventDropdownOpen
                      ? "opacity-100 transform translate-y-0 pointer-events-auto"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                      Nhân viên y tế
                    </div>
                    <Link
                      to="/staff/health-events"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Danh sách sự kiện y tế
                    </Link>
                    <Link
                      to="/staff/health-events/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Thêm sự kiện mới
                    </Link>
                  </div>
                </div>
              </div>

              {/* Kiểm tra y tế định kỳ dropdown */}
              <div
                className="relative"
                ref={healthCheckDropdownRef}
                onMouseEnter={handleHealthCheckMouseEnter}
                onMouseLeave={handleHealthCheckMouseLeave}
              >
                <button className="text-gray-600 hover:text-blue-600 px-2 py-2 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center group whitespace-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span className="whitespace-nowrap">Kiểm tra định kỳ</span>
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      healthCheckDropdownOpen ? "rotate-180" : ""
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

                {/* Dropdown menu for health checks */}
                <div
                  className={`absolute mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ${
                    healthCheckDropdownOpen
                      ? "opacity-100 transform translate-y-0 pointer-events-auto"
                      : "opacity-0 transform -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                      Phụ huynh
                    </div>
                    <Link
                      to="/parent/health-check"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Xác nhận kiểm tra
                    </Link>
                    <Link
                      to="/parent/health-check/results"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Xem kết quả kiểm tra
                    </Link>

                    <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-t border-gray-100">
                      Nhân viên y tế
                    </div>
                    <Link
                      to="/staff/health-check"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Quản lý kiểm tra
                    </Link>
                    <Link
                      to="/staff/health-check/new"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      role="menuitem"
                    >
                      Lên lịch kiểm tra mới
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication - Right */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto pr-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md border border-blue-200 hover:border-blue-400 transition-all duration-200 font-medium flex items-center bg-blue-50 hover:bg-blue-100 whitespace-nowrap"
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Đăng nhập
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } lg:hidden border-t border-gray-200`}
      >
        <div className="px-5 pt-3 pb-4 space-y-2.5">
          <Link
            to="/"
            className="text-blue-600 font-medium block px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Trang chủ
          </Link>
          <Link
            to="/tinh-nang"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Tính năng
          </Link>

          {/* Mobile dropdown for Ho so suc khoe */}
          <div className="relative">
            <button
              onClick={() =>
                setHealthProfileDropdownOpen(!healthProfileDropdownOpen)
              }
              className="text-gray-600 hover:text-blue-600 w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Hồ sơ sức khỏe
              </div>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  healthProfileDropdownOpen ? "rotate-180" : ""
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

            {/* Mobile dropdown menu with transition */}
            <div
              className={`${
                healthProfileDropdownOpen ? "block" : "hidden"
              } mt-2 pl-10 pr-4 pb-2`}
            >
              <Link
                to="/parent/health-profile"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Danh sách hồ sơ sức khỏe
              </Link>
              <Link
                to="/parent/health-profile/new"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Khai báo hồ sơ sức khỏe
              </Link>
            </div>
          </div>

          {/* Mobile dropdown for Quan ly thuoc */}
          <div className="relative">
            <button
              onClick={() => setMedicationDropdownOpen(!medicationDropdownOpen)}
              className="text-gray-600 hover:text-blue-600 w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                Thuốc
              </div>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  medicationDropdownOpen ? "rotate-180" : ""
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

            {/* Mobile dropdown menu */}
            <div
              className={`${
                medicationDropdownOpen ? "block" : "hidden"
              } mt-2 pl-10 pr-4 pb-2`}
            >
              <p className="text-xs text-gray-500 px-3 py-2 uppercase font-semibold">
                Phụ huynh
              </p>
              <Link
                to="/parent/medication/request"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Gửi thuốc
              </Link>
              <Link
                to="/parent/medication/history"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Lịch sử gửi thuốc
              </Link>
              <Link
                to="/parent/dashboard"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Bảng điều khiển
              </Link>

              <p className="text-xs text-gray-500 px-3 py-2 mt-2 uppercase font-semibold">
                Nhân viên y tế
              </p>
              <Link
                to="/staff/medication"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Quản lý thuốc
              </Link>
            </div>
          </div>

          {/* Mobile dropdown for Tiêm chủng */}
          <div className="relative">
            <button
              onClick={() =>
                setVaccinationDropdownOpen(!vaccinationDropdownOpen)
              }
              className="text-gray-600 hover:text-blue-600 w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5m0 0l9-5-9-5-9 5 9 5m0 0v6"
                  />
                </svg>
                Tiêm chủng
              </div>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  vaccinationDropdownOpen ? "rotate-180" : ""
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

            {/* Mobile dropdown menu */}
            <div
              className={`${
                vaccinationDropdownOpen ? "block" : "hidden"
              } mt-2 pl-10 pr-4 pb-2`}
            >
              <p className="text-xs text-gray-500 px-3 py-2 uppercase font-semibold">
                Phụ huynh
              </p>
              <Link
                to="/parent/vaccination/consent/new"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Phiếu đồng ý tiêm chủng
              </Link>

              <p className="text-xs text-gray-500 px-3 py-2 mt-2 uppercase font-semibold">
                Nhân viên y tế
              </p>
              <Link
                to="/staff/vaccination"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Quản lý tiêm chủng
              </Link>
              <Link
                to="/staff/vaccination/flow"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Quy trình tiêm chủng
              </Link>
            </div>
          </div>

          {/* Mobile dropdown for Sự kiện y tế */}
          <div className="relative">
            <button
              onClick={() =>
                setHealthEventDropdownOpen(!healthEventDropdownOpen)
              }
              className="text-gray-600 hover:text-blue-600 w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Sự kiện y tế
              </div>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  healthEventDropdownOpen ? "rotate-180" : ""
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

            {/* Mobile dropdown menu */}
            <div
              className={`${
                healthEventDropdownOpen ? "block" : "hidden"
              } mt-2 pl-10 pr-4 pb-2`}
            >
              <p className="text-xs text-gray-500 px-3 py-2 uppercase font-semibold">
                Nhân viên y tế
              </p>
              <Link
                to="/staff/health-events"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Danh sách sự kiện y tế
              </Link>
              <Link
                to="/staff/health-events/new"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Thêm sự kiện mới
              </Link>
            </div>
          </div>

          {/* Mobile dropdown for Kiểm tra y tế định kỳ */}
          <div className="relative">
            <button
              onClick={() =>
                setHealthCheckDropdownOpen(!healthCheckDropdownOpen)
              }
              className="text-gray-600 hover:text-blue-600 w-full text-left px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Kiểm tra định kỳ
              </div>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  healthCheckDropdownOpen ? "rotate-180" : ""
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

            {/* Mobile dropdown menu */}
            <div
              className={`${
                healthCheckDropdownOpen ? "block" : "hidden"
              } mt-2 pl-10 pr-4 pb-2`}
            >
              <p className="text-xs text-gray-500 px-3 py-2 uppercase font-semibold">
                Phụ huynh
              </p>
              <Link
                to="/parent/health-check"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Xác nhận kiểm tra
              </Link>
              <Link
                to="/parent/health-check/results"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Xem kết quả kiểm tra
              </Link>

              <p className="text-xs text-gray-500 px-3 py-2 mt-2 uppercase font-semibold">
                Nhân viên y tế
              </p>
              <Link
                to="/staff/health-check"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Quản lý kiểm tra
              </Link>
              <Link
                to="/staff/health-check/new"
                className="block text-gray-600 hover:text-blue-600 py-2.5 px-3 text-sm transition"
              >
                Lên lịch kiểm tra mới
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 mt-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 block px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-800 block px-4 py-3 rounded-md hover:bg-blue-50 transition flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
