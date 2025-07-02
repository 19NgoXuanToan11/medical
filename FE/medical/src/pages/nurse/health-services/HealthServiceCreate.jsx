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
  FiCheckCircle,
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
    followUpRequired: false,
  });

  const [availableGrades, setAvailableGrades] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [healthCheckItems, setHealthCheckItems] = useState([
    "Chiều cao",
    "Cân nặng",
    "Thị lực",
    "Răng miệng",
    "Tim mạch",
    "Phổi",
    "Xương khớp",
    "Da liễu",
    "Thần kinh",
    "Tiêu hóa",
  ]);

  // Load data from API and draft
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load draft if exists
        const savedDraft = localStorage.getItem("healthServiceDraft");
        if (savedDraft) {
          const draftData = JSON.parse(savedDraft);
          if (
            confirm(
              "Phát hiện bản nháp đã lưu. Bạn có muốn tiếp tục chỉnh sửa không?"
            )
          ) {
            setFormData((prev) => ({ ...prev, ...draftData }));
            setServiceType(draftData.type || "vaccination");
            localStorage.removeItem("healthServiceDraft"); // Clean up after loading
          }
        }

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
            {
              id: "flu",
              name: "Vắc-xin cúm mùa",
              recommendedAges: ["6-18 tuổi"],
              dosage: "0.5ml",
              sideEffects: "Sốt nhẹ, đau tại chỗ tiêm trong 24-48 giờ",
              contraindications: "Dị ứng với thành phần vắc-xin, sốt cao",
            },
            {
              id: "mmr",
              name: "Vắc-xin MMR (Sởi-Quai bị-Rubella)",
              recommendedAges: ["12-15 tháng", "4-6 tuổi"],
              dosage: "0.5ml",
              sideEffects: "Sốt nhẹ, phát ban nhẹ sau 1-2 tuần",
              contraindications: "Thai kỳ, suy giảm miễn dịch, dị ứng neomycin",
            },
            {
              id: "hepatitis_b",
              name: "Vắc-xin Viêm gan B",
              recommendedAges: ["Sơ sinh", "Trẻ em chưa tiêm"],
              dosage: "0.5ml",
              sideEffects: "Đau, sưng tại chỗ tiêm, sốt nhẹ",
              contraindications: "Dị ứng với men bia, sốt cao",
            },
            {
              id: "japanese_encephalitis",
              name: "Vắc-xin Viêm não Nhật Bản",
              recommendedAges: ["12 tháng - 15 tuổi"],
              dosage: "0.5ml",
              sideEffects: "Sốt, đau đầu nhẹ, đau tại chỗ tiêm",
              contraindications: "Dị ứng với protein động vật, bệnh cấp tính",
            },
            {
              id: "hpv",
              name: "Vắc-xin HPV",
              recommendedAges: ["9-14 tuổi (nữ)"],
              dosage: "0.5ml",
              sideEffects: "Đau, sưng tại chỗ tiêm, choáng váng nhẹ",
              contraindications: "Thai kỳ, dị ứng với thành phần vắc-xin",
            },
            {
              id: "varicella",
              name: "Vắc-xin Thủy đậu",
              recommendedAges: ["12-15 tháng", "4-6 tuổi"],
              dosage: "0.5ml",
              sideEffects: "Sốt nhẹ, phát ban thủy đậu nhẹ",
              contraindications:
                "Thai kỳ, suy giảm miễn dịch, thuốc ức chế miễn dịch",
            },
            {
              id: "dpt",
              name: "Vắc-xin DPT (Bạch hầu-Ho gà-Uốn ván)",
              recommendedAges: ["2-6 tháng", "nhắc lại 4-6 tuổi"],
              dosage: "0.5ml",
              sideEffects: "Sưng đỏ tại chỗ tiêm, sốt, quấy khóc",
              contraindications:
                "Bệnh não cấp tính, dị ứng với thành phần vắc-xin",
            },
          ]);
        }, 500);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    loadData();
  }, []);

  // Auto-fill vaccine details when vaccine type is selected
  useEffect(() => {
    if (formData.vaccineType && vaccineTypes.length > 0) {
      const selectedVaccine = vaccineTypes.find(
        (v) => v.id === formData.vaccineType
      );
      if (selectedVaccine) {
        setFormData((prev) => ({
          ...prev,
          vaccinationDetails: {
            ...prev.vaccinationDetails,
            dosage: selectedVaccine.dosage || prev.vaccinationDetails.dosage,
            sideEffects:
              selectedVaccine.sideEffects ||
              prev.vaccinationDetails.sideEffects,
            contraindications:
              selectedVaccine.contraindications ||
              prev.vaccinationDetails.contraindications,
          },
          // Auto-suggest title if empty
          title: prev.title || `Tiêm ${selectedVaccine.name}`,
          // Auto-adjust duration based on vaccine type
          estimatedDuration: formData.vaccineType === "hpv" ? 90 : 60,
        }));
      }
    }
  }, [formData.vaccineType, vaccineTypes]);

  // Auto-suggest title for health check
  useEffect(() => {
    if (
      serviceType === "health_check" &&
      !formData.title &&
      formData.checkItems.length > 0
    ) {
      const season = new Date().getMonth() >= 8 ? "học kỳ 1" : "học kỳ 2";
      setFormData((prev) => ({
        ...prev,
        title: `Khám sức khỏe định kỳ ${season}`,
        estimatedDuration: formData.checkItems.length * 10 + 30, // 10 min per item + 30 min buffer
      }));
    }
  }, [serviceType, formData.checkItems, formData.title]);

  // Smart default reminder days based on service type
  useEffect(() => {
    if (serviceType === "vaccination" && formData.reminderDaysBefore === 7) {
      setFormData((prev) => ({ ...prev, reminderDaysBefore: 14 })); // More time for vaccination consent
    } else if (
      serviceType === "health_check" &&
      formData.reminderDaysBefore === 14
    ) {
      setFormData((prev) => ({ ...prev, reminderDaysBefore: 7 })); // Less time for health check
    }
  }, [serviceType]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("vaccinationDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        vaccinationDetails: {
          ...prev.vaccinationDetails,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleGradeSelection = (gradeId) => {
    setFormData((prev) => ({
      ...prev,
      targetGrades: prev.targetGrades.includes(gradeId)
        ? prev.targetGrades.filter((id) => id !== gradeId)
        : [...prev.targetGrades, gradeId],
    }));
  };

  const handleCheckItemToggle = (item) => {
    setFormData((prev) => ({
      ...prev,
      checkItems: prev.checkItems.includes(item)
        ? prev.checkItems.filter((i) => i !== item)
        : [...prev.checkItems, item],
    }));
  };

  const calculateTotalStudents = () => {
    return formData.targetGrades.reduce((total, gradeId) => {
      const grade = availableGrades.find((g) => g.id === gradeId);
      return total + (grade ? grade.studentCount : 0);
    }, 0);
  };

  // Validation functions
  const validateBasicInfo = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Tiêu đề là bắt buộc";
    if (!formData.scheduledDate)
      errors.scheduledDate = "Ngày thực hiện là bắt buộc";
    if (!formData.scheduledTime) errors.scheduledTime = "Thời gian là bắt buộc";
    if (!formData.location.trim()) errors.location = "Địa điểm là bắt buộc";
    if (formData.targetGrades.length === 0)
      errors.targetGrades = "Phải chọn ít nhất một lớp";

    // Check date is not in the past
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.scheduledDate = "Ngày thực hiện không thể trong quá khứ";
    }

    return errors;
  };

  const validateVaccination = () => {
    const errors = {};
    if (!formData.vaccineType) errors.vaccineType = "Loại vắc-xin là bắt buộc";
    return errors;
  };

  const validateHealthCheck = () => {
    const errors = {};
    if (formData.checkItems.length === 0) {
      errors.checkItems = "Phải chọn ít nhất một hạng mục kiểm tra";
    }
    return errors;
  };

  // Check for scheduling conflicts
  const checkSchedulingConflicts = () => {
    // This would normally call an API to check existing schedules
    // For now, simulate conflict detection
    const conflicts = [];

    // Check if too many students for time slot
    const totalStudents = calculateTotalStudents();
    const estimatedTimePerStudent = serviceType === "vaccination" ? 5 : 15; // minutes
    const totalTimeNeeded =
      (totalStudents * estimatedTimePerStudent) /
      formData.maxStudentsPerSession;

    if (totalTimeNeeded > formData.estimatedDuration) {
      conflicts.push({
        type: "time",
        message: `Thời gian dự kiến (${
          formData.estimatedDuration
        } phút) không đủ cho ${totalStudents} học sinh. Cần ít nhất ${Math.ceil(
          totalTimeNeeded
        )} phút.`,
      });
    }

    return conflicts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Comprehensive validation
      const basicErrors = validateBasicInfo();
      const serviceErrors =
        serviceType === "vaccination"
          ? validateVaccination()
          : validateHealthCheck();
      const allErrors = { ...basicErrors, ...serviceErrors };

      if (Object.keys(allErrors).length > 0) {
        alert(
          "Vui lòng kiểm tra lại thông tin: " +
            Object.values(allErrors).join(", ")
        );
        setLoading(false);
        return;
      }

      // Check for conflicts
      const conflicts = checkSchedulingConflicts();
      if (conflicts.length > 0) {
        const conflictMessages = conflicts.map((c) => c.message).join("\n");
        if (
          !confirm(
            `Phát hiện xung đột:\n${conflictMessages}\n\nBạn có muốn tiếp tục không?`
          )
        ) {
          setLoading(false);
          return;
        }
      }

      // Prepare comprehensive data for API
      const serviceData = {
        ...formData,
        type: serviceType,
        grades: formData.targetGrades,
        totalStudents: calculateTotalStudents(),
        status: "draft", // Start as draft, then move to scheduled after approval
        createdBy: "current_nurse_id", // Would come from auth context
        workflow: {
          requiresApproval:
            totalStudents > 100 || serviceType === "vaccination",
          approvalLevel: totalStudents > 100 ? "manager" : "nurse_supervisor",
          estimatedCost: calculateEstimatedCost(),
          resourceRequirements: calculateResourceRequirements(),
        },
        notifications: {
          parentReminderDays: formData.reminderDaysBefore,
          autoSendReminders: true,
          requiresConsent: formData.requiresConsent,
        },
      };

      // Simulate API call with better success handling
      setTimeout(() => {
        const successMessage =
          `Đã tạo thành công ${
            serviceType === "vaccination"
              ? "kế hoạch tiêm chủng"
              : "lịch khám sức khỏe"
          } cho ${calculateTotalStudents()} học sinh!\n\n` +
          `${
            serviceData.workflow.requiresApproval
              ? "Kế hoạch đang chờ phê duyệt."
              : "Kế hoạch đã được lên lịch."
          }`;

        alert(successMessage);
        navigate("/nurse/health-services");
      }, 1500);
    } catch (error) {
      console.error("Lỗi khi tạo dịch vụ:", error);
      alert("Có lỗi xảy ra khi tạo dịch vụ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for business logic
  const calculateEstimatedCost = () => {
    const baseCost = serviceType === "vaccination" ? 50000 : 30000; // VND per student
    return calculateTotalStudents() * baseCost;
  };

  const calculateResourceRequirements = () => {
    const totalStudents = calculateTotalStudents();
    return {
      staff: Math.ceil(totalStudents / formData.maxStudentsPerSession),
      equipment:
        serviceType === "vaccination"
          ? { syringes: totalStudents, vaccines: totalStudents }
          : { stethoscopes: 2, scales: 1, heightMeasure: 1 },
      timeSlots: Math.ceil(totalStudents / formData.maxStudentsPerSession),
    };
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-4xl flex-grow flex flex-col">
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

        <form
          onSubmit={handleSubmit}
          className="space-y-8 pb-8 flex-grow flex flex-col"
        >
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
                  <FiShield
                    className={`w-8 h-8 ${
                      serviceType === "vaccination"
                        ? "text-blue-600"
                        : "text-neutral-400"
                    }`}
                  />
                </div>
                <h3
                  className={`font-medium mb-2 ${
                    serviceType === "vaccination"
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  Tiêm chủng
                </h3>
                <p
                  className={`text-sm ${
                    serviceType === "vaccination"
                      ? "text-blue-700 dark:text-blue-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
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
                  <FiActivity
                    className={`w-8 h-8 ${
                      serviceType === "health_check"
                        ? "text-green-600"
                        : "text-neutral-400"
                    }`}
                  />
                </div>
                <h3
                  className={`font-medium mb-2 ${
                    serviceType === "health_check"
                      ? "text-green-900 dark:text-green-100"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  Khám sức khỏe định kỳ
                </h3>
                <p
                  className={`text-sm ${
                    serviceType === "health_check"
                      ? "text-green-700 dark:text-green-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
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
                  placeholder={`Nhập tiêu đề ${
                    serviceType === "vaccination"
                      ? "tiêm chủng"
                      : "khám sức khỏe"
                  }`}
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
                placeholder={`Mô tả chi tiết về ${
                  serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"
                } này...`}
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          {/* Target Grades */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Lớp học mục tiêu
            </h2>
            <div className="mb-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Chọn các lớp tham gia{" "}
                {serviceType === "vaccination" ? "tiêm chủng" : "khám sức khỏe"}
              </p>
            </div>

            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4 content-start">
              {availableGrades.map((grade) => (
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
                    <span
                      className={`text-sm font-medium ${
                        formData.targetGrades.includes(grade.id)
                          ? "text-primary-800 dark:text-primary-200"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {grade.name}
                    </span>
                    <p
                      className={`text-xs ${
                        formData.targetGrades.includes(grade.id)
                          ? "text-primary-600 dark:text-primary-300"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
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
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-primary-800 dark:text-primary-200">
                    <FiInfo className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      Tổng số học sinh: {calculateTotalStudents()} học sinh
                    </span>
                  </div>
                  <div className="text-xs text-primary-600 dark:text-primary-300">
                    Dự kiến chi phí:{" "}
                    {calculateEstimatedCost().toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service-Specific Configuration */}
          {serviceType === "vaccination" && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiShield className="w-5 h-5 mr-2 text-blue-600" />
                Cấu hình tiêm chủng
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Loại vắc-xin <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vaccineType"
                    value={formData.vaccineType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    required
                  >
                    <option value="">Chọn loại vắc-xin</option>
                    {vaccineTypes.map((vaccine) => (
                      <option key={vaccine.id} value={vaccine.id}>
                        {vaccine.name} - {vaccine.recommendedAges.join(", ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Liều lượng
                  </label>
                  <input
                    type="text"
                    name="vaccinationDetails.dosage"
                    value={formData.vaccinationDetails.dosage}
                    onChange={handleInputChange}
                    placeholder="VD: 0.5ml"
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Tác dụng phụ có thể xảy ra
                  </label>
                  <textarea
                    name="vaccinationDetails.sideEffects"
                    value={formData.vaccinationDetails.sideEffects}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả các tác dụng phụ có thể xảy ra sau khi tiêm..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Chống chỉ định
                  </label>
                  <textarea
                    name="vaccinationDetails.contraindications"
                    value={formData.vaccinationDetails.contraindications}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Các trường hợp không nên tiêm (dị ứng, bệnh lý, thuốc đang sử dụng...)..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

          {serviceType === "health_check" && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiActivity className="w-5 h-5 mr-2 text-green-600" />
                Cấu hình khám sức khỏe
              </h2>

              <div className="mb-6 flex-grow">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Hạng mục kiểm tra <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthCheckItems.map((item) => (
                    <label
                      key={item}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        formData.checkItems.includes(item)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-neutral-200 dark:border-neutral-600 hover:border-green-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.checkItems.includes(item)}
                        onChange={() => handleCheckItemToggle(item)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <span
                          className={`text-sm font-medium ${
                            formData.checkItems.includes(item)
                              ? "text-green-800 dark:text-green-200"
                              : "text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {item}
                        </span>
                      </div>
                      {formData.checkItems.includes(item) && (
                        <FiCheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Quy trình xử lý bất thường
                  </label>
                  <textarea
                    name="abnormalityProtocol"
                    value={formData.abnormalityProtocol}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Mô tả quy trình xử lý khi phát hiện bất thường (thông báo phụ huynh, chuyển viện, theo dõi...)..."
                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Preview and Summary */}
          {formData.targetGrades.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center">
                <FiInfo className="w-5 h-5 mr-2 text-blue-600" />
                Tóm tắt kế hoạch
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiUsers className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Tổng học sinh
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {calculateTotalStudents()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiClock className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Thời gian
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {formData.estimatedDuration}m
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiMapPin className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Số phiên
                      </p>
                      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        {Math.ceil(
                          calculateTotalStudents() /
                            formData.maxStudentsPerSession
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Chi phí dự kiến
                      </p>
                      <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {calculateEstimatedCost().toLocaleString("vi-VN")} ₫
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Requirements */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                  Yêu cầu tài nguyên:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Nhân sự cần thiết:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {calculateResourceRequirements().staff} người
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Thời gian thực hiện:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {Math.ceil(
                        (calculateResourceRequirements().timeSlots *
                          formData.estimatedDuration) /
                          60
                      )}{" "}
                      giờ
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Cần phê duyệt:
                    </span>
                    <span className="ml-2 font-medium text-neutral-900 dark:text-neutral-100">
                      {calculateTotalStudents() > 100 ||
                      serviceType === "vaccination"
                        ? "Có"
                        : "Không"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warnings and Recommendations */}
              {checkSchedulingConflicts().length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start">
                    <FiAlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                        Cảnh báo và đề xuất:
                      </h4>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        {checkSchedulingConflicts().map((conflict, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {conflict.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/nurse/health-services")}
                className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200"
              >
                <FiX className="w-4 h-4 mr-2 inline" />
                Hủy
              </button>

              <button
                type="button"
                onClick={() => {
                  const data = {
                    ...formData,
                    type: serviceType,
                    totalStudents: calculateTotalStudents(),
                    estimatedCost: calculateEstimatedCost(),
                    resourceRequirements: calculateResourceRequirements(),
                  };
                  localStorage.setItem(
                    "healthServiceDraft",
                    JSON.stringify(data)
                  );
                  alert("Đã lưu bản nháp!");
                }}
                disabled={loading}
                className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 dark:border-primary-600 dark:text-primary-300 dark:hover:bg-primary-900/20 transition-colors duration-200 disabled:opacity-50"
              >
                <FiSave className="w-4 h-4 mr-2 inline" />
                Lưu nháp
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  formData.targetGrades.length === 0 ||
                  !formData.title.trim() ||
                  !formData.scheduledDate
                }
                className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Tạo{" "}
                    {serviceType === "vaccination"
                      ? "kế hoạch tiêm chủng"
                      : "lịch khám sức khỏe"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthServiceCreate;
