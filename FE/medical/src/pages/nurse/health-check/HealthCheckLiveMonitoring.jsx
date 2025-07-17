import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiUser,
  FiActivity,
  FiCheckCircle,
  FiAlertTriangle,
  FiPause,
  FiPlay,
  FiRefreshCcw,
  FiEdit,
  FiEye,
  FiAlertCircle,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

const HealthCheckLiveMonitoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState(null);
  const [students, setStudents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeStation, setActiveStation] = useState("height-weight");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    const mockHealthCheck = {
      id: id,
      scheduledDate: "2023-06-29",
      grade: "Lớp 3A",
      status: "in-progress",
      totalStudents: 32,
      checkedStudents: 18,
      currentStation: "Đo chiều cao, cân nặng",
      startTime: "08:00",
      estimatedEndTime: "11:30",
      abnormalFound: 2,
      staffAssigned: ["Y tá Hương", "Y tá Mai"],
      stations: [
        {
          id: "height-weight",
          name: "Đo chiều cao, cân nặng",
          status: "active",
          queue: 3,
        },
        { id: "vision", name: "Kiểm tra thị lực", status: "waiting", queue: 8 },
        { id: "general", name: "Khám tổng quát", status: "waiting", queue: 15 },
        { id: "dental", name: "Khám răng miệng", status: "waiting", queue: 20 },
      ],
    };

    const mockStudents = [
      {
        id: 1,
        name: "Nguyễn Văn An",
        studentCode: "3A001",
        status: "completed",
        currentStation: "Hoàn thành",
        timeCompleted: "09:15",
        results: {
          height: 125,
          weight: 28,
          vision: "Bình thường",
          general: "Tốt",
          abnormal: false,
        },
      },
      {
        id: 2,
        name: "Trần Thị Bảo",
        studentCode: "3A002",
        status: "in-progress",
        currentStation: "Kiểm tra thị lực",
        timeStarted: "09:20",
        results: {
          height: 122,
          weight: 26,
          vision: "Đang kiểm tra",
          general: "Chưa kiểm tra",
        },
      },
      {
        id: 3,
        name: "Lê Văn Cường",
        studentCode: "3A003",
        status: "in-progress",
        currentStation: "Đo chiều cao, cân nặng",
        timeStarted: "09:25",
        results: {
          height: "Đang đo",
          weight: "Đang đo",
        },
      },
      {
        id: 4,
        name: "Phạm Thị Dung",
        studentCode: "3A004",
        status: "completed",
        currentStation: "Hoàn thành",
        timeCompleted: "09:10",
        results: {
          height: 118,
          weight: 24,
          vision: "Cận thị nhẹ",
          general: "Tốt",
          abnormal: true,
          abnormalNote: "Cận thị -0.5D, cần theo dõi",
        },
      },
      {
        id: 5,
        name: "Hoàng Văn Em",
        studentCode: "3A005",
        status: "waiting",
        currentStation: "Chờ đến lượt",
        queuePosition: 1,
      },
      // Thêm nhiều học sinh khác...
      ...Array.from({ length: 27 }, (_, i) => ({
        id: i + 6,
        name: `Học sinh ${i + 6}`,
        studentCode: `3A${String(i + 6).padStart(3, "0")}`,
        status: "waiting",
        currentStation: "Chờ đến lượt",
        queuePosition: i + 2,
      })),
    ];

    setHealthCheck(mockHealthCheck);
    setStudents(mockStudents);
    setLoading(false);
  }, [id]);

  // Auto refresh current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const refreshTimer = setInterval(() => {
      // Simulate data updates
    }, 5000);

    return () => clearInterval(refreshTimer);
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200 animate-pulse";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "abnormal":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStationStatus = (station) => {
    switch (station.status) {
      case "active":
        return "bg-green-500 text-white";
      case "waiting":
        return "bg-gray-400 text-white";
      case "paused":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const calculateProgress = () => {
    const completed = students.filter((s) => s.status === "completed").length;
    return Math.round((completed / healthCheck.totalStudents) * 100);
  };

  const getElapsedTime = () => {
    const start = new Date(`2023-06-29 ${healthCheck.startTime}`);
    const diff = currentTime - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handlePauseResume = () => {
    // Implement pause/resume functionality
  };

  const handleCompleteEarly = () => {
    if (window.confirm("Bạn có chắc chắn muốn hoàn thành buổi kiểm tra sớm?")) {
      navigate("/nurse/health-check");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/nurse/health-check")}
            className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Theo dõi trực tiếp - {healthCheck.grade}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ngày:{" "}
              {new Date(healthCheck.scheduledDate).toLocaleDateString("vi-VN")}{" "}
              | Thời gian hiện tại: {currentTime.toLocaleTimeString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-md border ${
              autoRefresh
                ? "bg-green-100 border-green-300 text-green-800"
                : "bg-gray-100 border-gray-300 text-gray-800"
            }`}
          >
            <FiRefreshCcw className="inline mr-1" />
            {autoRefresh ? "Tự động cập nhật" : "Cập nhật thủ công"}
          </button>
          <button
            onClick={handlePauseResume}
            className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md"
          >
            <FiPause className="inline mr-1" />
            Tạm dừng
          </button>
          <button
            onClick={handleCompleteEarly}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            <FiCheckCircle className="inline mr-1" />
            Hoàn thành sớm
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tiến độ
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {calculateProgress()}%
              </p>
              <p className="text-xs text-gray-500">
                {students.filter((s) => s.status === "completed").length}/
                {healthCheck.totalStudents} học sinh
              </p>
            </div>
            <FiUser className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thời gian đã trôi
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {getElapsedTime()}
              </p>
              <p className="text-xs text-gray-500">
                Bắt đầu lúc {healthCheck.startTime}
              </p>
            </div>
            <FiClock className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang kiểm tra
              </p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.status === "in-progress").length}
              </p>
              <p className="text-xs text-gray-500">học sinh</p>
            </div>
            <FiActivity className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bất thường
              </p>
              <p className="text-2xl font-bold text-red-600">
                {students.filter((s) => s.results?.abnormal).length}
              </p>
              <p className="text-xs text-gray-500">trường hợp</p>
            </div>
            <FiAlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Stations Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border mb-8">
        <div className="p-6 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Trạng thái các trạm kiểm tra
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthCheck.stations.map((station) => (
              <div
                key={station.id}
                className="p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStationStatus(
                      station
                    )}`}
                  >
                    {station.status === "active" ? "Đang hoạt động" : "Chờ"}
                  </span>
                  {station.status === "active" && (
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {station.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hàng đợi: {station.queue} học sinh
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Danh sách học sinh
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạm hiện tại
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kết quả
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {student.studentCode}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status === "completed" && "Hoàn thành"}
                      {student.status === "in-progress" && "Đang kiểm tra"}
                      {student.status === "waiting" && "Chờ đến lượt"}
                      {student.results?.abnormal && (
                        <FiAlertCircle className="ml-1 w-3 h-3 text-red-600" />
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                    {student.currentStation}
                    {student.queuePosition && (
                      <div className="text-xs text-gray-500">
                        Thứ tự: {student.queuePosition}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                    {student.timeCompleted &&
                      `Hoàn thành: ${student.timeCompleted}`}
                    {student.timeStarted && `Bắt đầu: ${student.timeStarted}`}
                    {student.status === "waiting" && "Chưa bắt đầu"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {student.results && (
                      <div className="space-y-1">
                        {student.results.height && (
                          <div>Cao: {student.results.height}cm</div>
                        )}
                        {student.results.weight && (
                          <div>Nặng: {student.results.weight}kg</div>
                        )}
                        {student.results.abnormal && (
                          <div className="text-red-600 text-xs">
                            <FiAlertTriangle className="inline mr-1" />
                            Có bất thường
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/nurse/health-check/${id}/student/${student.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      {student.status === "completed" &&
                        student.results?.abnormal && (
                          <button className="text-red-600 hover:text-red-900">
                            <FiAlertTriangle className="w-4 h-4" />
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

      {/* Quick Actions */}
      <div className="mt-8 flex justify-end space-x-4">
        <Link
          to={`/nurse/health-check/${id}/manage`}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
        >
          <FiEdit className="inline mr-1" />
          Quản lý chi tiết
        </Link>
      </div>
    </div>
  );
};

export default HealthCheckLiveMonitoring;
