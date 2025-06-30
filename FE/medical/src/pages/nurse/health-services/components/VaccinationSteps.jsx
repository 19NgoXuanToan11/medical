import React from 'react';
import { FiCheck, FiChevronLeft, FiChevronRight, FiSave, FiX, FiSend } from 'react-icons/fi';
import { vaccinationStepsConfig } from '../data/vaccinationData';

export const StepIndicator = ({ currentStep, onStepClick }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {vaccinationStepsConfig.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div
                            className={`flex items-center cursor-pointer group ${currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400 dark:text-neutral-500'
                                }`}
                            onClick={() => onStepClick(step.id)}
                        >
                            <div className={`
                                w-10 h-10 rounded-full border-2 flex items-center justify-center
                                transition-all duration-200 group-hover:scale-105
                                ${currentStep > step.id
                                    ? 'bg-success-500 dark:bg-success-400 border-success-500 dark:border-success-400 text-white'
                                    : currentStep === step.id
                                        ? 'bg-primary-500 dark:bg-primary-400 border-primary-500 dark:border-primary-400 text-white'
                                        : 'border-neutral-300 dark:border-neutral-600 text-neutral-400 dark:text-neutral-500 group-hover:border-neutral-400 dark:group-hover:border-neutral-500'
                                }
                            `}>
                                {currentStep > step.id ? (
                                    <FiCheck className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-medium">{step.id}</span>
                                )}
                            </div>
                            <div className="ml-3 hidden md:block">
                                <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-neutral-900 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
                                    }`}>
                                    {step.title}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">{step.description}</p>
                            </div>
                        </div>

                        {index < vaccinationStepsConfig.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-success-500 dark:bg-success-400' : 'bg-neutral-200 dark:bg-neutral-700'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile step info */}
            <div className="md:hidden mt-4 text-center">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {vaccinationStepsConfig[currentStep - 1]?.title}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {vaccinationStepsConfig[currentStep - 1]?.description}
                </p>
            </div>
        </div>
    );
};

export const NavigationControls = ({
    currentStep,
    loading,
    onPrevious,
    onNext,
    onSaveDraft,
    onCancel,
    onSubmit,
    hasErrors = false,
    conflictSeverity = null
}) => {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === 4;

    return (
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            {/* Left side - Cancel button */}
            <div className="flex justify-start">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiX className="w-4 h-4 mr-2" />
                    Hủy
                </button>
            </div>

            {/* Center - Back button (if not first step) */}
            <div className="flex-1 flex justify-center">
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiChevronLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </button>
                )}
            </div>

            {/* Right side - Next/Submit button */}
            <div className="flex justify-end">
                {isLastStep ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading || hasErrors || conflictSeverity === 'error'}
                        className={`inline-flex items-center px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed ${hasErrors || conflictSeverity === 'error'
                            ? 'border border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700'
                            : 'border border-transparent text-white bg-success-600 dark:bg-success-500 hover:bg-success-700 dark:hover:bg-success-600 focus:ring-success-500'
                            }`}
                    >
                        <FiSend className="w-4 h-4 mr-2" />
                        {loading ? 'Đang gửi...' : 'Gửi kế hoạch'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Tiếp tục
                        <FiChevronRight className="w-4 h-4 ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
};

export const ProgressBar = ({ currentStep, totalSteps = 4 }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-6">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <span className="text-neutral-900 dark:text-white">Bước {currentStep} / {totalSteps}</span>
                <span>{Math.round(progress)}% hoàn thành</span>
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div
                    className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

export const StepHeader = ({ currentStep, title, description, steps = [], validationErrors = {}, scheduleConflicts = [] }) => {
    const hasErrors = Object.keys(validationErrors).length > 0;
    const hasCriticalConflicts = scheduleConflicts.some(c => c.severity === 'error');
    const hasWarnings = scheduleConflicts.some(c => c.severity === 'warning');

    // Get title and description from steps if not provided directly
    const currentStepInfo = steps.find(step => step.id === currentStep) || {};
    const stepTitle = title || currentStepInfo.title || '';
    const stepDescription = description || currentStepInfo.description || '';

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                Bước {currentStep}: {stepTitle}
            </h2>
            {stepDescription && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{stepDescription}</p>
            )}

            {/* Validation Errors */}
            {hasErrors && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                <div className={`border rounded-lg p-4 mb-4 ${hasCriticalConflicts
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className={`h-5 w-5 ${hasCriticalConflicts
                                ? 'text-red-400 dark:text-red-500'
                                : 'text-yellow-400 dark:text-yellow-500'
                                }`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className={`text-sm font-medium ${hasCriticalConflicts
                                ? 'text-red-800 dark:text-red-200'
                                : 'text-yellow-800 dark:text-yellow-200'
                                }`}>
                                {hasCriticalConflicts ? 'Xung đột nghiêm trọng' : 'Cảnh báo xung đột'}
                            </h3>
                            <div className="mt-2">
                                <ul className="space-y-1">
                                    {scheduleConflicts.map((conflict, index) => (
                                        <li key={index} className={`text-sm flex items-start ${conflict.severity === 'error'
                                            ? 'text-red-700 dark:text-red-300'
                                            : 'text-yellow-700 dark:text-yellow-300'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0 ${conflict.severity === 'error'
                                                ? 'bg-red-500 dark:bg-red-400'
                                                : 'bg-yellow-500 dark:bg-yellow-400'
                                                }`} />
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