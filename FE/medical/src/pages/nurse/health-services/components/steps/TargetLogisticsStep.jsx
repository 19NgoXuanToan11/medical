import React, { useState } from 'react';
import { FiUsers, FiCalendar, FiClock, FiMapPin, FiUserCheck, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { formatCurrency, formatDuration } from '../../utils/vaccinationHelpers';

const TargetLogisticsStep = ({
    formData,
    validationErrors,
    onInputChange,
    onGradeSelection,
    availableGrades,
    totalStudents,
    sessions,
    resourceReqs
}) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="space-y-6">
            {/* Target Selection */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                    Đối tượng tiêm chủng
                </h3>

                {/* Grade Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                        <FiUsers className="inline w-4 h-4 mr-1" />
                        Chọn khối lớp *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableGrades.map((grade) => (
                            <label
                                key={grade.id}
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    formData.targetGrades.includes(grade.id)
                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-200 dark:ring-primary-800'
                                        : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 bg-white dark:bg-neutral-900'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.targetGrades.includes(grade.id)}
                                    onChange={(e) => {
                                        const newSelectedGrades = e.target.checked
                                            ? [...formData.targetGrades, grade.id]
                                            : formData.targetGrades.filter(id => id !== grade.id);
                                        onInputChange('targetGrades', newSelectedGrades);
                                    }}
                                    className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {grade.name}
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        {grade.studentCount} học sinh
                                    </p>
                                </div>
                                <div className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                    {grade.ageRange}
                                </div>
                            </label>
                        ))}
                    </div>
                    {validationErrors.targetGrades && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationErrors.targetGrades}</p>
                    )}
                </div>

                {/* Summary */}
                {formData.targetGrades.length > 0 && (
                    <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                Tổng kết đối tượng tiêm
                            </h4>
                            <button
                                type="button"
                                onClick={() => setShowDetails(!showDetails)}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
                            >
                                {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                            </button>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formData.targetGrades.length}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Khối lớp</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalStudents}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Học sinh</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formData.targetGrades.reduce((sum, gradeId) => sum + availableGrades.find(grade => grade.id === gradeId).classes, 0)}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Lớp học</p>
                            </div>
                        </div>

                        {showDetails && (
                            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.targetGrades.map(gradeId => (
                                        <div key={gradeId} className="flex justify-between items-center py-2">
                                            <span className="font-medium text-neutral-900 dark:text-neutral-100">{availableGrades.find(grade => grade.id === gradeId).name}</span>
                                            <span className="text-neutral-600 dark:text-neutral-400">
                                                {availableGrades.find(grade => grade.id === gradeId).studentCount} HS - {availableGrades.find(grade => grade.id === gradeId).classes} lớp
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Logistics Details */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                    Thông tin logistics
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Session Duration */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                <FiClock className="inline w-4 h-4 mr-1" />
                                Thời gian dự kiến cho mỗi phiên
                            </label>
                            <select
                                value={formData.sessionDuration}
                                onChange={(e) => onInputChange('sessionDuration', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value={30}>30 phút</option>
                                <option value={45}>45 phút</option>
                                <option value={60}>1 giờ</option>
                                <option value={90}>1.5 giờ</option>
                                <option value={120}>2 giờ</option>
                            </select>
                        </div>

                        {/* Students per Session */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                <FiUserCheck className="inline w-4 h-4 mr-1" />
                                Số học sinh mỗi phiên
                            </label>
                            <input
                                type="number"
                                value={formData.studentsPerSession}
                                onChange={(e) => onInputChange('studentsPerSession', parseInt(e.target.value))}
                                min="1"
                                max="100"
                                placeholder="Vd: 50"
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                        </div>

                        {/* Required Staff */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Nhân viên y tế cần thiết
                            </label>
                            <input
                                type="number"
                                value={formData.requiredStaff}
                                onChange={(e) => onInputChange('requiredStaff', parseInt(e.target.value))}
                                min="1"
                                max="20"
                                placeholder="Vd: 3"
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Break Time */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                Thời gian nghỉ giữa các phiên
                            </label>
                            <select
                                value={formData.breakTime}
                                onChange={(e) => onInputChange('breakTime', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value={5}>5 phút</option>
                                <option value={10}>10 phút</option>
                                <option value={15}>15 phút</option>
                                <option value={30}>30 phút</option>
                            </select>
                        </div>

                        {/* Location Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                <FiMapPin className="inline w-4 h-4 mr-1" />
                                Sức chứa địa điểm
                            </label>
                            <input
                                type="number"
                                value={formData.locationCapacity}
                                onChange={(e) => onInputChange('locationCapacity', parseInt(e.target.value))}
                                min="1"
                                placeholder="Vd: 100"
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                            />
                        </div>

                        {/* Special Requirements */}
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.requiresParentConsent}
                                    onChange={(e) => onInputChange('requiresParentConsent', e.target.checked)}
                                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600 rounded"
                                />
                                <span className="text-sm text-neutral-700 dark:text-neutral-300">Yêu cầu đồng ý của phụ huynh</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Estimated Sessions Calculation */}
                {totalStudents > 0 && formData.studentsPerSession > 0 && (
                    <div className="mt-6 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
                            Ước tính số phiên tiêm
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {Math.ceil(totalStudents / formData.studentsPerSession)}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Số phiên</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {Math.ceil(totalStudents / formData.studentsPerSession) * formData.sessionDuration}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Phút</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {Math.ceil((Math.ceil(totalStudents / formData.studentsPerSession) * formData.sessionDuration) / 60)}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Giờ</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                    {formData.requiredStaff || 1}
                                </p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">Nhân viên</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Resource Requirements */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
                    Yêu cầu tài nguyên
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Equipment */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Trang thiết bị cần thiết
                        </label>
                        <textarea
                            rows={4}
                            value={formData.equipmentNeeded}
                            onChange={(e) => onInputChange('equipmentNeeded', e.target.value)}
                            placeholder="Vd: Kim tiêm, bông gòn, cồn y tế, thùng rác y tế..."
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            Ghi chú bổ sung
                        </label>
                        <textarea
                            rows={4}
                            value={formData.additionalNotes}
                            onChange={(e) => onInputChange('additionalNotes', e.target.value)}
                            placeholder="Ghi chú về yêu cầu đặc biệt, lưu ý về sức khỏe học sinh..."
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                        />
                    </div>
                </div>
            </div>

            {/* Validation Errors */}
            {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                        <FiAlertTriangle className="w-5 h-5 text-red-400 dark:text-red-500" />
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-red-800 dark:text-red-300">
                                Vui lòng kiểm tra lại các thông tin sau:
                            </h4>
                            <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                                {Object.entries(validationErrors).map(([key, error]) => (
                                    <li key={key}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Important Guidelines */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex">
                    <FiInfo className="w-5 h-5 text-amber-400 dark:text-amber-500" />
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                            Hướng dẫn quan trọng
                        </h4>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                            <li>• Đảm bảo chọn đủ khối lớp cần tiêm chủng</li>
                            <li>• Tính toán thời gian phù hợp để không ảnh hưởng đến việc học</li>
                            <li>• Chuẩn bị đầy đủ nhân viên y tế và trang thiết bị</li>
                            <li>• Xem xét sức chứa địa điểm và yêu cầu an toàn</li>
                            <li>• Lưu ý các yêu cầu đặc biệt về sức khỏe của học sinh</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TargetLogisticsStep; 