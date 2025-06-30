import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiActivity,
    FiCalendar,
    FiMapPin,
    FiUsers,
    FiCheckCircle,
    FiAlertCircle,
    FiX,
    FiSave,
    FiRotateCcw,
    FiPlus,
    FiFileText,
    FiCheck,
    FiArrowLeft,
    FiArrowRight
} from "react-icons/fi";
import { useHealthCheckForm } from './hooks/useHealthCheckForm';
import {
    StepIndicator,
    NavigationControls,
    ProgressBar,
    StepHeader
} from './components/HealthCheckSteps';
import BasicInfoHealthStep from './components/steps/BasicInfoHealthStep';
import HealthCheckItemsStep from './components/steps/HealthCheckItemsStep';
import TargetLogisticsHealthStep from './components/steps/TargetLogisticsHealthStep';
import PreviewHealthStep from './components/steps/PreviewHealthStep';
import { healthCheckStepsConfig } from './data/healthCheckData';

const HealthCheckCreate = () => {
    const navigate = useNavigate();

    // Use the custom hook for form management
    const {
        loading,
        currentStep,
        formData,
        validationErrors,
        scheduleConflicts,
        availableGrades,
        healthCheckItems,
        totalStudents,
        sessions,
        resourceReqs,
        handleInputChange,
        handleGradeSelection,
        handleCheckItemToggle,
        handleNext,
        handlePrevious,
        goToStep,
        saveDraft,
        loadDraft,
        handleSubmit,
        resetForm
    } = useHealthCheckForm();

    // Load draft on component mount
    useEffect(() => {
        loadDraft();
    }, [loadDraft]);

    // Handle save draft
    const handleSaveDraft = async () => {
        const result = await saveDraft();
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy? Tất cả thay đổi sẽ bị mất.')) {
            resetForm();
            navigate('/nurse/health-services');
        }
    };

    // Handle form submission
    const handleFormSubmit = async () => {
        const result = await handleSubmit();
        if (result.success) {
            alert(result.message);
            navigate('/nurse/health-services');
        } else {
            alert(result.message);
        }
    };

    // Render current step content
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInfoHealthStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onInputChange={handleInputChange}
                        totalStudents={totalStudents}
                        sessions={sessions}
                        resourceReqs={resourceReqs}
                    />
                );
            case 2:
                return (
                    <HealthCheckItemsStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onCheckItemToggle={handleCheckItemToggle}
                        onInputChange={handleInputChange}
                        healthCheckItems={healthCheckItems}
                    />
                );
            case 3:
                return (
                    <TargetLogisticsHealthStep
                        formData={formData}
                        validationErrors={validationErrors}
                        onInputChange={handleInputChange}
                        onGradeSelection={handleGradeSelection}
                        totalStudents={totalStudents}
                        sessions={sessions}
                        resourceReqs={resourceReqs}
                        availableGrades={availableGrades}
                    />
                );
            case 4:
                return (
                    <PreviewHealthStep
                        formData={formData}
                        totalStudents={totalStudents}
                        sessions={sessions}
                        resourceReqs={resourceReqs}
                        scheduleConflicts={scheduleConflicts}
                        availableGrades={availableGrades}
                        healthCheckItems={healthCheckItems}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                Lập kế hoạch khám sức khỏe
                            </h1>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                                Tạo kế hoạch khám sức khỏe định kỳ cho học sinh
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} />

                {/* Step Indicator */}
                <StepIndicator
                    currentStep={currentStep}
                    onStepClick={goToStep}
                />

                {/* Step Header */}
                <StepHeader
                    currentStep={currentStep}
                    validationErrors={validationErrors}
                    scheduleConflicts={scheduleConflicts}
                />

                {/* Main Content */}
                <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                    <div className="p-6">
                        {renderCurrentStep()}
                    </div>

                    {/* Navigation Controls */}
                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
                        <NavigationControls
                            currentStep={currentStep}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onSaveDraft={handleSaveDraft}
                            onCancel={handleCancel}
                            onSubmit={handleFormSubmit}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* Schedule Conflicts Alert (if any) */}
                {scheduleConflicts.length > 0 && currentStep < 4 && (
                    <div className="mt-6 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-warning-400 dark:text-warning-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-warning-800 dark:text-warning-200">
                                    Có {scheduleConflicts.length} xung đột lịch trình
                                </h3>
                                <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
                                    Kiểm tra chi tiết ở bước xem trước để điều chỉnh.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthCheckCreate; 