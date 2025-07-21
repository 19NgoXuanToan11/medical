import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiInfo,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const HealthServices = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [activeServiceType, setActiveServiceType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [pendingConsents, setPendingConsents] = useState([]);

  // Load data from API
  useEffect(() => {
    const loadHealthServices = async () => {
      setLoading(true);

      try {
        // For now, set empty arrays
        setUpcomingServices([]);
        setServiceHistory([]);
        setPendingConsents([]);
      } catch (error) {
        console.error("Error loading health services:", error);
        setUpcomingServices([]);
        setServiceHistory([]);
        setPendingConsents([]);
      } finally {
        setLoading(false);
      }
    };

    loadHealthServices();
  }, []);

  // Filter services based on active service type
  const filterServicesByType = (services) => {
    if (activeServiceType === "all") return services;
    return services.filter((service) => service.type === activeServiceType);
  };

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
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    if (type === "vaccination") {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
    }
  };

  const getStatusBadge = (status, consentStatus = null) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    if (status === "completed") {
      return `${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300`;
    } else if (status === "scheduled") {
      if (consentStatus === "pending") {
        return `${baseClasses} bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300`;
      } else if (consentStatus === "confirmed") {
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      }
    }
    return `${baseClasses} bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300`;
  };

  const getStatusLabel = (status, consentStatus = null) => {
    if (status === "completed") return "Đã hoàn thành";
    if (status === "scheduled") {
      if (consentStatus === "pending") return "Chờ xác nhận";
      if (consentStatus === "confirmed") return "Đã xác nhận";
    }
    return "Đang chờ duyệt";
  };

  const handleConsent = (serviceId, action) => {
    if (action === "approve") {
      // Update the service consent status
      setUpcomingServices((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? { ...service, consentStatus: "confirmed" }
            : service
        )
      );

      // Remove from pending consents
      setPendingConsents((prev) =>
        prev.filter((consent) => consent.id !== serviceId)
      );
    }
  };

  // Render service type filter tabs
  const renderServiceTypeFilter = () => {
    const serviceTypes = [
      { id: "vaccination", label: "Tiêm chủng", icon: FiShield },
      { id: "health_check", label: "Y tế định kỳ", icon: FiActivity },
      { id: "all", label: "Tất cả", icon: FiFileText },
    ];

    return (
      <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-lg p-1 mb-4">
        {serviceTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveServiceType(type.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex-1 justify-center ${
              activeServiceType === type.id
                ? "bg-white text-primary-700 shadow-sm dark:bg-neutral-800 dark:text-primary-400"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            }`}
          >
            <type.icon className="w-4 h-4 mr-2" />
            {type.label}
            {type.id !== "all" && (
              <span className="ml-2 bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 text-xs px-2 py-1 rounded-full">
                {type.id === "vaccination"
                  ? activeTab === "upcoming"
                    ? upcomingServices.filter((s) => s.type === "vaccination")
                        .length
                    : activeTab === "history"
                    ? serviceHistory.filter((s) => s.type === "vaccination")
                        .length
                    : pendingConsents.filter((s) => s.type === "vaccination")
                        .length
                  : activeTab === "upcoming"
                  ? upcomingServices.filter((s) => s.type === "health_check")
                      .length
                  : activeTab === "history"
                  ? serviceHistory.filter((s) => s.type === "health_check")
                      .length
                  : pendingConsents.filter((s) => s.type === "health_check")
                      .length}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  const renderServiceCards = (services) => {
    const filteredServices = filterServicesByType(services);

    if (filteredServices.length === 0) {
      const emptyMessage =
        activeServiceType === "vaccination"
          ? "Không có dịch vụ tiêm chủng nào"
          : activeServiceType === "health_check"
          ? "Không có dịch vụ y tế định kỳ nào"
          : "Không có dịch vụ nào";

      return (
        <div className="text-center py-12">
          <div className="text-neutral-400 dark:text-neutral-500 text-sm mb-2">
            {emptyMessage}
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            {activeTab === "upcoming" ? "trong thời gian tới" : "trong lịch sử"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden hover:shadow-xl transition-all duration-300"
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
                      {getServiceIcon(service.type)}
                      <span className="ml-1">
                        {getServiceTypeLabel(service.type)}
                      </span>
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {service.title}
                    </h3>
                  </div>
                </div>
                <span
                  className={getStatusBadge(
                    service.status,
                    service.consentStatus
                  )}
                >
                  {getStatusLabel(service.status, service.consentStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <FiUser className="w-4 h-4 mr-2" />
                  <span>
                    {service.studentName} - Lớp {service.class}
                  </span>
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>{service.date}</span>
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>{service.time}</span>
                </div>
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  <span>{service.location}</span>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <FiInfo className="w-4 h-4 mr-2 mt-0.5 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-xs text-neutral-600 dark:text-neutral-300">
                    {service.description}
                  </p>
                </div>
              </div>

              {service.type === "health_check" && service.checkItems && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Các hạng mục kiểm tra:
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

              {service.consentStatus === "pending" &&
                service.requiresConsent && (
                  <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-600 dark:text-amber-400">
                        <FiAlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-xs font-medium">
                          Cần xác nhận đồng ý
                        </span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleConsent(service.id, "reject")}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleConsent(service.id, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                        >
                          Đồng ý
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              {service.findings && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-3">
                  <h4 className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Phát hiện:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                    {service.findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.recommendations && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Khuyến nghị:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {service.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.notes && service.status === "completed" && (
                <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <strong>Ghi chú:</strong> {service.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPendingConsents = () => {
    const filteredConsents = filterServicesByType(pendingConsents);

    if (filteredConsents.length === 0) {
      const emptyMessage =
        activeServiceType === "vaccination"
          ? "Không có dịch vụ tiêm chủng nào cần xác nhận"
          : activeServiceType === "health_check"
          ? "Không có dịch vụ y tế định kỳ nào cần xác nhận"
          : pendingConsents.length === 0
          ? "Tất cả xác nhận đã được hoàn thành"
          : "Không có dịch vụ nào cần xác nhận";

      return (
        <div className="text-center py-12">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-400 dark:text-green-500 mb-4" />
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            {pendingConsents.length === 0
              ? "Không có dịch vụ y tế nào cần xác nhận đồng ý"
              : "Trong danh mục đã chọn"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
            <p className="text-amber-800 dark:text-amber-200 font-medium">
              Bạn có {filteredConsents.length} dịch vụ y tế cần xác nhận đồng ý
            </p>
          </div>
        </div>

        {filteredConsents.map((consent) => (
          <div
            key={consent.id}
            className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-600 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    consent.type === "vaccination"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}
                >
                  {getServiceIcon(consent.type)}
                </div>
                <div>
                  <span className={getServiceTypeBadge(consent.type)}>
                    {getServiceTypeLabel(consent.type)}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                    {consent.title}
                  </h3>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  consent.urgency === "high"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : consent.urgency === "medium"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                }`}
              >
                {consent.urgency === "high"
                  ? "Khẩn cấp"
                  : consent.urgency === "medium"
                  ? "Trung bình"
                  : "Bình thường"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <FiUser className="w-4 h-4 mr-2" />
                <span className="mr-6">{consent.studentName}</span>
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>Hạn xác nhận: {consent.dueDate}</span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleConsent(consent.id, "reject")}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleConsent(consent.id, "approve")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-200"
                >
                  Đồng ý
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Dịch vụ Y tế
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Quản lý và theo dõi các dịch vụ y tế của con bạn bao gồm tiêm chủng và
          khám sức khỏe định kỳ
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                Tiêm chủng
              </p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {upcomingServices.filter((s) => s.type === "vaccination")
                  .length +
                  serviceHistory.filter((s) => s.type === "vaccination").length}
              </p>
            </div>
            <FiShield className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-xs font-medium">
                Y tế định kỳ
              </p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">
                {upcomingServices.filter((s) => s.type === "health_check")
                  .length +
                  serviceHistory.filter((s) => s.type === "health_check")
                    .length}
              </p>
            </div>
            <FiActivity className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 dark:text-amber-400 text-xs font-medium">
                Cần xác nhận
              </p>
              <p className="text-xl font-bold text-amber-900 dark:text-amber-100">
                {pendingConsents.length}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            {[
              { id: "upcoming", label: "Dịch vụ sắp tới", icon: FiCalendar },
              { id: "history", label: "Lịch sử dịch vụ", icon: FiFileText },
              {
                id: "consents",
                label: "Cần xác nhận",
                icon: FiAlertCircle,
                badge: pendingConsents.length,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setActiveServiceType("all"); // Reset filter when switching tabs
                }}
                className={`relative flex items-center px-6 py-4 text-xs font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {tab.badge}
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
          ) : (
            <>
              {(activeTab === "upcoming" || activeTab === "history") && (
                <>
                  {renderServiceTypeFilter()}
                  {activeTab === "upcoming" &&
                    renderServiceCards(upcomingServices)}
                  {activeTab === "history" &&
                    renderServiceCards(serviceHistory)}
                </>
              )}
              {activeTab === "consents" && (
                <>
                  {renderServiceTypeFilter()}
                  {renderPendingConsents()}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthServices;
