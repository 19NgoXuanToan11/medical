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
    <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
      {/* Simple Greeting */}
      <SimpleGreeting roleTitle="Phụ huynh" />

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-colors duration-300">
        <div className="p-4 sm:p-6">
          {/* Top Stats Cards - More compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
              <div className="border-b border-neutral-100 dark:border-neutral-700 px-4 py-3 flex justify-between items-center">
                <h2 className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
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
                <h2 className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
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
                <h2 className="font-medium text-sm text-neutral-800 dark:text-neutral-200">
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

          {/* Main Content Grid - Optimized layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column - Medication and Health Profile */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medication Management */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
                  <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-3 border-b border-primary-100 dark:border-primary-800">
                    <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                      Quản lý thuốc
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
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
                          <div className="flex-1">
                            <Link
                              to="/parent/medication/request"
                              className="text-primary-700 dark:text-primary-400 font-medium text-base group-hover:text-primary-900 dark:group-hover:text-primary-300"
                            >
                              Gửi yêu cầu thuốc mới
                            </Link>
                            <p className="text-sm text-primary-600 dark:text-primary-500 mt-1">
                              Tạo yêu cầu mới để gửi thuốc đến trường
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
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
                          <div className="flex-1">
                            <Link
                              to="/parent/medication/history"
                              className="text-primary-700 dark:text-primary-400 font-medium text-base group-hover:text-primary-900 dark:group-hover:text-primary-300"
                            >
                              Lịch sử yêu cầu
                            </Link>
                            <p className="text-sm text-primary-600 dark:text-primary-500 mt-1">
                              Xem tất cả các yêu cầu thuốc trước đây
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Profile */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-sm transition-all duration-200">
                  <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-3 border-b border-primary-100 dark:border-primary-800">
                    <h2 className="text-base font-medium text-neutral-800 dark:text-neutral-200">
                      Hồ sơ sức khỏe
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors group">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-700">
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
                        <div className="flex-1">
                          <Link
                            to="/parent/health-profile"
                            className="text-primary-700 dark:text-primary-400 font-medium text-base group-hover:text-primary-900 dark:group-hover:text-primary-300"
                          >
                            Xem hồ sơ sức khỏe
                          </Link>
                          <p className="text-sm text-primary-600 dark:text-primary-500 mt-1">
                            Thông tin sức khỏe chi tiết của học sinh
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Health Stats */}
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            5
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-300">
                            Khám sức khỏe
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            8
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Tiêm chủng
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-1 gap-2">
                        <Link
                          to="/parent/health-check"
                          className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Kết quả khám gần nhất
                            </span>
                          </div>
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>

                        <Link
                          to="/parent/vaccination"
                          className="flex items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-blue-600 dark:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Lịch tiêm chủng sắp tới
                            </span>
                          </div>
                          <svg
                            className="w-4 h-4 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Vaccination Widget */}
            <div className="lg:col-span-4">
              <VaccinationWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
