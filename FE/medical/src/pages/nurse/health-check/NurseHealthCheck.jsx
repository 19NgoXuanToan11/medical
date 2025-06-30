import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiPlus,
  FiPlay,
  FiPause,
  FiUser,
  FiActivity,
  FiEye,
  FiEdit,
  FiRotateCcw,
} from "react-icons/fi";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

const NurseHealthCheck = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [healthCheckList, setHealthCheckList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedCheckId, setSelectedCheckId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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
        // Thêm dữ liệu cho trạng thái "Đang diễn ra"
        {
          id: 6,
          scheduledDate: "2023-06-29",
          grade: "Lớp 3A",
          status: "in-progress",
          totalStudents: 32,
          confirmedParents: 32,
          checkedStudents: 18,
          currentStation: "Đo chiều cao, cân nặng",
          startTime: "08:00",
          estimatedEndTime: "11:30",
          currentTime: "09:45",
          remainingTime: "1h 45m",
          abnormalFound: 2,
          staffAssigned: ["Y tá Hương", "Y tá Mai"],
        },
        {
          id: 7,
          scheduledDate: "2023-06-29",
          grade: "Lớp 4B",
          status: "in-progress",
          totalStudents: 29,
          confirmedParents: 29,
          checkedStudents: 8,
          currentStation: "Khám tổng quát",
          startTime: "13:30",
          estimatedEndTime: "16:00",
          currentTime: "14:15",
          remainingTime: "1h 45m",
          abnormalFound: 1,
          staffAssigned: ["Y tá Linh", "Bác sĩ Tuấn"],
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

    const inProgressCount = healthCheckList.filter(
      (check) => check.status === "in-progress"
    ).length;

    const completedCount = healthCheckList.filter(
      (check) => check.status === "completed"
    ).length;

    const abnormalCount = healthCheckList
      .filter((check) => check.status === "completed")
      .reduce((sum, check) => sum + (check.abnormalResults || 0), 0);

    // Tính tổng số học sinh đang được kiểm tra
    const studentsInProgress = healthCheckList
      .filter((check) => check.status === "in-progress")
      .reduce((sum, check) => sum + (check.checkedStudents || 0), 0);

    return {
      upcoming: upcomingCount,
      pending: pendingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      abnormal: abnormalCount,
      studentsInProgress: studentsInProgress,
    };
  };

  const stats = getStats();

  // Handler functions for modal actions
  const handlePauseCheck = (checkId) => {
    setSelectedCheckId(checkId);
    setShowPauseModal(true);
  };

  const handleCompleteEarly = (checkId) => {
    setSelectedCheckId(checkId);
    setShowCompleteModal(true);
  };

  const confirmPause = async () => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setHealthCheckList((prev) =>
        prev.map((check) =>
          check.id === selectedCheckId ? { ...check, status: "paused" } : check
        )
      );
      setActionLoading(false);
      setShowPauseModal(false);
      setSelectedCheckId(null);

      // Show success notification
      alert("Đã tạm dừng buổi kiểm tra thành công!");
    }, 1500);
  };

  const confirmComplete = async () => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setHealthCheckList((prev) =>
        prev.map((check) =>
          check.id === selectedCheckId
            ? {
                ...check,
                status: "completed",
                checkedStudents: check.totalStudents,
              }
            : check
        )
      );
      setActionLoading(false);
      setShowCompleteModal(false);
      setSelectedCheckId(null);

      // Show success notification
      alert("Đã hoàn thành buổi kiểm tra sớm!");
    }, 1500);
  };

  const closePauseModal = () => {
    if (!actionLoading) {
      setShowPauseModal(false);
      setSelectedCheckId(null);
    }
  };

  const closeCompleteModal = () => {
    if (!actionLoading) {
      setShowCompleteModal(false);
      setSelectedCheckId(null);
    }
  };

  // Render content dựa theo tab active
  const renderTabContent = () => {
    if (activeTab === "in-progress") {
      return renderInProgressContent();
    }
    return renderDefaultContent();
  };

  // Render giao diện cho tab "Đang diễn ra"
  const renderInProgressContent = () => {
    const inProgressChecks = healthCheckList.filter(
      (check) => check.status === "in-progress"
    );

    if (inProgressChecks.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="mx-auto h-24 w-24 text-neutral-400 dark:text-neutral-500 mb-4">
            <FiActivity className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Không có buổi kiểm tra nào đang diễn ra
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Các buổi kiểm tra y tế sẽ hiển thị ở đây khi bắt đầu
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {inProgressChecks.map((check) => (
          <div
            key={check.id}
            className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          >
            {/* Header với thông tin cơ bản */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-blue-100 dark:border-blue-800">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                    <FiActivity className="mr-2 text-blue-600 dark:text-blue-400" />
                    Kiểm tra {check.grade}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Ngày:{" "}
                    {new Date(check.scheduledDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full animate-pulse">
                    <FiClock className="inline mr-1" />
                    Đang diễn ra
                  </span>
                </div>
              </div>
            </div>

            {/* Progress và thống kê */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Tiến độ kiểm tra */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                      Tiến độ kiểm tra
                    </h4>
                    <FiUser className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {check.checkedStudents}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400 mb-1">
                      / {check.totalStudents}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2 mt-3">
                    <div
                      className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (check.checkedStudents / check.totalStudents) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {Math.round(
                      (check.checkedStudents / check.totalStudents) * 100
                    )}
                    % hoàn thành
                  </p>
                </div>

                {/* Thời gian */}
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      Thời gian
                    </h4>
                    <FiClock className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Bắt đầu:
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {check.startTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Dự kiến:
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {check.estimatedEndTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Còn lại:
                      </span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {check.remainingTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bất thường phát hiện */}
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Bất thường
                    </h4>
                    <FiAlertTriangle className="text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {check.abnormalFound || 0}
                    </span>
                    <span className="text-sm text-red-600 dark:text-red-400 mb-1">
                      trường hợp
                    </span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {check.abnormalFound > 0
                      ? "Cần xem xét kỹ"
                      : "Chưa phát hiện"}
                  </p>
                </div>
              </div>

              {/* Thông tin chi tiết và hành động */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trạng thái hiện tại */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
                    <FiActivity className="mr-2 text-blue-600 dark:text-blue-400" />
                    Trạng thái hiện tại
                  </h4>
                  <div className="bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {check.currentStation}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Nhân viên: {check.staffAssigned.join(", ")}
                    </p>
                  </div>
                </div>

                {/* Hành động */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Hành động
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/nurse/health-check/${check.id}/live`}
                      className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                    >
                      <FiEye className="mr-1" />
                      Theo dõi trực tiếp
                    </Link>
                    <button
                      onClick={() => handlePauseCheck(check.id)}
                      className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-md transition-colors"
                    >
                      <FiPause className="mr-1" />
                      Tạm dừng
                    </button>
                    <Link
                      to={`/nurse/health-check/${check.id}/manage`}
                      className="flex items-center px-3 py-2 bg-neutral-600 hover:bg-neutral-700 text-white text-sm rounded-md transition-colors"
                    >
                      <FiEdit className="mr-1" />
                      Quản lý
                    </Link>
                    <button
                      onClick={() => handleCompleteEarly(check.id)}
                      className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
                    >
                      <FiCheckCircle className="mr-1" />
                      Hoàn thành sớm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render giao diện mặc định cho các tab khác
  const renderDefaultContent = () => {
    return (
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
                    {new Date(check.scheduledDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {check.grade}
                      {check.abnormalResults > 0 && (
                        <span
                          title="Có học sinh bất thường"
                          className="flex items-center text-red-600 ml-1"
                        >
                          <FiAlertTriangle className="w-4 h-4" />
                          <span className="ml-1 text-xs font-semibold">
                            {check.abnormalResults} bất thường
                          </span>
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
    );
  };

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

      {/* Dashboard Stats - Thêm thống kê cho "Đang diễn ra" */}
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

        {/* Thêm thống kê cho "Đang diễn ra" */}
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-lg shadow border border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Đang diễn ra
              </p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                {stats.inProgress}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {stats.studentsInProgress} học sinh
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <FiActivity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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

      {/* Action buttons - Thêm tab "Đang diễn ra" */}
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
            onClick={() => setActiveTab("in-progress")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "in-progress"
                ? "bg-primary-600 text-white"
                : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-600"
            } transition-colors duration-200 relative`}
          >
            Đang diễn ra
            {stats.inProgress > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                {stats.inProgress}
              </span>
            )}
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
        renderTabContent()
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showPauseModal}
        onClose={closePauseModal}
        onConfirm={confirmPause}
        title="Tạm dừng buổi kiểm tra"
        message="Bạn có chắc chắn muốn tạm dừng buổi kiểm tra này? Buổi kiểm tra sẽ được dừng lại và có thể tiếp tục sau."
        type="warning"
        confirmText="Tạm dừng"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={showCompleteModal}
        onClose={closeCompleteModal}
        onConfirm={confirmComplete}
        title="Hoàn thành buổi kiểm tra sớm"
        message="Bạn có chắc chắn muốn hoàn thành buổi kiểm tra sớm? Hành động này không thể hoàn tác và sẽ đánh dấu tất cả học sinh chưa kiểm tra là đã hoàn thành."
        type="success"
        confirmText="Hoàn thành"
        loading={actionLoading}
      />
    </div>
  );
};

export default NurseHealthCheck;
