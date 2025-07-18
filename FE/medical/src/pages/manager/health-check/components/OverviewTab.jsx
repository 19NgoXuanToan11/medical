import React from "react";
import { FiEye, FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import StatsCards from "./StatsCards";
import EquipmentAlert from "./EquipmentAlert";

const OverviewTab = ({
  stats,
  healthCheckPrograms,
  pendingRequests,
  fetchingData,
  error,
  onRefresh,
  onViewDetail,
  onSetActiveTab,
  onSetSelectedRequest,
}) => {
  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tổng quan khám sức khỏe
        </h3>
        <button
          onClick={onRefresh}
          disabled={fetchingData}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiRefreshCw
            className={`w-4 h-4 ${fetchingData ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Health Check Programs Table */}
      <HealthCheckProgramsTable
        healthCheckPrograms={healthCheckPrograms}
        onViewDetail={onViewDetail}
      />

      {/* Equipment Alerts Section */}
      <EquipmentAlert
        pendingRequests={pendingRequests}
        onViewDetail={onViewDetail}
        onSetActiveTab={onSetActiveTab}
        onSetSelectedRequest={onSetSelectedRequest}
      />
    </div>
  );
};

const HealthCheckProgramsTable = ({ healthCheckPrograms, onViewDetail }) => (
  <div className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chương trình khám gần đây
        </h4>
        <StatusLegend />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <TableHeader />
          <TableBody
            healthCheckPrograms={healthCheckPrograms}
            onViewDetail={onViewDetail}
          />
        </table>
      </div>
    </div>
  </div>
);

const StatusLegend = () => (
  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      Đã duyệt/Hoàn thành
    </span>
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      Đã từ chối
    </span>
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
      Đã lên lịch
    </span>
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
      Chờ duyệt
    </span>
  </div>
);

const TableHeader = () => (
  <thead>
    <tr className="border-b border-gray-200 dark:border-neutral-700">
      <th className="text-left py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Tên chương trình
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Loại
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Ngày thực hiện
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Học sinh
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Trạng thái
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Xử lý bởi
      </th>
      <th className="text-center py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
        Thao tác
      </th>
    </tr>
  </thead>
);

const TableBody = ({ healthCheckPrograms, onViewDetail }) => {
  const sortedPrograms = healthCheckPrograms
    .sort((a, b) => {
      // Approved/Rejected first, then scheduled, then pending
      const statusOrder = {
        Approved: 1,
        Rejected: 2,
        completed: 3,
        scheduled: 4,
        pending: 5,
        pending_equipment_review: 6,
      };
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      if (orderA !== orderB) return orderA - orderB;
      // Then sort by date (newest first)
      return new Date(b.requestDate) - new Date(a.requestDate);
    })
    .slice(0, 5);

  return (
    <tbody>
      {sortedPrograms.map((program) => (
        <TableRow
          key={program.id}
          program={program}
          onViewDetail={onViewDetail}
        />
      ))}
    </tbody>
  );
};

const TableRow = ({ program, onViewDetail }) => {
  const getStatusBadge = () => {
    const statusClasses = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Approved:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      scheduled:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };

    const statusText = {
      completed: "Hoàn thành",
      Approved: "Đã duyệt",
      scheduled: "Đã lên lịch",
      Rejected: "Đã từ chối",
      pending: "Chờ duyệt",
    };

    const className = statusClasses[program.status] || statusClasses.pending;
    const text = statusText[program.status] || "Chờ duyệt";

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {text}
      </span>
    );
  };

  const getProcessedBy = () => {
    if (program.status === "Approved" || program.status === "Rejected") {
      return (
        <div className="text-xs">
          <div className="font-medium">Manager</div>
          <div>
            {program.confirmedDate
              ? new Date(program.confirmedDate).toLocaleDateString("vi-VN")
              : "N/A"}
          </div>
        </div>
      );
    } else if (program.status === "scheduled") {
      return (
        <div className="text-xs">
          <div className="font-medium">Hệ thống</div>
          <div>Tự động</div>
        </div>
      );
    } else {
      return <span className="text-gray-400">-</span>;
    }
  };

  return (
    <tr className="border-b border-gray-100 dark:border-neutral-700">
      <td className="py-4 px-6">
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {program.name}
        </div>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          {program.type}
        </span>
      </td>
      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
        {program.startDate}
      </td>
      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
        {program.targetStudents}
      </td>
      <td className="py-4 px-6 text-center">{getStatusBadge()}</td>
      <td className="py-4 px-6 text-center text-gray-600 dark:text-gray-400">
        {getProcessedBy()}
      </td>
      <td className="py-4 px-6 text-center">
        <button
          onClick={() => onViewDetail(program)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <FiEye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
};

export default OverviewTab;
