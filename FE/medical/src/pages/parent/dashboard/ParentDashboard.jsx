import React from "react";
import { Link, useNavigate } from "react-router-dom";
import VaccinationWidget from "../vaccination/VaccinationWidget";
import SimpleGreeting from "../../../components/common/SimpleGreeting";

const ParentDashboard = () => {
  const navigate = useNavigate();
  // Sample data - in a real application, this would come from an API
  const activeMedications = 2;
  const pendingMedications = 1;
  const studentName = "Nguyễn Văn An";
  const notificationCount = 3;

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Simple Greeting */}
      <SimpleGreeting roleTitle="Phụ huynh" />

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
              <div className="border-b border-neutral-100 dark:border-neutral-700 px-4 py-3 flex justify-between items-center">
                <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                  Thuốc đang sử dụng
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-1 ring-primary-600/20 dark:ring-primary-400/20">
                  {activeMedications} yêu cầu
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Các yêu cầu thuốc đang được thực hiện tại trường
                </p>
                <Link
                  to="/parent/medication/history"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  Xem chi tiết
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
              <div className="border-b border-neutral-100 dark:border-neutral-700 px-4 py-3 flex justify-between items-center">
                <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                  Yêu cầu chờ xác nhận
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-1 ring-yellow-600/20 dark:ring-yellow-400/20">
                  {pendingMedications} yêu cầu
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Các yêu cầu thuốc đang chờ xác nhận từ nhân viên y tế
                </p>
                <Link
                  to="/parent/medication/history?status=pending"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  Xem chi tiết
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
              <div className="border-b border-neutral-100 dark:border-neutral-700 px-4 py-3 flex justify-between items-center">
                <h2 className="font-medium text-neutral-800 dark:text-neutral-200">
                  Thông báo mới
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-400/20">
                  {notificationCount} thông báo
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  Thông báo từ trường học về sức khỏe và thuốc của con bạn
                </p>
                <Link
                  to="/parent/notifications"
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center"
                >
                  Xem tất cả
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 border-b border-primary-100 dark:border-primary-800">
                    <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                      Quản lý thuốc
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
                          <svg
                            className="w-7 h-7 text-primary-600 dark:text-primary-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <Link
                          to="/parent/medication/request"
                          className="text-primary-700 dark:text-primary-400 font-medium text-center group-hover:text-primary-900 dark:group-hover:text-primary-300"
                        >
                          Gửi yêu cầu thuốc mới
                        </Link>
                        <p className="text-sm text-primary-600 dark:text-primary-500 text-center mt-1">
                          Tạo một yêu cầu mới để gửi thuốc đến trường
                        </p>
                      </div>

                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
                          <svg
                            className="w-7 h-7 text-primary-600 dark:text-primary-400"
                            xmlns="http://www.w3.org/2000/svg"
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
                        </div>
                        <Link
                          to="/parent/medication/history"
                          className="text-primary-700 dark:text-primary-400 font-medium text-center group-hover:text-primary-900 dark:group-hover:text-primary-300"
                        >
                          Lịch sử yêu cầu
                        </Link>
                        <p className="text-sm text-primary-600 dark:text-primary-500 text-center mt-1">
                          Xem tất cả các yêu cầu thuốc trước đây
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 border-b border-primary-100 dark:border-primary-800">
                    <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-200">
                      Hồ sơ sức khỏe
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
                          <svg
                            className="w-7 h-7 text-primary-600 dark:text-primary-400"
                            xmlns="http://www.w3.org/2000/svg"
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
                        </div>
                        <Link
                          to="/parent/health-profile"
                          className="text-primary-700 dark:text-primary-400 font-medium text-center group-hover:text-primary-900 dark:group-hover:text-primary-300"
                        >
                          Xem hồ sơ sức khỏe
                        </Link>
                        <p className="text-sm text-primary-600 dark:text-primary-500 text-center mt-1">
                          Thông tin sức khỏe chi tiết của học sinh
                        </p>
                      </div>

                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg flex flex-col items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
                          <svg
                            className="w-7 h-7 text-primary-600 dark:text-primary-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                          </svg>
                        </div>
                        <Link
                          to="/parent/health-profile/new"
                          className="text-primary-700 dark:text-primary-400 font-medium text-center group-hover:text-primary-900 dark:group-hover:text-primary-300"
                        >
                          Cập nhật thông tin
                        </Link>
                        <p className="text-sm text-primary-600 dark:text-primary-500 text-center mt-1">
                          Cập nhật thông tin sức khỏe của học sinh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <VaccinationWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
