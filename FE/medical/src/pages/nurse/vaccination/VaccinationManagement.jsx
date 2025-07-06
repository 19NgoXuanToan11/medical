import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";

const VaccinationManagement = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [vaccinationList, setVaccinationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVaccinationList([
        {
          id: 1,
          title: "Tiêm vắc-xin cúm mùa",
          scheduledDate: "2023-07-15",
          status: "upcoming",
          grades: ["1A", "1B", "1C"],
          totalStudents: 75,
          confirmedParents: 68,
          vaccineInfo: "Vắc-xin cúm mùa 2023",
          description: "Tiêm phòng cúm mùa cho học sinh khối lớp 1",
        },
        {
          id: 2,
          title: "Tiêm nhắc vắc-xin MMR",
          scheduledDate: "2023-06-30",
          status: "upcoming",
          grades: ["5A", "5B"],
          totalStudents: 52,
          confirmedParents: 45,
          vaccineInfo: "Vắc-xin MMR (Sởi - Quai bị - Rubella)",
          description: "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 5",
        },
        {
          id: 3,
          title: "Tiêm vắc-xin Viêm gan B",
          scheduledDate: "2023-05-20",
          status: "completed",
          grades: ["3A", "3B", "3C"],
          totalStudents: 80,
          vaccinatedStudents: 76,
          vaccineInfo: "Vắc-xin Viêm gan B",
          description: "Tiêm nhắc vắc-xin Viêm gan B cho học sinh khối lớp 3",
        },
        {
          id: 4,
          title: "Tiêm phòng HPV",
          scheduledDate: "2023-08-10",
          status: "planning",
          grades: ["7A", "7B"],
          totalStudents: 60,
          confirmedParents: 10,
          vaccineInfo: "Vắc-xin HPV",
          description:
            "Tiêm vắc-xin phòng ung thư cổ tử cung cho học sinh nữ lớp 7",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        label: "Sắp diễn ra",
      },
      completed: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        label: "Đã hoàn thành",
      },
      planning: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-800 dark:text-purple-300",
        label: "Lên kế hoạch",
      },
    };

    const config = statusConfig[status] || statusConfig.upcoming;

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredVaccinations = vaccinationList.filter(
    (vaccination) =>
      (activeTab === "all" || vaccination.status === activeTab) &&
      (vaccination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vaccination.vaccineInfo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vaccination.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        vaccination.grades.some((grade) =>
          grade.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // Calculate statistics
  const getStats = () => {
    const today = new Date();
    const upcomingCount = vaccinationList.filter(
      (v) => v.status === "upcoming" || v.status === "planning"
    ).length;

    const completedCount = vaccinationList.filter(
      (v) => v.status === "completed"
    ).length;

    const thisMonthCount = vaccinationList.filter((v) => {
      const vacDate = new Date(v.scheduledDate);
      return (
        vacDate.getMonth() === today.getMonth() &&
        vacDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const totalStudentsCount = vaccinationList.reduce(
      (sum, v) => sum + v.totalStudents,
      0
    );

    return {
      upcoming: upcomingCount,
      completed: completedCount,
      thisMonth: thisMonthCount,
      totalStudents: totalStudentsCount,
    };
  };

  const stats = getStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Quản lý tiêm chủng
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Quản lý kế hoạch và lịch tiêm chủng của học sinh
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Kế hoạch sắp tới
              </p>
              <p className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.upcoming}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Đã hoàn thành
              </p>
              <p className="text-xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Tháng này
              </p>
              <p className="text-xl font-bold mt-1 text-purple-600 dark:text-purple-400">
                {stats.thisMonth}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                Tổng học sinh
              </p>
              <p className="text-xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg mb-6 border border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["upcoming", "completed", "planning", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                }`}
              >
                {tab === "upcoming"
                  ? "Sắp diễn ra"
                  : tab === "completed"
                  ? "Đã hoàn thành"
                  : tab === "planning"
                  ? "Lên kế hoạch"
                  : "Tất cả"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>
            <button className="flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
              <FiFilter className="mr-2 h-4 w-4" />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Vaccination List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-100 dark:bg-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tiêm chủng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Ngày tiêm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tham gia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-50 dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredVaccinations.map((vaccination) => (
                  <tr
                    key={vaccination.id}
                    className="hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {vaccination.title}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {vaccination.vaccineInfo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {vaccination.grades.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-neutral-900 dark:text-neutral-100">
                        {new Date(vaccination.scheduledDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(vaccination.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {vaccination.status === "completed" ? (
                        <div className="text-sm text-neutral-900 dark:text-neutral-100">
                          {vaccination.vaccinatedStudents}/
                          {vaccination.totalStudents}
                        </div>
                      ) : (
                        <div className="text-sm text-neutral-900 dark:text-neutral-100">
                          {vaccination.confirmedParents}/
                          {vaccination.totalStudents}
                        </div>
                      )}
                      {vaccination.status !== "completed" && (
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${Math.round(
                                (vaccination.confirmedParents /
                                  vaccination.totalStudents) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/nurse/vaccination/${vaccination.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          Chi tiết
                        </Link>
                        {vaccination.status === "planning" && (
                          <button className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300">
                            Gửi thông báo
                          </button>
                        )}
                        {vaccination.status === "upcoming" && (
                          <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                            Đánh dấu hoàn thành
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Floating Action Button - Tạo kế hoạch mới */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <div className="relative group">
          <Link
            to="/nurse/vaccination/create"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
            title="Tạo kế hoạch tiêm chủng mới"
          >
            <FiPlus className="h-6 w-6 md:h-7 md:w-7 group-hover:rotate-90 transition-transform duration-300" />
          </Link>

          {/* Tooltip */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-2 bg-neutral-800 dark:bg-neutral-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Tạo kế hoạch mới
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-neutral-800 dark:border-l-neutral-700 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationManagement;
