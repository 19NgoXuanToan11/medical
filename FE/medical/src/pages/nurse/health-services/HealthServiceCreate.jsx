<<<<<<< HEAD
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import VaccinationCreate from "./VaccinationCreate";
import HealthCheckCreate from "./HealthCheckCreate";

const HealthServiceCreate = () => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState(""); // vaccination or health_check

  // Nếu đã chọn loại dịch vụ, hiển thị component tương ứng
  if (serviceType === "vaccination") {
    return <VaccinationCreate onBack={() => setServiceType("")} />;
  }

  if (serviceType === "health_check") {
    return <HealthCheckCreate onBack={() => setServiceType("")} />;
  }

  // Hiển thị màn hình chọn loại dịch vụ
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate("/nurse/health-services")}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo Dịch vụ Y tế mới
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Vui lòng chọn loại dịch vụ y tế mà bạn muốn tạo lịch
          </p>
        </div>

        {/* Service Type Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Chọn loại dịch vụ y tế
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Lựa chọn dịch vụ phù hợp với nhu cầu chăm sóc sức khỏe học sinh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vaccination Option */}
            <button
              type="button"
              onClick={() => setServiceType("vaccination")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-blue-100 group-hover:text-blue-500 transition-all duration-300">
                  <FiShield className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Tiêm chủng
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch tiêm phòng các loại vắc-xin cho học sinh theo độ tuổi và chương trình y tế học đường
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Phòng bệnh
                    </span>
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Theo lứa tuổi
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* Health Check Option */}
            <button
              type="button"
              onClick={() => setServiceType("health_check")}
              className="group p-8 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-green-300 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-neutral-100 dark:bg-neutral-700 text-neutral-400 group-hover:bg-green-100 group-hover:text-green-500 transition-all duration-300">
                  <FiActivity className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                  Khám sức khỏe định kỳ
                </h3>

                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Tạo lịch khám sức khỏe tổng quát và chuyên khoa cho học sinh theo quy định của Bộ Y tế
                </p>

                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center">
                      <FiActivity className="w-3 h-3 mr-1" />
                      Tổng quát
                    </span>
                    <span className="flex items-center">
                      <FiShield className="w-3 h-3 mr-1" />
                      Định kỳ
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
=======
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiCalendar,
  FiClock,
  FiUsers,
  FiInfo,
  FiAlertCircle,
  FiShield,
  FiActivity,
  FiMapPin,
  FiPlus,
  FiMinus,
  FiCheckCircle
} from "react-icons/fi";

const HealthServiceCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState("vaccination"); // vaccination or health_check
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    location: "Phòng y tế trường",
    targetGrades: [],
    requiresConsent: true,
    reminderDaysBefore: 7,
    maxStudentsPerSession: 50,
    estimatedDuration: 60,
    notes: "",
    
    // Vaccination specific fields
    vaccineType: "",
    vaccinationDetails: {
      dosage: "",
      manufacturer: "",
      lotNumber: "",
      expiryDate: "",
      sideEffects: "",
      contraindications: "",
    },
    
    // Health check specific fields
    checkItems: ["Chiều cao", "Cân nặng", "Thị lực", "Răng miệng"],
    abnormalityProtocol: "",
    followUpRequired: false
  });

  const [availableGrades, setAvailableGrades] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [healthCheckItems, setHealthCheckItems] = useState([
    "Chiều cao", "Cân nặng", "Thị lực", "Răng miệng", "Tim mạch", 
    "Phổi", "Xương khớp", "Da liễu", "Thần kinh", "Tiêu hóa"
  ]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API calls
        setTimeout(() => {
          setAvailableGrades([
            { id: "1A", name: "Lớp 1A", studentCount: 25 },
            { id: "1B", name: "Lớp 1B", studentCount: 24 },
            { id: "1C", name: "Lớp 1C", studentCount: 26 },
            { id: "2A", name: "Lớp 2A", studentCount: 28 },
            { id: "2B", name: "Lớp 2B", studentCount: 27 },
            { id: "2C", name: "Lớp 2C", studentCount: 25 },
            { id: "3A", name: "Lớp 3A", studentCount: 30 },
            { id: "3B", name: "Lớp 3B", studentCount: 29 },
            { id: "3C", name: "Lớp 3C", studentCount: 28 },
            { id: "4A", name: "Lớp 4A", studentCount: 27 },
            { id: "4B", name: "Lớp 4B", studentCount: 26 },
            { id: "5A", name: "Lớp 5A", studentCount: 24 },
            { id: "5B", name: "Lớp 5B", studentCount: 25 },
          ]);

          setVaccineTypes([
            { id: "flu", name: "Vắc-xin cúm mùa" },
            { id: "mmr", name: "Vắc-xin MMR (Sởi-Quai bị-Rubella)" },
            { id: "hepatitis_b", name: "Vắc-xin Viêm gan B" },
            { id: "japanese_encephalitis", name: "Vắc-xin Viêm não Nhật Bản" },
            { id: "hpv", name: "Vắc-xin HPV" },
            { id: "varicella", name: "Vắc-xin Thủy đậu" },
            { id: "dpt", name: "Vắc-xin DPT (Bạch hầu-Ho gà-Uốn ván)" }
          ]);
        }, 500);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("vaccinationDetails.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        vaccinationDetails: {
          ...prev.vaccinationDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleGradeSelection = (gradeId) => {
    setFormData(prev => ({
      ...prev,
      targetGrades: prev.targetGrades.includes(gradeId)
        ? prev.targetGrades.filter(id => id !== gradeId)
        : [...prev.targetGrades, gradeId],
    }));
  };

  const handleCheckItemToggle = (item) => {
    setFormData(prev => ({
      ...prev,
      checkItems: prev.checkItems.includes(item)
        ? prev.checkItems.filter(i => i !== item)
        : [...prev.checkItems, item]
    }));
  };

  const calculateTotalStudents = () => {
    return formData.targetGrades.reduce((total, gradeId) => {
      const grade = availableGrades.find(g => g.id === gradeId);
      return total + (grade ? grade.studentCount : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for API
      const serviceData = {
        ...formData,
        type: serviceType,
        grades: formData.targetGrades,
        totalStudents: calculateTotalStudents(),
        status: "scheduled"
      };

      // Simulate API call
      setTimeout(() => {
        alert(`Đã tạo thành công ${serviceType === "vaccination" ? "lịch tiêm chủng" : "lịch khám sức khỏe"}!`);
        navigate("/nurse/health-services");
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi tạo dịch vụ:", error);
      alert("Có lỗi xảy ra khi tạo dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo Dịch vụ Y tế mới
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Tạo lịch tiêm chủng hoặc khám sức khỏe định kỳ cho học sinh
          </p>
        </div>
        <button
          onClick={() => navigate("/nurse/health-services")}
          className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <FiX className="w-4 h-4 mr-2" />
          Hủy
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Type Selection */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Loại dịch vụ y tế
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setServiceType("vaccination")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                serviceType === "vaccination"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-neutral-200 dark:border-neutral-600 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <FiShield className={`w-8 h-8 ${
                  serviceType === "vaccination" ? "text-blue-600" : "text-neutral-400"
                }`} />
              </div>
              <h3 className={`font-medium mb-2 ${
                serviceType === "vaccination" ? "text-blue-900 dark:text-blue-100" : "text-neutral-700 dark:text-neutral-300"
              }`}>
                Tiêm chủng
              </h3>
              <p className={`text-sm ${
                serviceType === "vaccination" ? "text-blue-700 dark:text-blue-200" : "text-neutral-500 dark:text-neutral-400"
              }`}>
                Tạo lịch tiêm chủng với các loại vắc-xin khác nhau
              </p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType("health_check")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                serviceType === "health_check"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-neutral-200 dark:border-neutral-600 hover:border-green-300"
              }`}
            >
              <div className="flex items-center justify-center mb-3">
                <FiActivity className={`w-8 h-8 ${
                  serviceType === "health_check" ? "text-green-600" : "text-neutral-400"
                }`} />
              </div>
              <h3 className={`font-medium mb-2 ${
                serviceType === "health_check" ? "text-green-900 dark:text-green-100" : "text-neutral-700 dark:text-neutral-300"
              }`}>
                Khám sức khỏe định kỳ
              </h3>
              <p className={`text-sm ${
                serviceType === "health_check" ? "text-green-700 dark:text-green-200" : "text-neutral-500 dark:text-neutral-400"
              }`}>
                Tạo lịch khám sức khỏe toàn diện cho học sinh
              </p>
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={`Nhập tiêu đề ${serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"}`}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Ngày thực hiện <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Thời gian bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder={`Mô tả chi tiết về ${serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"} này...`}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Target Grades */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Lớp học mục tiêu
          </h2>
          <div className="mb-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Chọn các lớp tham gia {serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            {availableGrades.map(grade => (
              <label
                key={grade.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  formData.targetGrades.includes(grade.id)
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-neutral-200 dark:border-neutral-600 hover:border-primary-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.targetGrades.includes(grade.id)}
                  onChange={() => handleGradeSelection(grade.id)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <span className={`text-sm font-medium ${
                    formData.targetGrades.includes(grade.id)
                      ? "text-primary-800 dark:text-primary-200"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}>
                    {grade.name}
                  </span>
                  <p className={`text-xs ${
                    formData.targetGrades.includes(grade.id)
                      ? "text-primary-600 dark:text-primary-300"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}>
                    {grade.studentCount} học sinh
                  </p>
                </div>
                {formData.targetGrades.includes(grade.id) && (
                  <FiUsers className="w-4 h-4 text-primary-600" />
                )}
              </label>
            ))}
          </div>

          {formData.targetGrades.length > 0 && (
            <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
              <div className="flex items-center text-primary-800 dark:text-primary-200">
                <FiInfo className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Tổng số học sinh: {calculateTotalStudents()} học sinh
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/nurse/health-services")}
            className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || formData.targetGrades.length === 0}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4 mr-2" />
                Tạo {serviceType === "vaccination" ? "lịch tiêm chủng" : "lịch khám sức khỏe"}
              </>
            )}
          </button>
        </div>
      </form>
>>>>>>> 02f67a7 (combined UI vaccination and regular medical check-ups)
    </div>
  );
};

export default HealthServiceCreate;
