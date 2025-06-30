import { useState, useEffect, useCallback } from 'react';
import {
    calculateTotalStudents,
    calculateEstimatedCost,
    calculateRequiredSessions,
    calculateResourceRequirements,
    calculateEndTime,
    validateFormStep,
    checkScheduleConflicts,
    generateParentNotificationTemplate
} from '../utils/vaccinationHelpers';
import {
    availableGradesData,
    vaccineTypesData,
    initialFormData
} from '../data/vaccinationData';

export const useVaccinationForm = () => {
    // State management
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);
    const [validationErrors, setValidationErrors] = useState({});
    const [scheduleConflicts, setScheduleConflicts] = useState([]);
    const [availableGrades] = useState(availableGradesData);
    const [vaccineTypes] = useState(vaccineTypesData);

    // Calculated values
    const totalStudents = calculateTotalStudents(formData.targetGrades, availableGrades);
    const sessions = calculateRequiredSessions(totalStudents, formData.maxStudentsPerSession);
    const selectedVaccine = vaccineTypes.find(v => v.id === formData.vaccineType);
    const estimatedCost = calculateEstimatedCost(totalStudents, selectedVaccine?.costPerDose || 0);
    const resourceReqs = calculateResourceRequirements(totalStudents, formData.vaccineType);

    // Auto-calculate end time when start time or duration changes
    useEffect(() => {
        if (formData.scheduledTime && formData.estimatedDuration) {
            const endTime = calculateEndTime(formData.scheduledTime, formData.estimatedDuration * sessions);
            if (endTime && endTime !== formData.endTime) {
                setFormData(prev => ({ ...prev, endTime }));
            }
        }
    }, [formData.scheduledTime, formData.estimatedDuration, sessions]);

    // Auto-fill vaccine details when vaccine type is selected
    useEffect(() => {
        if (formData.vaccineType && selectedVaccine) {
            // Cập nhật thông tin cơ bản và notification
            setFormData(prev => ({
                ...prev,
                costPerStudent: selectedVaccine.costPerDose,
                estimatedDuration: selectedVaccine.preparationTime + selectedVaccine.observationTime,
                title: prev.title || `Tiêm ${selectedVaccine.name}`
            }));

            // Generate parent notification template with updated information
            const notificationTemplate = generateParentNotificationTemplate(formData, selectedVaccine);
            setFormData(prev => ({
                ...prev,
                parentNotificationMessage: notificationTemplate
            }));
        } else if (!formData.vaccineType) {
            // Reset thông tin nếu không có vaccine được chọn
            setFormData(prev => ({
                ...prev,
                parentNotificationMessage: ''
            }));
        }
    }, [formData.vaccineType, selectedVaccine, formData.title, formData.scheduledDate, formData.scheduledTime, formData.location]);

    // Check for schedule conflicts with delay
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (formData.scheduledDate && formData.scheduledTime && formData.location) {
                // Mock existing schedules - in real app, fetch from API
                const existingSchedules = [
                    {
                        date: formData.scheduledDate,
                        startTime: "09:00",
                        endTime: "11:00",
                        location: "Phòng y tế trường",
                        title: "Khám sức khỏe định kỳ"
                    }
                ];

                const conflicts = checkScheduleConflicts(formData, existingSchedules);
                setScheduleConflicts(conflicts);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [formData.scheduledDate, formData.scheduledTime, formData.endTime, formData.location]);

    // Handle input changes
    const handleInputChange = useCallback((fieldOrEvent, value) => {
        let field, actualValue;

        // Check if first parameter is an event object with target property
        if (fieldOrEvent && typeof fieldOrEvent === 'object' && fieldOrEvent.target) {
            field = fieldOrEvent.target.name;
            actualValue = fieldOrEvent.target.value;
        } else {
            // Direct field and value parameters
            field = fieldOrEvent;
            actualValue = value;
        }

        // Validate that we have the required parameters
        if (typeof field !== 'string') {
            console.error('handleInputChange: field must be a string', { field, actualValue });
            return;
        }

        setFormData(prev => {
            const newData = { ...prev };

            // Handle nested fields
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                newData[parent] = {
                    ...newData[parent],
                    [child]: actualValue
                };
            } else {
                newData[field] = actualValue;
            }

            return newData;
        });

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [validationErrors]);

    // Handle grade selection
    const handleGradeSelection = useCallback((gradeId) => {
        setFormData(prev => ({
            ...prev,
            targetGrades: prev.targetGrades.includes(gradeId)
                ? prev.targetGrades.filter(id => id !== gradeId)
                : [...prev.targetGrades, gradeId]
        }));

        // Clear validation error
        if (validationErrors.targetGrades) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.targetGrades;
                return newErrors;
            });
        }
    }, [validationErrors.targetGrades]);

    // Step navigation
    const handleNext = useCallback(() => {
        const errors = validateFormStep(currentStep, formData);

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return false;
        }

        setValidationErrors({});
        setCurrentStep(prev => Math.min(prev + 1, 4));
        return true;
    }, [currentStep, formData]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
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
                status: 'draft',
                lastModified: new Date().toISOString()
            };

            localStorage.setItem('vaccination_draft', JSON.stringify(draftData));

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return { success: true, message: 'Bản nháp đã được lưu' };
        } catch (error) {
            return { success: false, message: 'Lỗi khi lưu bản nháp' };
        } finally {
            setLoading(false);
        }
    }, [formData]);

    // Load draft functionality
    const loadDraft = useCallback(() => {
        try {
            const savedDraft = localStorage.getItem('vaccination_draft');
            if (savedDraft) {
                const draftData = JSON.parse(savedDraft);
                setFormData(draftData);
                return true;
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
        return false;
    }, []);

    // Submit form
    const handleSubmit = useCallback(async () => {
        // Final validation for all steps
        const allErrors = {};
        for (let step = 1; step <= 4; step++) {
            const stepErrors = validateFormStep(step, formData);
            Object.assign(allErrors, stepErrors);
        }

        if (Object.keys(allErrors).length > 0) {
            setValidationErrors(allErrors);
            return { success: false, message: 'Vui lòng kiểm tra lại thông tin' };
        }

        // Check for critical conflicts
        const criticalConflicts = scheduleConflicts.filter(c => c.severity === 'error');
        if (criticalConflicts.length > 0) {
            return {
                success: false,
                message: 'Có xung đột nghiêm trọng về lịch trình. Vui lòng điều chỉnh.'
            };
        }

        setLoading(true);
        try {
            // Mock API call - in real app, submit to backend
            const submissionData = {
                ...formData,
                totalStudents,
                sessions,
                estimatedCost,
                resourceRequirements: resourceReqs,
                submittedAt: new Date().toISOString(),
                status: 'pending_approval'
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear draft after successful submission
            localStorage.removeItem('vaccination_draft');

            return {
                success: true,
                message: 'Kế hoạch tiêm chủng đã được gửi thành công!',
                data: submissionData
            };
        } catch (error) {
            return {
                success: false,
                message: 'Có lỗi xảy ra khi gửi kế hoạch. Vui lòng thử lại.'
            };
        } finally {
            setLoading(false);
        }
    }, [formData, scheduleConflicts, totalStudents, sessions, estimatedCost, resourceReqs]);

    // Reset form
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setCurrentStep(1);
        setValidationErrors({});
        setScheduleConflicts([]);
        localStorage.removeItem('vaccination_draft');
    }, []);

    return {
        // State
        loading,
        currentStep,
        formData,
        validationErrors,
        scheduleConflicts,
        availableGrades,
        vaccineTypes,

        // Calculated values
        totalStudents,
        sessions,
        selectedVaccine,
        estimatedCost,
        resourceReqs,

        // Actions
        handleInputChange,
        handleGradeSelection,
        handleNext,
        handlePrevious,
        goToStep,
        saveDraft,
        loadDraft,
        handleSubmit,
        resetForm
    };
}; 