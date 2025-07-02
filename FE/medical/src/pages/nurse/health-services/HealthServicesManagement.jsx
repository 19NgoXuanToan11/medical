import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiShield,
  FiEye,
  FiEdit,
  FiPlay,
  FiPause,
  FiUser,
  FiMapPin,
  FiInfo,
  FiAlertCircle,
} from "react-icons/fi";

const HealthServicesManagement = () => {
  const [activeMainTab, setActiveMainTab] = useState("vaccination"); // vaccination, health_check
  const [activeSubTab, setActiveSubTab] = useState("scheduled");
  const [healthServices, setHealthServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load health services data
  useEffect(() => {
    const loadHealthServices = async () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        setHealthServices([
          // Scheduled Services
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
            id: 2,
            type: "health_check",
            title: "Khám sức khỏe định kỳ học kỳ 1",
            scheduledDate: "2023-07-15",
            scheduledTime: "08:00",
            status: "scheduled",
            grades: ["2A", "2B"],
            totalStudents: 60,
            confirmedParents: 55,
            location: "Phòng y tế trường",
            description: "Khám sức khỏe định kỳ học kỳ 1 năm học 2023-2024",
            checkItems: [
              "Chiều cao",
              "Cân nặng",
              "Thị lực",
              "Răng miệng",
              "Tim mạch",
            ],
            requiresConsent: true,
            estimatedDuration: 180,
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

          // Active Services
          {
            id: 4,
            type: "health_check",
            title: "Khám sức khỏe khối lớp 3",
            scheduledDate: "2023-07-10",
            scheduledTime: "08:00",
            status: "active",
            grades: ["3A", "3B", "3C"],
            totalStudents: 80,
            completedStudents: 35,
            location: "Phòng y tế trường",
            description: "Khám sức khỏe định kỳ cho học sinh khối lớp 3",
            checkItems: [
              "Chiều cao",
              "Cân nặng",
              "Thị lực",
              "Răng miệng",
              "Tim mạch",
              "Phổi",
            ],
            startTime: "08:00",
            estimatedDuration: 240,
          },

          // Completed Services
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
          {
            id: 6,
            type: "health_check",
            title: "Khám sức khỏe học kỳ 2",
            scheduledDate: "2023-05-15",
            status: "completed",
            grades: ["1A", "1B"],
            totalStudents: 65,
            completedStudents: 65,
            location: "Phòng y tế trường",
            description: "Khám sức khỏe định kỳ học kỳ 2 năm học 2022-2023",
            checkItems: ["Chiều cao", "Cân nặng", "Thị lực", "Răng miệng"],
            completedDate: "2023-05-15",
            abnormalCases: 8,
            notes: "Phát hiện 8 trường hợp cần theo dõi",
          },
        ]);

        setLoading(false);
      }, 1000);
    };

    loadHealthServices();
  }, []);

  const getServiceIcon = (type) => {
    return type === "vaccination" ? (
      <FiShield className="w-5 h-5" />
    ) : (
      <FiActivity className="w-5 h-5" />
    );
  };

  const getServiceTypeLabel = (type) => {
    return type === "vaccination" ? "Tiêm chủng" : "Khám sức khỏe";
  };

  const getServiceTypeBadge = (type) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    if (type === "vaccination") {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "scheduled":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case "active":
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "scheduled":
        return "Đã lên lịch";
      case "active":
        return "Đang thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const filteredServices = healthServices.filter((service) => {
    // Filter by service type (main tab)
    if (service.type !== activeMainTab) return false;

    // Filter by status (sub tab)
    if (activeSubTab === "scheduled" && service.status !== "scheduled")
      return false;
    if (activeSubTab === "active" && service.status !== "active") return false;
    if (activeSubTab === "completed" && service.status !== "completed")
      return false;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        service.title.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term) ||
        service.grades.some((grade) => grade.toLowerCase().includes(term))
      );
    }

    return true;
  });

  // Calculate statistics based on current main tab
  const getStats = () => {
    const currentTypeServices = healthServices.filter(
      (s) => s.type === activeMainTab
    );

    const scheduledCount = currentTypeServices.filter(
      (s) => s.status === "scheduled"
    ).length;
    const activeCount = currentTypeServices.filter(
      (s) => s.status === "active"
    ).length;
    const completedThisMonth = currentTypeServices.filter((s) => {
      if (s.status !== "completed") return false;
      const completedDate = new Date(s.completedDate || s.scheduledDate);
      const now = new Date();
      return (
        completedDate.getMonth() === now.getMonth() &&
        completedDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const totalStudents = currentTypeServices.reduce((sum, service) => {
      if (service.status === "scheduled" || service.status === "active") {
        return sum + service.totalStudents;
      }
      return sum;
    }, 0);

    return {
      scheduled: scheduledCount,
      active: activeCount,
      completedThisMonth,
      totalStudents,
    };
  };

  const stats = getStats();

  const handleStartService = (serviceId) => {
    setHealthServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: "active",
              startTime: new Date().toISOString(),
            }
          : service
      )
    );
  };

  const handleCompleteService = (serviceId) => {
    setHealthServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              status: "completed",
              completedDate: new Date().toISOString(),
            }
          : service
      )
    );
  };

  const renderServiceCard = (service) => (
    <div
      key={service.id}
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                service.type === "vaccination"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                  : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              }`}
            >
              {getServiceIcon(service.type)}
            </div>
            <div>
              <span className={getServiceTypeBadge(service.type)}>
                {getServiceTypeLabel(service.type)}
              </span>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                {service.title}
              </h3>
            </div>
          </div>
          <span className={getStatusBadge(service.status)}>
            {getStatusLabel(service.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiCalendar className="w-4 h-4 mr-2" />
            <span>{service.scheduledDate}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiClock className="w-4 h-4 mr-2" />
            <span>{service.scheduledTime || service.startTime}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiUsers className="w-4 h-4 mr-2" />
            <span>Lớp: {service.grades.join(", ")}</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <FiMapPin className="w-4 h-4 mr-2" />
            <span>{service.location}</span>
          </div>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            {service.description}
          </p>
        </div>

        {/* Service-specific information */}
        {service.type === "vaccination" && service.vaccineInfo && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Thông tin vắc-xin:
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              {service.vaccineInfo}
            </p>
          </div>
        )}

        {service.type === "health_check" && service.checkItems && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Hạng mục kiểm tra:
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.checkItems.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress information */}
        {service.status === "scheduled" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Phụ huynh đã xác nhận</span>
              <span>
                {service.confirmedParents}/{service.totalStudents}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (service.confirmedParents / service.totalStudents) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {service.status === "active" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <span>Đã hoàn thành</span>
              <span>
                {service.completedStudents}/{service.totalStudents}
              </span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
              <div
                className="bg-amber-600 dark:bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (service.completedStudents / service.totalStudents) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {service.status === "completed" && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-600 dark:text-neutral-400">
                Kết quả hoàn thành
              </span>
              <span className="text-green-600 dark:text-green-400 font-semibold">
                {service.vaccinatedStudents || service.completedStudents}/
                {service.totalStudents}
              </span>
            </div>
            {service.abnormalCases && (
              <div className="text-sm text-amber-600 dark:text-amber-400">
                <FiAlertCircle className="w-4 h-4 inline mr-1" />
                {service.abnormalCases} trường hợp bất thường
              </div>
            )}
          </div>
        )}

        {service.notes && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start">
              <FiInfo className="w-4 h-4 mr-2 mt-0.5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {service.notes}
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-600">
          <div className="flex space-x-3">
            <Link
              to={`/nurse/health-services/${service.id}`}
              className="inline-flex items-center px-3 py-2 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-200"
            >
              <FiEye className="w-4 h-4 mr-1" />
              Chi tiết
            </Link>

            {service.status === "scheduled" && (
              <Link
                to={`/nurse/health-services/${service.id}/edit`}
                className="inline-flex items-center px-3 py-2 text-sm border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors duration-200"
              >
                <FiEdit className="w-4 h-4 mr-1" />
                Chỉnh sửa
              </Link>
            )}
          </div>

          <div className="flex space-x-2">
            {service.status === "scheduled" && (
              <button
                onClick={() => handleStartService(service.id)}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
              >
                <FiPlay className="w-4 h-4 mr-1" />
                Bắt đầu
              </button>
            )}

            {service.status === "active" && (
              <button
                onClick={() => handleCompleteService(service.id)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
              >
                <FiCheckCircle className="w-4 h-4 mr-1" />
                Hoàn thành
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500 mb-4">
        {activeSubTab === "scheduled" && <FiCalendar className="w-12 h-12" />}
        {activeSubTab === "active" && <FiClock className="w-12 h-12" />}
        {activeSubTab === "completed" && (
          <FiCheckCircle className="w-12 h-12" />
        )}
      </div>
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
        {activeSubTab === "scheduled" &&
          `Không có ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } nào được lên lịch`}
        {activeSubTab === "active" &&
          `Không có ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } nào đang thực hiện`}
        {activeSubTab === "completed" &&
          `Chưa có ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } nào hoàn thành`}
      </h3>
      <p className="text-neutral-500 dark:text-neutral-400 mb-6">
        {activeSubTab === "scheduled" &&
          `Tạo lịch ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } mới để bắt đầu`}
        {activeSubTab === "active" &&
          `Các ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } đang thực hiện sẽ hiển thị ở đây`}
        {activeSubTab === "completed" &&
          `Lịch sử các ${
            activeMainTab === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
          } đã hoàn thành sẽ hiển thị ở đây`}
      </p>
      {activeSubTab === "scheduled" && (
        <Link
          to="/nurse/health-services/create"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Tạo dịch vụ mới
        </Link>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              Quản lý{" "}
              {activeMainTab === "vaccination" ? "Tiêm chủng" : "Y tế định kỳ"}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              {activeMainTab === "vaccination"
                ? "Quản lý lịch tiêm chủng và theo dõi tiến độ tiêm phòng của học sinh"
                : "Quản lý khám sức khỏe định kỳ và theo dõi tình trạng sức khỏe học sinh"}
            </p>
          </div>
          <Link
            to="/nurse/health-services/create"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Tạo dịch vụ mới
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Đã lên lịch
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {stats.scheduled}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Đang thực hiện
              </p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {stats.active}
              </p>
            </div>
            <FiClock className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Hoàn thành tháng này
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {stats.completedThisMonth}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Tổng học sinh
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {stats.totalStudents}
              </p>
            </div>
            <FiUsers className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs and Sub Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {/* Main Service Type Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              {
                id: "vaccination",
                label: "Tiêm chủng",
                icon: FiShield,
                count: healthServices.filter((s) => s.type === "vaccination")
                  .length,
              },
              {
                id: "health_check",
                label: "Y tế định kỳ",
                icon: FiActivity,
                count: healthServices.filter((s) => s.type === "health_check")
                  .length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeMainTab === tab.id
                    ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sub Status Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50">
          <nav className="flex">
            {[
              {
                id: "scheduled",
                label: "Đã lên lịch",
                icon: FiCalendar,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "scheduled"
                ).length,
              },
              {
                id: "active",
                label: "Đang thực hiện",
                icon: FiClock,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "active"
                ).length,
              },
              {
                id: "completed",
                label: "Đã hoàn thành",
                icon: FiCheckCircle,
                count: healthServices.filter(
                  (s) => s.type === activeMainTab && s.status === "completed"
                ).length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeSubTab === tab.id
                    ? "bg-white dark:bg-neutral-800 border-b-2 border-primary-500 text-primary-700 dark:text-primary-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-600/50"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-primary-100 text-primary-800 rounded-full dark:bg-primary-900 dark:text-primary-200">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(renderServiceCard)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthServicesManagement;
