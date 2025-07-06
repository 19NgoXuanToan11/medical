import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UpcomingVaccination = () => {
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch upcoming vaccinations
    setTimeout(() => {
      const mockUpcomingVaccinations = [
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          studentId: "HS12345",
          class: "2A",
          vaccineName: "Sởi-Rubella",
          date: "20/07/2025",
          location: "Phòng y tế trường",
          status: "Chờ xác nhận",
          description:
            "Vaccine phòng bệnh Sởi và Rubella cho trẻ em trong độ tuổi tiểu học",
        },
        {
          id: 2,
          studentName: "Nguyễn Minh Cường",
          studentId: "HS12347",
          class: "3C",
          vaccineName: "Viêm não Nhật Bản",
          date: "25/07/2025",
          location: "Phòng y tế trường",
          status: "Chờ xác nhận",
          description: "Vaccine phòng bệnh viêm não Nhật Bản cho trẻ em",
        },
      ];

      setUpcomingVaccinations(mockUpcomingVaccinations);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-all duration-300">
        {/* Enhanced Header Section */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-neutral-800 dark:to-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Tiêm chủng sắp tới
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                Theo dõi và xác nhận lịch tiêm chủng cho con bạn
              </p>
            </div>
            <Link
              to="/parent/vaccination/history"
              className="inline-flex items-center px-6 py-3 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl text-primary-600 dark:text-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-600 font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Xem lịch sử tiêm chủng</span>
              <svg
                className="w-4 h-4 ml-2"
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

        <div className="p-8">
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-2xl">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              <span className="font-bold">Lưu ý quan trọng:</span> Danh sách các
              mũi tiêm chủng đã được lên lịch cho con của bạn tại trường. Vui
              lòng xác nhận đồng ý hoặc từ chối cho con tham gia tiêm chủng.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-80">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 dark:border-primary-800"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary-600 dark:border-primary-400 absolute top-0 left-0"></div>
              </div>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400 font-medium">
                Đang tải thông tin tiêm chủng...
              </p>
            </div>
          ) : upcomingVaccinations.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                  Có {upcomingVaccinations.length} mũi tiêm cần xác nhận
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Hãy xem xét và xác nhận đồng ý cho từng mũi tiêm dưới đây
                </p>
              </div>

              {upcomingVaccinations.map((vaccination, index) => (
                <div
                  key={vaccination.id}
                  className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {index + 1}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                            {vaccination.vaccineName}
                          </h2>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded-full inline-flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Cho học sinh: {vaccination.studentName} - Lớp{" "}
                            {vaccination.class}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
                          vaccination.status === "Chờ xác nhận"
                            ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-700/50 shadow-amber-200/50 dark:shadow-amber-900/30"
                            : vaccination.status === "Đã xác nhận"
                            ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                            : vaccination.status === "Đã hoàn thành"
                            ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-blue-200/50 dark:shadow-blue-900/30"
                            : "bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 dark:from-rose-900/40 dark:via-red-900/30 dark:to-pink-900/40 text-rose-800 dark:text-rose-200 border-2 border-rose-200 dark:border-rose-700/50 shadow-rose-200/50 dark:shadow-rose-900/30"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 ${
                            vaccination.status === "Chờ xác nhận"
                              ? "bg-amber-200 dark:bg-amber-800/60"
                              : vaccination.status === "Đã xác nhận"
                              ? "bg-emerald-200 dark:bg-emerald-800/60"
                              : vaccination.status === "Đã hoàn thành"
                              ? "bg-blue-200 dark:bg-blue-800/60"
                              : "bg-rose-200 dark:bg-rose-800/60"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 ${
                              vaccination.status === "Chờ xác nhận"
                                ? "text-amber-700 dark:text-amber-300"
                                : vaccination.status === "Đã xác nhận"
                                ? "text-emerald-700 dark:text-emerald-300"
                                : vaccination.status === "Đã hoàn thành"
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-rose-700 dark:text-rose-300"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {vaccination.status === "Chờ xác nhận" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : vaccination.status === "Đã xác nhận" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : vaccination.status === "Đã hoàn thành" ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </div>
                        <span className="font-bold tracking-wide">
                          {vaccination.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-600 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-blue-600 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Ngày tiêm
                            </p>
                            <p className="text-lg font-bold text-neutral-700 dark:text-neutral-300">
                              {vaccination.date}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-600 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-green-600 dark:text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                              Địa điểm
                            </p>
                            <p className="text-lg font-bold text-neutral-700 dark:text-neutral-300">
                              {vaccination.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {vaccination.description && (
                      <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-purple-500 dark:border-purple-400 rounded-r-2xl">
                        <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Thông tin về vaccine
                        </h4>
                        <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                          {vaccination.description}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                      {vaccination.status === "Chờ xác nhận" && (
                        <>
                          <button className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Từ chối
                          </button>
                          <Link
                            to={`/parent/vaccination/consent/${vaccination.id}`}
                            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Xác nhận đồng ý
                          </Link>
                        </>
                      )}
                      {vaccination.status === "Đã xác nhận" && (
                        <div className="flex items-center justify-center px-8 py-4 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 font-bold rounded-2xl">
                          <div className="w-8 h-8 bg-emerald-200 dark:bg-emerald-800/60 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-emerald-700 dark:text-emerald-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-bold tracking-wide">
                            Bạn đã đồng ý cho con tham gia tiêm chủng
                          </span>
                        </div>
                      )}
                      {vaccination.status === "Đã hoàn thành" && (
                        <div className="flex items-center justify-center px-8 py-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 font-bold rounded-2xl">
                          <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800/60 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-blue-700 dark:text-blue-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-bold tracking-wide">
                            Con bạn đã hoàn thành tiêm chủng
                          </span>
                        </div>
                      )}
                      {vaccination.status === "Đã từ chối" && (
                        <div className="flex items-center justify-center px-8 py-4 bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 dark:from-rose-900/40 dark:via-red-900/30 dark:to-pink-900/40 text-rose-800 dark:text-rose-200 border-2 border-rose-200 dark:border-rose-700/50 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30 font-bold rounded-2xl">
                          <div className="w-8 h-8 bg-rose-200 dark:bg-rose-800/60 rounded-full flex items-center justify-center mr-3">
                            <svg
                              className="w-5 h-5 text-rose-700 dark:text-rose-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                              />
                            </svg>
                          </div>
                          <span className="text-lg font-bold tracking-wide">
                            Bạn đã từ chối cho con tham gia tiêm chủng
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl shadow-lg p-12 text-center border border-neutral-200 dark:border-neutral-600">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <svg
                  className="h-12 w-12 text-primary-600 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-200">
                Không có tiêm chủng sắp tới
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 leading-relaxed">
                Hiện tại không có kế hoạch tiêm chủng nào được lên lịch cho con
                của bạn tại trường.
                <br />
                Chúng tôi sẽ thông báo khi có lịch tiêm mới.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/parent/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Quay lại trang chủ
                </Link>
                <Link
                  to="/parent/vaccination/history"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-neutral-700 border-2 border-primary-300 dark:border-primary-500 text-primary-600 dark:text-primary-400 font-bold rounded-xl hover:bg-primary-50 dark:hover:bg-neutral-600 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Xem lịch sử tiêm chủng
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingVaccination;
