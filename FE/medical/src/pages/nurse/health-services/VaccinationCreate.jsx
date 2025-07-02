import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiCalendar,
    FiClock,
    FiMapPin,
    FiUsers,
    FiCheckCircle,
    FiAlertCircle,
    FiX,
    FiSave,
    FiRotateCcw,
    FiPlus,
    FiShield,
    FiCheck,
    FiArrowLeft
} from "react-icons/fi";
import { useVaccinationForm } from './hooks/useVaccinationForm';
import { StepIndicator, NavigationControls, ProgressBar, StepHeader } from './components/VaccinationSteps';
import BasicInfoStep from './components/steps/BasicInfoStep';
import VaccineDetailsStep from './components/steps/VaccineDetailsStep';
import TargetLogisticsStep from './components/steps/TargetLogisticsStep';
import PreviewStep from './components/steps/PreviewStep';
import { vaccinationStepsConfig } from './data/vaccinationData';

const VaccinationCreate = ({ onBack }) => {
    const navigate = useNavigate();
    const {
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
    } = useVaccinationForm();

    // Helper functions - định nghĩa trước để tránh hoisting error
    const calculateTotalStudents = () => {
        return formData.targetGrades.reduce((total, gradeId) => {
            const grade = availableGrades.find(g => g.id === gradeId);
            return total + (grade?.studentCount || 0);
        }, 0);
    };

    const generateVaccineNotificationMessage = (vaccine) => {
        return `Kính gửi Quý phụ huynh,

Trường sẽ tổ chức tiêm ${vaccine.name} cho các em học sinh.

📋 Thông tin vắc-xin:
• Tên: ${vaccine.name} (${vaccine.code})
• Liều dùng: ${vaccine.dosage}
• Phương pháp: ${vaccine.route}
• Hiệu lực: ${vaccine.effectivenessPeriod}
• Nhà sản xuất: ${vaccine.manufacturer}

⚠️ Lưu ý quan trọng:
• Chống chỉ định: ${vaccine.contraindications}
• Tác dụng phụ có thể có: ${vaccine.sideEffects}
• Yêu cầu bảo quản: Bảo quản ở ${vaccine.storageTemp}

📝 Lưu ý: Thông tin cụ thể về lô vaccine, hạn sử dụng và chi tiết khác sẽ được cập nhật khi có thông tin chính xác từ nhà cung cấp.

Quý phụ huynh vui lòng xác nhận cho con em tham gia và thông báo các tình trạng sức khỏe đặc biệt.

Trân trọng,
Ban Giám hiệu`;
    };

    // Steps configuration for vaccination
    const steps = [
        {
            id: 1,
            title: "Thông tin cơ bản",
            description: "Thời gian, địa điểm và mục tiêu",
            icon: FiCalendar,
            required: true
        },
        {
            id: 2,
            title: "Chi tiết vắc-xin",
            description: "Thông tin chuyên môn về vắc-xin",
            icon: FiShield,
            required: true
        },
        {
            id: 3,
            title: "Đối tượng & Logistics",
            description: "Lớp học và tổ chức thực hiện",
            icon: FiUsers,
            required: true
        },
        {
            id: 4,
            title: "Kiểm tra & Xác nhận",
            description: "Xem trước và hoàn tất",
            icon: FiCheckCircle,
            required: true
        }
    ];

    // Auto-save draft every 30 seconds
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            if (Object.keys(formData).length > 0 && formData.title) {
                localStorage.setItem("vaccinationDraft", JSON.stringify(formData));
            }
        }, 30000);

        return () => clearInterval(autoSaveInterval);
    }, [formData]);

    // Auto-fill vaccine details when vaccine type is selected
    useEffect(() => {
        if (formData.vaccineType && vaccineTypes.length > 0) {
            const selectedVaccine = vaccineTypes.find(v => v.id === formData.vaccineType);
            if (selectedVaccine) {
                // Thực hiện batch update để reset và fill dữ liệu mới cùng lúc
                const updates = [
                    { name: 'title', value: formData.title || `Tiêm ${selectedVaccine.name}` },
                    { name: 'estimatedDuration', value: selectedVaccine.preparationTime + (calculateTotalStudents() * 3) + selectedVaccine.observationTime },
                    { name: 'costPerStudent', value: selectedVaccine.costPerDose },
                    { name: 'parentNotificationMessage', value: generateVaccineNotificationMessage(selectedVaccine) }
                ];

                // Thực hiện tất cả các cập nhật
                updates.forEach(update => {
                    handleInputChange({
                        target: update
                    });
                });
            }
        } else {
            // Nếu không có vaccine được chọn, reset thông báo
            handleInputChange({
                target: { name: 'parentNotificationMessage', value: '' }
            });
        }
    }, [formData.vaccineType, vaccineTypes, handleInputChange, calculateTotalStudents]);

    // Validation functions
    const validateStep = (stepId) => {
        const errors = {};

        switch (stepId) {
            case 1:
                if (!formData.title?.trim()) {
                    errors.title = "Tiêu đề là bắt buộc";
                }
                if (!formData.scheduledDate) {
                    errors.scheduledDate = "Ngày thực hiện là bắt buộc";
                } else {
                    const selectedDate = new Date(formData.scheduledDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        errors.scheduledDate = "Ngày thực hiện không thể trong quá khứ";
                    }
                }
                if (!formData.scheduledTime) {
                    errors.scheduledTime = "Giờ bắt đầu là bắt buộc";
                }
                if (!formData.location?.trim()) {
                    errors.location = "Địa điểm là bắt buộc";
                }
                break;

            case 2:
                if (!formData.vaccineType) {
                    errors.vaccineType = "Loại vắc-xin là bắt buộc";
                }
                break;

            case 3:
                if (!formData.targetGrades || formData.targetGrades.length === 0) {
                    errors.targetGrades = "Cần chọn ít nhất một lớp học";
                }
                break;

            default:
                break;
        }

        return errors;
    };

    const handleFormSubmit = async () => {
        try {
            await handleSubmit();
            // Clear draft after successful submission
            localStorage.removeItem("vaccinationDraft");
            alert("✅ Đã tạo thành công kế hoạch tiêm chủng!");
            navigate('/nurse/health-services#success');
        } catch (error) {
            console.error("Lỗi khi tạo kế hoạch:", error);
            alert("❌ Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.");
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onInputChange={handleInputChange}
                        totalStudents={totalStudents}
                        estimatedCost={estimatedCost}
                        sessions={sessions}
                    />
                );
            case 2:
                return (
                    <VaccineDetailsStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onInputChange={handleInputChange}
                        vaccineTypes={vaccineTypes}
                        selectedVaccine={selectedVaccine}
                    />
                );
            case 3:
                return (
                    <TargetLogisticsStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onInputChange={handleInputChange}
                        onGradeSelection={handleGradeSelection}
                        availableGrades={availableGrades}
                        totalStudents={totalStudents}
                        sessions={sessions}
                        resourceReqs={resourceReqs}
                    />
                );
            case 4:
                return (
                    <PreviewStep
                        formData={formData}
                        selectedVaccine={selectedVaccine}
                        availableGrades={availableGrades}
                        totalStudents={totalStudents}
                        sessions={sessions}
                        estimatedCost={estimatedCost}
                        resourceReqs={resourceReqs}
                        scheduleConflicts={scheduleConflicts}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-6 max-w-5xl">
                {/* Header */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                                >
                                    <FiArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                        Tạo kế hoạch tiêm chủng
                                    </h1>
                                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                                        Lập kế hoạch tiêm chủng cho học sinh
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress & Steps */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                    <div className="p-6">
                        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

                        <div className="mt-6">
                            <StepIndicator
                                steps={steps}
                                currentStep={currentStep}
                                completedSteps={[...Array(currentStep - 1)].map((_, i) => i + 1)}
                                onStepClick={goToStep}
                            />
                        </div>
                    </div>
                </div>

                {/* Current Step Content */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                    <div className="p-6">
                        <StepHeader
                            currentStep={currentStep}
                            steps={steps}
                            validationErrors={validationErrors}
                            scheduleConflicts={scheduleConflicts}
                        />

                        <div className="mt-6">
                            {renderCurrentStep()}
                        </div>

                        {/* Navigation Controls */}
                        <NavigationControls
                            currentStep={currentStep}
                            loading={loading}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onSubmit={handleFormSubmit}
                            hasErrors={Object.keys(validationErrors).length > 0}
                            conflictSeverity={scheduleConflicts.reduce((max, conflict) => {
                                if (conflict.severity === 'error') return 'error';
                                if (conflict.severity === 'warning' && max !== 'error') return 'warning';
                                return max;
                            }, null)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VaccinationCreate; 