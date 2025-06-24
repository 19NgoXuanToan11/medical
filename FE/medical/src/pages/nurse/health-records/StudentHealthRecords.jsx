import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiCalendar,
  FiActivity,
  FiEye,
} from "react-icons/fi";

const StudentHealthRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  // Mock data - thay thế bằng API call thực tế
  const healthRecords = [
    {
      id: 1,
      studentId: "HS001",
      studentName: "Nguyễn Văn An",
      className: "10A1",
      lastCheckup: "2024-06-15",
      healthStatus: "Tốt",
      allergies: "Không",
      medications: "Không",
      notes: "Học sinh khỏe mạnh, không có vấn đề gì đặc biệt",
    },
    {
      id: 2,
      studentId: "HS002",
      studentName: "Trần Thị Bình",
      className: "10A2",
      lastCheckup: "2024-06-14",
      healthStatus: "Bình thường",
      allergies: "Phấn hoa",
      medications: "Thuốc chống dị ứng",
      notes: "Cần theo dõi tình trạng dị ứng",
    },
    {
      id: 3,
      studentId: "HS003",
      studentName: "Lê Minh Cường",
      className: "10B1",
      lastCheckup: "2024-06-13",
      healthStatus: "Cần theo dõi",
      allergies: "Không",
      medications: "Vitamin D",
      notes: "Cần tăng cường vận động",
    },
  ];

  const classes = [
    "all",
    "10A1",
    "10A2",
    "10B1",
    "10B2",
    "11A1",
    "11A2",
    "12A1",
    "12A2",
  ];

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || record.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Tốt":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300";
      case "Bình thường":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300";
      case "Cần theo dõi":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300";
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-3">
          Hồ sơ sức khỏe học sinh
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Quản lý và theo dõi tình trạng sức khỏe của học sinh
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Class Filter */}
          <div className="sm:w-56">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 text-base border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Tất cả lớp</option>
              {classes.slice(1).map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 mb-2">
                Học sinh khỏe mạnh
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                1
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 mb-2">
                Cần theo dõi
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                1
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base text-neutral-600 dark:text-neutral-400 mb-2">
                Tổng học sinh
              </div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                3
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
              <FiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Khám gần nhất
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Tình trạng
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Dị ứng
                </th>
                <th className="px-8 py-4 text-center text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Thuốc
                </th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center">
                          <FiUser className="text-white w-6 h-6" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                          {record.studentName}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {record.studentId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-neutral-900 dark:text-neutral-100">
                    {record.className}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base text-neutral-900 dark:text-neutral-100">
                    <div className="flex items-center">
                      <FiCalendar className="w-5 h-5 mr-2 text-neutral-400" />
                      {record.lastCheckup}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(
                        record.healthStatus
                      )}`}
                    >
                      {record.healthStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base text-neutral-900 dark:text-neutral-100">
                    {record.allergies}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base text-neutral-900 dark:text-neutral-100 text-center">
                    {record.medications}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/nurse/health-records/${record.studentId}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 flex items-center text-base font-semibold"
                    >
                      <FiEye className="w-5 h-5 mr-2" />
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <FiActivity className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Không tìm thấy hồ sơ
            </h3>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Không có hồ sơ nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentHealthRecords;
