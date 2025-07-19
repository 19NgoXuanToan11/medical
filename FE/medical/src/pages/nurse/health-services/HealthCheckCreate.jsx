import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { useHealthCheckForm } from "./hooks/useHealthCheckForm";
import {
  StepIndicator,
  NavigationControls,
  ProgressBar,
  StepHeader,
} from "./components/HealthCheckSteps";
import BasicInfoHealthStep from "./components/steps/BasicInfoHealthStep";
import HealthCheckItemsStep from "./components/steps/HealthCheckItemsStep";
import TargetLogisticsHealthStep from "./components/steps/TargetLogisticsHealthStep";
import PreviewHealthStep from "./components/steps/PreviewHealthStep";
import { healthCheckStepsConfig } from "./data/healthCheckData";

const HealthCheckCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  // Use the custom hook for form management
  const {
    loading,
    loadingItems,
    loadingGrades,
    currentStep,
    formData,
    validationErrors,
    scheduleConflicts,
    availableGrades,
    healthCheckItems,
    totalStudents,
    sessions,
    resourceReqs,
    equipmentStatus,
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
  } = useHealthCheckForm(id);

  // Load draft on component mount (only for create mode, not edit mode)
  useEffect(() => {
    if (!isEditMode) {
      loadDraft();
    }
  }, [loadDraft, isEditMode]);

  // Handle save draft (only in create mode)
  const handleSaveDraft = async () => {
    if (isEditMode) {
      alert("Không thể lưu nháp khi đang chỉnh sửa. Vui lòng submit để cập nhật.");
      return;
    }
    
    const result = await saveDraft();
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      window.confirm("Bạn có chắc chắn muốn hủy? Tất cả thay đổi sẽ bị mất.")
    ) {
      resetForm();
      navigate("/nurse/health-services");
    }
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    const result = await handleSubmit();
    if (result.success) {
      alert(result.message);
      navigate("/nurse/health-services");
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
        // Show loading state when health check items are being loaded
        if (loadingItems) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Đang tải danh sách hạng mục khám...
                </p>
              </div>
            </div>
          );
        }
        return (
          <HealthCheckItemsStep
            formData={formData}
            validationErrors={validationErrors}
            onCheckItemToggle={handleCheckItemToggle}
            onInputChange={handleInputChange}
            healthCheckItems={healthCheckItems}
            equipmentStatus={equipmentStatus}
          />
        );
      case 3:
        // Show loading state when classes are being loaded
        if (loadingGrades) {
          return (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Đang tải danh sách lớp học...
                </p>
              </div>
            </div>
          );
        }
        return (
          <TargetLogisticsHealthStep
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
            onGradeSelection={handleGradeSelection}
            totalStudents={totalStudents}
            sessions={sessions}
            availableGrades={availableGrades}
          />
        );
      case 4:
        return (
          <PreviewHealthStep
            formData={formData}
            totalStudents={totalStudents}
            sessions={sessions}
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
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {isEditMode ? "Chỉnh sửa kế hoạch khám sức khỏe" : "Lập kế hoạch khám sức khỏe"}
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {isEditMode ? "Chỉnh sửa và gửi lại yêu cầu khám sức khỏe đã bị từ chối" : "Tạo kế hoạch khám sức khỏe định kỳ cho học sinh"}
              </p>
              {isEditMode && (
                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Đang chỉnh sửa lịch khám
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Bạn đang chỉnh sửa lịch khám hiện có. Sau khi cập nhật, lịch khám sẽ được gửi lại cho quản lý để xem xét duyệt.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
        <StepIndicator currentStep={currentStep} onStepClick={goToStep} />

        {/* Step Header */}
        <StepHeader
          currentStep={currentStep}
          validationErrors={validationErrors}
          scheduleConflicts={scheduleConflicts}
        />

        {/* Main Content */}
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
          {isEditMode && loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu để chỉnh sửa...</p>
            </div>
          ) : (
            <div className="p-6">{renderCurrentStep()}</div>
          )}

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
              isEditMode={isEditMode}
            />
          </div>
        </div>

        {/* Schedule Conflicts Alert (if any) */}
        {scheduleConflicts.length > 0 && currentStep < 4 && (
          <div className="mt-6 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-warning-400 dark:text-warning-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
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
