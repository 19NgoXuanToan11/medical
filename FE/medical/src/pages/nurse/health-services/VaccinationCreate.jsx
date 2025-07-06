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
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { useVaccinationForm } from "./hooks/useVaccinationForm";
import {
  StepIndicator,
  NavigationControls,
  ProgressBar,
  StepHeader,
} from "./components/VaccinationSteps";
import BasicInfoStep from "./components/steps/BasicInfoStep";
import TargetLogisticsStep from "./components/steps/TargetLogisticsStep";
import PreviewStep from "./components/steps/PreviewStep";
import { vaccinationStepsConfig } from "./data/vaccinationData";

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
  } = useVaccinationForm();

  // Steps configuration for vaccination (updated to 3 steps)
  const steps = [
    {
      id: 1,
      title: "Thông tin cơ bản",
      description: "Thời gian, địa điểm và mục tiêu",
      icon: FiCalendar,
      required: true,
    },
    {
      id: 2,
      title: "Đối tượng tiêm",
      description: "Lớp học",
      icon: FiUsers,
      required: true,
    },
    {
      id: 3,
      title: "Kiểm tra & Xác nhận",
      description: "Xem trước và hoàn tất",
      icon: FiCheckCircle,
      required: true,
    },
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

  // Validation functions
  const validateStep = (stepId) => {
    const errors = {};

    switch (stepId) {
      case 1:
        if (!formData.title?.trim()) {
          errors.title = "Tiêu đề là bắt buộc";
        }
        if (!formData.scheduledDateTime) {
          errors.scheduledDateTime = "Ngày và giờ thực hiện là bắt buộc";
        } else {
          const selectedDate = new Date(formData.scheduledDateTime);
          const today = new Date();
          if (selectedDate < today) {
            errors.scheduledDateTime =
              "Thời gian thực hiện không thể trong quá khứ";
          }
        }
        if (!formData.location?.trim()) {
          errors.location = "Địa điểm là bắt buộc";
        }
        break;

      case 2:
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
      navigate("/nurse/health-services#success");
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
          />
        );
      case 2:
        return (
          <TargetLogisticsStep
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
            onGradeSelection={handleGradeSelection}
            availableGrades={availableGrades}
            totalStudents={totalStudents}
          />
        );
      case 3:
        return (
          <PreviewStep
            formData={formData}
            availableGrades={availableGrades}
            totalStudents={totalStudents}
            scheduleConflicts={scheduleConflicts}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => onBack?.() || navigate("/nurse/health-services")}
              className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mr-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </button>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Tạo kế hoạch tiêm chủng
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Tạo kế hoạch tiêm chủng cho học sinh trong trường
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={goToStep}
        />

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          steps={steps}
          validationErrors={validationErrors}
          onStepClick={goToStep}
        />

        {/* Current Step Content */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="p-6">
            <StepHeader
              currentStep={currentStep}
              steps={steps}
              validationErrors={validationErrors}
              scheduleConflicts={scheduleConflicts}
            />

            <div className="mt-6">{renderCurrentStep()}</div>

            {/* Navigation Controls */}
            <NavigationControls
              currentStep={currentStep}
              loading={loading}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleFormSubmit}
              hasErrors={Object.keys(validationErrors).length > 0}
              conflictSeverity={scheduleConflicts.reduce((max, conflict) => {
                if (conflict.severity === "error") return "error";
                if (conflict.severity === "warning" && max !== "error")
                  return "warning";
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
