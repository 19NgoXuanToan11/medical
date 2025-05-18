import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HealthCheckConfirmation = ({ initialTab = "pending" }) => {
  const [loading, setLoading] = useState(true);
  const [pendingChecks, setPendingChecks] = useState([]);
  const [confirmedChecks, setConfirmedChecks] = useState([]);
  const [completedChecks, setCompletedChecks] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock data - would be replaced by API calls
  useEffect(() => {
    // Simulate API call to fetch health checks for parent's children
    setTimeout(() => {
      setPendingChecks([
        {
          id: 1,
          childName: "Nguyễn Minh Anh",
          grade: "Lớp 1A",
          scheduledDate: "2023-06-15",
          status: "pending",
        },
      ]);

      setConfirmedChecks([
        {
          id: 2,
          childName: "Nguyễn Minh Bảo",
          grade: "Lớp 2B",
          scheduledDate: "2023-06-22",
          status: "confirmed",
        },
      ]);

      setCompletedChecks([
        {
          id: 3,
          childName: "Nguyễn Minh Anh",
          grade: "Lớp 1A",
          checkDate: "2023-05-10",
          status: "completed",
          hasAbnormality: true,
          appointmentDate: "2023-05-20",
        },
        {
          id: 4,
          childName: "Nguyễn Minh Bảo",
          grade: "Lớp 2B",
          checkDate: "2023-05-10",
          status: "completed",
          hasAbnormality: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const confirmHealthCheck = (checkId) => {
    // In a real app, this would send a confirmation to the backend
    console.log(`Confirming health check ${checkId}`);

    // Update local state to reflect the change
    const checkToMove = pendingChecks.find((check) => check.id === checkId);
    if (checkToMove) {
      checkToMove.status = "confirmed";
      setConfirmedChecks([...confirmedChecks, checkToMove]);
      setPendingChecks(pendingChecks.filter((check) => check.id !== checkId));
    }
  };

  const renderCheckList = () => {
    let checksToDisplay = [];

    switch (activeTab) {
      case "pending":
        checksToDisplay = pendingChecks;
        break;
      case "confirmed":
        checksToDisplay = confirmedChecks;
        break;
      case "completed":
        checksToDisplay = completedChecks;
        break;
      default:
        checksToDisplay = pendingChecks;
    }

    if (checksToDisplay.length === 0) {
      return (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có kiểm tra nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === "pending"
              ? "Không có kiểm tra y tế nào đang chờ xác nhận"
              : activeTab === "confirmed"
              ? "Không có kiểm tra y tế nào đã xác nhận"
              : "Không có kiểm tra y tế nào đã hoàn thành"}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        {checksToDisplay.map((check) => (
          <div key={check.id} className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {check.childName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {check.grade}
                </p>
              </div>
              <div className="ml-2">
                {activeTab === "pending" && (
                  <button
                    onClick={() => confirmHealthCheck(check.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Xác nhận tham gia
                  </button>
                )}
                {activeTab === "confirmed" && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Đã xác nhận
                  </span>
                )}
                {activeTab === "completed" && check.hasAbnormality && (
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Có dấu hiệu bất thường
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Lịch hẹn:{" "}
                      {new Date(check.appointmentDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                )}
                {activeTab === "completed" && !check.hasAbnormality && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Kết quả bình thường
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {activeTab === "completed"
                  ? `Kiểm tra ngày: ${new Date(
                      check.checkDate
                    ).toLocaleDateString("vi-VN")}`
                  : `Lịch kiểm tra: ${new Date(
                      check.scheduledDate
                    ).toLocaleDateString("vi-VN")}`}
              </div>
              <div>
                {activeTab === "completed" && (
                  <Link
                    to={`/parent/health-check/${check.id}/results`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Xem chi tiết kết quả
                  </Link>
                )}
                {activeTab === "confirmed" && (
                  <span className="text-sm text-gray-500">
                    Chờ đến ngày kiểm tra
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Kiểm tra y tế định kỳ
        </h1>
        <p className="text-gray-600 mt-1">
          Quản lý lịch kiểm tra y tế định kỳ cho con em bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("pending")}
                className={`${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Chờ xác nhận
                {pendingChecks.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {pendingChecks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("confirmed")}
                className={`${
                  activeTab === "confirmed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Đã xác nhận
                {confirmedChecks.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {confirmedChecks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`${
                  activeTab === "completed"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Đã hoàn thành
                {completedChecks.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {completedChecks.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderCheckList()
      )}
    </div>
  );
};

export default HealthCheckConfirmation;
