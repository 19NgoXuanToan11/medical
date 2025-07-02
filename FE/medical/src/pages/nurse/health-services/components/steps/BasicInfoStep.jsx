import React from 'react';
import { FiUsers, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const BasicInfoStep = ({ formData, validationErrors, onInputChange, totalStudents = 0 }) => {
    const currentDateTime = new Date().toISOString().slice(0, 16);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        <FiUsers className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Tổng học sinh</p>
                            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalStudents}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        <FiCalendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Ngày dự kiến</p>
                            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                {formData.scheduledDate ? new Date(formData.scheduledDate).toLocaleDateString('vi-VN') : '--'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        <FiClock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Thời gian</p>
                            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                {formData.scheduledTime || '--'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        <FiMapPin className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Địa điểm</p>
                            <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                {formData.location || '--'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-6">
                    Thông tin cơ bản của kế hoạch tiêm chủng
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Tiêu đề kế hoạch *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => onInputChange('title', e.target.value)}
                                placeholder="Vd: Tiêm chủng phòng chống COVID-19 học kỳ I"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${validationErrors.title ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                    }`}
                            />
                            {validationErrors.title && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
                            )}
                        </div>

                        {/* Scheduled Date */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Ngày dự kiến thực hiện *
                            </label>
                            <input
                                type="date"
                                value={formData.scheduledDate}
                                onChange={(e) => onInputChange('scheduledDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${validationErrors.scheduledDate ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                    }`}
                            />
                            {validationErrors.scheduledDate && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.scheduledDate}</p>
                            )}
                        </div>

                        {/* Scheduled Time */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Thời gian dự kiến *
                            </label>
                            <input
                                type="time"
                                value={formData.scheduledTime}
                                onChange={(e) => onInputChange('scheduledTime', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${validationErrors.scheduledTime ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                    }`}
                            />
                            {validationErrors.scheduledTime && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.scheduledTime}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Địa điểm thực hiện *
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => onInputChange('location', e.target.value)}
                                placeholder="Vd: Phòng y tế trường, Hội trường, Sân trường..."
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 ${validationErrors.location ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-600'
                                    }`}
                            />
                            {validationErrors.location && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.location}</p>
                            )}
                        </div>

                        {/* Priority Level */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Mức độ ưu tiên
                            </label>
                            <select
                                value={formData.priorityLevel}
                                onChange={(e) => onInputChange('priorityLevel', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="normal">Bình thường</option>
                                <option value="high">Cao</option>
                                <option value="urgent">Khẩn cấp</option>
                            </select>
                        </div>

                        {/* Urgency Level */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Tình trạng khẩn cấp
                            </label>
                            <select
                                value={formData.urgencyLevel}
                                onChange={(e) => onInputChange('urgencyLevel', e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="routine">Định kỳ</option>
                                <option value="urgent">Khẩn cấp</option>
                                <option value="emergency">Cấp cứu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Mô tả thêm
                    </label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => onInputChange('description', e.target.value)}
                        placeholder="Mô tả chi tiết về kế hoạch tiêm chủng, mục đích, yêu cầu đặc biệt..."
                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                </div>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                    Lưu ý quan trọng
                </h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Thông tin cơ bản sẽ được sử dụng để tạo lập kế hoạch tiêm chủng</li>
                    <li>• Vui lòng kiểm tra kỹ thông tin trước khi chuyển sang bước tiếp theo</li>
                    <li>• Ngày và giờ thực hiện cần phù hợp với lịch học của các lớp được chọn</li>
                    <li>• Địa điểm cần đảm bảo đủ không gian và điều kiện vệ sinh</li>
                </ul>
            </div>
        </div>
    );
};

export default BasicInfoStep; 