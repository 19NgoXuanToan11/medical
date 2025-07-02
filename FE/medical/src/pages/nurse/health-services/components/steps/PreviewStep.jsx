import React from 'react';
import { FiShield, FiCalendar, FiMapPin, FiClock, FiUsers, FiDollarSign, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { formatCurrency, formatDuration } from '../../utils/vaccinationHelpers';

const PreviewStep = ({
    formData,
    totalStudents,
    sessions,
    selectedVaccine,
    estimatedCost,
    resourceReqs,
    scheduleConflicts,
    availableGrades
}) => {
    const hasHighSeverityConflicts = scheduleConflicts.some(c => c.severity === 'error');
    const hasWarnings = scheduleConflicts.some(c => c.severity === 'warning');

    return (
        <div className="space-y-6">
            {/* Header Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Xác nhận kế hoạch tiêm chủng
                    </h2>
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                        <FiShield className="w-4 h-4 inline mr-1" />
                        Tiêm chủng
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalStudents}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tổng học sinh</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formData.targetGrades.length}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Lớp học</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sessions}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Ca tiêm</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(estimatedCost)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Chi phí dự kiến</div>
                    </div>
                </div>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <FiCalendar className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
                        Thông tin cơ bản
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Tiêu đề:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Ngày thực hiện:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {new Date(formData.scheduledDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formData.scheduledTime} - {formData.endTime}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Địa điểm:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{formData.location}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Thời gian dự kiến:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatDuration(formData.estimatedDuration)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Mức độ ưu tiên:</span>
                            <span className={`font-medium ${formData.urgencyLevel === 'urgent' ? 'text-red-600 dark:text-red-400' :
                                formData.urgencyLevel === 'high' ? 'text-orange-600 dark:text-orange-400' :
                                    formData.urgencyLevel === 'normal' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                {formData.urgencyLevel === 'urgent' ? 'Khẩn cấp' :
                                    formData.urgencyLevel === 'high' ? 'Cao' :
                                        formData.urgencyLevel === 'normal' ? 'Bình thường' : 'Thấp'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Vaccine Details */}
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <FiShield className="w-5 h-5 mr-2 text-green-500 dark:text-green-400" />
                        Chi tiết vắc-xin
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Loại vắc-xin:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                                {selectedVaccine?.name || 'Chưa chọn'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Mã vắc-xin:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {selectedVaccine?.code || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Nhà sản xuất:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                                {selectedVaccine?.manufacturer || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Liều dùng:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {selectedVaccine?.dosage || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Đường dùng:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {selectedVaccine?.route || 'N/A'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Yêu cầu bảo quản:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {selectedVaccine?.storageTemp || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Target Classes */}
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <FiUsers className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                        Lớp học tham gia
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {formData.targetGrades.map(gradeId => {
                            const grade = availableGrades.find(g => g.id === gradeId);
                            return grade ? (
                                <div key={gradeId} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-neutral-700 rounded">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{grade.name}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{grade.studentCount} HS</span>
                                </div>
                            ) : null;
                        })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-neutral-600">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">Tổng cộng:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{totalStudents} học sinh</span>
                        </div>
                    </div>
                </div>

                {/* Resource Requirements */}
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                        <FiDollarSign className="w-5 h-5 mr-2 text-orange-500 dark:text-orange-400" />
                        Yêu cầu tài nguyên
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Nhân viên y tế:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{resourceReqs.staff} người</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Số ca thực hiện:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{sessions} ca</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Vắc-xin cần:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{resourceReqs.vaccines} liều</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Kim tiêm:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{resourceReqs.syringes} cái</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Bảo quản:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 text-right">{resourceReqs.storage}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-neutral-600">
                            <span className="font-medium text-gray-900 dark:text-gray-100">Chi phí dự kiến:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(estimatedCost)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Communication Details */}
            {(formData.parentNotificationMessage || formData.teacherInstructions || formData.notes) && (
                <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Thông tin giao tiếp
                    </h3>
                    <div className="space-y-4">
                        {formData.parentNotificationMessage && (
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Thông báo phụ huynh:</h4>
                                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                                    {formData.parentNotificationMessage}
                                </p>
                            </div>
                        )}
                        {formData.teacherInstructions && (
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Hướng dẫn giáo viên:</h4>
                                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                                    {formData.teacherInstructions}
                                </p>
                            </div>
                        )}
                        {formData.notes && (
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Ghi chú:</h4>
                                <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700 p-3 rounded border border-gray-200 dark:border-neutral-600">
                                    {formData.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Approval Requirements */}
            {formData.requiresApproval && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                    <div className="flex items-center">
                        <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                        <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Yêu cầu phê duyệt</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                Kế hoạch này cần được phê duyệt bởi {' '}
                                <span className="font-medium">
                                    {formData.approvalLevel === 'manager' ? 'Ban Giám hiệu' : 'Y tá trưởng'}
                                </span>
                                {' '} trước khi thực hiện do quy mô lớn hoặc mức độ ưu tiên cao.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule Conflicts */}
            {scheduleConflicts.length > 0 && (
                <div className={`border rounded-lg p-6 ${hasHighSeverityConflicts
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    }`}>
                    <h4 className={`font-medium mb-3 flex items-center ${hasHighSeverityConflicts
                        ? 'text-red-800 dark:text-red-200'
                        : 'text-yellow-800 dark:text-yellow-200'
                        }`}>
                        <FiAlertCircle className="w-5 h-5 mr-2" />
                        {hasHighSeverityConflicts ? 'Xung đột nghiêm trọng' : 'Cảnh báo xung đột'}
                    </h4>
                    <ul className="space-y-2">
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
                    {hasHighSeverityConflicts && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded">
                            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                                ⚠️ Vui lòng giải quyết các xung đột nghiêm trọng trước khi tiếp tục.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Success Message */}
            {!hasHighSeverityConflicts && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                    <div className="flex items-center">
                        <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                            <h4 className="font-medium text-green-800 dark:text-green-200">Sẵn sàng tạo kế hoạch</h4>
                            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Tất cả thông tin đã được kiểm tra và xác thực.
                                {hasWarnings && ' Có một số cảnh báo nhỏ nhưng không ảnh hưởng đến việc thực hiện.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewStep; 