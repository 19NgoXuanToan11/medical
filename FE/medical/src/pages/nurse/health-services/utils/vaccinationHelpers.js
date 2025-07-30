// Helper functions for vaccination management

/**
 * Calculate total number of students across selected grades
 */
export const calculateTotalStudents = (selectedGrades, availableGrades, assignedClasses = []) => {
  if (
    !selectedGrades ||
    !Array.isArray(selectedGrades) ||
    !availableGrades ||
    !Array.isArray(availableGrades)
  ) {
    return 0;
  }

  return selectedGrades.reduce((total, gradeId) => {
    const grade = availableGrades.find(
      (g) => g.id === gradeId || g.classId === gradeId
    );
    if (!grade) return total;
    
    // Nếu có assignedClasses, đếm từ data thật
    if (assignedClasses.length > 0) {
      const classesInGrade = assignedClasses.filter(
        (cls) => `${cls.gradeLevel}` === `${grade.gradeLevel}`
      );
      const totalStudents = classesInGrade.reduce(
        (classSum, cls) => classSum + (cls.students?.length || 0),
        0
      );
      return total + totalStudents;
    }
    
    // Fallback về cách cũ nếu không có assignedClasses
    return total + (grade?.studentCount || 0);
  }, 0);
};

/**
 * Calculate estimated cost for vaccination program
 */
export const calculateEstimatedCost = (totalStudents, costPerDose) => {
  return totalStudents * (costPerDose || 0);
};

/**
 * Calculate number of sessions needed based on max students per session
 */
export const calculateRequiredSessions = (totalStudents, maxPerSession) => {
  if (!maxPerSession || maxPerSession <= 0) return 1;
  return Math.ceil(totalStudents / maxPerSession);
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
    tables: Math.ceil(nurseCount / 2),
  };
};

/**
 * Auto-calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return "";

  const [hours, minutes] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return `${endDate.getHours().toString().padStart(2, "0")}:${endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format duration in minutes to human readable format
 */
export const formatDuration = (minutes) => {
  if (!minutes) return "0 phút";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} phút`;
  if (remainingMinutes === 0) return `${hours} giờ`;
  return `${hours} giờ ${remainingMinutes} phút`;
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const today = new Date();
  return selectedDate > today;
};

/**
 * Check if time is during school hours
 */
export const isSchoolHours = (time) => {
  if (!time) return false;
  const [hours] = time.split(":").map(Number);
  return hours >= 7 && hours <= 17; // 7 AM to 5 PM
};

/**
 * Check if a datetime is in the future
 */
export const isFutureDateTime = (dateTimeString) => {
  if (!dateTimeString) return false;
  const selectedDateTime = new Date(dateTimeString);
  const now = new Date();
  return selectedDateTime > now;
};

/**
 * Check if a datetime is within work hours (7:00 - 17:00)
 */
export const isWorkHours = (dateTimeString) => {
  if (!dateTimeString) return false;
  const date = new Date(dateTimeString);
  const hour = date.getHours();
  return hour >= 7 && hour <= 17;
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
    dateTime: formData.scheduledDateTime,
    location: formData.location,
    vaccine: formData.vaccineType,
    totalStudents,
    sessions,
    grades: formData.targetGrades.length,
    requiresApproval: formData.requiresApproval,
  };
};

/**
 * Check for potential scheduling conflicts
 */
export const checkScheduleConflicts = (dateTimeString, location) => {
  const conflicts = [];

  if (!dateTimeString) return conflicts;

  const scheduledDate = new Date(dateTimeString);
  const now = new Date();

  // Check if scheduled in the past
  if (scheduledDate < now) {
    conflicts.push({
      severity: "error",
      message:
        "Thời gian đã được chọn đã qua. Vui lòng chọn thời gian trong tương lai.",
    });
  }

  // Check if within work hours
  if (!isWorkHours(dateTimeString)) {
    conflicts.push({
      severity: "warning",
      message: "Thời gian được chọn ngoài giờ hành chính (7:00 - 17:00).",
    });
  }

  // Check weekend
  const dayOfWeek = scheduledDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    conflicts.push({
      severity: "warning",
      message:
        "Thời gian được chọn vào cuối tuần. Xem xét lại khả năng tổ chức.",
    });
  }

  // Mock existing schedules check
  // In real app, this would check against actual scheduled events
  const hour = scheduledDate.getHours();
  if (hour >= 9 && hour <= 11 && location === "Phòng y tế trường") {
    conflicts.push({
      severity: "warning",
      message: "Có thể có hoạt động khác đã được lên lịch tại thời gian này.",
    });
  }

  return conflicts;
};

/**
 * Generate parent notification message template
 */
export const generateParentNotificationTemplate = (formData, vaccine) => {
  if (!vaccine) return "";

  return `Kính gửi Quý phụ huynh,

Trường sẽ tổ chức tiêm ${vaccine.name} cho các em học sinh vào ${
    formData.scheduledDateTime
      ? new Date(formData.scheduledDateTime).toLocaleDateString("vi-VN")
      : "[Ngày sẽ được thông báo]"
  } tại ${formData.location || "[Địa điểm sẽ được thông báo]"}.

📋 Thông tin vắc-xin:
• Tên: ${vaccine.name} (${vaccine.code})
• Liều dùng: ${vaccine.dosage}
• Phương pháp: ${vaccine.route}
• Hiệu lực: ${vaccine.effectivenessPeriod}
• Nhà sản xuất: ${vaccine.manufacturer}

⚠️ Lưu ý quan trọng:
• Chống chỉ định: ${vaccine.contraindications}
• Tác dụng phụ có thể có: ${vaccine.sideEffects}
• Yêu cầu bảo quản: Bảo quản ở ${vaccine.storageTemp}

📝 Lưu ý: Thông tin cụ thể về lô vaccine, hạn sử dụng và chi tiết khác sẽ được cập nhật khi có thông tin chính xác từ nhà cung cấp.

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
    case 1: // Basic Info (Time and Location)
      if (!formData.title?.trim()) {
        errors.title = "Vui lòng nhập tiêu đề kế hoạch";
      } else if (formData.title.trim().length < 5) {
        errors.title = "Tiêu đề phải có ít nhất 5 ký tự";
      }

      if (!formData.scheduledDateTime) {
        errors.scheduledDateTime = "Vui lòng chọn ngày và giờ thực hiện";
      } else {
        const selectedDate = new Date(formData.scheduledDateTime);
        const now = new Date();
        const minFutureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        if (selectedDate < now) {
          errors.scheduledDateTime = "Thời gian thực hiện phải trong tương lai";
        } else if (selectedDate < minFutureDate) {
          errors.scheduledDateTime =
            "Thời gian thực hiện phải ít nhất 1 tuần (7 ngày) sau hiện tại để đảm bảo thời gian chuẩn bị";
        }
      }

      if (!formData.location?.trim()) {
        errors.location = "Vui lòng nhập địa điểm thực hiện";
      } else if (formData.location.trim().length < 3) {
        errors.location = "Địa điểm phải có ít nhất 3 ký tự";
      }
      break;

    case 2: // Vaccine Selection
      if (!formData.vaccineId) {
        errors.vaccineId = "Vui lòng chọn vaccine để tiêm chủng";
      } else if (isNaN(formData.vaccineId) || formData.vaccineId <= 0) {
        errors.vaccineId = "ID vaccine không hợp lệ";
      }

      // Optional vaccine name validation
      if (formData.vaccineName && formData.vaccineName.trim().length < 2) {
        errors.vaccineName = "Tên vaccine phải có ít nhất 2 ký tự";
      }
      break;

    case 3: // Target Classes
      if (!formData.targetGrades || !Array.isArray(formData.targetGrades)) {
        errors.targetGrades = "Dữ liệu lớp học không hợp lệ";
      } else if (formData.targetGrades.length === 0) {
        errors.targetGrades = "Vui lòng chọn ít nhất một khối học";
      } else {
        // Validate each grade ID (should be non-empty strings)
        const invalidGrades = formData.targetGrades.filter(
          (gradeId) =>
            !gradeId || typeof gradeId !== "string" || gradeId.trim() === ""
        );
        if (invalidGrades.length > 0) {
          errors.targetGrades = "Một số ID lớp học không hợp lệ";
        }
      }
      break;

    case 4: // Additional Settings (optional step)
      // Validate description if provided
      if (formData.description && formData.description.length > 500) {
        errors.description = "Mô tả không được vượt quá 500 ký tự";
      }

      // Validate estimated duration if provided
      if (formData.estimatedDuration) {
        if (
          isNaN(formData.estimatedDuration) ||
          formData.estimatedDuration < 30
        ) {
          errors.estimatedDuration = "Thời gian ước tính phải ít nhất 30 phút";
        } else if (formData.estimatedDuration > 480) {
          errors.estimatedDuration =
            "Thời gian ước tính không được vượt quá 8 giờ";
        }
      }
      break;

    default:
      break;
  }

  return errors;
};

/**
 * Validate complete form data before submission
 */
export const validateCompleteForm = (formData) => {
  const errors = {};

  // Validate all critical fields
  if (!formData.title?.trim()) {
    errors.title = "Tiêu đề là bắt buộc";
  }

  if (!formData.vaccineId || formData.vaccineId <= 0) {
    errors.vaccineId = "Phải chọn vaccine hợp lệ";
  }

  if (!formData.targetGrades || formData.targetGrades.length === 0) {
    errors.targetGrades = "Phải chọn ít nhất một lớp học";
  }

  if (
    !formData.scheduledDateTime &&
    (!formData.scheduledDate || !formData.scheduledTime)
  ) {
    errors.scheduledDateTime = "Phải chọn ngày và thời gian thực hiện";
  } else {
    let dateToValidate;
    if (formData.scheduledDateTime) {
      dateToValidate = new Date(formData.scheduledDateTime);
    } else if (formData.scheduledDate && formData.scheduledTime) {
      dateToValidate = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}:00`
      );
    }

    if (dateToValidate) {
      const now = new Date();
      const minFutureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      if (dateToValidate <= now) {
        errors.scheduledDateTime = "Thời gian thực hiện phải trong tương lai";
      } else if (dateToValidate < minFutureDate) {
        errors.scheduledDateTime =
          "Thời gian thực hiện phải ít nhất 1 tuần (7 ngày) sau hiện tại";
      }
    }
  }

  if (!formData.location?.trim()) {
    errors.location = "Địa điểm là bắt buộc";
  }

  return errors;
};
