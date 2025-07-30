import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiEye,
  FiEdit,
  FiMapPin,
  FiInfo,
  FiXCircle,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateWithContext,
  formatDuration,
  formatRelativeTime,
} from "../../../utils/timeUtils";

const VaccinationManagement = ({ searchTerm: parentSearchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState("pending");
  const [injectionForms, setInjectionForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // Load injection forms data by status
  const loadInjectionFormsByStatus = async (status) => {
    try {
      const { injectionFormService } = await import(
        "../../../utils/api/injection/injectionService"
      );
      const result = await injectionFormService.getInjectionFormsByStatus(
        status
      );

      if (result.success) {
        return result.data || [];
      } else {
        console.warn(
          `Failed to load ${status} injection forms:`,
          result.message
        );
        return [];
      }
    } catch (error) {
      console.error(`Error loading ${status} injection forms:`, error);
      return [];
    }
  };

  // Load all injection forms data
  const loadAllInjectionForms = async () => {
    setLoading(true);
    try {
      const [pendingForms, approvedForms, rejectedForms] = await Promise.all([
        loadInjectionFormsByStatus("pending"),
        loadInjectionFormsByStatus("approved"),
        loadInjectionFormsByStatus("rejected"),
      ]);

      // Transform data to match UI expectations
      const transformData = (forms, status) => {
        return forms.map((form) => ({
          id: form.formId,
          formId: form.formId,
          title: form.injectionName || "Tiêm chủng",
          description: form.description || "",
          scheduledDate: form.scheduledDate
            ? formatDateWithContext(form.scheduledDate)
            : "Chưa xác định",
          scheduledTime: form.startTime || "08:00",
          location: form.location || "Phòng y tế trường",
          status: status,
          originalStatus: form.status,
          totalStudents: form.totalStudents || 0,
          grades: (() => {
            try {
              return (
                form.grades || (form.gradeIds ? JSON.parse(form.gradeIds) : [])
              );
            } catch (error) {
              console.error("Error parsing grades:", error);
              return [];
            }
          })(),
          // Vaccine information
          vaccineId: form.vaccineId,
          vaccine: form.vaccine,
          vaccineName:
            form.vaccine?.name || form.injectionName || "Unknown Vaccine",
          vaccineInfo:
            form.vaccine?.name || form.injectionName || "Unknown Vaccine",
          // Additional information
          estimatedDuration: form.estimatedDuration || 60,
          notifyParents: form.notifyParents,
          requireParentConfirmation: form.requireParentConfirmation,
          consentStatus: form.consentStatus,
          confirmStatus: form.confirmStatus,
          createdDate: form.createdDate,
          confirmedDate: form.confirmedDate,
          // Add notes for rejected forms
          notes: form.notes || form.rejectionReason || "",
        }));
      };

      const allForms = [
        ...transformData(pendingForms, "pending"),
        ...transformData(approvedForms, "upcoming"),
        ...transformData(rejectedForms, "rejected"),
      ];

      setInjectionForms(allForms);
    } catch (error) {
      console.error("Error loading injection forms:", error);
      setInjectionForms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAllInjectionForms();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      upcoming: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      badges[status] || badges.pending
    }`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Đang chờ duyệt",
      upcoming: "Sắp tới",
      rejected: "Đã từ chối",
      completed: "Đã hoàn thành",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      upcoming: FiCalendar,
      rejected: FiXCircle,
      completed: FiCheckCircle,
    };
    return icons[status] || FiClock;
  };

  // Filter forms by search term
  const filteredForms = injectionForms.filter((form) => {
    // Filter by status
    if (activeTab !== "all" && form.status !== activeTab) return false;

    // Filter by search term (both parent and local)
    const searchTerm = parentSearchTerm || localSearchTerm;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        form.title.toLowerCase().includes(term) ||
        form.description.toLowerCase().includes(term) ||
        form.vaccineInfo.toLowerCase().includes(term) ||
        form.location.toLowerCase().includes(term) ||
        form.formId.toString().includes(term) ||
        form.grades.some((grade) =>
          grade.toString().toLowerCase().includes(term)
        )
      );
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    pending: injectionForms.filter((f) => f.status === "pending").length,
    upcoming: injectionForms.filter((f) => f.status === "upcoming").length,
    rejected: injectionForms.filter((f) => f.status === "rejected").length,
    completed: injectionForms.filter((f) => f.status === "completed").length,
    totalStudents: injectionForms
      .filter((f) => f.status === "pending" || f.status === "upcoming")
      .reduce((sum, f) => sum + f.totalStudents, 0),
  };

  const renderInjectionFormCard = (form) => {
    const StatusIcon = getStatusIcon(form.status);
    const isUrgent =
      form.status === "pending" &&
      form.createdDate &&
      (new Date() - new Date(form.createdDate)) / (1000 * 60 * 60) > 24;

    return (
      <div
        key={form.id}
        className={`bg-white dark:bg-gray-800 border rounded-xl p-6 hover:shadow-lg transition-all duration-200 ${
          isUrgent
            ? "border-red-300 dark:border-red-600 shadow-red-50"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                form.status === "pending"
                  ? "bg-yellow-100 dark:bg-yellow-900"
                  : form.status === "upcoming"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : form.status === "rejected"
                  ? "bg-red-100 dark:bg-red-900"
                  : "bg-green-100 dark:bg-green-900"
              }`}
            >
              <StatusIcon
                className={`w-6 h-6 ${
                  form.status === "pending"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : form.status === "upcoming"
                    ? "text-blue-600 dark:text-blue-400"
                    : form.status === "rejected"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
                {form.title}
              </h3>
              {form.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {form.description}
                </p>
              )}
            </div>
          </div>
          <span className={`${getStatusBadge(form.status)} ml-4 flex-shrink-0`}>
            {getStatusLabel(form.status)}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* Left Column - Schedule & Location Info */}
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FiCalendar className="w-4 h-4 mr-2" />
                Thông tin lịch trình
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ngày thực hiện:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {form.scheduledDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Giờ bắt đầu:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {form.scheduledTime
                      ? form.scheduledTime.includes(":")
                        ? form.scheduledTime.substring(0, 5)
                        : form.scheduledTime
                      : "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thời gian dự kiến:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(form.estimatedDuration || 60)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Địa điểm:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">
                    {form.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Students & Vaccine Info */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FiUsers className="w-4 h-4 mr-2" />
                Thông tin đối tượng
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Số học sinh:
                  </span>
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {form.totalStudents} em
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Khối lớp:
                  </span>
                  <div className="flex flex-wrap gap-1 ml-2">
                    {form.grades && form.grades.length > 0 ? (
                      form.grades.map((grade, index) => {
                        const match = grade.match(/^grade-(\d+)$/);
                        const displayGrade = match ? match[1] : grade;
                        return (
                          <span
                            key={index}
                            className="inline-block text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium"
                          >
                            Lớp {displayGrade}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Chưa xác định
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FiShield className="w-4 h-4 mr-2" />
                Thông tin vắc-xin
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {form.vaccineInfo}
                  </span>
                </div>
                {form.vaccine && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    NSX: {form.vaccine.manufacturer || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings & Status Info */}
        <div className="flex flex-wrap gap-2 mb-4">
          {form.notifyParents && (
            <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-medium">
              Thông báo PH
            </span>
          )}
          {form.requireParentConfirmation && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
              Cần xác nhận PH
            </span>
          )}
        </div>

        {/* Rejection Notes */}
        {form.status === "rejected" && form.notes && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mr-3 mt-0.5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                  Lý do từ chối:
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {form.notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div>
                Ngày tạo:{" "}
                {form.createdDate
                  ? formatDate(form.createdDate)
                  : "Chưa xác định"}
              </div>
              {form.confirmedDate && (
                <div>Ngày duyệt: {formatDateTime(form.confirmedDate)}</div>
              )}
            </div>
            {isUrgent && (
              <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
                Cần xử lý gấp
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              <Link
                to={`/nurse/health-services/vaccination/${form.formId}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
              >
                <FiEye className="w-4 h-4 mr-2" />
                Chi tiết
              </Link>
              {form.status === "pending" && (
                <Link
                  to={`/nurse/health-services/${form.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiEdit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <FiShield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {activeTab === "pending" && "Chưa có phiếu chờ duyệt"}
        {activeTab === "upcoming" && "Chưa có lịch tiêm sắp tới"}
        {activeTab === "rejected" && "Chưa có phiếu bị từ chối"}
        {activeTab === "completed" && "Chưa có phiếu đã hoàn thành"}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {activeTab === "pending" &&
          "Các phiếu tiêm chủng bạn tạo sẽ hiển thị ở đây"}
        {activeTab === "upcoming" &&
          "Các lịch tiêm được duyệt sẽ hiển thị ở đây"}
        {activeTab === "rejected" && "Các phiếu bị từ chối sẽ hiển thị ở đây"}
        {activeTab === "completed" &&
          "Các phiếu đã hoàn thành sẽ hiển thị ở đây"}
      </p>
      {activeTab === "pending" && (
        <Link
          to="/nurse/health-services/create/vaccination"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FiShield className="w-4 h-4 mr-2" />
          Tạo phiếu tiêm mới
        </Link>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {!parentSearchTerm && (
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm phiếu tiêm chủng..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={loadAllInjectionForms}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FiRefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            Làm mới
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sắp tới
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {stats.upcoming}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đã từ chối
              </p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {stats.rejected}
              </p>
            </div>
            <FiXCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hoàn thành
              </p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {stats.completed}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng học sinh
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            {
              id: "pending",
              label: "Chờ duyệt",
              count: stats.pending,
              icon: FiClock,
            },
            {
              id: "upcoming",
              label: "Sắp tới",
              count: stats.upcoming,
              icon: FiCalendar,
            },
            {
              id: "rejected",
              label: "Đã từ chối",
              count: stats.rejected,
              icon: FiXCircle,
            },
            {
              id: "completed",
              label: "Đã hoàn thành",
              count: stats.completed,
              icon: FiCheckCircle,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredForms.map(renderInjectionFormCard)}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default VaccinationManagement;
