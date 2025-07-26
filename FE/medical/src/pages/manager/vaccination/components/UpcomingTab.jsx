import React, { useState } from "react";
import {
  FiShield,
  FiCalendar,
  FiUsers,
  FiEye,
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import { 
  formatDate, 
  formatTime, 
  formatDateTime, 
  formatDateWithContext,
  formatDuration,
  formatRelativeTime 
} from "../../../../utils/timeUtils";

const UpcomingTab = ({ 
  upcomingForms, 
  searchTerm, 
  setSearchTerm,
  onRefresh, 
  loading,
  onShowDetail 
}) => {
  const [sortBy, setSortBy] = useState("date"); // date, vaccine, students
  const [filterBy, setFilterBy] = useState("all"); // all, today, this_week, next_week

  // Calculate date filters
  const today = new Date();
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextWeekStart = new Date(endOfWeek);
  const nextWeekEnd = new Date(nextWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Filter and sort forms
  const filteredAndSortedForms = upcomingForms
    .filter(form => {
      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          form.injectionName?.toLowerCase().includes(term) ||
          form.description?.toLowerCase().includes(term) ||
          form.vaccine?.name?.toLowerCase().includes(term) ||
          form.formId.toString().includes(term) ||
          form.location?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Date filter
      if (filterBy !== "all" && form.scheduledDate) {
        const scheduleDate = new Date(form.scheduledDate);
        
        switch (filterBy) {
          case "today":
            return scheduleDate.toDateString() === today.toDateString();
          case "this_week":
            return scheduleDate >= startOfWeek && scheduleDate < endOfWeek;
          case "next_week":
            return scheduleDate >= nextWeekStart && scheduleDate < nextWeekEnd;
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
        case "students":
          return (b.totalStudents || 0) - (a.totalStudents || 0);
        default: // date
          if (!a.scheduledDate && !b.scheduledDate) return 0;
          if (!a.scheduledDate) return 1;
          if (!b.scheduledDate) return -1;
          return new Date(a.scheduledDate) - new Date(b.scheduledDate);
      }
    });

  // Calculate stats
  const todayForms = upcomingForms.filter(form => {
    if (!form.scheduledDate) return false;
    return new Date(form.scheduledDate).toDateString() === today.toDateString();
  }).length;

  const thisWeekForms = upcomingForms.filter(form => {
    if (!form.scheduledDate) return false;
    const scheduleDate = new Date(form.scheduledDate);
    return scheduleDate >= startOfWeek && scheduleDate < endOfWeek;
  }).length;

  const renderFormCard = (form) => {
    const scheduleDate = form.scheduledDate ? new Date(form.scheduledDate) : null;
    const isToday = scheduleDate && scheduleDate.toDateString() === today.toDateString();
    const isThisWeek = scheduleDate && scheduleDate >= startOfWeek && scheduleDate < endOfWeek;

    return (
      <div
        key={form.formId}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow border p-6 hover:shadow-lg transition-shadow ${
          isToday
            ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
            : isThisWeek
            ? "border-blue-300 dark:border-blue-600"
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
              {isToday && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <FiCalendar className="w-3 h-3 mr-1" />
                  Hôm nay
                </span>
              )}
              {!isToday && isThisWeek && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <FiClock className="w-3 h-3 mr-1" />
                  Tuần này
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mã phiếu: #{form.formId} • Duyệt lúc:{" "}
              {form.confirmedDate
                ? formatDateTime(form.confirmedDate)
                : "Chưa xác định"}
            </p>
            {form.confirmedDate && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatRelativeTime(form.confirmedDate)}
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
            <div className="p-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <FiCheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Schedule Info - Primary */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-green-600" />
              Lịch tiêm
            </h4>
            <div className="pl-6 space-y-1 text-sm">
              <p className="font-medium text-green-600 dark:text-green-400">
                <span className="text-gray-500">Ngày:</span>{" "}
                {scheduleDate ? formatDateWithContext(scheduleDate) : "Chưa xác định"}
              </p>
              <p>
                <span className="text-gray-500">Giờ:</span>{" "}
                {form.startTime || "N/A"}
              </p>
              <div className="flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">{form.location || "N/A"}</span>
              </div>
              <p>
                <span className="text-gray-500">Thời gian:</span>{" "}
                {form.estimatedDuration || 60} phút
              </p>
            </div>
          </div>

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

          {/* Target Info */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-purple-600" />
              Đối tượng
            </h4>
            <div className="pl-6 space-y-1 text-sm">
              <p className="font-medium text-purple-600 dark:text-purple-400">
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

        {/* Status and Settings */}
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
              Đã duyệt
            </span>
            {form.notifyParents && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                Thông báo PH
              </span>
            )}
            {form.requireParentConfirmation && (
              <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                Cần xác nhận PH
              </span>
            )}
          </div>
          
          {scheduleDate && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {scheduleDate < today 
                  ? "Đã qua"
                  : scheduleDate.toDateString() === today.toDateString()
                  ? "Hôm nay"
                  : `Còn ${Math.ceil((scheduleDate - today) / (1000 * 60 * 60 * 24))} ngày`
                }
              </p>
            </div>
          )}
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
                placeholder="Tìm kiếm theo tên vaccine, mô tả, địa điểm..."
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
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="next_week">Tuần sau</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Ngày tiêm</option>
              <option value="vaccine">Tên vaccine</option>
              <option value="students">Số học sinh</option>
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
            Tổng: <strong>{upcomingForms.length}</strong> phiếu
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            Hiển thị: <strong>{filteredAndSortedForms.length}</strong> phiếu
          </span>
          {todayForms > 0 && (
            <span className="text-green-600 dark:text-green-400">
              Hôm nay: <strong>{todayForms}</strong> phiếu
            </span>
          )}
          {thisWeekForms > 0 && (
            <span className="text-blue-600 dark:text-blue-400">
              Tuần này: <strong>{thisWeekForms}</strong> phiếu
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
          <FiCheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm ? "Không tìm thấy phiếu nào" : "Chưa có lịch tiêm được duyệt"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm 
              ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
              : "Các phiếu được duyệt sẽ hiển thị ở đây"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTab; 