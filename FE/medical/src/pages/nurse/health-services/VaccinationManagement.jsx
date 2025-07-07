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
  FiPlay,
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

      // Simulate API call
      setTimeout(() => {
        setVaccinations([
          // Scheduled Vaccinations
          {
            id: 1,
            type: "vaccination",
            title: "Tiêm vắc-xin cúm mùa",
            scheduledDate: "2023-07-20",
            scheduledTime: "09:00",
            status: "scheduled",
            grades: ["1A", "1B", "1C"],
            totalStudents: 75,
            confirmedParents: 68,
            location: "Phòng y tế trường",
            vaccineInfo: "Vắc-xin cúm mùa 2023",
            description: "Tiêm phòng cúm mùa cho học sinh khối lớp 1",
            requiresConsent: true,
            estimatedDuration: 120,
          },
          {
            id: 3,
            type: "vaccination",
            title: "Tiêm nhắc vắc-xin MMR",
            scheduledDate: "2023-07-25",
            scheduledTime: "10:00",
            status: "scheduled",
            grades: ["5A", "5B"],
            totalStudents: 52,
            confirmedParents: 45,
            location: "Phòng y tế trường",
            vaccineInfo: "Vắc-xin MMR (Sởi - Quai bị - Rubella)",
            description: "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 5",
            requiresConsent: true,
            estimatedDuration: 90,
          },

          // Completed Vaccinations
          {
            id: 5,
            type: "vaccination",
            title: "Tiêm vắc-xin Viêm gan B",
            scheduledDate: "2023-06-20",
            status: "completed",
            grades: ["4A", "4B", "4C"],
            totalStudents: 85,
            vaccinatedStudents: 78,
            location: "Phòng y tế trường",
            vaccineInfo: "Vắc-xin Viêm gan B",
            description: "Tiêm nhắc vắc-xin Viêm gan B cho học sinh khối lớp 4",
            completedDate: "2023-06-20",
            notes: "Có 7 học sinh vắng mặt",
          },
        ]);

        setLoading(false);
      }, 1000);
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

  const handleStartVaccination = (vaccinationId) => {
    setVaccinations((prev) =>
      prev.map((vaccination) =>
        vaccination.id === vaccinationId
          ? {
              ...vaccination,
              status: "active",
              startTime: new Date().toISOString(),
            }
          : vaccination
      )
    );
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
            <span className={getStatusBadge(vaccination.status)}>
              {getStatusLabel(vaccination.status)}
            </span>
          </div>
        </div>
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
          <span>Lớp: {vaccination.grades.join(", ")}</span>
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

      {/* Progress */}
      {vaccination.status === "scheduled" && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Phụ huynh xác nhận</span>
            <span>
              {vaccination.confirmedParents}/{vaccination.totalStudents}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${Math.round(
                  (vaccination.confirmedParents / vaccination.totalStudents) *
                    100
                )}%`,
              }}
            />
          </div>
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
          {vaccination.status === "scheduled" && (
            <button
              onClick={() => handleStartVaccination(vaccination.id)}
              className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              <FiPlay className="w-3 h-3 mr-1 inline" />
              Bắt đầu
            </button>
          )}
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
