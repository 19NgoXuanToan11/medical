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
} from "react-icons/fi";

const VaccinationManagement = ({ searchTerm: parentSearchTerm = "" }) => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [vaccinations, setVaccinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load vaccination data
  useEffect(() => {
    const loadVaccinations = async () => {
      setLoading(true);

      try {
        // Import injectionService dynamically to avoid circular dependency
        const { injectionFormService } = await import(
          "../../../utils/api/injection/injectionService"
        );
        const result = await injectionFormService.getVaccinationSchedules();

        if (result.success) {
          // Transform data to match UI expectations
          const transformedVaccinations = result.data.map((schedule) => ({
            id: schedule.formId,
            title: schedule.title,
            description: schedule.description,
            scheduledDate: schedule.scheduledDate
              ? new Date(schedule.scheduledDate).toLocaleDateString("vi-VN")
              : "Chưa xác định",
            scheduledTime: schedule.startTime || "08:00",
            location: schedule.location,
            status:
              schedule.status === "đang chờ"
                ? "scheduled"
                : schedule.status === "đã duyệt"
                ? "active"
                : schedule.status === "hoàn thành"
                ? "completed"
                : "scheduled",
            totalStudents: schedule.totalStudents || 0,
            grades: (() => {
              // Handle schedule.grades first (if it exists and is not empty)
              if (schedule.grades && schedule.grades.length > 0) {
                const processedGrades = schedule.grades.map((grade) =>
                  grade.replace("grade-", "")
                );
                return processedGrades;
              }
              // Handle schedule.gradeIds if grades is empty or doesn't exist
              if (schedule.gradeIds) {
                try {
                  const parsedGrades = JSON.parse(schedule.gradeIds).map(
                    (gradeId) => gradeId.replace("grade-", "")
                  );
                  return parsedGrades;
                } catch (error) {
                  console.error("Error parsing gradeIds:", error);
                  return [];
                }
              }
              return [];
            })(),
          }));

          setVaccinations(transformedVaccinations);
        } else {
          console.warn("Failed to load vaccinations:", result.message);
          setVaccinations([]);
        }
      } catch (error) {
        console.error("Error loading vaccinations:", error);
        setVaccinations([]);
      } finally {
        setLoading(false);
      }
    };

    loadVaccinations();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      scheduled:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      active:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${
      badges[status] || badges.scheduled
    }`;
  };

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: "Đang chờ duyệt",
      active: "Đang thực hiện",
      completed: "Đã hoàn thành",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const filteredVaccinations = vaccinations.filter((vaccination) => {
    // Filter by status
    if (activeTab !== "all" && vaccination.status !== activeTab) return false;

    // Filter by search term
    if (parentSearchTerm) {
      const term = parentSearchTerm.toLowerCase();
      return (
        vaccination.title.toLowerCase().includes(term) ||
        vaccination.description.toLowerCase().includes(term) ||
        vaccination.grades.some((grade) => grade.toLowerCase().includes(term))
      );
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    scheduled: vaccinations.filter((v) => v.status === "scheduled").length,
    active: vaccinations.filter((v) => v.status === "active").length,
    completed: vaccinations.filter((v) => v.status === "completed").length,
    totalStudents: vaccinations
      .filter((v) => v.status === "scheduled" || v.status === "active")
      .reduce((sum, v) => sum + v.totalStudents, 0),
  };

  const handleCompleteVaccination = (vaccinationId) => {
    setVaccinations((prev) =>
      prev.map((vaccination) =>
        vaccination.id === vaccinationId
          ? {
              ...vaccination,
              status: "completed",
              completedDate: new Date().toISOString(),
            }
          : vaccination
      )
    );
  };

  const renderVaccinationCard = (vaccination) => (
    <div
      key={vaccination.id}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {vaccination.title}
            </h3>
          </div>
        </div>
        <span className={getStatusBadge(vaccination.status)}>
          {getStatusLabel(vaccination.status)}
        </span>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-2" />
          <span>{vaccination.scheduledDate}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="w-4 h-4 mr-2" />
          <span>{vaccination.scheduledTime || vaccination.startTime}</span>
        </div>
        <div className="flex items-center">
          <FiUsers className="w-4 h-4 mr-2" />
          <span>Khối: {vaccination.grades.join(", ")}</span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="w-4 h-4 mr-2" />
          <span>{vaccination.location}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {vaccination.description}
      </p>

      {/* Vaccine Information */}
      {vaccination.vaccineInfo && (
        <div className="mb-3">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Vắc-xin:{" "}
          </span>
          <span className="text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
            {vaccination.vaccineInfo}
          </span>
        </div>
      )}

      {vaccination.status === "active" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Đã hoàn thành</span>
            <span>
              {vaccination.completedStudents}/{vaccination.totalStudents}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (vaccination.completedStudents / vaccination.totalStudents) *
                    100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {vaccination.status === "completed" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600 dark:text-gray-400">Kết quả</span>
            <span className="text-green-600 dark:text-green-400 font-medium">
              {vaccination.vaccinatedStudents}/{vaccination.totalStudents}
            </span>
          </div>
        </div>
      )}

      {/* Notes */}
      {vaccination.notes && (
        <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
          <div className="flex items-start">
            <FiInfo className="w-3 h-3 mr-2 mt-0.5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              {vaccination.notes}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <Link
            to={`/nurse/health-services/${
              vaccination.formId || vaccination.id
            }`}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            <FiEye className="w-3 h-3 mr-1 inline" />
            Chi tiết
          </Link>
          {vaccination.status === "scheduled" && (
            <Link
              to={`/nurse/health-services/${vaccination.id}/edit`}
              className="text-xs px-3 py-1 border border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
            >
              <FiEdit className="w-3 h-3 mr-1 inline" />
              Sửa
            </Link>
          )}
        </div>

        <div className="flex space-x-2">
          {vaccination.status === "active" && (
            <button
              onClick={() => handleCompleteVaccination(vaccination.id)}
              className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              <FiCheckCircle className="w-3 h-3 mr-1 inline" />
              Hoàn thành
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <FiShield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Chưa có lịch tiêm chủng
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Tạo lịch tiêm chủng cho học sinh
      </p>
      <Link
        to="/nurse/health-services/create/vaccination"
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <FiShield className="w-4 h-4 mr-2" />
        Tạo lịch tiêm mới
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chờ duyệt
              </p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {stats.scheduled}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang thực hiện
              </p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {stats.active}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
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
            { id: "scheduled", label: "Chờ duyệt", count: stats.scheduled },
            { id: "active", label: "Đang thực hiện", count: stats.active },
            { id: "completed", label: "Đã hoàn thành", count: stats.completed },
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
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 text-xs rounded-full">
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
        ) : filteredVaccinations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVaccinations.map(renderVaccinationCard)}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default VaccinationManagement;
