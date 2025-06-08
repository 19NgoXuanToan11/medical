import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
} from "react-icons/fi";

const NurseHealthCheck = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [healthCheckList, setHealthCheckList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHealthCheckList([
        {
          id: 1,
          scheduledDate: "2023-06-15",
          grade: "Lớp 1A",
          status: "pending",
          totalStudents: 28,
          confirmedParents: 24,
        },
        {
          id: 2,
          scheduledDate: "2023-06-22",
          grade: "Lớp 2B",
          status: "upcoming",
          totalStudents: 30,
          confirmedParents: 27,
        },
        {
          id: 3,
          scheduledDate: "2023-05-30",
          grade: "Lớp 3C",
          status: "completed",
          totalStudents: 29,
          confirmedParents: 29,
          abnormalResults: 3,
        },
        {
          id: 4,
          scheduledDate: "2023-07-05",
          grade: "Lớp 4A",
          status: "upcoming",
          totalStudents: 32,
          confirmedParents: 25,
        },
        {
          id: 5,
          scheduledDate: "2023-05-15",
          grade: "Lớp 5B",
          status: "completed",
          totalStudents: 30,
          confirmedParents: 30,
          abnormalResults: 2,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Calculate statistics
  const getStats = () => {
    const upcomingCount = healthCheckList.filter(
      (check) => check.status === "upcoming"
    ).length;

    const pendingCount = healthCheckList.filter(
      (check) => check.status === "pending"
    ).length;

    const completedCount = healthCheckList.filter(
      (check) => check.status === "completed"
    ).length;

    const abnormalCount = healthCheckList
      .filter((check) => check.status === "completed")
      .reduce((sum, check) => sum + (check.abnormalResults || 0), 0);

    return {
      upcoming: upcomingCount,
      pending: pendingCount,
      completed: completedCount,
      abnormal: abnormalCount,
    };
  };

  const stats = getStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kiểm tra y tế định kỳ
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý quá trình kiểm tra sức khỏe định kỳ cho học sinh
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Sắp tới</p>
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
              <p className="text-gray-500 text-sm">Chờ xác nhận</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="h-5 w-5 text-yellow-600" />
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
              <p className="text-gray-500 text-sm">Kết quả bất thường</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {stats.abnormal}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiAlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Chờ xác nhận
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            } transition-colors duration-200`}
          >
            Đã hoàn thành
          </button>
        </div>
        <Link
          to="/nurse/health-check/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <FiPlus className="h-5 w-5 mr-1" />
          Lên lịch kiểm tra mới
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lớp
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Xác nhận
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {healthCheckList
                .filter((check) => check.status === activeTab)
                .map((check) => (
                  <tr key={check.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {new Date(check.scheduledDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {check.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          check.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : check.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {check.status === "completed"
                          ? "Đã hoàn thành"
                          : check.status === "upcoming"
                          ? "Sắp tới"
                          : "Chờ xác nhận"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div>
                        {check.confirmedParents}/{check.totalStudents}
                      </div>
                      {check.status !== "completed" && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.round(
                                (check.confirmedParents / check.totalStudents) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <div className="flex justify-center space-x-4">
                        <Link
                          to={`/nurse/health-check/${check.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Xem
                        </Link>
                        {check.status === "completed" && (
                          <Link
                            to={`/nurse/health-check/${check.id}/results`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Kết quả
                          </Link>
                        )}
                        {check.status === "pending" && (
                          <button className="text-yellow-600 hover:text-yellow-900">
                            Gửi nhắc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NurseHealthCheck;
