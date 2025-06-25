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
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Quản lý kiểm tra y tế định kỳ
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Quản lý quá trình kiểm tra sức khỏe định kỳ cho học sinh
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Sắp tới
              </p>
              <p className="text-2xl font-bold mt-1 text-primary-600 dark:text-primary-400">
                {stats.upcoming}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <FiCalendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Đã hoàn thành
              </p>
              <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Kết quả bất thường
              </p>
              <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                {stats.abnormal}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <FiAlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
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
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Sắp tới
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "completed"
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
            } transition-colors duration-200`}
          >
            Đã hoàn thành
          </button>
        </div>
        <Link
          to="/nurse/health-check/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
        >
          <FiPlus className="h-5 w-5 mr-1" />
          Lên lịch kiểm tra mới
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 table-fixed">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Ngày
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Lớp
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Xác nhận
                </th>
                <th
                  scope="col"
                  className="w-1/5 px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
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
                      <div className="flex items-center justify-center gap-2">
                        {check.grade}
                        {check.abnormalResults > 0 && (
                          <span title="Có học sinh bất thường" className="flex items-center text-red-600 ml-1">
                            <FiAlertTriangle className="w-4 h-4" />
                            <span className="ml-1 text-xs font-semibold">{check.abnormalResults} bất thường</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          check.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {check.status === "completed"
                          ? "Đã hoàn thành"
                          : "Sắp tới"}
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
