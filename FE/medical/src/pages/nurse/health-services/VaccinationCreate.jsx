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
  FiClipboard,
  FiAlertTriangle,
} from "react-icons/fi";
import { useVaccinationForm } from "./hooks/useVaccinationForm";
import {
  StepIndicator,
  NavigationControls,
  ProgressBar,
  StepHeader,
} from "./components/VaccinationSteps";
import VaccineSelectionStep from "./components/steps/VaccineSelectionStep";
import BasicInfoStep from "./components/steps/BasicInfoStep";
import TargetLogisticsStep from "./components/steps/TargetLogisticsStep";
import PreviewStep from "./components/steps/PreviewStep";
import { vaccinationStepsConfig } from "./data/vaccinationData";

// Error display component
const ValidationErrorDisplay = ({ validationErrors }) => {
  if (!validationErrors || Object.keys(validationErrors).length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start">
        <FiAlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
            Vui lòng sửa các lỗi sau:
          </h3>
          <ul className="space-y-1">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li
                key={field}
                className="text-sm text-red-700 dark:text-red-400 flex items-start"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                <span>
                  <strong className="capitalize">
                    {getFieldDisplayName(field)}:
                  </strong>{" "}
                  {error}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Helper function to get user-friendly field names
const getFieldDisplayName = (fieldName) => {
  const fieldNames = {
    title: "Tiêu đề",
    scheduledDateTime: "Thời gian thực hiện",
    location: "Địa điểm",
    vaccineId: "Vaccine",
    vaccineName: "Tên vaccine",
    targetGrades: "Lớp học",
    description: "Mô tả",
    estimatedDuration: "Thời gian ước tính",
  };
  return fieldNames[fieldName] || fieldName;
};

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
    loadingGrades,
    gradesError,
    studentCountsByGrade,

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
  } = useVaccinationForm();

  // Use steps configuration from data file
  const steps = vaccinationStepsConfig;

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
        // Basic information validation (Time and Location)
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
        // Vaccine selection validation
        if (!formData.vaccineId) {
          errors.vaccineId = "Vui lòng chọn vaccine để tiêm chủng";
        }
        break;

      case 3:
        // Target grades validation
        if (!formData.targetGrades || formData.targetGrades.length === 0) {
          errors.targetGrades = "Cần chọn ít nhất một khối học";
        }
        break;

      default:
        break;
    }

    return errors;
  };

  const handleFormSubmit = async () => {
    try {
      const result = await handleSubmit();

      if (result.success) {
        // Clear draft after successful submission
        localStorage.removeItem("vaccinationDraft");

        // Show detailed success message
        const successMessage = result.data
          ? `✅ ${result.message}\n\nChi tiết:\n• Đã tạo ${result.data.totalFormsCreated} phiếu tiêm chủng\n• Tổng số học sinh: ${result.data.totalStudents}\n• Kế hoạch đã được gửi để phê duyệt`
          : `✅ ${result.message}`;

        alert(successMessage);
        navigate("/nurse/health-services?tab=vaccination#success");
      } else {
        // Show specific error message
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi khi tạo kế hoạch:", error);

      // Enhanced error display
      let errorMessage = "❌ Có lỗi xảy ra khi tạo kế hoạch";

      if (error.message) {
        if (error.message.includes("kiểm tra và sửa các lỗi")) {
          errorMessage =
            "❌ Vui lòng kiểm tra và sửa các lỗi trong form trước khi gửi";
        } else if (error.message.includes("hoàn thành thông tin")) {
          errorMessage = "❌ Vui lòng hoàn thành thông tin ở bước hiện tại";
        } else if (error.message.includes("xung đột lịch trình")) {
          errorMessage =
            "❌ Cần giải quyết các xung đột lịch trình trước khi gửi";
        } else {
          errorMessage = `❌ ${error.message}`;
        }
      }

      alert(errorMessage);

      // Scroll to top to show validation errors if any
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            scheduleConflicts={scheduleConflicts}
          />
        );

      case 2:
        return (
          <VaccineSelectionStep
            formData={formData}
            validationErrors={validationErrors}
            onInputChange={handleInputChange}
          />
        );

      case 3:
        return (
          <TargetLogisticsStep
            formData={formData}
            validationErrors={validationErrors}
            availableGrades={availableGrades}
            loadingGrades={loadingGrades}
            gradesError={gradesError}
            totalStudents={totalStudents}
            onInputChange={handleInputChange}
            onGradeSelection={handleGradeSelection}
            onRetryLoadGrades={retryLoadGrades}
          />
        );

      case 4:
        return (
          <PreviewStep
            formData={formData}
            totalStudents={totalStudents}
            availableGrades={availableGrades}
            scheduleConflicts={scheduleConflicts}
            studentCountsByGrade={studentCountsByGrade}
          />
        );

      default:
        return null;
    }
  };

  // Show loading state
  if (loading && currentStep === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Đang khởi tạo form...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/nurse/health-services")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-gray-100 font-semibold">
                Tạo kế hoạch tiêm chủng
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Bước {currentStep} của {steps.length}:{" "}
                {steps[currentStep - 1]?.title}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={resetForm}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <FiRotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

      {/* Step Indicator */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={[]}
          onStepClick={goToStep}
        />
      </div>

      {/* Validation Errors Display */}
      <div className="px-6 pt-4">
        <ValidationErrorDisplay validationErrors={validationErrors} />
      </div>

      {/* Step Content */}
      <div className="px-6 py-6">
        <StepHeader
          step={steps[currentStep - 1]}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <div className="mt-6">{renderCurrentStep()}</div>
      </div>

      {/* Navigation Controls */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <NavigationControls
          currentStep={currentStep}
          totalSteps={steps.length}
          loading={loading}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleFormSubmit}
          canProceed={Object.keys(validationErrors).length === 0}
        />
      </div>
    </div>
  );
};

export default VaccinationCreate;
