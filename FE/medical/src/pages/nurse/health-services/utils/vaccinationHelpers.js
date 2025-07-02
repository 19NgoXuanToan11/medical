// Helper functions for vaccination management

/**
 * Calculate total number of students across selected grades
 */
export const calculateTotalStudents = (selectedGrades, availableGrades) => {
    return selectedGrades.reduce((total, gradeId) => {
        const grade = availableGrades.find(g => g.id === gradeId);
        return total + (grade ? grade.studentCount : 0);
    }, 0);
};

/**
 * Calculate estimated cost for vaccination program
 */
export const calculateEstimatedCost = (totalStudents, costPerDose, additionalCosts = 0) => {
    return (totalStudents * costPerDose) + additionalCosts;
};

/**
 * Calculate number of sessions needed based on max students per session
 */
export const calculateRequiredSessions = (totalStudents, maxStudentsPerSession) => {
    if (totalStudents === 0 || maxStudentsPerSession === 0) return 0;
    return Math.ceil(totalStudents / maxStudentsPerSession);
};

/**
 * Calculate total time needed for vaccination program
 */
export const calculateTotalDuration = (sessions, durationPerSession) => {
    return sessions * durationPerSession;
};

/**
 * Calculate resource requirements for vaccination
 */
export const calculateResourceRequirements = (totalStudents, vaccineType) => {
    const baseStaffCount = Math.ceil(totalStudents / 50); // 1 staff per 50 students
    const nurseCount = Math.max(2, Math.ceil(totalStudents / 30)); // Min 2 nurses
    const doctorCount = Math.max(1, Math.ceil(totalStudents / 100)); // Min 1 doctor

    return {
        totalStaff: baseStaffCount + nurseCount + doctorCount,
        nurses: nurseCount,
        doctors: doctorCount,
        supportStaff: baseStaffCount,
        syringes: totalStudents + Math.ceil(totalStudents * 0.1), // 10% extra
        vaccines: totalStudents + Math.ceil(totalStudents * 0.05), // 5% extra
        cottonSwabs: totalStudents * 2,
        bandAids: totalStudents,
        alcoholPads: totalStudents * 2,
        disposalBoxes: Math.ceil(totalStudents / 100),
        emergencyKit: 1,
        chairs: Math.min(20, Math.ceil(totalStudents / 10)),
        tables: Math.ceil(nurseCount / 2)
    };
};

/**
 * Auto-calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationMinutes) => {
    if (!startTime || !durationMinutes) return "";

    try {
        const [hours, minutes] = startTime.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        return endDate.toTimeString().slice(0, 5);
    } catch (error) {
        console.error("Error calculating end time:", error);
        return "";
    }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes} phút`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} giờ`;
    }

    return `${hours} giờ ${remainingMinutes} phút`;
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString) => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
};

/**
 * Check if time is during school hours
 */
export const isSchoolHours = (timeString) => {
    if (!timeString) return false;

    const [hours] = timeString.split(':').map(Number);
    return hours >= 7 && hours <= 17; // 7 AM to 5 PM
};

/**
 * Validate vaccine expiry date
 */
export const isValidExpiryDate = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry > today;
};

/**
 * Generate vaccination schedule summary
 */
export const generateScheduleSummary = (formData, totalStudents, sessions) => {
    return {
        title: formData.title,
        date: formData.scheduledDate,
        time: `${formData.scheduledTime} - ${formData.endTime}`,
        location: formData.location,
        vaccine: formData.vaccineType,
        totalStudents,
        sessions,
        estimatedDuration: formatDuration(formData.estimatedDuration * sessions),
        grades: formData.targetGrades.length,
        requiresApproval: formData.requiresApproval
    };
};

/**
 * Check for potential scheduling conflicts
 */
export const checkScheduleConflicts = (formData, existingSchedules = []) => {
    const conflicts = [];
    const selectedDate = formData.scheduledDate;
    const selectedTime = formData.scheduledTime;
    const selectedLocation = formData.location;

    // Check date conflicts
    const sameDate = existingSchedules.filter(schedule =>
        schedule.date === selectedDate
    );

    if (sameDate.length > 0) {
        conflicts.push({
            type: 'date',
            severity: 'warning',
            message: `Đã có ${sameDate.length} hoạt động khác trong ngày ${selectedDate}`
        });
    }

    // Check time/location conflicts
    const timeConflicts = sameDate.filter(schedule => {
        const scheduleStart = schedule.startTime;
        const scheduleEnd = schedule.endTime;

        return (selectedTime >= scheduleStart && selectedTime <= scheduleEnd) ||
            (formData.endTime >= scheduleStart && formData.endTime <= scheduleEnd) ||
            (selectedTime <= scheduleStart && formData.endTime >= scheduleEnd);
    });

    if (timeConflicts.length > 0) {
        conflicts.push({
            type: 'time',
            severity: 'error',
            message: `Xung đột thời gian với ${timeConflicts.length} hoạt động khác`
        });
    }

    const locationConflicts = timeConflicts.filter(schedule =>
        schedule.location === selectedLocation
    );

    if (locationConflicts.length > 0) {
        conflicts.push({
            type: 'location',
            severity: 'error',
            message: `Xung đột địa điểm "${selectedLocation}" với hoạt động khác`
        });
    }

    return conflicts;
};

/**
 * Generate parent notification message template
 */
export const generateParentNotificationTemplate = (formData, vaccineDetails) => {
    return `Kính gửi Quý phụ huynh,

Trường sẽ tổ chức tiêm ${vaccineDetails?.name || formData.vaccineType} cho các em học sinh.

📋 Thông tin vắc-xin:
• Tên: ${vaccineDetails?.name || 'Đang cập nhật'} (${vaccineDetails?.code || ''})
• Liều dùng: ${vaccineDetails?.dosage || 'Theo chỉ định'}
• Phương pháp: ${vaccineDetails?.route || 'Tiêm bắp'}
• Hiệu lực: ${vaccineDetails?.effectivenessPeriod || 'Theo chỉ định'}
• Nhà sản xuất: ${vaccineDetails?.manufacturer || 'Đang cập nhật'}

📅 Thời gian: ${formData.scheduledDate || 'Đang lên lịch'} lúc ${formData.scheduledTime || 'Đang xác định'}
📍 Địa điểm: ${formData.location || 'Phòng y tế trường'}
👥 Đối tượng: Học sinh các lớp đã chọn

⚠️ Lưu ý quan trọng:
• Chống chỉ định: ${vaccineDetails?.contraindications || 'Xem hướng dẫn chi tiết'}
• Tác dụng phụ có thể có: ${vaccineDetails?.sideEffects || 'Theo hướng dẫn sử dụng'}
• Yêu cầu bảo quản: Bảo quản ở ${vaccineDetails?.storageTemp || '2-8°C'}
• Thời gian quan sát sau tiêm: ${vaccineDetails?.observationTime || 15} phút

📝 Lưu ý: Thông tin cụ thể về lô vaccine, hạn sử dụng và chi tiết khác sẽ được cập nhật khi có thông tin chính xác từ nhà cung cấp.

Chúng tôi sẽ liên hệ với Quý phụ huynh trước ngày tiêm ${formData.reminderDaysBefore || 7} ngày để xác nhận.

Quý phụ huynh vui lòng xác nhận cho con em tham gia và thông báo các tình trạng sức khỏe đặc biệt.

Trân trọng,
Ban Giám hiệu`;
};

/**
 * Validate form data for each step
 */
export const validateFormStep = (step, formData) => {
    const errors = {};

    switch (step) {
        case 1: // Basic Info
            if (!formData.title?.trim()) {
                errors.title = "Vui lòng nhập tiêu đề kế hoạch";
            }
            if (!formData.scheduledDate) {
                errors.scheduledDate = "Vui lòng chọn ngày thực hiện";
            } else if (!isFutureDate(formData.scheduledDate)) {
                errors.scheduledDate = "Ngày thực hiện phải là ngày trong tương lai";
            }
            if (!formData.scheduledTime) {
                errors.scheduledTime = "Vui lòng chọn giờ bắt đầu";
            } else if (!isSchoolHours(formData.scheduledTime)) {
                errors.scheduledTime = "Thời gian nên trong giờ học (7:00 - 17:00)";
            }
            if (!formData.location?.trim()) {
                errors.location = "Vui lòng nhập địa điểm thực hiện";
            }
            break;

        case 2: // Vaccine Details
            if (!formData.vaccineType) {
                errors.vaccineType = "Vui lòng chọn loại vắc-xin";
            }
            break;

        case 3: // Target & Logistics
            if (formData.targetGrades.length === 0) {
                errors.targetGrades = "Vui lòng chọn ít nhất một lớp học";
            }
            if (!formData.maxStudentsPerSession || formData.maxStudentsPerSession < 1) {
                errors.maxStudentsPerSession = "Số học sinh tối đa phải lớn hơn 0";
            }
            if (!formData.estimatedDuration || formData.estimatedDuration < 30) {
                errors.estimatedDuration = "Thời gian ước tính phải ít nhất 30 phút";
            }
            break;

        default:
            break;
    }

    return errors;
}; 