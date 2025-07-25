import React, { useState } from "react";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiEye,
  FiCheck,
  FiX,
  FiClock,
  FiMapPin,
  FiAlertTriangle,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  formatDateWithContext,
  formatDuration,
  formatRelativeTime 
} from "../../../../utils/timeUtils";

const PendingTab = ({ 
  pendingForms, 
  searchTerm, 
  setSearchTerm,
  onRefresh, 
  loading,
  onApprovalAction,
  onShowDetail 
}) => {
  const [sortBy, setSortBy] = useState("date"); // date, priority, vaccine
  const [filterBy, setFilterBy] = useState("all"); // all, urgent, normal

  // Filter and sort forms
  const filteredAndSortedForms = pendingForms
    .filter(form => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          form.injectionName?.toLowerCase().includes(term) ||
          form.description?.toLowerCase().includes(term) ||
          form.vaccine?.name?.toLowerCase().includes(term) ||
          form.formId.toString().includes(term);
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filterBy === "urgent") {
        const isUrgent = form.createdDate && 
          (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60) > 24;
        return isUrgent;
      } else if (filterBy === "normal") {
        const isUrgent = form.createdDate && 
          (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60) > 24;
        return !isUrgent;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const aUrgent = a.createdDate && (new Date() - new Date(a.createdDate)) / (1000 * 60 * 60) > 24;
          const bUrgent = b.createdDate && (new Date() - new Date(b.createdDate)) / (1000 * 60 * 60) > 24;
          if (aUrgent && !bUrgent) return -1;
          if (!aUrgent && bUrgent) return 1;
          return new Date(b.createdDate) - new Date(a.createdDate);
        case "vaccine":
          return (a.injectionName || "").localeCompare(b.injectionName || "");
        default: // date
          return new Date(b.createdDate) - new Date(a.createdDate);
      }
    });

  const urgentCount = pendingForms.filter(form => {
    if (!form.createdDate) return false;
    return (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60) > 24;
  }).length;

  const renderFormCard = (form) => {
    const isUrgent = form.createdDate && 
      (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60) > 24;

    return (
      <div
        key={form.formId}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow border p-6 hover:shadow-lg transition-shadow ${
          isUrgent
            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {form.injectionName || "Chưa có tên vaccine"}
              </h3>
              {isUrgent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <FiAlertTriangle className="w-3 h-3 mr-1" />
                  Khẩn cấp
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mã phiếu: #{form.formId} • Tạo lúc:{" "}
              {form.createdDate
                ? formatDateTime(form.createdDate)
                : "Chưa xác định"}
            </p>
            {form.createdDate && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatRelativeTime(form.createdDate)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onShowDetail(form)}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Xem chi tiết"
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onApprovalAction("approve", form)}
              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Duyệt"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => onApprovalAction("reject", form)}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Từ chối"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Vaccine Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiShield className="w-4 h-4 text-blue-600" />
              Vaccine
            </h4>
            <div className="pl-6 space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Tên:</span>{" "}
                {form.vaccine?.name || form.injectionName || "N/A"}
              </p>
              <p>
                <span className="text-gray-500">Loại:</span>{" "}
                {form.vaccine?.type || "N/A"}
              </p>
              <p>
                <span className="text-gray-500">NSX:</span>{" "}
                {form.vaccine?.manufacturer || "N/A"}
              </p>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-green-600" />
              Lịch tiêm
            </h4>
            <div className="pl-6 space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Ngày:</span>{" "}
                {form.scheduledDate
                  ? formatDateWithContext(form.scheduledDate)
                  : "Chưa xác định"}
              </p>
              <p>
                <span className="text-gray-500">Giờ:</span>{" "}
                {form.startTime || "N/A"}
              </p>
              <div className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">{form.location || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Target Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-purple-600" />
              Đối tượng
            </h4>
            <div className="pl-6 space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Học sinh:</span>{" "}
                {form.totalStudents || 0}
              </p>
              <div className="flex flex-wrap gap-1">
                {form.gradeIds ? (
                  JSON.parse(form.gradeIds).map((grade, index) => (
                    <span
                      key={index}
                      className="inline-block text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                    >
                      Lớp {grade}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {form.description && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Mô tả:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
              {form.description}
            </p>
          </div>
        )}

        {/* Settings */}
        <div className="flex flex-wrap gap-2 text-xs">
          {form.notifyParents && (
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Thông báo PH
            </span>
          )}
          {form.requireParentConfirmation && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              Cần xác nhận PH
            </span>
          )}
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
            {form.estimatedDuration || 60} phút
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên vaccine, mô tả, mã phiếu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="normal">Bình thường</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Ngày tạo</option>
              <option value="priority">Độ ưu tiên</option>
              <option value="vaccine">Tên vaccine</option>
            </select>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Tổng: <strong>{pendingForms.length}</strong> phiếu
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Hiển thị: <strong>{filteredAndSortedForms.length}</strong> phiếu
          </span>
          {urgentCount > 0 && (
            <span className="text-red-600 dark:text-red-400">
              Khẩn cấp: <strong>{urgentCount}</strong> phiếu
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : filteredAndSortedForms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredAndSortedForms.map(renderFormCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? "Không tìm thấy phiếu nào" : "Chưa có phiếu chờ duyệt"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm 
              ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
              : "Các phiếu tiêm chủng mới sẽ hiển thị ở đây"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingTab; 