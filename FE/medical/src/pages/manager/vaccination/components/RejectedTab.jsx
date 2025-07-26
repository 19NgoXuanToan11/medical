import React, { useState } from "react";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiEye,
  FiXCircle,
  FiMapPin,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiAlertCircle,
  FiInfo,
} from "react-icons/fi";
import { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  formatDateWithContext,
  formatDuration,
  formatRelativeTime 
} from "../../../../utils/timeUtils";

const RejectedTab = ({
  rejectedForms,
  searchTerm,
  setSearchTerm,
  onRefresh,
  loading,
  onShowDetail,
}) => {
  const [sortBy, setSortBy] = useState("date"); // date, vaccine, reason
  const [filterBy, setFilterBy] = useState("all"); // all, recent, old

  // Filter and sort forms
  const filteredAndSortedForms = rejectedForms
    .filter((form) => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          form.injectionName?.toLowerCase().includes(term) ||
          form.description?.toLowerCase().includes(term) ||
          form.vaccine?.name?.toLowerCase().includes(term) ||
          form.formId.toString().includes(term) ||
          form.notes?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Date filter
      if (filterBy !== "all" && form.confirmedDate) {
        const rejectedDate = new Date(form.confirmedDate);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        switch (filterBy) {
          case "recent":
            return rejectedDate >= weekAgo;
          case "old":
            return rejectedDate < weekAgo;
          default:
            return true;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "vaccine":
          return (a.injectionName || "").localeCompare(b.injectionName || "");
        case "reason":
          return (a.notes || "").localeCompare(b.notes || "");
        default: // date
          if (!a.confirmedDate && !b.confirmedDate) return 0;
          if (!a.confirmedDate) return 1;
          if (!b.confirmedDate) return -1;
          return new Date(b.confirmedDate) - new Date(a.confirmedDate);
      }
    });

  // Calculate stats
  const recentCount = rejectedForms.filter((form) => {
    if (!form.confirmedDate) return false;
    const rejectedDate = new Date(form.confirmedDate);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return rejectedDate >= weekAgo;
  }).length;

  const renderFormCard = (form) => {
    const rejectedDate = form.confirmedDate
      ? new Date(form.confirmedDate)
      : null;
    const isRecent =
      rejectedDate &&
      rejectedDate >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (
      <div
        key={form.formId}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow border p-6 hover:shadow-lg transition-shadow ${
          isRecent
            ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {form.injectionName || "Tiêm chủng"}
              </h3>
              {isRecent && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  <FiClock className="w-3 h-3 mr-1" />
                  Mới từ chối
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mã phiếu: #{form.formId} • Từ chối lúc:{" "}
              {rejectedDate ? formatDateTime(rejectedDate) : "Chưa xác định"}
            </p>
            {rejectedDate && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatRelativeTime(rejectedDate)}
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
            <div className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <FiXCircle className="w-4 h-4" />
            </div>
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

          {/* Original Schedule Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              Lịch đã đề xuất
            </h4>
            <div className="pl-6 space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p>
                <span>Ngày:</span>{" "}
                {form.scheduledDate
                  ? formatDateWithContext(form.scheduledDate)
                  : "Chưa xác định"}
              </p>
              <p>
                <span>Giờ:</span> {form.startTime || "N/A"}
              </p>
              <div className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                <span>{form.location || "N/A"}</span>
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
                      className="inline-block text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
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

        {/* Original Description */}
        {form.description && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Mô tả ban đầu:
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded">
              {form.description}
            </p>
          </div>
        )}

        {/* Rejection Reason */}
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Lý do từ chối:
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                {form.notes || "Không có lý do cụ thể"}
              </p>
              {rejectedDate && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                  Từ chối lúc: {formatDateTime(rejectedDate)} ({formatRelativeTime(rejectedDate)})
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Creation Info */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <FiInfo className="w-4 h-4" />
            Thông tin tạo phiếu
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p>
              <span>Ngày tạo:</span>{" "}
              {form.createdDate
                ? formatDateTime(form.createdDate)
                : "Chưa xác định"}
            </p>
            {form.createdDate && (
              <p className="text-xs text-gray-500">
                {formatRelativeTime(form.createdDate)}
              </p>
            )}
            {form.createdDate && rejectedDate && (
              <p>
                <span>Thời gian xử lý:</span>{" "}
                {Math.round(
                  (rejectedDate - new Date(form.createdDate)) / (1000 * 60 * 60)
                )}{" "}
                giờ
              </p>
            )}
          </div>
        </div>

        {/* Status and Settings */}
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
              Đã từ chối
            </span>
            {form.notifyParents && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                Đã thông báo PH
              </span>
            )}
            {form.requireParentConfirmation && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                Cần xác nhận PH
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Thời gian dự kiến: {form.estimatedDuration || 60} phút
            </p>
          </div>
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
                placeholder="Tìm kiếm theo tên vaccine, mô tả, lý do từ chối..."
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
              <option value="recent">Mới từ chối (7 ngày)</option>
              <option value="old">Cũ hơn</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Ngày từ chối</option>
              <option value="vaccine">Tên vaccine</option>
              <option value="reason">Lý do từ chối</option>
            </select>

            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Tổng: <strong>{rejectedForms.length}</strong> phiếu
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Hiển thị: <strong>{filteredAndSortedForms.length}</strong> phiếu
          </span>
          {recentCount > 0 && (
            <span className="text-orange-600 dark:text-orange-400">
              Mới từ chối: <strong>{recentCount}</strong> phiếu
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
          <FiXCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm
              ? "Không tìm thấy phiếu nào"
              : "Chưa có phiếu bị từ chối"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm
              ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
              : "Các phiếu bị từ chối sẽ hiển thị ở đây"}
          </p>
        </div>
      )}
    </div>
  );
};

export default RejectedTab;
