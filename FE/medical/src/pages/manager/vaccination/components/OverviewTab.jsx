import React from "react";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import {
  formatDateTime,
  formatRelativeTime,
  formatDate,
} from "../../../../utils/timeUtils";

const OverviewTab = ({ stats, pendingForms, upcomingForms, rejectedForms }) => {
  // Calculate additional metrics
  const totalForms = stats.pending + stats.upcoming + stats.rejected;
  const approvalRate =
    totalForms > 0
      ? Math.round(((stats.upcoming + stats.rejected) / totalForms) * 100)
      : 0;
  const urgentForms = pendingForms.filter((form) => {
    if (!form.createdDate) return false;
    const hoursSinceCreated =
      (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60);
    return hoursSinceCreated > 24;
  }).length;

  // Get recent activities
  const recentActivities = [
    ...pendingForms.map((form) => ({
      ...form,
      type: "pending",
      time: form.createdDate,
      formattedTime: form.createdDate
        ? formatDateTime(form.createdDate)
        : "Chưa xác định",
      relativeTime: form.createdDate
        ? formatRelativeTime(form.createdDate)
        : null,
    })),
    ...upcomingForms.map((form) => ({
      ...form,
      type: "approved",
      time: form.confirmedDate || form.createdDate,
      formattedTime: form.confirmedDate
        ? formatDateTime(form.confirmedDate)
        : form.createdDate
        ? formatDateTime(form.createdDate)
        : "Chưa xác định",
      relativeTime: form.confirmedDate
        ? formatRelativeTime(form.confirmedDate)
        : form.createdDate
        ? formatRelativeTime(form.createdDate)
        : null,
    })),
    ...rejectedForms.map((form) => ({
      ...form,
      type: "rejected",
      time: form.confirmedDate || form.createdDate,
      formattedTime: form.confirmedDate
        ? formatDateTime(form.confirmedDate)
        : form.createdDate
        ? formatDateTime(form.createdDate)
        : "Chưa xác định",
      relativeTime: form.confirmedDate
        ? formatRelativeTime(form.confirmedDate)
        : form.createdDate
        ? formatRelativeTime(form.createdDate)
        : null,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${color
            .replace("text-", "bg-")
            .replace("600", "100")} dark:${color
            .replace("text-", "bg-")
            .replace("600", "900")}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 dark:text-green-400">
            {trend}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng phiếu tiêm"
          value={totalForms}
          icon={FiShield}
          color="text-blue-600 dark:text-blue-400"
          subtitle="Tất cả phiếu trong hệ thống"
        />

        <StatCard
          title="Chờ duyệt"
          value={stats.pending}
          icon={FiClock}
          color="text-yellow-600 dark:text-yellow-400"
          subtitle={urgentForms > 0 ? `${urgentForms} khẩn cấp` : "Cần xử lý"}
        />

        <StatCard
          title="Đã duyệt"
          value={stats.upcoming}
          icon={FiCheckCircle}
          color="text-green-600 dark:text-green-400"
          subtitle="Sẵn sàng thực hiện"
        />

        <StatCard
          title="Đã từ chối"
          value={stats.rejected}
          icon={FiXCircle}
          color="text-red-600 dark:text-red-400"
          subtitle="Cần xem xét lại"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Tỷ lệ xử lý"
          value={`${approvalRate}%`}
          icon={FiActivity}
          color="text-purple-600 dark:text-purple-400"
          subtitle="Phiếu đã được xử lý"
          trend={approvalRate > 80 ? "+5% từ tuần trước" : ""}
        />

        <StatCard
          title="Phiếu khẩn cấp"
          value={urgentForms}
          icon={FiCalendar}
          color="text-orange-600 dark:text-orange-400"
          subtitle="Quá 24h chưa xử lý"
        />

        <StatCard
          title="Tổng học sinh"
          value={stats.totalStudents || 0}
          icon={FiUsers}
          color="text-indigo-600 dark:text-indigo-400"
          subtitle="Sẽ được tiêm chủng"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FiActivity className="w-5 h-5 text-blue-600" />
            Hoạt động gần đây
          </h3>
        </div>
        <div className="p-6">
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "pending"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : activity.type === "approved"
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {activity.type === "pending" && (
                      <FiClock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {activity.type === "approved" && (
                      <FiCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    {activity.type === "rejected" && (
                      <FiXCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Phiếu #{activity.formId} -{" "}
                      {activity.injectionName || "Tiêm chủng"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.type === "pending" && "Chờ duyệt"}
                      {activity.type === "approved" && "Đã được duyệt"}
                      {activity.type === "rejected" && "Đã bị từ chối"}
                      {" • "}
                      {activity.formattedTime}
                    </p>
                    {activity.relativeTime && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {activity.relativeTime}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiActivity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Chưa có hoạt động nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
