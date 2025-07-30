// Helper functions for health check management

/**
 * Calculate total number of students across selected grades
 */
export const calculateTotalStudents = (selectedGrades, availableGrades, assignedClasses = []) => {
  return selectedGrades.reduce((total, classId) => {
    // Tìm lớp được chọn trong assignedClasses
    const selectedClass = assignedClasses.find((cls) => 
      cls.classId === classId || cls.id === classId
    );
    
    if (selectedClass) {
      // Đếm học sinh từ lớp được chọn
      return total + (selectedClass.students?.length || 0);
    }
    
    // Fallback: tìm trong availableGrades (nếu có)
    const grade = availableGrades.find((g) => g.id === classId);
    if (grade) {
      return total + (grade.studentCount || 0);
    }
    
    return total;
  }, 0);
};

/**
 * Calculate number of sessions needed based on max students per session
 */
export const calculateRequiredSessions = (
  totalStudents,
  maxStudentsPerSession
) => {
  if (totalStudents === 0 || maxStudentsPerSession === 0) return 0;
  return Math.ceil(totalStudents / maxStudentsPerSession);
};

/**
 * Calculate total time needed for health check program
 */
export const calculateTotalDuration = (
  checkItems,
  healthCheckItems,
  sessions
) => {
  const totalItemTime = checkItems.reduce((total, itemId) => {
    const item = healthCheckItems.find((h) => h.id === itemId);
    return total + (item?.estimatedTime || 10);
  }, 0);

  // Add buffer time (30 minutes) and multiply by sessions
  const baseTime = Math.max(totalItemTime + 30, 60); // Min 60 minutes
  return baseTime * sessions;
};

/**
 * Calculate resource requirements for health check
 */
export const calculateResourceRequirements = (
  totalStudents,
  checkItems,
  healthCheckItems
) => {
  const staff = Math.max(2, Math.ceil(totalStudents / 50)); // Min 2 staff
  const sessions = Math.ceil(totalStudents / 50);
  const examinationRooms = Math.ceil(sessions / 2);

  // Get all required equipment
  const equipment = [
    ...new Set(
      checkItems.flatMap((itemId) => {
        const item = healthCheckItems.find((h) => h.id === itemId);
        return item?.equipment || [];
      })
    ),
  ];

  return {
    staff,
    timeSlots: sessions,
    estimatedCost: totalStudents * 0, // No cost by default for health checks
    equipment,
    examinationRooms,
    totalTime: calculateTotalDuration(checkItems, healthCheckItems, 1), // Per session
  };
};

/**
 * Auto-calculate end time based on start time and duration
 */
export const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return "";

  try {
    const [hours, minutes] = startTime.split(":").map(Number);
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
 * Check if a date is in the future and at least 3 days from today
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate minimum date (1 week from today)
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7);

  return selectedDate >= minDate;
};

/**
 * Check if a date is valid for health check scheduling
 * Returns validation error message or null if valid
 */
export const validateScheduleDate = (dateString) => {
  if (!dateString) return "Ngày thực hiện là bắt buộc";

  const selectedDate = new Date(dateString);
  selectedDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if date is in the past
  if (selectedDate < today) {
    return "Ngày thực hiện không thể trong quá khứ";
  }

  // Calculate minimum date (1 week from today)
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 7);

  if (selectedDate < minDate) {
    const minDateStr = minDate.toLocaleDateString("vi-VN");
    return `Ngày thực hiện phải cách tối thiểu 3 ngày (từ ${minDateStr})`;
  }

  return null;
};

/**
 * Check if time is during school hours
 */
export const isSchoolHours = (timeString) => {
  if (!timeString) return false;

  const [hours] = timeString.split(":").map(Number);
  return hours >= 7 && hours <= 17; // 7 AM to 5 PM
};

/**
 * Get season text based on current month
 */
export const getSeasonText = () => {
  const month = new Date().getMonth();
  return month >= 8 ? "Học kỳ 1" : "Học kỳ 2";
};

/**
 * Generate health check notification message template
 */
export const generateHealthCheckNotificationTemplate = (
  checkItems,
  healthCheckItems,
  formData
) => {
  const selectedItems = checkItems
    .map((itemId) => {
      const item = healthCheckItems.find((h) => h.id === itemId);
      return item?.name;
    })
    .filter(Boolean);

  return `Kính gửi Quý phụ huynh,

Trường sẽ tổ chức khám sức khỏe định kỳ cho các em học sinh.

🏥 Các hạng mục khám:
${selectedItems.map((item) => `• ${item}`).join("\n")}

📝 Quý phụ huynh lưu ý:
• Đảm bảo con em được nghỉ ngơi đầy đủ trước ngày khám
• Thông báo các vấn đề sức khỏe đang gặp phải
• Mang theo thẻ BHYT (nếu có)

Kết quả khám sẽ được thông báo đến quý phụ huynh trong vòng 3-5 ngày làm việc.

Trân trọng,
Ban Giám hiệu`;
};

/**
 * Check for potential scheduling conflicts
 */
export const checkScheduleConflicts = (formData, existingSchedules = []) => {
  const conflicts = [];
  const selectedDate = formData.scheduledDate;
  const selectedTime = formData.scheduledTime;
  const selectedLocation = formData.location;

  // Skip checks if required data is missing
  if (!selectedDate || !selectedTime || !selectedLocation) {
    return conflicts;
  }

  // Determine session (morning/afternoon) based on time
  const getSession = (time) => {
    const hour = parseInt(time.split(':')[0]);
    return hour < 12 ? 'morning' : 'afternoon';
  };

  const selectedSession = getSession(selectedTime);

  // Filter approved schedules for the same date and session
  const conflictingSchedules = existingSchedules.filter((schedule) => {
    // Only check approved schedules (status: 'approved')
    if (schedule.status !== 'approved') return false;
    
    // Check same date
    if (schedule.scheduledDate !== selectedDate) return false;
    
    // Check same session (morning/afternoon)
    const scheduleSession = getSession(schedule.scheduledTime || schedule.startTime);
    return scheduleSession === selectedSession;
  });

  if (conflictingSchedules.length > 0) {
    const sessionText = selectedSession === 'morning' ? 'buổi sáng' : 'buổi chiều';
    conflicts.push({
      type: "schedule_conflict",
      severity: "error",
      message: `Đã có lịch khám được phê duyệt vào ${sessionText} ngày ${selectedDate}. Vui lòng chọn buổi khác hoặc ngày khác.`,
    });
  }

  // Check for time/location conflicts within the same session
  const sameDateSchedules = existingSchedules.filter((schedule) => {
    if (schedule.status !== 'approved') return false;
    return schedule.scheduledDate === selectedDate;
  });

  const timeConflicts = sameDateSchedules.filter((schedule) => {
    const scheduleStart = schedule.startTime || schedule.scheduledTime;
    const scheduleEnd = schedule.endTime;

    if (!scheduleStart || !scheduleEnd) return false;

    return (
      (selectedTime >= scheduleStart && selectedTime <= scheduleEnd) ||
      (formData.endTime >= scheduleStart && formData.endTime <= scheduleEnd) ||
      (selectedTime <= scheduleStart && formData.endTime >= scheduleEnd)
    );
  });

  if (timeConflicts.length > 0) {
    conflicts.push({
      type: "time",
      severity: "error",
      message: `Xung đột thời gian với ${timeConflicts.length} hoạt động khác`,
    });
  }

  const locationConflicts = timeConflicts.filter(
    (schedule) => schedule.location === selectedLocation
  );

  if (locationConflicts.length > 0) {
    conflicts.push({
      type: "location",
      severity: "error",
      message: `Xung đột địa điểm "${selectedLocation}" với hoạt động khác`,
    });
  }

  // Check staff availability only if we have many students
  const totalStudents = formData.targetGrades
    ? formData.targetGrades.length * 25
    : 0;
  const requiredStaff = Math.ceil(totalStudents / 50);
  const availableStaff = 3; // Mock available staff

  // Only show staff warning if really needed (over 150 students = 6+ staff needed)
  if (requiredStaff > availableStaff && totalStudents > 150) {
    conflicts.push({
      type: "staff",
      severity: "warning",
      message: `Cần ${requiredStaff} nhân viên y tế nhưng chỉ có ${availableStaff} người rảnh`,
    });
  }

  return conflicts;
};

/**
 * Validate form data for each step
 */
export const validateFormStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1: // Basic Info
      if (!formData.title?.trim()) {
        errors.title = "Tiêu đề là bắt buộc";
      }
      const dateError = validateScheduleDate(formData.scheduledDate);
      if (dateError) {
        errors.scheduledDate = dateError;
      } else {
        const selectedDate = new Date(formData.scheduledDate);
        const dayOfWeek = selectedDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // Đổi thành warning thay vì error để không block việc chuyển bước
          // errors.scheduledDate = "Khuyến nghị chọn ngày trong tuần (Thứ 2 - Thứ 6)";
        }
      }
      if (!formData.scheduledTime) {
        errors.scheduledTime = "Buổi thực hiện là bắt buộc";
      }
      if (!formData.location?.trim()) {
        errors.location = "Địa điểm là bắt buộc";
      }
      break;

    case 2: // Preview step - no validation needed
      break;

    default:
      break;
  }

  return errors;
};
