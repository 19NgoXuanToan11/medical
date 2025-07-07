import { useState, useEffect, useCallback } from "react";
import {
  calculateTotalStudents,
  calculateRequiredSessions,
  calculateResourceRequirements,
  calculateEndTime,
  validateFormStep,
  checkScheduleConflicts,
  generateHealthCheckNotificationTemplate,
  getSeasonText,
} from "../utils/healthCheckHelpers";
import {
  availableGradesData,
  healthCheckItemsData,
  initialFormData,
} from "../data/healthCheckData";
import { createHealthCheck } from "../../../../utils/api/healthCheck/healthCheckService";

export const useHealthCheckForm = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  const [availableGrades] = useState(availableGradesData);
  const [healthCheckItems] = useState(healthCheckItemsData);

  // Calculated values
  const totalStudents = calculateTotalStudents(
    formData.targetGrades,
    availableGrades
  );
  const sessions = calculateRequiredSessions(
    totalStudents,
    formData.maxStudentsPerSession
  );
  const resourceReqs = calculateResourceRequirements(
    totalStudents,
    formData.checkItems,
    healthCheckItems
  );

  // Auto-calculate end time when start time or duration changes
  useEffect(() => {
    if (formData.scheduledTime && formData.estimatedDuration) {
      const endTime = calculateEndTime(
        formData.scheduledTime,
        formData.estimatedDuration
      );
      if (endTime && endTime !== formData.endTime) {
        setFormData((prev) => ({ ...prev, endTime }));
      }
    }
  }, [formData.scheduledTime, formData.estimatedDuration]);

  // Auto-update health check details when check items change
  useEffect(() => {
    if (formData.checkItems.length > 0 && healthCheckItems.length > 0) {
      const totalEstimatedTime = formData.checkItems.reduce((total, itemId) => {
        const item = healthCheckItems.find((h) => h.id === itemId);
        return total + (item?.estimatedTime || 10);
      }, 0);

      const allEquipment = [
        ...new Set(
          formData.checkItems.flatMap((itemId) => {
            const item = healthCheckItems.find((h) => h.id === itemId);
            return item?.equipment || [];
          })
        ),
      ];

      setFormData((prev) => ({
        ...prev,
        estimatedDuration: Math.max(totalEstimatedTime + 30, 60), // Add 30min buffer, min 60min
        equipmentNeeded: allEquipment,
        title: prev.title || `Khám sức khỏe định kỳ - ${getSeasonText()}`,
        parentNotificationMessage: generateHealthCheckNotificationTemplate(
          formData.checkItems,
          healthCheckItems,
          formData
        ),
      }));
    }
  }, [formData.checkItems, healthCheckItems]);

  // Check for schedule conflicts with delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        formData.scheduledDate &&
        formData.scheduledTime &&
        formData.location
      ) {
        const conflicts = checkScheduleConflicts(formData);
        setScheduleConflicts(conflicts);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    formData.scheduledDate,
    formData.scheduledTime,
    formData.endTime,
    formData.location,
    formData.equipmentNeeded,
  ]);

  // Handle input changes
  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const newData = { ...prev };

        // Handle nested fields
        if (field.includes(".")) {
          const [parent, child] = field.split(".");
          newData[parent] = {
            ...newData[parent],
            [child]: value,
          };
        } else {
          newData[field] = value;
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
      setFormData((prev) => {
        const newTargetGrades = prev.targetGrades.includes(gradeId)
          ? prev.targetGrades.filter((id) => id !== gradeId)
          : [...prev.targetGrades, gradeId];

        const totalStudents = newTargetGrades.reduce((total, id) => {
          const grade = availableGrades.find((g) => g.id === id);
          return total + (grade?.studentCount || 0);
        }, 0);

        return {
          ...prev,
          targetGrades: newTargetGrades,
          requiresApproval:
            totalStudents > 100 || prev.urgencyLevel === "urgent",
          approvalLevel: totalStudents > 200 ? "manager" : "nurse_supervisor",
        };
      });

      // Clear validation error
      if (validationErrors.targetGrades) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.targetGrades;
          return newErrors;
        });
      }
    },
    [availableGrades, validationErrors.targetGrades]
  );

  // Handle check item toggle
  const handleCheckItemToggle = useCallback(
    (itemId) => {
      setFormData((prev) => {
        const newCheckItems = prev.checkItems.includes(itemId)
          ? prev.checkItems.filter((id) => id !== itemId)
          : [...prev.checkItems, itemId];

        return {
          ...prev,
          checkItems: newCheckItems,
        };
      });

      // Clear validation error
      if (validationErrors.checkItems) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.checkItems;
          return newErrors;
        });
      }
    },
    [validationErrors.checkItems]
  );

  // Step navigation
  const handleNext = useCallback(() => {
    const errors = validateFormStep(currentStep, formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    return true;
  }, [currentStep, formData]);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  // Save draft functionality
  const saveDraft = useCallback(async () => {
    setLoading(true);
    try {
      const draftData = {
        ...formData,
        status: "draft",
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem("healthcheck_draft", JSON.stringify(draftData));

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
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem("healthcheck_draft");
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        return true;
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
    return false;
  }, []);

  // Submit form
  const handleSubmit = useCallback(async () => {
    // Final validation for all steps
    const allErrors = {};
    for (let step = 1; step <= 3; step++) {
      const stepErrors = validateFormStep(step, formData);
      Object.assign(allErrors, stepErrors);
    }

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      return { success: false, message: "Vui lòng kiểm tra lại thông tin" };
    }

    // Check for critical conflicts
    const criticalConflicts = scheduleConflicts.filter(
      (c) => c.severity === "error"
    );
    if (criticalConflicts.length > 0) {
      return {
        success: false,
        message: "Có xung đột nghiêm trọng về lịch trình. Vui lòng điều chỉnh.",
      };
    }

    setLoading(true);
    try {
      // Map form data to complete API schema
      const submissionData = {
        formId: formData.formId || 0,
        title: formData.title,
        scheduledDate: formData.scheduledDate,
        startTime: formData.scheduledTime,
        estimatedDuration: formData.estimatedDuration,
        description: formData.description,
        location: formData.location,
        studentId: formData.studentId || 0,
        parentId: formData.parentId || 0,
        createdDate: new Date().toISOString(),
        consentStatus: formData.consentStatus || "pending",
        consentDate: formData.consentDate || null,
        confirmStatus: formData.confirmStatus || "pending",
        confirmedBy: formData.confirmedBy || 0,
        confirmedDate: formData.confirmedDate || null,
        className: formData.className || "",
        gradeIds: JSON.stringify(formData.targetGrades),
        totalStudents: totalStudents,
        notifyParents: formData.notifyParents,
        autoAdvance: formData.autoAdvance,
        saveResults: formData.saveResults,
        generateReport: formData.generateReport,
        requireParentConfirmation: formData.requireParentConfirmation,
        selectedStations: JSON.stringify(formData.checkItems),
        staffAssigned: formData.staffAssigned || "",
        status: "Scheduled",
        estimatedEndTime: formData.endTime || "",
        student: formData.student || null,
        parent: formData.parent || null,
        confirmedByStaff: formData.confirmedByStaff || null,
        results: formData.results || [],
        grades: formData.targetGrades || [],
      };
      console.log("Submitting health check data:", submissionData);
      const response = await createHealthCheck(submissionData);
      console.log("API response:", response);
      // Clear draft after successful submission
      localStorage.removeItem("healthcheck_draft");
      return {
        success: true,
        message: "Kế hoạch khám sức khỏe đã được gửi thành công!",
        data: response,
      };
    } catch (error) {
      console.error("Error creating health check schedule:", error);
      return {
        success: false,
        message:
          error.message || "Có lỗi xảy ra khi gửi kế hoạch. Vui lòng thử lại.",
      };
    } finally {
      setLoading(false);
    }
  }, [formData, scheduleConflicts, totalStudents, resourceReqs]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setValidationErrors({});
    setScheduleConflicts([]);
    localStorage.removeItem("healthcheck_draft");
  }, []);

  return {
    // State
    loading,
    currentStep,
    formData,
    validationErrors,
    scheduleConflicts,
    availableGrades,
    healthCheckItems,

    // Calculated values
    totalStudents,
    sessions,
    resourceReqs,

    // Actions
    handleInputChange,
    handleGradeSelection,
    handleCheckItemToggle,
    handleNext,
    handlePrevious,
    goToStep,
    saveDraft,
    loadDraft,
    handleSubmit,
    resetForm,
  };
};
