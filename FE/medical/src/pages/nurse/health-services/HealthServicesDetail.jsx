import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiUser,
  FiFileText,
  FiActivity,
  FiSettings,
  FiInfo,
  FiEdit,
  FiPrinter,
  FiDownload,
  FiShare2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { getHealthCheckScheduleById } from "../../../utils/api/healthCheck/healthCheckService";

const HealthServicesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [healthService, setHealthService] = useState(null);
  const [error, setError] = useState(null);

  // States for class and student details
  const [expandedClasses, setExpandedClasses] = useState({});
  const [classData, setClassData] = useState({});
  const [loadingClassData, setLoadingClassData] = useState(false);

  // States for health check items
  const [healthCheckItems, setHealthCheckItems] = useState([]);
  const [loadingHealthCheckItems, setLoadingHealthCheckItems] = useState(false);

  useEffect(() => {
    const loadHealthServiceDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id && id !== "undefined") {
          // Sử dụng API thực với formId
          const data = await getHealthCheckScheduleById(id);
          setHealthService(data);
        } else {
          // Nếu không có ID, hiển thị dữ liệu mẫu để demo
          setHealthService(mockHealthServiceData);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu từ API:", err);
        setError(err.message);
        // Hiển thị dữ liệu mẫu khi có lỗi để demo
        setHealthService(mockHealthServiceData);
      }
      setLoading(false);
    };

    loadHealthServiceDetail();
  }, [id]);

  // Load health check items when healthService is loaded
  useEffect(() => {
    const fetchHealthCheckItems = async () => {
      if (!healthService?.selectedStations) return;
      
      setLoadingHealthCheckItems(true);
      try {
        const response = await fetch('https://localhost:7111/api/HealthCheckItem/active');
        if (response.ok) {
          const allItems = await response.json();
          const selectedStations = parseJsonField(healthService.selectedStations);
          
          // Map selected stations to actual health check items
          const mappedItems = selectedStations.map(station => {
            let foundItem = allItems.find(item => 
              item.itemId === parseInt(station) ||
              item.code === station || 
              item.name === station ||
              item.itemId.toString() === station.toString()
            );
            
            return foundItem || {
              itemId: station,
              name: getStationNameInVietnamese(station),
              category: 'Unknown',
              estimatedTimeMinutes: 0
            };
          });
          
          setHealthCheckItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching health check items:", error);
        // Fallback to static names
        const selectedStations = parseJsonField(healthService.selectedStations);
        setHealthCheckItems(selectedStations.map(station => ({
          itemId: station,
          name: getStationNameInVietnamese(station),
          category: 'Unknown',
          estimatedTimeMinutes: 0
        })));
      } finally {
        setLoadingHealthCheckItems(false);
      }
    };

    fetchHealthCheckItems();
  }, [healthService]);

  const toggleClass = async (gradeInfo) => {
    const isExpanded = expandedClasses[gradeInfo];
    
    if (!isExpanded && !classData[gradeInfo]) {
      setLoadingClassData(true);
      try {
        // Import classService dynamically
        const { getClassesByGrade, getClassStudents } = await import("../../../utils/api/class/classService");
        
        // Extract grade level from gradeInfo (e.g., "grade-2" -> 2, "5B" -> 5)
        let gradeLevel;
        if (gradeInfo.includes('grade-')) {
          gradeLevel = parseInt(gradeInfo.split('-')[1]);
        } else {
          // If it's already a class name like "5B", extract the grade
          gradeLevel = parseInt(gradeInfo.charAt(0));
        }
        
        // Get all classes for this grade level
        const classesInGrade = await getClassesByGrade(gradeLevel);
        
        if (classesInGrade && classesInGrade.length > 0) {
          // Get students for all classes in this grade
          const allStudentsInGrade = [];
          const classNames = [];
          
          for (const classItem of classesInGrade) {
            try {
              const students = await getClassStudents(classItem.classId);
              if (students && students.length > 0) {
                allStudentsInGrade.push(...students);
                classNames.push(classItem.className);
              }
            } catch (error) {
              console.error(`Error fetching students for class ${classItem.className}:`, error);
            }
          }
          
          setClassData(prev => ({
            ...prev,
            [gradeInfo]: {
              gradeLevel: gradeLevel,
              classNames: classNames,
              students: allStudentsInGrade,
              totalClasses: classesInGrade.length
            }
          }));
        } else {
          setClassData(prev => ({
            ...prev,
            [gradeInfo]: {
              gradeLevel: gradeLevel,
              classNames: [],
              students: [],
              error: `Không tìm thấy lớp nào cho khối ${gradeLevel}`
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setClassData(prev => ({
          ...prev,
          [gradeInfo]: {
            gradeLevel: gradeInfo,
            students: [],
            error: "Không thể tải dữ liệu lớp"
          }
        }));
      } finally {
        setLoadingClassData(false);
      }
    }

    setExpandedClasses(prev => ({
      ...prev,
      [gradeInfo]: !isExpanded
    }));
  };

  const mockHealthServiceData = {
    formId: 1,
    title: "Khám sức khỏe học kỳ 1",
    scheduledDate: "2025-08-05T00:00:00",
    startTime: "08:59:00",
    estimatedDuration: 60,
    description: "Đảm bảo có đầy đủ học sinh",
    location: "Phòng y tế trường",
    studentId: null,
    parentId: null,
    createdDate: "2025-07-07T06:54:56.977",
    consentStatus: "Pending",
    consentDate: null,
    confirmStatus: null,
    confirmedBy: null,
    confirmedDate: null,
    className: null,
    gradeIds: '["5B"]',
    totalStudents: 25,
    notifyParents: true,
    autoAdvance: true,
    saveResults: true,
    generateReport: true,
    requireParentConfirmation: true,
    selectedStations:
      '["height_weight", "vision", "hearing", "dental", "cardiovascular"]',
    staffAssigned: "",
    status: "Đang chờ duyệt",
    estimatedEndTime: "09:59:00",
    student: null,
    parent: null,
    confirmedByStaff: null,
    results: [],
    grades: ["5B"],
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium";

    switch (status) {
      case "Đang chờ duyệt":
      case "Pending":
      case "scheduled":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case "Approved":
      case "Đã duyệt":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "Active":
      case "Đang thực hiện":
      case "active":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case "Completed":
      case "Hoàn thành":
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case "Cancelled":
      case "Đã hủy":
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      Pending: "Đang chờ duyệt",
      scheduled: "Đã lên lịch",
      Approved: "Đã duyệt",
      Active: "Đang thực hiện",
      active: "Đang thực hiện",
      Completed: "Hoàn thành",
      completed: "Hoàn thành",
      Cancelled: "Đã hủy",
      cancelled: "Đã hủy",
      "Đang chờ duyệt": "Đang chờ duyệt",
      "Đã duyệt": "Đã duyệt",
      "Đang thực hiện": "Đang thực hiện",
      "Hoàn thành": "Hoàn thành",
      "Đã hủy": "Đã hủy",
    };
    return statusMap[status] || status || "Chưa xác định";
  };

  const parseJsonField = (field) => {
    try {
      return Array.isArray(field) ? field : JSON.parse(field || "[]");
    } catch (error) {
      return [];
    }
  };

  const formatGradesList = (gradeIds, grades) => {
    // Try to use grades array first, then parse gradeIds
    let gradesList = [];

    if (grades && Array.isArray(grades) && grades.length > 0) {
      gradesList = grades;
    } else if (gradeIds) {
      gradesList = parseJsonField(gradeIds);
    }

    if (gradesList.length === 0) {
      return "Tất cả";
    }

    // Format grade names to be more readable
    return gradesList
      .map((grade) => {
        // If grade is just a number or letter combination, format it
        if (typeof grade === "string" && grade.match(/^[0-9]+[A-Z]?$/)) {
          return `Lớp ${grade}`;
        }
        return grade;
      })
      .join(", ");
  };

  const getStationNameInVietnamese = (stationKey) => {
    // Kiểm tra nếu stationKey không hợp lệ
    if (!stationKey || typeof stationKey !== "string") {
      return "Trạm không xác định";
    }

    const stationMap = {
      // Các trạm cơ bản
      height: "Đo chiều cao",
      weight: "Cân nặng",
      "height-weight": "Chiều cao & Cân nặng",
      height_weight: "Chiều cao & Cân nặng",
      vision: "Khám mắt",
      hearing: "Khám tai",
      dental: "Khám răng miệng",

      // Các trạm nâng cao
      "blood-pressure": "Đo huyết áp",
      bloodPressure: "Đo huyết áp",
      "heart-rate": "Đo nhịp tim",
      heartRate: "Đo nhịp tim",
      temperature: "Đo nhiệt độ",
      bmi: "Chỉ số BMI",
      physical: "Thể lực",
      general: "Khám tổng quát",
      respiratory: "Khám hô hấp",
      cardiovascular: "Khám tim mạch",
      musculoskeletal: "Khám xương khớp",
      neurological: "Khám thần kinh",
      skin: "Khám da liễu",
      "mental-health": "Sức khỏe tâm thần",
      mental_health: "Sức khỏe tâm thần",

      // Các trạm khác
      spine: "Khám cột sống",
      posture: "Kiểm tra tư thế",
      reflexes: "Kiểm tra phản xạ",
      coordination: "Phối hợp vận động",

      // Xử lý các trường hợp đặc biệt
      oral: "Khám răng miệng",
      sensory: "Khám giác quan",
      dermatology: "Khám da liễu",
      mental: "Sức khỏe tâm thần",
    };

    // Nếu không tìm thấy trong map, thử format lại
    if (stationMap[stationKey]) {
      return stationMap[stationKey];
    }

    // Xử lý các trường hợp có dấu gạch dưới
    if (stationKey.includes("_")) {
      const parts = stationKey.split("_");
      const translatedParts = parts.map((part) => stationMap[part] || part);
      return translatedParts.join(" & ");
    }

    // Trường hợp mặc định - capitalize first letter
    return stationKey.charAt(0).toUpperCase() + stationKey.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Chưa xác định";
    try {
      return timeString.slice(0, 5);
    } catch (error) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  if (!healthService) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <FiInfo className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Không tìm thấy thông tin dịch vụ y tế
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Compact Header */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-2 py-1 border border-gray-300 dark:border-neutral-600 rounded text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-600"
              >
                <FiArrowLeft className="h-4 w-4 mr-1" />
                Quay lại
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                to={`/nurse/health-services/edit/${id || "new"}`}
                className="inline-flex items-center px-2 py-1 border border-transparent rounded text-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="h-4 w-4 mr-1" />
                Chỉnh sửa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-4">
            <div className="flex">
              <FiInfo className="h-5 w-5 text-yellow-400 dark:text-yellow-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Không thể tải dữ liệu từ API (ID: {id}). Hiển thị dữ liệu mẫu
                  để demo. Lỗi: {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiClipboard className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin cơ bản
                </h3>
              </div>
              <div className="px-6 py-4">
                {/* First row: Title and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tiêu đề
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {healthService.title || "Chưa có tiêu đề"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trạng thái
                    </label>
                    <span className={getStatusBadge(healthService.status)}>
                      {getStatusText(healthService.status)}
                    </span>
                  </div>
                </div>

                {/* Second row: Description centered */}
                <div className="flex justify-center">
                  <div className="w-full md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                      Mô tả
                    </label>
                    <p className="text-base text-gray-900 dark:text-white text-center">
                      {healthService.description || "Chưa có mô tả"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information Card */}
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiCalendar className="h-5 w-5 mr-2 text-green-600" />
                  Thông tin lịch trình
                </h3>
              </div>
              <div className="px-6 py-4">
                {/* Desktop view - table layout for perfect alignment */}
                <div className="hidden lg:block">
                  <div className="flex">
                    <div className="flex-1 text-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngày thực hiện
                      </label>
                    </div>
                    <div className="flex-1 text-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian bắt đầu
                      </label>
                    </div>
                    <div className="flex-1 text-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thời lượng
                      </label>
                    </div>
                    <div className="flex-1 text-center">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Địa điểm
                      </label>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    <div className="flex-1 text-center">
                      <p className="text-base text-gray-900 dark:text-white">
                        {formatDate(healthService.scheduledDate)}
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-base text-gray-900 dark:text-white flex items-center justify-center">
                        <FiClock className="h-4 w-4 mr-2 text-gray-400" />
                        {formatTime(healthService.startTime)}
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-base text-gray-900 dark:text-white">
                        {healthService.estimatedDuration || 0} phút
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-base text-gray-900 dark:text-white flex items-center justify-center">
                        <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {healthService.location || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mobile/Tablet view - grid layout */}
                <div className="lg:hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ngày thực hiện
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">
                        {formatDate(healthService.scheduledDate)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thời gian bắt đầu
                      </label>
                      <p className="text-base text-gray-900 dark:text-white flex items-center">
                        <FiClock className="h-4 w-4 mr-2 text-gray-400" />
                        {formatTime(healthService.startTime)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Thời lượng
                      </label>
                      <p className="text-base text-gray-900 dark:text-white">
                        {healthService.estimatedDuration || 0} phút
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Địa điểm
                      </label>
                      <p className="text-base text-gray-900 dark:text-white flex items-center">
                        <FiMapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {healthService.location || "Chưa xác định"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Class Information Card */}
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiUsers className="h-5 w-5 mr-2 text-purple-600" />
                  Thông tin lớp và học sinh
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Lớp học đã chọn
                    </label>
                    <div className="text-base text-gray-900 dark:text-white">
                      {healthService.grades &&
                      healthService.grades.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {healthService.grades.map((grade, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            >
                              Lớp {grade}
                            </span>
                          ))}
                        </div>
                      ) : (
                        formatGradesList(
                          healthService.gradeIds,
                          healthService.grades
                        ) || "Chưa chọn lớp"
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tổng số học sinh
                    </label>
                    <p className="text-base text-gray-900 dark:text-white">
                      {healthService.totalStudents || 0} học sinh
                    </p>
                  </div>
                </div>

                {/* Detailed Class and Student Information */}
                {healthService.grades && healthService.grades.length > 0 && (
                  <ClassStudentDetails 
                    grades={healthService.grades}
                    expandedClasses={expandedClasses}
                    classData={classData}
                    loadingClassData={loadingClassData}
                    onToggleClass={toggleClass}
                  />
                )}
              </div>
            </div>

            {/* Health Check Stations Card */}
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FiActivity className="h-5 w-5 mr-2 text-red-600" />
                  Hạng mục khám sức khỏe ({healthCheckItems.length} hạng mục)
                </h3>
              </div>
              <div className="px-6 py-4">
                {loadingHealthCheckItems ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Đang tải thông tin hạng mục khám...</span>
                  </div>
                ) : healthCheckItems.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {healthCheckItems.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                {item.name}
                              </h5>
                              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-full text-xs">
                                  {item.category}
                                </span>
                                {item.estimatedTimeMinutes > 0 && (
                                  <span className="text-xs">
                                    ~{item.estimatedTimeMinutes} phút
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
                      <strong>Tổng thời gian ước tính:</strong> {healthCheckItems.reduce((total, item) => total + (item.estimatedTimeMinutes || 0), 0)} phút
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chưa có hạng mục khám nào được chọn
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {healthService.results && healthService.results.length > 0 && (
          <div className="mt-8">
            <div className="bg-white dark:bg-neutral-800 shadow-sm rounded-lg border border-gray-200 dark:border-neutral-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <FiFileText className="h-5 w-5 mr-2 text-purple-600" />
                  Kết quả khám sức khỏe
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Kết quả sẽ được hiển thị khi quá trình khám sức khỏe hoàn tất.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ClassStudentDetails Component
const ClassStudentDetails = ({ grades, expandedClasses, classData, loadingClassData, onToggleClass }) => {
  if (!grades || grades.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
          <FiUsers className="h-5 w-5 text-blue-800 dark:text-blue-200" />
        </div>
        <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200">
          Chi tiết danh sách lớp và học sinh
        </h4>
      </div>

      <div className="space-y-4">
        {grades.map((gradeInfo, index) => (
          <div key={index} className="bg-white dark:bg-neutral-700 rounded-lg border border-blue-200 dark:border-blue-700">
            <button
              onClick={() => onToggleClass(gradeInfo)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              disabled={loadingClassData}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {gradeInfo.includes('grade-') ? `Khối ${gradeInfo.split('-')[1]}` : `Lớp ${gradeInfo}`}
                </span>
                {classData[gradeInfo]?.students && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                    {classData[gradeInfo].students.length} học sinh
                  </span>
                )}
                {classData[gradeInfo]?.classNames && classData[gradeInfo].classNames.length > 0 && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-medium">
                    {classData[gradeInfo].totalClasses} lớp
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {loadingClassData && expandedClasses[gradeInfo] === undefined && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
                {expandedClasses[gradeInfo] ? (
                  <FiChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>

            {expandedClasses[gradeInfo] && (
              <div className="px-4 pb-4">
                {classData[gradeInfo]?.error ? (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {classData[gradeInfo].error}
                  </div>
                ) : classData[gradeInfo]?.students ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {classData[gradeInfo].gradeLevel && `Khối ${classData[gradeInfo].gradeLevel} • `}
                      {classData[gradeInfo].students.length} học sinh
                      {classData[gradeInfo].totalClasses && ` • ${classData[gradeInfo].totalClasses} lớp`}
                      {classData[gradeInfo].classNames && classData[gradeInfo].classNames.length > 0 && (
                        <div className="mt-1">
                          <strong>Các lớp:</strong> {classData[gradeInfo].classNames.join(", ")}
                        </div>
                      )}
                    </div>
                    
                    {classData[gradeInfo].students.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 text-sm italic">
                        Không có học sinh nào trong lớp/khối này
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {classData[gradeInfo].students.map((student, studentIndex) => (
                          <div
                            key={studentIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-600 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                MSHS: {student.studentCode}
                                {student.className && (
                                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs">
                                    {student.className}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.gender === "Male" ? "Nam" : "Nữ"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <div className="flex items-start gap-2">
          <FiInfo className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Lưu ý:</strong> Danh sách học sinh sẽ được tải khi bạn mở rộng từng lớp. 
            Tất cả học sinh trong các lớp này sẽ tham gia khám sức khỏe.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthServicesDetail;
