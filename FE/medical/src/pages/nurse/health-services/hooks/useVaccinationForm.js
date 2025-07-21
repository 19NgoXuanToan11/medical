import { useState, useEffect, useCallback } from "react";
import {
  calculateTotalStudents,
  validateFormStep,
  validateCompleteForm,
  checkScheduleConflicts,
} from "../utils/vaccinationHelpers";
import { initialFormData } from "../data/vaccinationData";
import { injectionFormService } from "../../../../utils/api/injection/injectionService";
import { getActiveClasses } from "../../../../utils/api/class/classService";

// Helper function to get age range by grade level
const getAgeRangeByGrade = (gradeLevel) => {
  const ageRanges = {
    1: "6-7 tuổi",
    2: "7-8 tuổi",
    3: "8-9 tuổi",
    4: "9-10 tuổi",
    5: "10-11 tuổi",
    6: "11-12 tuổi",
    7: "12-13 tuổi",
    8: "13-14 tuổi",
    9: "14-15 tuổi",
    10: "15-16 tuổi",
    11: "16-17 tuổi",
    12: "17-18 tuổi",
  };
  return ageRanges[gradeLevel] || `${gradeLevel + 5}-${gradeLevel + 6} tuổi`;
};

export const useVaccinationForm = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [gradesError, setGradesError] = useState(null);

  // Load active classes on component mount
  useEffect(() => {
    const loadActiveClasses = async () => {
      setLoadingGrades(true);
      setGradesError(null);
      try {
        const classesData = await getActiveClasses();

        // Group classes by grade level to match HealthCheck pattern
        const gradeGroups = {};

        classesData.forEach((classItem) => {
          const gradeLevel = classItem.gradeLevel;
          const studentCount =
            classItem.currentStudentCount ||
            classItem.studentCount ||
            (classItem.students ? classItem.students.length : 0) ||
            0;

          if (!gradeGroups[gradeLevel]) {
            gradeGroups[gradeLevel] = {
              id: `grade-${gradeLevel}`,
              name: `Khối ${gradeLevel}`,
              gradeLevel: gradeLevel,
              studentCount: 0,
              ageRange: getAgeRangeByGrade(gradeLevel),
              classes: [],
              classCount: 0,
            };
          }

          gradeGroups[gradeLevel].studentCount += studentCount;
          gradeGroups[gradeLevel].classes.push(
            classItem.className || classItem.name
          );
          gradeGroups[gradeLevel].classCount += 1;
        });

        // Convert to array and sort by grade level
        const transformedData = Object.values(gradeGroups).sort(
          (a, b) => a.gradeLevel - b.gradeLevel
        );
        setAvailableGrades(transformedData);
      } catch (error) {
        console.error("Error loading active classes:", error);
        setGradesError("Không thể tải danh sách lớp học. Vui lòng thử lại.");
        // Fallback to empty array on error
        setAvailableGrades([]);
      } finally {
        setLoadingGrades(false);
      }
    };

    loadActiveClasses();
  }, []);

  // Calculated values
  const totalStudents = calculateTotalStudents(
    formData.targetGrades,
    availableGrades
  );

  // Check for schedule conflicts when date/time changes
  useEffect(() => {
    if (formData.scheduledDateTime) {
      const conflicts = checkScheduleConflicts(
        formData.scheduledDateTime,
        formData.location
      );
      setScheduleConflicts(conflicts);
    } else {
      setScheduleConflicts([]);
    }
  }, [formData.scheduledDateTime, formData.location]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("vaccination_draft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (error) {
        console.error("Error loading draft:", error);
      }
    }
  }, []);

  // Handle input changes
  const handleInputChange = useCallback(
    (fieldOrEvent, value) => {
      let field, actualValue;

      // Check if first parameter is an event object with target property
      if (
        fieldOrEvent &&
        typeof fieldOrEvent === "object" &&
        fieldOrEvent.target
      ) {
        field = fieldOrEvent.target.name;
        actualValue = fieldOrEvent.target.value;
      } else {
        // Direct field and value parameters
        field = fieldOrEvent;
        actualValue = value;
      }

      // Validate that we have the required parameters
      if (typeof field !== "string") {
        console.error("handleInputChange: field must be a string", {
          field,
          actualValue,
        });
        return;
      }

      setFormData((prev) => {
        const newData = { ...prev };

        // Handle nested fields
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          newData[parent] = {
            ...newData[parent],
            [child]: actualValue,
          };
        } else {
          newData[field] = actualValue;
        }

        return newData;
      });

      // Clear validation error for this field
      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  // Handle grade selection
  const handleGradeSelection = useCallback(
    (gradeId) => {
      setFormData((prev) => ({
        ...prev,
        targetGrades: prev.targetGrades.includes(gradeId)
          ? prev.targetGrades.filter((id) => id !== gradeId)
          : [...prev.targetGrades, gradeId],
      }));

      // Clear validation error
      if (validationErrors.targetGrades) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.targetGrades;
          return newErrors;
        });
      }
    },
    [validationErrors.targetGrades]
  );

  // Step navigation
  const handleNext = useCallback(() => {
    const errors = validateFormStep(currentStep, formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5)); // Max 5 steps now
    return true;
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback(
    (step) => {
      // Don't allow going to future steps if current or previous steps have validation errors
      if (step > currentStep) {
        // Validate all steps from 1 to the target step - 1
        for (let i = 1; i < step; i++) {
          const errors = validateFormStep(i, formData);
          if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false; // Don't allow navigation
          }
        }
      }

      // Clear validation errors and allow navigation
      setValidationErrors({});
      setCurrentStep(step);
      return true;
    },
    [currentStep, formData]
  );

  // Save draft functionality
  const saveDraft = useCallback(async () => {
    setLoading(true);
    try {
      // Mock API call - in real app, save to backend
      const draftData = {
        ...formData,
        status: "draft",
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem("vaccination_draft", JSON.stringify(draftData));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return { success: true, message: "Bản nháp đã được lưu" };
    } catch (error) {
      return { success: false, message: "Lỗi khi lưu bản nháp" };
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Load draft functionality
  const loadDraft = useCallback(async () => {
    setLoading(true);
    try {
      const savedDraft = localStorage.getItem("vaccination_draft");
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        return { success: true, message: "Bản nháp đã được tải" };
      }
      return { success: false, message: "Không tìm thấy bản nháp" };
    } catch (error) {
      return { success: false, message: "Lỗi khi tải bản nháp" };
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit form
  const handleSubmit = useCallback(async () => {
    // Complete form validation before submission
    const completeValidationErrors = validateCompleteForm(formData);
    if (Object.keys(completeValidationErrors).length > 0) {
      setValidationErrors(completeValidationErrors);
      throw new Error("Vui lòng kiểm tra và sửa các lỗi trong form");
    }

    // Final step validation
    const stepErrors = validateFormStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      throw new Error("Vui lòng hoàn thành thông tin ở bước hiện tại");
    }

    // Check for high severity conflicts
    const highSeverityConflicts = scheduleConflicts.filter(
      (conflict) => conflict.severity === "error"
    );
    if (highSeverityConflicts.length > 0) {
      throw new Error(
        "Cần giải quyết các xung đột lịch trình nghiêm trọng trước khi gửi"
      );
    }

    setLoading(true);

    try {
      // Clear any previous validation errors
      setValidationErrors({});

      // Enhanced data mapping for API submission
      const vaccinationData = {
        // Basic information
        title: formData.title?.trim(),
        description: formData.description?.trim() || "",
        scheduledDateTime: formData.scheduledDateTime,
        location: formData.location?.trim(),

        // Vaccine information
        vaccineId: parseInt(formData.vaccineId),
        vaccineName:
          formData.vaccineName ||
          formData.vaccineInfo?.name ||
          `Vaccine ${formData.vaccineId}`,

        // Target classes - ensure it's an array of valid IDs
        targetGrades: Array.isArray(formData.targetGrades)
          ? formData.targetGrades.filter(
              (id) => id && typeof id === "string" && id.trim() !== ""
            )
          : [],

        // Additional metadata
        totalStudents,
        submittedAt: new Date().toISOString(),
        status: "pending_approval",

        // Requirements and approvals
        requiresConsent: formData.requiresConsent !== false, // default true
        requiresApproval: formData.requiresApproval === true, // default false
        approvalLevel: formData.approvalLevel || "nurse_supervisor",

        // Communication
        parentNotificationMessage:
          formData.parentNotificationMessage?.trim() || "",
        teacherInstructions: formData.teacherInstructions?.trim() || "",
        notes: formData.notes?.trim() || "",
      };

      // Final data validation before API call
      if (!vaccinationData.title) {
        throw new Error("Tiêu đề không được để trống");
      }

      if (!vaccinationData.scheduledDateTime) {
        throw new Error("Thời gian thực hiện không được để trống");
      }

      if (!vaccinationData.location) {
        throw new Error("Địa điểm không được để trống");
      }

      if (!vaccinationData.vaccineId || vaccinationData.vaccineId <= 0) {
        throw new Error("ID vaccine không hợp lệ");
      }

      if (!vaccinationData.targetGrades.length) {
        throw new Error("Phải chọn ít nhất một lớp học");
      }

      // Call real API to create vaccination schedule
      const result = await injectionFormService.createVaccinationSchedule(
        vaccinationData
      );

      if (result.success) {
        // Clear draft after successful submission
        localStorage.removeItem("vaccination_draft");

        return {
          success: true,
          message:
            result.message || "Kế hoạch tiêm chủng đã được tạo thành công!",
          data: result.data,
        };
      } else {
        // Handle specific API errors
        let errorMessage =
          result.message || "Không thể tạo kế hoạch tiêm chủng";

        // Check for specific error cases
        if (result.message?.includes("Student not found")) {
          errorMessage = "Một số học sinh không tồn tại trong hệ thống";
        } else if (result.message?.includes("StudentId is required")) {
          errorMessage = "Thiếu thông tin ID học sinh";
        } else if (result.message?.includes("Parent not found")) {
          errorMessage = "Không tìm thấy thông tin phụ huynh";
        } else if (result.message?.includes("Invalid consent status")) {
          errorMessage = "Trạng thái đồng ý không hợp lệ";
        } else if (result.message?.includes("Không tìm thấy học sinh nào")) {
          errorMessage =
            "Không tìm thấy học sinh nào trong các lớp đã chọn. Vui lòng kiểm tra lại danh sách lớp.";
        } else if (result.message?.includes("Cần chọn ít nhất một lớp học")) {
          errorMessage = "Vui lòng chọn ít nhất một lớp học để tiêm chủng";
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting vaccination schedule:", error);

      // Enhanced error handling with specific messages
      let errorMessage = "Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage =
          "Dữ liệu gửi không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (error.response?.status === 500) {
        errorMessage = "Lỗi hệ thống. Vui lòng liên hệ quản trị viên.";
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền thực hiện chức năng này.";
      }

      return {
        success: false,
        message: errorMessage,
        error: error,
      };
    } finally {
      setLoading(false);
    }
  }, [formData, scheduleConflicts, totalStudents, currentStep]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setValidationErrors({});
    setScheduleConflicts([]);
    localStorage.removeItem("vaccination_draft");
  }, []);

  // Retry loading grades function
  const retryLoadGrades = useCallback(async () => {
    setLoadingGrades(true);
    setGradesError(null);
    try {
      const classesData = await getActiveClasses();

      // Group classes by grade level to match HealthCheck pattern
      const gradeGroups = {};

      classesData.forEach((classItem) => {
        const gradeLevel = classItem.gradeLevel;
        const studentCount =
          classItem.currentStudentCount ||
          classItem.studentCount ||
          (classItem.students ? classItem.students.length : 0) ||
          0;

        if (!gradeGroups[gradeLevel]) {
          gradeGroups[gradeLevel] = {
            id: `grade-${gradeLevel}`,
            name: `Khối ${gradeLevel}`,
            gradeLevel: gradeLevel,
            studentCount: 0,
            ageRange: getAgeRangeByGrade(gradeLevel),
            classes: [],
            classCount: 0,
          };
        }

        gradeGroups[gradeLevel].studentCount += studentCount;
        gradeGroups[gradeLevel].classes.push(
          classItem.className || classItem.name
        );
        gradeGroups[gradeLevel].classCount += 1;
      });

      // Convert to array and sort by grade level
      const transformedData = Object.values(gradeGroups).sort(
        (a, b) => a.gradeLevel - b.gradeLevel
      );
      setAvailableGrades(transformedData);
    } catch (error) {
      console.error("Error retrying to load active classes:", error);
      setGradesError("Không thể tải danh sách lớp học. Vui lòng thử lại.");
      setAvailableGrades([]);
    } finally {
      setLoadingGrades(false);
    }
  }, []);

  return {
    // State
    loading,
    currentStep,
    formData,
    validationErrors,
    scheduleConflicts,
    availableGrades,
    loadingGrades,
    gradesError,

    // Calculated values
    totalStudents,

    // Actions
    handleInputChange,
    handleGradeSelection,
    handleNext,
    handlePrevious,
    goToStep,
    saveDraft,
    loadDraft,
    handleSubmit,
    resetForm,
    retryLoadGrades,
  };
};
