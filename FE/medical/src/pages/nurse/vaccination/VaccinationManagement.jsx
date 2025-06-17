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
          description: "Tiêm phòng HPV cho học sinh nữ lớp 7 (tự nguyện)",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "planning":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Lên kế hoạch
          </span>
        );
      case "upcoming":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Sắp diễn ra
          </span>
        );
      case "completed":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Đã hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Quản lý tiêm chủng</h1>
        <p className="text-gray-600 mt-1">
          Quản lý kế hoạch và lịch tiêm chủng của học sinh
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Kế hoạch sắp tới</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">
                {stats.upcoming}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiCalendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Đã hoàn thành</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Tháng này</p>
              <p className="text-2xl font-bold mt-1 text-purple-600">
                {stats.thisMonth}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiCalendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Tổng học sinh</p>
              <p className="text-2xl font-bold mt-1 text-gray-800">
                {stats.totalStudents}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FiUsers className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex space-x-2 mb-4 sm:mb-0 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Sắp diễn ra
          </button>
          <button
            onClick={() => setActiveTab("planning")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "planning"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Lên kế hoạch
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Đã hoàn thành
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              activeTab === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Tất cả
          </button>
        </div>
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêm chủng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tiêm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tham gia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVaccinations.map((vaccination) => (
                  <tr key={vaccination.id}>
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-medium text-gray-900">
                        {vaccination.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {vaccination.vaccineInfo}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {vaccination.grades.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
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
                        <div className="text-sm text-gray-900">
                          {vaccination.vaccinatedStudents}/
                          {vaccination.totalStudents}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">
                          {vaccination.confirmedParents}/
                          {vaccination.totalStudents}
                        </div>
                      )}
                      {vaccination.status !== "completed" && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
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
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <Link
                          to={`/nurse/vaccination/${vaccination.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </Link>
                        {vaccination.status === "planning" && (
                          <button className="text-purple-600 hover:text-purple-900">
                            Gửi thông báo
                          </button>
                        )}
                        {vaccination.status === "upcoming" && (
                          <button className="text-green-600 hover:text-green-900">
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
            className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
            title="Tạo kế hoạch tiêm chủng mới"
          >
            <FiPlus className="h-6 w-6 md:h-7 md:w-7 group-hover:rotate-90 transition-transform duration-300" />
          </Link>

          {/* Tooltip */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Tạo kế hoạch mới
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationManagement;
