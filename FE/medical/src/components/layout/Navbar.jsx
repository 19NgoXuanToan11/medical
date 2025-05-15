import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <svg
                className="h-12 w-12 mr-3"
                viewBox="0 0 512 512"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Medical Cross Background Circle */}
                <circle cx="256" cy="256" r="240" fill="#EBF5FF" />

                {/* Medical Cross */}
                <rect
                  x="156"
                  y="226"
                  width="200"
                  height="60"
                  rx="8"
                  fill="#FF4757"
                />
                <rect
                  x="226"
                  y="156"
                  width="60"
                  height="200"
                  rx="8"
                  fill="#FF4757"
                />

                {/* Medical Snake Symbol (Caduceus) Stylized */}
                <path
                  d="M256 380C256 380 320 340 320 300C320 260 256 280 256 240C256 200 320 220 320 180C320 140 256 100 256 100"
                  stroke="#2E86DE"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M256 380C256 380 192 340 192 300C192 260 256 280 256 240C256 200 192 220 192 180C192 140 256 100 256 100"
                  stroke="#10AC84"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-blue-600 font-bold text-2xl tracking-tight">
                Med<span className="text-blue-800">School</span>
              </span>
            </a>
          </div>

          {/* Navigation Links - Middle */}
          <div className="hidden lg:flex items-center justify-center flex-grow mx-10">
            <div className="flex items-center space-x-8">
              <a
                href="/"
                className="text-blue-600 font-medium px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors duration-200 flex flex-row items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5 inline"
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
                <span>Trang chủ</span>
              </a>
              <a
                href="/tinh-nang"
                className="text-gray-600 hover:text-blue-600 px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors duration-200 flex flex-row items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5 inline"
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
                <span>Tính năng</span>
              </a>
              <a
                href="/ho-so-suc-khoe"
                className="text-gray-600 hover:text-blue-600 px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors duration-200 flex flex-row items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5 inline"
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
                <span>Hồ sơ sức khỏe</span>
              </a>
              <a
                href="/tiem-chung"
                className="text-gray-600 hover:text-blue-600 px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors duration-200 flex flex-row items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5 inline"
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
                <span>Tiêm chủng</span>
              </a>
            </div>
          </div>

          {/* Authentication - Right */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 px-5 py-2 rounded-full border border-blue-200 hover:border-blue-400 transition-all duration-200 font-medium flex flex-row items-center bg-blue-50 hover:bg-blue-100"
            >
              <svg
                className="w-5 h-5 mr-2 inline"
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
              <span>Đăng nhập</span>
            </a>
            <a
              href="/register"
              className="bg-gradient-to-r from-blue-300 to-blue-700 text-white px-5 py-2 rounded-full hover:shadow-md transition-all duration-200 font-medium flex flex-row items-center"
            >
              <svg
                className="w-5 h-5 mr-2 inline"
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
              <span>Đăng ký</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition"
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
          <a
            href="/"
            className="text-blue-600 font-medium block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
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
            <span>Trang chủ</span>
          </a>
          <a
            href="/gioi-thieu"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Giới thiệu</span>
          </a>
          <a
            href="/tinh-nang"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
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
            <span>Tính năng</span>
          </a>
          <a
            href="/ho-so-suc-khoe"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
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
            <span>Hồ sơ sức khỏe</span>
          </a>
          <a
            href="/tiem-chung"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
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
            <span>Tiêm chủng</span>
          </a>
          <a
            href="/tin-tuc"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            <span>Tin tức</span>
          </a>
          <a
            href="/lien-he"
            className="text-gray-600 hover:text-blue-600 block px-4 py-3.5 rounded-md hover:bg-blue-50 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2.5 inline"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Liên hệ</span>
          </a>
        </div>
        <div className="pt-5 pb-6 border-t border-gray-200 space-y-5 px-5">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 px-6 py-3 rounded-full border border-blue-200 hover:border-blue-400 transition-all duration-200 font-medium flex items-center bg-blue-50 hover:bg-blue-100 w-full justify-center"
          >
            <svg
              className="w-5 h-5 mr-2.5 inline"
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
            <span>Đăng nhập</span>
          </a>
          <a
            href="/register"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-7 py-3 rounded-full hover:shadow-md transition-all duration-200 font-medium flex items-center w-full justify-center"
          >
            <svg
              className="w-5 h-5 mr-2.5 inline"
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
            <span>Đăng ký</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
