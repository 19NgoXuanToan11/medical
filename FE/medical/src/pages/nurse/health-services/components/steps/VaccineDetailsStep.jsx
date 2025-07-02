import React, { useState } from 'react';
import { FiActivity, FiAlertTriangle, FiInfo, FiThermometer, FiPackage, FiCalendar } from 'react-icons/fi';

const VaccineDetailsStep = ({
    formData,
    validationErrors,
    onInputChange,
    vaccineTypes,
    selectedVaccine
}) => {
    const [showVaccineDetails, setShowVaccineDetails] = useState(false);

    return (
        <div className="space-y-6">
            {/* Vaccine Type Selection */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    <FiActivity className="inline w-4 h-4 mr-1" />
                    Chọn loại vắc-xin *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {vaccineTypes.map((vaccine) => (
                        <div
                            key={vaccine.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${formData.vaccineType === vaccine.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800'
                                : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-900'
                                }`}
                            onClick={() => onInputChange('vaccineType', vaccine.id)}
                        >
                            <div className="flex items-start">
                                <div className="flex-1">
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {vaccine.name}
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                        {vaccine.code} - {vaccine.dosage}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                        Độ tuổi: {vaccine.recommendedAges?.join(', ')}
                                    </p>
                                </div>
                                <div className="ml-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                                    {vaccine.costPerDose?.toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {validationErrors.vaccineType && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationErrors.vaccineType}</p>
                )}
            </div>

            {/* Validation Error */}
            {validationErrors.vaccineType && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                        <FiAlertTriangle className="w-5 h-5 text-red-400 dark:text-red-500" />
                        <div className="ml-3">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {validationErrors.vaccineType}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Vaccine Details */}
            {selectedVaccine && (
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                            Chi tiết vắc-xin: {selectedVaccine.name}
                        </h4>
                        <button
                            type="button"
                            onClick={() => setShowVaccineDetails(!showVaccineDetails)}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                        >
                            {showVaccineDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                        </button>
                    </div>

                    {showVaccineDetails && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <FiPackage className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Liều lượng:</span>
                                    <span className="ml-1 text-neutral-900 dark:text-neutral-100">{selectedVaccine.dosage}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiActivity className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Đường dùng:</span>
                                    <span className="ml-1 text-neutral-900 dark:text-neutral-100">{selectedVaccine.route}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiThermometer className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Bảo quản:</span>
                                    <span className="ml-1 text-neutral-900 dark:text-neutral-100">{selectedVaccine.storageTemp}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiCalendar className="w-4 h-4 text-neutral-500 dark:text-neutral-400 mr-2" />
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300">Hiệu lực:</span>
                                    <span className="ml-1 text-neutral-900 dark:text-neutral-100">{selectedVaccine.effectivenessPeriod}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-col">
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                        <FiAlertTriangle className="w-4 h-4 mr-2" />
                                        Tác dụng phụ:
                                    </span>
                                    <span className="ml-6 text-neutral-600 dark:text-neutral-400">{selectedVaccine.sideEffects}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                        <FiInfo className="w-4 h-4 mr-2" />
                                        Chống chỉ định:
                                    </span>
                                    <span className="ml-6 text-neutral-600 dark:text-neutral-400">{selectedVaccine.contraindications}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No Vaccine Selected */}
            {!selectedVaccine && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <div className="flex">
                        <FiInfo className="w-5 h-5 text-amber-400 dark:text-amber-500" />
                        <div className="ml-3">
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Vui lòng chọn loại vắc-xin để hiển thị các trường thông tin chi tiết.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VaccineDetailsStep; 