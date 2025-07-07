import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VaccinationHistory = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // In a real application, this would be fetched from an API
    const mockChildren = [
      {
        id: 1,
        name: "Nguyễn Văn An",
        studentId: "HS12345",
        class: "2A",
        dateOfBirth: "15/05/2017",
        upcomingVaccinations: [
          {
            id: 1,
            name: "Sởi-Rubella",
            date: "20/07/2025",
            location: "Phòng y tế trường",
            status: "Chờ xác nhận",
            description:
              "Vaccine phòng bệnh Sởi và Rubella cho trẻ em trong độ tuổi tiểu học",
          },
        ],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "15/06/2017",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "DPT (Bạch hầu, Ho gà, Uốn ván)",
            date: "20/08/2017",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Viêm gan B",
            date: "10/10/2017",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 4,
            name: "Thủy đậu",
            date: "15/05/2022",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
      {
        id: 2,
        name: "Nguyễn Thị Bình",
        studentId: "HS12346",
        class: "5B",
        dateOfBirth: "10/03/2015",
        upcomingVaccinations: [],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "20/04/2015",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "Viêm gan B",
            date: "15/06/2015",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Sởi-Rubella",
            date: "10/08/2021",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
      {
        id: 3,
        name: "Nguyễn Minh Cường",
        studentId: "HS12347",
        class: "3C",
        dateOfBirth: "12/09/2016",
        upcomingVaccinations: [
          {
            id: 1,
            name: "Viêm não Nhật Bản",
            date: "25/07/2025",
            location: "Phòng y tế trường",
            status: "Chờ xác nhận",
            description: "Vaccine phòng bệnh viêm não Nhật Bản cho trẻ em",
          },
        ],
        vaccinationHistory: [
          {
            id: 1,
            name: "BCG (Lao)",
            date: "20/10/2016",
            location: "Bệnh viện Nhi Trung ương",
            status: "Đã tiêm",
          },
          {
            id: 2,
            name: "DPT (Bạch hầu, Ho gà, Uốn ván)",
            date: "15/12/2016",
            location: "Trung tâm y tế quận",
            status: "Đã tiêm",
          },
          {
            id: 3,
            name: "Sởi",
            date: "10/05/2020",
            location: "Phòng y tế trường",
            status: "Đã tiêm",
          },
        ],
      },
    ];

    setChildren(mockChildren);
    setSelectedChild(mockChildren[0]);
  }, []);

  const handleChildSelect = (childId) => {
    const child = children.find((c) => c.id === childId);
    setSelectedChild(child);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl mt-20">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden transition-all duration-300">
        {/* Header Section */}
        <div className="px-8 py-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-neutral-800 dark:to-neutral-800 border-b border-neutral-100 dark:border-neutral-700">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Tiêm chủng
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Quản lý và theo dõi lịch sử tiêm chủng của con bạn
          </p>
        </div>

        {/* Child selector */}
        {children.length > 0 && (
          <div className="px-8 py-6 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-700">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
              Chọn con của bạn:
            </label>
            <div className="flex flex-wrap gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleChildSelect(child.id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedChild?.id === child.id
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
                      : "bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-500"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        selectedChild?.id === child.id
                          ? "bg-white/20 text-white"
                          : "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      }`}
                    >
                      {child.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold">{child.name}</div>
                      <div className="text-xs opacity-80">
                        Lớp {child.class}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedChild && (
          <>
            {/* Student info card */}
            <div className="p-8">
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-600 p-6 mb-8 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                    {selectedChild.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      Thông tin học sinh
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                      Chi tiết hồ sơ y tế
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Họ và tên học sinh
                    </p>
                    <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedChild.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Mã học sinh
                    </p>
                    <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedChild.studentId}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Lớp
                    </p>
                    <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedChild.class}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                      Ngày sinh
                    </p>
                    <p className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedChild.dateOfBirth}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <div className="mb-8">
                <div className="bg-neutral-100 dark:bg-neutral-700 p-1 rounded-xl inline-flex">
                  <button
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      activeTab === "upcoming"
                        ? "bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-md"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Tiêm chủng sắp tới</span>
                      {selectedChild.upcomingVaccinations.length > 0 && (
                        <span className="bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {selectedChild.upcomingVaccinations.length}
                        </span>
                      )}
                    </div>
                  </button>
                  <button
                    className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      activeTab === "history"
                        ? "bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-md"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4"
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
                      <span>Lịch sử tiêm chủng</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Upcoming vaccinations tab */}
              {activeTab === "upcoming" && (
                <div className="space-y-6">
                  {selectedChild.upcomingVaccinations.length > 0 ? (
                    <>
                      <div className="text-center py-2">
                        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                          Tiêm chủng sắp tới
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Các mũi tiêm đang chờ duyệt cho con bạn tại trường
                        </p>
                      </div>
                      <div className="space-y-6">
                        {selectedChild.upcomingVaccinations.map(
                          (vaccination) => (
                            <div
                              key={vaccination.id}
                              className="bg-gradient-to-r from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl shadow-lg border-l-4 border-primary-500 dark:border-primary-400 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                                    {vaccination.name}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                          Ngày tiêm
                                        </p>
                                        <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                          {vaccination.date}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-green-600 dark:text-green-400"
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
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                          Địa điểm
                                        </p>
                                        <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                          {vaccination.location}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                        <svg
                                          className="w-4 h-4 text-orange-600 dark:text-orange-400"
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
                                      </div>
                                      <div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                          Trạng thái
                                        </p>
                                        <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                          {vaccination.status}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  {vaccination.description && (
                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 rounded-r-lg">
                                      <p className="text-sm text-blue-800 dark:text-blue-300">
                                        <span className="font-semibold">
                                          Thông tin:
                                        </span>{" "}
                                        {vaccination.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                  <div
                                    className={`inline-flex items-center px-5 py-3 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
                                      vaccination.status === "Chờ xác nhận"
                                        ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-700/50 shadow-amber-200/50 dark:shadow-amber-900/30"
                                        : vaccination.status === "Đã xác nhận"
                                        ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                                        : vaccination.status === "Đã hoàn thành"
                                        ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-blue-200/50 dark:shadow-blue-900/30"
                                        : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                                    }`}
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                        vaccination.status === "Chờ xác nhận"
                                          ? "bg-amber-200 dark:bg-amber-800/60"
                                          : vaccination.status === "Đã xác nhận"
                                          ? "bg-emerald-200 dark:bg-emerald-800/60"
                                          : vaccination.status ===
                                            "Đã hoàn thành"
                                          ? "bg-blue-200 dark:bg-blue-800/60"
                                          : "bg-emerald-200 dark:bg-emerald-800/60"
                                      }`}
                                    >
                                      <svg
                                        className={`w-3 h-3 ${
                                          vaccination.status === "Chờ xác nhận"
                                            ? "text-amber-700 dark:text-amber-300"
                                            : vaccination.status ===
                                              "Đã xác nhận"
                                            ? "text-emerald-700 dark:text-emerald-300"
                                            : vaccination.status ===
                                              "Đã hoàn thành"
                                            ? "text-blue-700 dark:text-blue-300"
                                            : "text-emerald-700 dark:text-emerald-300"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        {vaccination.status ===
                                        "Chờ xác nhận" ? (
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2.5}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        ) : vaccination.status ===
                                          "Đã hoàn thành" ? (
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
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        )}
                                      </svg>
                                    </div>
                                    <span className="font-bold tracking-wide">
                                      {vaccination.status}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end mt-6">
                                <Link
                                  to={`/parent/vaccination/consent/${vaccination.id}`}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                >
                                  <svg
                                    className="w-4 h-4 mr-2"
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
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl shadow-sm p-12 text-center border border-neutral-200 dark:border-neutral-600">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="h-10 w-10 text-primary-600 dark:text-primary-400"
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
                      </div>
                      <h2 className="text-xl font-bold mb-3 text-neutral-800 dark:text-neutral-200">
                        Không có tiêm chủng sắp tới
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Hiện tại không có kế hoạch tiêm chủng nào được lên lịch
                        cho con bạn tại trường.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Vaccination history tab */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <div className="text-center py-2">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                      Lịch sử tiêm chủng
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Các mũi tiêm chủng con bạn đã thực hiện
                    </p>
                  </div>

                  {selectedChild.vaccinationHistory.length > 0 ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-600">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                    />
                                  </svg>
                                  <span>LOẠI VACCINE</span>
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="w-4 h-4"
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
                                  <span>NGÀY TIÊM</span>
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="w-4 h-4"
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
                                  <span>ĐỊA ĐIỂM</span>
                                </div>
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span>TRẠNG THÁI</span>
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {selectedChild.vaccinationHistory.map(
                              (vaccine, index) => (
                                <tr
                                  key={vaccine.id}
                                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all duration-200 ${
                                    index % 2 === 0
                                      ? "bg-neutral-25 dark:bg-neutral-800"
                                      : "bg-white dark:bg-neutral-750"
                                  }`}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center">
                                        <svg
                                          className="w-5 h-5 text-green-600 dark:text-green-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                          {vaccine.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                      {vaccine.date}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-neutral-700 dark:text-neutral-300">
                                      {vaccine.location}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                      className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-2xl shadow-md transition-all duration-300 hover:scale-105 ${
                                        vaccine.status === "Đã tiêm" ||
                                        vaccine.status === "Đã hoàn thành"
                                          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/40 dark:via-green-900/30 dark:to-teal-900/40 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-200/50 dark:shadow-emerald-900/30"
                                          : vaccine.status === "Chờ xác nhận"
                                          ? "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/40 dark:via-yellow-900/30 dark:to-orange-900/40 text-amber-800 dark:text-amber-200 border-2 border-amber-200 dark:border-amber-700/50 shadow-amber-200/50 dark:shadow-amber-900/30"
                                          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/40 dark:via-indigo-900/30 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 border-2 border-blue-200 dark:border-blue-700/50 shadow-blue-200/50 dark:shadow-blue-900/30"
                                      }`}
                                    >
                                      <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                          vaccine.status === "Đã tiêm" ||
                                          vaccine.status === "Đã hoàn thành"
                                            ? "bg-emerald-200 dark:bg-emerald-800/60"
                                            : vaccine.status === "Chờ xác nhận"
                                            ? "bg-amber-200 dark:bg-amber-800/60"
                                            : "bg-blue-200 dark:bg-blue-800/60"
                                        }`}
                                      >
                                        <svg
                                          className={`w-3 h-3 ${
                                            vaccine.status === "Đã tiêm" ||
                                            vaccine.status === "Đã hoàn thành"
                                              ? "text-emerald-700 dark:text-emerald-300"
                                              : vaccine.status ===
                                                "Chờ xác nhận"
                                              ? "text-amber-700 dark:text-amber-300"
                                              : "text-blue-700 dark:text-blue-300"
                                          }`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          {vaccine.status === "Chờ xác nhận" ? (
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2.5}
                                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          ) : vaccine.status ===
                                            "Đã hoàn thành" ? (
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
                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          )}
                                        </svg>
                                      </div>
                                      <span className="font-bold tracking-wide">
                                        {vaccine.status}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl shadow-sm p-12 text-center border border-neutral-200 dark:border-neutral-600">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="h-10 w-10 text-primary-600 dark:text-primary-400"
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
                      </div>
                      <h2 className="text-xl font-bold mb-3 text-neutral-800 dark:text-neutral-200">
                        📝 Chưa có lịch sử tiêm chủng
                      </h2>
                      <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Con bạn chưa có lịch sử tiêm chủng nào được ghi nhận.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VaccinationHistory;
