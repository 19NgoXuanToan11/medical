import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HealthCheckManagement = () => {
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
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý kiểm tra y tế định kỳ
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý quá trình kiểm tra sức khỏe định kỳ cho học sinh
        </p>
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
          to="/staff/health-check/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Lên lịch kiểm tra mới
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lớp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Xác nhận
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(check.scheduledDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {check.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {check.confirmedParents}/{check.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/staff/health-check/${check.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Xem
                        </Link>
                        {check.status === "upcoming" && (
                          <Link
                            to={`/staff/health-check/${check.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Chỉnh sửa
                          </Link>
                        )}
                        {check.status === "completed" && (
                          <Link
                            to={`/staff/health-check/${check.id}/results`}
                            className="text-green-600 hover:text-green-900"
                          >
                            Kết quả
                          </Link>
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

export default HealthCheckManagement;
