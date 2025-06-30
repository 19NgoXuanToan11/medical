import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiInfo,
  FiCheckCircle,
<<<<<<< HEAD
  FiAlertCircle,
  FiFileText,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const HealthServices = () => {
  const [activeTab, setActiveTab] = useState("health_check");
  const [activeSubTab, setActiveSubTab] = useState("upcoming");
=======
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiInfo, 
  FiCheckCircle, 
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
  FiAlertCircle,
  FiFileText,
  FiActivity,
  FiShield,
} from "react-icons/fi";

const HealthServices = () => {
<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState("upcoming");
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
  const [activeTab, setActiveTab] = useState("health_check");
  const [activeSubTab, setActiveSubTab] = useState("upcoming");
>>>>>>> 512000a (edit nurse role medical service management interface)
  const [loading, setLoading] = useState(true);
  const [upcomingServices, setUpcomingServices] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [pendingConsents, setPendingConsents] = useState([]);

  // Load data from API
  useEffect(() => {
    const loadHealthServices = async () => {
      setLoading(true);
<<<<<<< HEAD
<<<<<<< HEAD

=======
      
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======

>>>>>>> 512000a (edit nurse role medical service management interface)
      // Simulate API call
      setTimeout(() => {
        // Upcoming services (both vaccination and health check)
        setUpcomingServices([
          {
            id: 1,
            type: "vaccination",
            title: "Tiêm vắc-xin cúm mùa",
            studentName: "Nguyễn Văn An",
            studentId: "HS12345",
            class: "2A",
            date: "2023-07-20",
            time: "09:00",
            location: "Phòng y tế trường",
            status: "scheduled",
<<<<<<< HEAD
<<<<<<< HEAD
            description:
              "Vaccine phòng bệnh cúm mùa cho trẻ em trong độ tuổi tiểu học",
            requiresConsent: true,
            consentStatus: "pending",
            notes: "Cần đảm bảo con không bị sốt trong 48h trước khi tiêm",
=======
            description: "Vaccine phòng bệnh cúm mùa cho trẻ em trong độ tuổi tiểu học",
            requiresConsent: true,
            consentStatus: "pending",
            notes: "Cần đảm bảo con không bị sốt trong 48h trước khi tiêm"
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            description:
              "Vaccine phòng bệnh cúm mùa cho trẻ em trong độ tuổi tiểu học",
            requiresConsent: true,
            consentStatus: "pending",
            notes: "Cần đảm bảo con không bị sốt trong 48h trước khi tiêm",
>>>>>>> 512000a (edit nurse role medical service management interface)
          },
          {
            id: 2,
            type: "health_check",
            title: "Khám sức khỏe định kỳ",
            studentName: "Nguyễn Văn An",
<<<<<<< HEAD
<<<<<<< HEAD
            studentId: "HS12345",
=======
            studentId: "HS12345", 
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            studentId: "HS12345",
>>>>>>> 512000a (edit nurse role medical service management interface)
            class: "2A",
            date: "2023-07-15",
            time: "08:30",
            location: "Phòng y tế trường",
            status: "scheduled",
            description: "Khám sức khỏe định kỳ học kỳ 1 năm học 2023-2024",
            requiresConsent: true,
            consentStatus: "confirmed",
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
            checkItems: [
              "Chiều cao",
              "Cân nặng",
              "Thị lực",
              "Răng miệng",
              "Tim mạch",
            ],
<<<<<<< HEAD
=======
            checkItems: ["Chiều cao", "Cân nặng", "Thị lực", "Răng miệng", "Tim mạch"]
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
          },
          {
            id: 3,
            type: "vaccination",
            title: "Tiêm nhắc vắc-xin MMR",
            studentName: "Nguyễn Minh Cường",
            studentId: "HS12347",
            class: "3C",
            date: "2023-07-25",
            time: "10:30",
            location: "Phòng y tế trường",
            status: "scheduled",
            description: "Tiêm nhắc mũi 2 vắc-xin MMR cho học sinh khối lớp 3",
            requiresConsent: true,
<<<<<<< HEAD
<<<<<<< HEAD
            consentStatus: "pending",
          },
=======
            consentStatus: "pending"
          }
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            consentStatus: "pending",
          },
>>>>>>> 512000a (edit nurse role medical service management interface)
        ]);

        // Service history
        setServiceHistory([
          {
            id: 10,
            type: "vaccination",
            title: "Tiêm vắc-xin Viêm gan B",
            studentName: "Nguyễn Văn An",
            studentId: "HS12345",
<<<<<<< HEAD
<<<<<<< HEAD
            class: "2A",
            date: "2023-05-20",
            status: "completed",
            result: "Thành công",
            notes: "Không có phản ứng phụ",
=======
            class: "2A", 
            date: "2023-05-20",
            status: "completed",
            result: "Thành công",
            notes: "Không có phản ứng phụ"
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            class: "2A",
            date: "2023-05-20",
            status: "completed",
            result: "Thành công",
            notes: "Không có phản ứng phụ",
>>>>>>> 512000a (edit nurse role medical service management interface)
          },
          {
            id: 11,
            type: "health_check",
            title: "Khám sức khỏe học kỳ 2",
            studentName: "Nguyễn Văn An",
            studentId: "HS12345",
            class: "2A",
            date: "2023-04-15",
            status: "completed",
            result: "Có dấu hiệu bất thường",
            findings: [
              "Thị lực mắt trái giảm nhẹ (8/10)",
<<<<<<< HEAD
<<<<<<< HEAD
              "Cần theo dõi tình trạng cận thị",
            ],
            recommendations: [
              "Hạn chế thời gian sử dụng thiết bị điện tử",
              "Tái khám mắt sau 3 tháng",
            ],
          },
          {
            id: 12,
            type: "vaccination",
=======
              "Cần theo dõi tình trạng cận thị"
=======
              "Cần theo dõi tình trạng cận thị",
>>>>>>> 512000a (edit nurse role medical service management interface)
            ],
            recommendations: [
              "Hạn chế thời gian sử dụng thiết bị điện tử",
              "Tái khám mắt sau 3 tháng",
            ],
          },
          {
            id: 12,
<<<<<<< HEAD
            type: "vaccination", 
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            type: "vaccination",
>>>>>>> 512000a (edit nurse role medical service management interface)
            title: "Tiêm vắc-xin HPV",
            studentName: "Nguyễn Minh Cường",
            studentId: "HS12347",
            class: "3C",
            date: "2023-03-10",
            status: "completed",
<<<<<<< HEAD
<<<<<<< HEAD
            result: "Thành công",
          },
=======
            result: "Thành công"
          }
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            result: "Thành công",
          },
>>>>>>> 512000a (edit nurse role medical service management interface)
        ]);

        // Pending consents
        setPendingConsents([
          {
            id: 1,
            type: "vaccination",
            title: "Tiêm vắc-xin cúm mùa",
            studentName: "Nguyễn Văn An",
            dueDate: "2023-07-18",
<<<<<<< HEAD
<<<<<<< HEAD
            urgency: "medium",
          },
          {
            id: 3,
            type: "vaccination",
            title: "Tiêm nhắc vắc-xin MMR",
            studentName: "Nguyễn Minh Cường",
            dueDate: "2023-07-23",
            urgency: "high",
          },
=======
            urgency: "medium"
=======
            urgency: "medium",
>>>>>>> 512000a (edit nurse role medical service management interface)
          },
          {
            id: 3,
            type: "vaccination",
            title: "Tiêm nhắc vắc-xin MMR",
            studentName: "Nguyễn Minh Cường",
            dueDate: "2023-07-23",
<<<<<<< HEAD
            urgency: "high"
          }
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            urgency: "high",
          },
>>>>>>> 512000a (edit nurse role medical service management interface)
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
<<<<<<< HEAD
<<<<<<< HEAD
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

=======
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

>>>>>>> 512000a (edit nurse role medical service management interface)
    if (type === "vaccination") {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
    } else {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
    }
  };

  const getStatusBadge = (status, consentStatus = null) => {
<<<<<<< HEAD
<<<<<<< HEAD
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

=======
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

>>>>>>> 512000a (edit nurse role medical service management interface)
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
    return "Đã lên lịch";
  };

  const handleConsent = (serviceId, action) => {
    // Update consent status
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
    setUpcomingServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              consentStatus: action === "approve" ? "confirmed" : "rejected",
            }
<<<<<<< HEAD
          : service
      )
    );

    // Remove from pending consents
    setPendingConsents((prev) =>
      prev.filter((consent) => consent.id !== serviceId)
    );
  };

  // Filter services by type
  const getFilteredServices = (services, type) => {
    return services.filter((service) => service.type === type);
  };

  const getFilteredConsents = (consents, type) => {
    return consents.filter((consent) => consent.type === type);
  };

  const renderServiceCards = (services, showConsent = true) => {
    if (services.length === 0) {
=======
    setUpcomingServices(prev => 
      prev.map(service => 
        service.id === serviceId 
          ? { ...service, consentStatus: action === "approve" ? "confirmed" : "rejected" }
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
          : service
      )
    );

    // Remove from pending consents
    setPendingConsents((prev) =>
      prev.filter((consent) => consent.id !== serviceId)
    );
  };

<<<<<<< HEAD
  const renderUpcomingServices = () => {
    if (upcomingServices.length === 0) {
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
  // Filter services by type
  const getFilteredServices = (services, type) => {
    return services.filter((service) => service.type === type);
  };

  const getFilteredConsents = (consents, type) => {
    return consents.filter((consent) => consent.type === type);
  };

  const renderServiceCards = (services, showConsent = true) => {
    if (services.length === 0) {
>>>>>>> 512000a (edit nurse role medical service management interface)
      return (
        <div className="text-center py-12">
          <FiCalendar className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-500 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
<<<<<<< HEAD
<<<<<<< HEAD
            Không có dịch vụ nào
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Các dịch vụ y tế sẽ hiển thị ở đây khi được lên lịch
=======
            Không có dịch vụ y tế nào sắp tới
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Các dịch vụ y tế mới sẽ hiển thị ở đây khi được lên lịch
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            Không có dịch vụ nào
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Các dịch vụ y tế sẽ hiển thị ở đây khi được lên lịch
>>>>>>> 512000a (edit nurse role medical service management interface)
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
<<<<<<< HEAD
<<<<<<< HEAD
        {services.map((service) => (
=======
        {upcomingServices.map((service) => (
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
        {services.map((service) => (
>>>>>>> 512000a (edit nurse role medical service management interface)
          <div
            key={service.id}
            className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-600 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      service.type === "vaccination"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                        : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                    }`}
                  >
<<<<<<< HEAD
=======
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    service.type === "vaccination" 
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                    {getServiceIcon(service.type)}
                  </div>
                  <div>
                    <span className={getServiceTypeBadge(service.type)}>
                      {getServiceIcon(service.type)}
<<<<<<< HEAD
<<<<<<< HEAD
                      <span className="ml-1">
                        {getServiceTypeLabel(service.type)}
                      </span>
=======
                      <span className="ml-1">{getServiceTypeLabel(service.type)}</span>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
                      <span className="ml-1">
                        {getServiceTypeLabel(service.type)}
                      </span>
>>>>>>> 512000a (edit nurse role medical service management interface)
                    </span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                      {service.title}
                    </h3>
                  </div>
                </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                <span
                  className={getStatusBadge(
                    service.status,
                    service.consentStatus
                  )}
                >
<<<<<<< HEAD
=======
                <span className={getStatusBadge(service.status, service.consentStatus)}>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                  {getStatusLabel(service.status, service.consentStatus)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                  <FiUser className="w-4 h-4 mr-2" />
<<<<<<< HEAD
<<<<<<< HEAD
                  <span>
                    {service.studentName} - Lớp {service.class}
                  </span>
=======
                  <span>{service.studentName} - Lớp {service.class}</span>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
                  <span>
                    {service.studentName} - Lớp {service.class}
                  </span>
>>>>>>> 512000a (edit nurse role medical service management interface)
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
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {service.description}
                  </p>
                </div>
              </div>

              {service.type === "health_check" && service.checkItems && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
              {showConsent &&
                service.consentStatus === "pending" &&
                service.requiresConsent && (
                  <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-600 dark:text-amber-400">
                        <FiAlertCircle className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
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
<<<<<<< HEAD
                    </div>
                  </div>
                )}
=======
              {service.consentStatus === "pending" && service.requiresConsent && (
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <FiAlertCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Cần xác nhận đồng ý</span>
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
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
                    </div>
                  </div>
                )}
>>>>>>> 512000a (edit nurse role medical service management interface)

              {service.notes && (
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4 mt-4">
                  <div className="flex items-start">
                    <FiFileText className="w-4 h-4 mr-2 mt-0.5 text-blue-500 dark:text-blue-400" />
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                        Lưu ý quan trọng:
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">
                        {service.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)

              {/* Show findings and recommendations for completed services */}
              {service.findings && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-3">
                  <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Phát hiện:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    {service.findings.map((finding, index) => (
                      <li key={index}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.recommendations && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Khuyến nghị:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    {service.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {service.notes && service.status === "completed" && (
                <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <strong>Ghi chú:</strong> {service.notes}
                </div>
              )}
<<<<<<< HEAD
=======
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
            </div>
          </div>
        ))}
      </div>
    );
  };

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
  const renderUpcomingServices = () => {
    const filteredServices = getFilteredServices(upcomingServices, activeTab);
    return renderServiceCards(filteredServices, true);
  };

<<<<<<< HEAD
  const renderServiceHistory = () => {
    const filteredServices = getFilteredServices(serviceHistory, activeTab);
    return renderServiceCards(filteredServices, false);
  };

  const renderPendingConsents = () => {
    const filteredConsents = getFilteredConsents(pendingConsents, activeTab);

    if (filteredConsents.length === 0) {
=======
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
  const renderServiceHistory = () => {
    const filteredServices = getFilteredServices(serviceHistory, activeTab);
    return renderServiceCards(filteredServices, false);
  };

  const renderPendingConsents = () => {
<<<<<<< HEAD
    if (pendingConsents.length === 0) {
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
    const filteredConsents = getFilteredConsents(pendingConsents, activeTab);

    if (filteredConsents.length === 0) {
>>>>>>> 512000a (edit nurse role medical service management interface)
      return (
        <div className="text-center py-12">
          <FiCheckCircle className="mx-auto h-12 w-12 text-green-400 dark:text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Tất cả xác nhận đã được hoàn thành
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
<<<<<<< HEAD
<<<<<<< HEAD
            Không có dịch vụ y tế nào cần xác nhận đồng ý cho loại này
=======
            Không có dịch vụ y tế nào cần xác nhận đồng ý
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            Không có dịch vụ y tế nào cần xác nhận đồng ý cho loại này
>>>>>>> 512000a (edit nurse role medical service management interface)
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
<<<<<<< HEAD
<<<<<<< HEAD
              Bạn có {filteredConsents.length}{" "}
              {getServiceTypeLabel(activeTab).toLowerCase()} cần xác nhận đồng ý
=======
              Bạn có {pendingConsents.length} dịch vụ y tế cần xác nhận đồng ý
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
              Bạn có {filteredConsents.length}{" "}
              {getServiceTypeLabel(activeTab).toLowerCase()} cần xác nhận đồng ý
>>>>>>> 512000a (edit nurse role medical service management interface)
            </p>
          </div>
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
        {filteredConsents.map((consent) => (
=======
        {pendingConsents.map((consent) => (
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
        {filteredConsents.map((consent) => (
>>>>>>> 512000a (edit nurse role medical service management interface)
          <div
            key={consent.id}
            className="bg-white dark:bg-neutral-800 rounded-lg shadow border border-neutral-200 dark:border-neutral-600 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    consent.type === "vaccination"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  }`}
                >
<<<<<<< HEAD
=======
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  consent.type === "vaccination" 
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                    : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                }`}>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
                  {getServiceIcon(consent.type)}
                </div>
                <div>
                  <span className={getServiceTypeBadge(consent.type)}>
                    {getServiceTypeLabel(consent.type)}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                    {consent.title}
                  </h3>
                </div>
              </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
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
<<<<<<< HEAD
                  : consent.urgency === "medium"
                  ? "Trung bình"
                  : "Bình thường"}
=======
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                consent.urgency === "high" 
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : consent.urgency === "medium"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              }`}>
                {consent.urgency === "high" ? "Khẩn cấp" : 
                 consent.urgency === "medium" ? "Trung bình" : "Bình thường"}
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
                  : consent.urgency === "medium"
                  ? "Trung bình"
                  : "Bình thường"}
>>>>>>> 512000a (edit nurse role medical service management interface)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                <FiUser className="w-4 h-4 mr-2" />
                <span className="mr-6">{consent.studentName}</span>
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>Hạn xác nhận: {consent.dueDate}</span>
              </div>
<<<<<<< HEAD
<<<<<<< HEAD

=======
              
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======

>>>>>>> 512000a (edit nurse role medical service management interface)
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
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Dịch vụ Y tế
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
<<<<<<< HEAD
<<<<<<< HEAD
          Quản lý và theo dõi các dịch vụ y tế của con bạn bao gồm tiêm chủng và
          khám sức khỏe định kỳ
=======
          Quản lý và theo dõi các dịch vụ y tế của con bạn bao gồm tiêm chủng và khám sức khỏe định kỳ
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
          Quản lý và theo dõi các dịch vụ y tế của con bạn bao gồm tiêm chủng và
          khám sức khỏe định kỳ
>>>>>>> 512000a (edit nurse role medical service management interface)
        </p>
      </div>

      {/* Statistics Cards */}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                Y tế định kỳ
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {getFilteredServices(upcomingServices, "health_check").length +
                  getFilteredServices(serviceHistory, "health_check").length}
              </p>
            </div>
            <FiActivity className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>

<<<<<<< HEAD
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Tiêm chủng
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {getFilteredServices(upcomingServices, "vaccination").length +
                  getFilteredServices(serviceHistory, "vaccination").length}
              </p>
            </div>
            <FiShield className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Sắp tới
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {upcomingServices.length}
              </p>
            </div>
            <FiCalendar className="w-8 h-8 text-purple-500 dark:text-purple-400" />
=======
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                Tiêm chủng
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {getFilteredServices(upcomingServices, "vaccination").length +
                  getFilteredServices(serviceHistory, "vaccination").length}
              </p>
            </div>
            <FiShield className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                Sắp tới
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {upcomingServices.length}
              </p>
            </div>
<<<<<<< HEAD
            <FiCalendar className="w-8 h-8 text-blue-500 dark:text-blue-400" />
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
            <FiCalendar className="w-8 h-8 text-purple-500 dark:text-purple-400" />
>>>>>>> 512000a (edit nurse role medical service management interface)
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
<<<<<<< HEAD
<<<<<<< HEAD
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Cần xác nhận
              </p>
=======
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">Cần xác nhận</p>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                Cần xác nhận
              </p>
>>>>>>> 512000a (edit nurse role medical service management interface)
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {pendingConsents.length}
              </p>
            </div>
            <FiAlertCircle className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          </div>
        </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {serviceHistory.length}
              </p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-green-500 dark:text-green-400" />
          </div>
        </div>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <nav className="flex">
            {[
<<<<<<< HEAD
<<<<<<< HEAD
              { id: "health_check", label: "Y tế định kỳ", icon: FiActivity },
              { id: "vaccination", label: "Tiêm chủng", icon: FiShield },
=======
              { id: "upcoming", label: "Dịch vụ sắp tới", icon: FiCalendar },
              { id: "history", label: "Lịch sử dịch vụ", icon: FiFileText },
              { id: "consents", label: "Cần xác nhận", icon: FiAlertCircle, badge: pendingConsents.length }
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
              { id: "health_check", label: "Y tế định kỳ", icon: FiActivity },
              { id: "vaccination", label: "Tiêm chủng", icon: FiShield },
>>>>>>> 512000a (edit nurse role medical service management interface)
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary-50 border-b-2 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 512000a (edit nurse role medical service management interface)
              </button>
            ))}
          </nav>
        </div>

        {/* Sub Tab Navigation */}
        <div className="border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50">
          <nav className="flex">
            {[
              { id: "upcoming", label: "Sắp tới", icon: FiCalendar },
              { id: "history", label: "Lịch sử", icon: FiFileText },
              {
                id: "consents",
                label: "Cần xác nhận",
                icon: FiAlertCircle,
                badge: getFilteredConsents(pendingConsents, activeTab).length,
              },
            ].map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`relative flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeSubTab === subTab.id
                    ? "bg-white dark:bg-neutral-800 border-b-2 border-primary-500 text-primary-700 dark:text-primary-400"
                    : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-white/50 dark:hover:bg-neutral-800/50"
                }`}
              >
                <subTab.icon className="w-4 h-4 mr-2" />
                {subTab.label}
                {subTab.badge > 0 && (
<<<<<<< HEAD
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {subTab.badge}
=======
                {tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {tab.badge}
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium leading-4 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                    {subTab.badge}
>>>>>>> 512000a (edit nurse role medical service management interface)
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
<<<<<<< HEAD
<<<<<<< HEAD
              {activeSubTab === "upcoming" && renderUpcomingServices()}
              {activeSubTab === "history" && renderServiceHistory()}
              {activeSubTab === "consents" && renderPendingConsents()}
=======
              {activeTab === "upcoming" && renderUpcomingServices()}
              {activeTab === "history" && renderServiceHistory()}
              {activeTab === "consents" && renderPendingConsents()}
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
              {activeSubTab === "upcoming" && renderUpcomingServices()}
              {activeSubTab === "history" && renderServiceHistory()}
              {activeSubTab === "consents" && renderPendingConsents()}
>>>>>>> 512000a (edit nurse role medical service management interface)
            </>
          )}
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
export default HealthServices;
=======
export default HealthServices; 
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
=======
export default HealthServices;
>>>>>>> 512000a (edit nurse role medical service management interface)
