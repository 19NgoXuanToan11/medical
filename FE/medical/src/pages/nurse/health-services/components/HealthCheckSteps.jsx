import React from "react";
import {
  FiUser,
  FiClipboard,
  FiUsers,
  FiEye,
  FiArrowLeft,
  FiArrowRight,
  FiSave,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { healthCheckStepsConfig } from "../data/healthCheckData";

// Step Indicator Component
export const StepIndicator = ({ currentStep, onStepClick }) => {
  const getStepIcon = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return <FiUser />;
      case 2:
        return <FiClipboard />;
      case 3:
        return <FiUsers />;
      case 4:
        return <FiEye />;
      default:
        return <FiUser />;
    }
  };

  return (
    <div className="flex items-center justify-center mb-8">
      {healthCheckStepsConfig.map((step, index) => (
        <div key={step.step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all duration-300 ${
              currentStep === step.step
                ? "bg-primary-600 dark:bg-primary-500 text-white shadow-lg scale-110"
                : currentStep > step.step
                ? "bg-success-500 dark:bg-success-400 text-white hover:bg-success-600 dark:hover:bg-success-500"
                : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            }`}
            onClick={() => onStepClick(step.step)}
          >
            {currentStep > step.step ? <FiCheck /> : getStepIcon(step.step)}
          </div>
          <div className="ml-3 text-left">
            <p
              className={`text-sm font-medium ${
                currentStep === step.step
                  ? "text-primary-600 dark:text-primary-400"
                  : currentStep > step.step
                  ? "text-success-600 dark:text-success-400"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              Bước {step.step}
            </p>
            <p
              className={`text-xs ${
                currentStep === step.step
                  ? "text-primary-500 dark:text-primary-300"
                  : currentStep > step.step
                  ? "text-success-500 dark:text-success-300"
                  : "text-neutral-400 dark:text-neutral-500"
              }`}
            >
              {step.title}
            </p>
          </div>
          {index < healthCheckStepsConfig.length - 1 && (
            <div
              className={`w-8 h-0.5 mx-4 ${
                currentStep > step.step
                  ? "bg-success-500 dark:bg-success-400"
                  : "bg-neutral-300 dark:bg-neutral-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Navigation Controls Component
export const NavigationControls = ({
  currentStep,
  onPrevious,
  onNext,
  onSaveDraft,
  onCancel,
  onSubmit,
  loading,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-6 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          disabled={loading}
        >
          <FiX className="w-4 h-4 mr-2" />
          Hủy
        </button>
      </div>

      <div className="flex items-center space-x-3">
        {!isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
        )}
        {!isLastStep ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 border border-transparent rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            Tiếp theo
            <FiArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="inline-flex items-center px-8 py-2 text-sm font-medium text-white bg-success-600 dark:bg-success-500 border border-transparent rounded-lg hover:bg-success-700 dark:hover:bg-success-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border border-white border-t-transparent rounded-full" />
                Đang gửi...
              </>
            ) : (
              <>
                <FiCheck className="w-4 h-4 mr-2" />
                Gửi kế hoạch
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ currentStep }) => {
  const progress =
    ((currentStep - 1) / (healthCheckStepsConfig.length - 1)) * 100;

  return (
    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mb-6">
      <div
        className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="text-center">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          Tiến độ: {currentStep}/{healthCheckStepsConfig.length} bước (
          {Math.round(progress)}%)
        </span>
      </div>
    </div>
  );
};

// Step Header Component
export const StepHeader = ({
  currentStep,
  validationErrors = {},
  scheduleConflicts = [],
}) => {
  const currentStepConfig = healthCheckStepsConfig.find(
    (step) => step.step === currentStep
  );
  const hasErrors = Object.keys(validationErrors).length > 0;
  const hasCriticalConflicts = scheduleConflicts.some(
    (c) => c.severity === "error"
  );
  const hasWarnings = scheduleConflicts.some((c) => c.severity === "warning");

  if (!currentStepConfig) return null;

  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
        {currentStepConfig.title}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-4">
        {currentStepConfig.description}
      </p>

      {/* Validation Errors */}
      {hasErrors && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4 max-w-2xl mx-auto text-left">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400 dark:text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Có lỗi cần khắc phục
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <ul className="list-disc pl-5 space-y-1">
                  {Object.values(validationErrors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Conflicts */}
      {scheduleConflicts.length > 0 && (
        <div
          className={`border rounded-lg p-4 mb-4 max-w-2xl mx-auto text-left ${
            hasCriticalConflicts
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className={`h-5 w-5 ${
                  hasCriticalConflicts
                    ? "text-red-400 dark:text-red-500"
                    : "text-yellow-400 dark:text-yellow-500"
                }`}
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
              <h3
                className={`text-sm font-medium ${
                  hasCriticalConflicts
                    ? "text-red-800 dark:text-red-200"
                    : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {hasCriticalConflicts
                  ? "Xung đột nghiêm trọng"
                  : "Cảnh báo xung đột"}
              </h3>
              <div className="mt-2">
                <ul className="space-y-1">
                  {scheduleConflicts.map((conflict, index) => (
                    <li
                      key={index}
                      className={`text-sm flex items-start ${
                        conflict.severity === "error"
                          ? "text-red-700 dark:text-red-300"
                          : "text-yellow-700 dark:text-yellow-300"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${
                          conflict.severity === "error"
                            ? "bg-red-500 dark:bg-red-400"
                            : "bg-yellow-500 dark:bg-yellow-400"
                        }`}
                      />
                      {conflict.message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
