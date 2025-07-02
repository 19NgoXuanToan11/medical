import { useState, useEffect, useCallback } from "react";
import {
  calculateTotalStudents,
  validateFormStep,
  checkScheduleConflicts,
} from "../utils/vaccinationHelpers";
import { availableGradesData, initialFormData } from "../data/vaccinationData";

export const useVaccinationForm = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  const [availableGrades] = useState(availableGradesData);

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
    setCurrentStep((prev) => Math.min(prev + 1, 3)); // Max 3 steps now
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
    // Final validation
    const errors = validateFormStep(currentStep, formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      throw new Error("Validation failed");
    }

    // Check for high severity conflicts
    const highSeverityConflicts = scheduleConflicts.filter(
      (conflict) => conflict.severity === "error"
    );
    if (highSeverityConflicts.length > 0) {
      throw new Error("Schedule conflicts must be resolved");
    }

    setLoading(true);

    try {
      // Mock API call - in real app, submit to backend
      const submissionData = {
        ...formData,
        totalStudents,
        submittedAt: new Date().toISOString(),
        status: "pending_approval",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear draft after successful submission
      localStorage.removeItem("vaccination_draft");

      return {
        success: true,
        message: "Kế hoạch tiêm chủng đã được gửi thành công!",
        data: submissionData,
      };
    } catch (error) {
      return {
        success: false,
        message: "Có lỗi xảy ra khi gửi kế hoạch. Vui lòng thử lại.",
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

  return {
    // State
    loading,
    currentStep,
    formData,
    validationErrors,
    scheduleConflicts,
    availableGrades,

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
  };
};
