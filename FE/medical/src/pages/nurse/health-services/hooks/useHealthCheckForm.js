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
  // availableGradesData, // Remove mock data import for classes
  initialFormData,
  healthCheckItemsData,
} from "../data/healthCheckData";
import { createHealthCheck } from "../../../../utils/api/healthCheck/healthCheckService";
import { checkEquipmentAvailability } from "../../../../utils/api/medicalSupply/medicalSupplyService";
// Add import for health check items API
import { healthCheckItemService } from "../../../../utils/api/healthCheckItem/healthCheckItemService";
// Add import for class API
import { getActiveClasses } from "../../../../utils/api/class/classService";

export const useHealthCheckForm = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});
  const [scheduleConflicts, setScheduleConflicts] = useState([]);
  // Replace mock data with real API data for both items and classes
  const [availableGrades, setAvailableGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [healthCheckItems, setHealthCheckItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [equipmentStatus, setEquipmentStatus] = useState(null);

  // Load health check items from API on component mount
  useEffect(() => {
    const loadHealthCheckItems = async () => {
      setLoadingItems(true);
      try {
        const result =
          await healthCheckItemService.getHealthCheckItemsWithMedicalSupplies();

        // Handle different response structures
        let dataArray = null;

        if (result?.success && result?.data) {
          dataArray = result.data;
        } else if (result?.data) {
          dataArray = result.data;
        } else if (Array.isArray(result)) {
          dataArray = result;
        }

        if (dataArray && Array.isArray(dataArray) && dataArray.length > 0) {
          // Transform API data to match expected UI format
          const transformedItems = dataArray.map((item) => {
            // Create equipment array from requiredMedicalSupplies
            let equipment = [];

            if (
              item.requiredMedicalSupplies &&
              Array.isArray(item.requiredMedicalSupplies)
            ) {
              equipment = item.requiredMedicalSupplies
                .map((supply) => {
                  // Handle different possible structures
                  if (supply.medicalSupply && supply.medicalSupply.name) {
                    return supply.medicalSupply.name;
                  } else if (supply.medicalSupplyName) {
                    return supply.medicalSupplyName;
                  } else if (supply.name) {
                    return supply.name;
                  } else if (typeof supply === "string") {
                    return supply;
                  } else {
                    return null;
                  }
                })
                .filter(
                  (name) =>
                    name !== null && name !== undefined && name.trim() !== ""
                ); // Remove null/empty values
            }

            return {
              id: item.itemId || item.id,
              name: item.name,
              category: item.category ? item.category.toLowerCase() : "general",
              estimatedTime:
                item.estimatedTimeMinutes || item.estimatedTime || 10,
              description: item.description || "",
              equipment: equipment,
              isActive: item.isActive !== false, // Default to true if not specified
              requiredMedicalSupplies: item.requiredMedicalSupplies || [],
            };
          });

          setHealthCheckItems(transformedItems);
        } else {
          setHealthCheckItems(healthCheckItemsData);
        }
      } catch (error) {
        setHealthCheckItems(healthCheckItemsData);
      } finally {
        setLoadingItems(false);
      }
    };

    loadHealthCheckItems();
  }, []);

  // Load active classes from API on component mount
  useEffect(() => {
    const loadActiveClasses = async () => {
      setLoadingGrades(true);
      try {
        const result = await getActiveClasses();

        // Handle different response structures
        let classesArray = null;

        if (result?.success && result?.data) {
          classesArray = result.data;
        } else if (result?.data) {
          classesArray = result.data;
        } else if (Array.isArray(result)) {
          classesArray = result;
        }

        if (classesArray && Array.isArray(classesArray)) {
          // Transform API data to match expected UI format
          const transformedClasses = classesArray.map((classItem) => ({
            id: classItem.classId || classItem.id,
            name: classItem.className || classItem.name,
            gradeLevel: classItem.gradeLevel,
            studentCount:
              classItem.currentStudentCount ||
              classItem.totalStudents ||
              classItem.studentCount ||
              0,
            isActive: classItem.isActive !== false, // Default to true if not specified
          }));

          setAvailableGrades(transformedClasses);
        } else {
          console.warn("No valid classes data found in API response");
          setAvailableGrades([]);
        }
      } catch (error) {
        console.error("Error loading active classes:", error);
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
  const sessions = calculateRequiredSessions(
    totalStudents,
    formData.maxStudentsPerSession
  );
  const resourceReqs = calculateResourceRequirements(
    totalStudents,
    formData.checkItems,
    healthCheckItems
  );

  // Helper function to get selected equipment with medical supplies data
  const getSelectedEquipment = useCallback(() => {
    const equipment = new Set();

    formData.checkItems.forEach((itemId) => {
      // Convert itemId to both string and number for comparison
      const numId = typeof itemId === "string" ? parseInt(itemId) : itemId;
      const strId = String(itemId);

      // Try multiple ways to find the item
      let item = healthCheckItems.find((h) => {
        return (
          h.id === itemId ||
          h.id === numId ||
          h.id === strId ||
          h.itemId === itemId ||
          h.itemId === numId ||
          h.itemId === strId
        );
      });

      if (item?.requiredMedicalSupplies) {
        // Use medical supplies data from API
        item.requiredMedicalSupplies.forEach((supplyItem) => {
          const supplyName =
            supplyItem.medicalSupply?.name ||
            supplyItem.medicalSupplyName ||
            supplyItem.name;
          if (supplyName) {
            equipment.add(supplyName);
          }
        });
      } else if (item?.equipment) {
        // Fallback to equipment array for compatibility
        item.equipment.forEach((eq) => equipment.add(eq));
      }
    });

    const result = Array.from(equipment);
    return result;
  }, [formData.checkItems, healthCheckItems]);

  // Create equipment status directly from health check data
  const createEquipmentStatusFromHealthCheckData = useCallback(() => {
    const equipmentMap = new Map();

    formData.checkItems.forEach((itemId) => {
      // Convert itemId to both string and number for comparison
      const numId = typeof itemId === "string" ? parseInt(itemId) : itemId;
      const strId = String(itemId);

      // Try multiple ways to find the item
      let item = healthCheckItems.find((h) => {
        return (
          h.id === itemId ||
          h.id === numId ||
          h.id === strId ||
          h.itemId === itemId ||
          h.itemId === numId ||
          h.itemId === strId
        );
      });

      if (item?.requiredMedicalSupplies) {
        item.requiredMedicalSupplies.forEach((supplyItem) => {
          const key =
            supplyItem.medicalSupplyName ||
            supplyItem.medicalSupply?.name ||
            supplyItem.name;
          if (key) {
            if (!equipmentMap.has(key)) {
              equipmentMap.set(key, {
                name: key,
                available: true,
                stockQuantity: supplyItem.stockQuantity || 0,
                isInStock: (supplyItem.stockQuantity || 0) > 0,
                isActive: supplyItem.isActive !== false,
                supply: supplyItem,
                requiredQuantity: supplyItem.quantityRequired || 1,
              });
            } else {
              // Add to required quantity if same equipment needed multiple times
              const existing = equipmentMap.get(key);
              existing.requiredQuantity += supplyItem.quantityRequired || 1;
            }
          }
        });
      }
    });

    const equipment = Array.from(equipmentMap.values());
    const unavailableEquipment = equipment.filter(
      (eq) => !eq.available || !eq.isActive
    );
    const outOfStockEquipment = equipment.filter(
      (eq) => eq.available && eq.isActive && !eq.isInStock
    );

    return {
      equipment,
      hasUnavailable: unavailableEquipment.length > 0,
      hasOutOfStock: outOfStockEquipment.length > 0,
      unavailableEquipment,
      outOfStockEquipment,
      allAvailable:
        unavailableEquipment.length === 0 && outOfStockEquipment.length === 0,
    };
  }, [formData.checkItems, healthCheckItems]);

  // Check equipment availability when check items change
  useEffect(() => {
    const checkEquipment = async () => {
      if (formData.checkItems.length === 0) {
        setEquipmentStatus(null);
        return;
      }

      try {
        // First try to create status from health check data (includes stock info)
        const statusFromHealthCheckData =
          createEquipmentStatusFromHealthCheckData();

        if (statusFromHealthCheckData.equipment.length > 0) {
          setEquipmentStatus(statusFromHealthCheckData);
        } else {
          // Fallback to old method for compatibility
          const selectedEquipment = getSelectedEquipment();

          if (selectedEquipment.length === 0) {
            setEquipmentStatus(null);
            return;
          }

          const status = await checkEquipmentAvailability(selectedEquipment);
          setEquipmentStatus(status);
        }
      } catch (error) {
        setEquipmentStatus({
          equipment: getSelectedEquipment().map((eq) => ({
            name: eq,
            available: false,
            stockQuantity: 0,
            isInStock: false,
            supply: null,
          })),
          hasUnavailable: true,
          hasOutOfStock: false,
          unavailableEquipment: getSelectedEquipment().map((eq) => ({
            name: eq,
          })),
          outOfStockEquipment: [],
          allAvailable: false,
        });
      }
    };

    checkEquipment();
  }, [
    formData.checkItems,
    getSelectedEquipment,
    createEquipmentStatusFromHealthCheckData,
  ]);

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
      const draftData = {
        ...formData,
        status: "draft",
        lastModified: new Date().toISOString(),
        equipmentStatus: equipmentStatus, // Save equipment status with draft
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
  }, [formData, equipmentStatus]);

  // Load draft functionality
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem("healthcheck_draft");
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        if (draftData.equipmentStatus) {
          setEquipmentStatus(draftData.equipmentStatus);
        }
        return true;
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
    return false;
  }, []);

  // Generate equipment report for submission
  const generateEquipmentReport = useCallback(() => {
    if (!equipmentStatus) return null;

    const report = {
      totalEquipmentNeeded: equipmentStatus.equipment.length,
      allAvailable: equipmentStatus.allAvailable,
      hasUnavailable: equipmentStatus.hasUnavailable,
      hasOutOfStock: equipmentStatus.hasOutOfStock,
      availableEquipment: equipmentStatus.equipment.filter(
        (eq) => eq.available && eq.isInStock
      ),
      unavailableEquipment: equipmentStatus.unavailableEquipment,
      outOfStockEquipment: equipmentStatus.outOfStockEquipment,
      summary: equipmentStatus.allAvailable
        ? "Tất cả thiết bị cần thiết đều có sẵn và đủ số lượng."
        : equipmentStatus.hasUnavailable
        ? `Thiếu ${equipmentStatus.unavailableEquipment.length} thiết bị không có trong kho. Cần liên hệ để bổ sung thiết bị.`
        : `${equipmentStatus.outOfStockEquipment.length} thiết bị đã hết hàng. Cần nhập thêm trước khi thực hiện khám.`,
      requiresAction: !equipmentStatus.allAvailable,
      actionRequired: equipmentStatus.hasUnavailable
        ? "Cần mua/cho mượn thiết bị thiếu"
        : equipmentStatus.hasOutOfStock
        ? "Cần nhập thêm thiết bị hết hàng"
        : null,
    };

    return report;
  }, [equipmentStatus]);

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
      return {
        success: false,
        message: `Vui lòng kiểm tra lại thông tin: ${Object.keys(
          allErrors
        ).join(", ")}`,
      };
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
      // Generate equipment report
      const equipmentReport = generateEquipmentReport();

      // Create equipment notification for manager if there are issues
      let managerNotification = "";
      if (equipmentReport && equipmentReport.requiresAction) {
        managerNotification = `
THÔNG BÁO THIẾT BỊ CẦN CHÚ Ý:

${equipmentReport.summary}

Chi tiết:
${
  equipmentReport.hasUnavailable
    ? `
• Thiết bị không có sẵn (${equipmentReport.unavailableEquipment.length}):
${equipmentReport.unavailableEquipment.map((eq) => `  - ${eq.name}`).join("\n")}
`
    : ""
}${
          equipmentReport.hasOutOfStock
            ? `
• Thiết bị hết hàng (${equipmentReport.outOfStockEquipment.length}):
${equipmentReport.outOfStockEquipment.map((eq) => `  - ${eq.name}`).join("\n")}
`
            : ""
        }

Hành động cần thiết: ${equipmentReport.actionRequired}

Vui lòng xem xét và chuẩn bị thiết bị trước ngày thực hiện khám.
        `.trim();
      }

      // Ensure title is not empty
      const finalTitle =
        formData.title ||
        `Khám sức khỏe định kỳ - ${new Date().toLocaleDateString("vi-VN")}`;

      // Ensure description has content
      const finalDescription =
        (formData.description || "Khám sức khỏe định kỳ cho học sinh") +
        (managerNotification ? `\n\n${managerNotification}` : "");

      // Format date as ISO string for backend
      const scheduledDateISO = formData.scheduledDate
        ? new Date(formData.scheduledDate).toISOString().split("T")[0] +
          "T00:00:00.000Z"
        : new Date().toISOString();

      // Format time as TimeSpan string (HH:mm:ss) for backend
      const startTimeFormatted = formData.scheduledTime
        ? `${formData.scheduledTime}:00`
        : "08:00:00";

      // Ensure gradeIds is properly formatted as JSON string
      const gradeIdsFormatted =
        formData.targetGrades && Array.isArray(formData.targetGrades)
          ? JSON.stringify(formData.targetGrades.map((g) => String(g)))
          : JSON.stringify([]);

      // Map form data to API schema with proper validation
      const submissionData = {
        FormId: 0, // Always 0 for new forms
        Title: finalTitle,
        ScheduledDate: scheduledDateISO,
        StartTime: startTimeFormatted, // Backend expects TimeSpan format
        EstimatedDuration: formData.estimatedDuration || 60,
        Description: finalDescription,
        Location: formData.location || "Phòng y tế trường",
        StudentId: null,
        ParentId: null,
        CreatedDate: new Date().toISOString(),
        ConsentStatus: "pending",
        ConsentDate: null,
        ConfirmStatus: "pending",
        ConfirmedBy: null,
        ConfirmedDate: null,
        ClassName: null,
        GradeIds: gradeIdsFormatted, // Required field - must not be empty
        TotalStudents: totalStudents || 0,
        NotifyParents: formData.notifyParents === true,
        AutoAdvance: formData.autoAdvance === true,
        SaveResults: formData.saveResults === true,
        GenerateReport: formData.generateReport === true,
        RequireParentConfirmation: formData.requireParentConfirmation === true,
        SelectedStations: JSON.stringify(formData.checkItems || []),
        StaffAssigned: null,
        Status: "pending",
        EstimatedEndTime: formData.endTime || null,
        Student: null,
        Parent: null,
        ConfirmedByStaff: null,
        Results: null,
      };

      // Set default values for missing fields to pass validation
      if (!formData.checkItems || formData.checkItems.length === 0) {
        console.warn("No checkItems selected, using default");
        formData.checkItems = ["general"]; // Default check item
      }

      if (
        !formData.maxStudentsPerSession ||
        formData.maxStudentsPerSession < 1
      ) {
        console.warn("maxStudentsPerSession missing, using default");
        formData.maxStudentsPerSession = 50;
      }

      if (!formData.estimatedDuration || formData.estimatedDuration < 30) {
        console.warn("estimatedDuration missing, using default");
        formData.estimatedDuration = 60;
      }

      // Validate required fields before sending
      if (!submissionData.Title || submissionData.Title.trim() === "") {
        return { success: false, message: "Tiêu đề không được để trống" };
      }

      if (!submissionData.ScheduledDate) {
        return { success: false, message: "Ngày khám không được để trống" };
      }

      if (!submissionData.GradeIds || submissionData.GradeIds === "[]") {
        return { success: false, message: "Phải chọn ít nhất một lớp học" };
      }

      const response = await createHealthCheck(submissionData);

      // Clear draft after successful submission
      localStorage.removeItem("healthcheck_draft");

      // Create success message based on equipment status
      let successMessage = "Kế hoạch khám sức khỏe đã được gửi thành công!";
      if (equipmentReport?.requiresAction) {
        successMessage +=
          " Lưu ý: Đã gửi thông báo về tình trạng thiết bị cho quản lý để xem xét.";
      }

      return {
        success: true,
        message: successMessage,
        data: response,
        equipmentWarning: equipmentReport?.requiresAction || false,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Có lỗi xảy ra khi gửi kế hoạch. Vui lòng thử lại.",
      };
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    scheduleConflicts,
    totalStudents,
    resourceReqs,
    generateEquipmentReport,
  ]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setValidationErrors({});
    setScheduleConflicts([]);
    setEquipmentStatus(null);
    localStorage.removeItem("healthcheck_draft");
  }, []);

  return {
    // State
    loading,
    loadingItems,
    loadingGrades,
    currentStep,
    formData,
    validationErrors,
    scheduleConflicts,
    availableGrades,
    healthCheckItems,
    equipmentStatus,

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
    getSelectedEquipment,
    generateEquipmentReport,
  };
};
