/**
 * Utility functions for formatting time and date
 */

// Locale options for Vietnamese format
const VI_LOCALE_OPTIONS = {
  timeZone: "Asia/Ho_Chi_Minh",
  locale: "vi-VN",
};

/**
 * Create current datetime formatted for display
 * @returns {string} Current time in dd/MM/yyyy HH:mm format
 */
export const getCurrentFormattedDateTime = () => {
  const now = new Date();
  return formatDateTime(now);
};

/**
 * Format date to Vietnamese format (dd/MM/yyyy)
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "Chưa xác định";

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ";
    }

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Lỗi định dạng ngày";
  }
};

/**
 * Format time to Vietnamese format (HH:mm)
 * @param {string|Date} timeInput - Time string or Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (timeInput) => {
  if (!timeInput) return "Chưa xác định";

  try {
    const date = new Date(timeInput);
    if (isNaN(date.getTime())) {
      return "Giờ không hợp lệ";
    }

    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Lỗi định dạng giờ";
  }
};

/**
 * Format datetime to Vietnamese format (dd/MM/yyyy HH:mm)
 * @param {string|Date} dateTimeInput - DateTime string or Date object
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateTimeInput) => {
  if (!dateTimeInput) return "Chưa xác định";

  try {
    const date = new Date(dateTimeInput);
    if (isNaN(date.getTime())) {
      return "Thời gian không hợp lệ";
    }

    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "Lỗi định dạng thời gian";
  }
};

/**
 * Format datetime with seconds to Vietnamese format (dd/MM/yyyy HH:mm:ss)
 * @param {string|Date} dateTimeInput - DateTime string or Date object
 * @returns {string} Formatted datetime string with seconds
 */
export const formatDateTimeWithSeconds = (dateTimeInput) => {
  if (!dateTimeInput) return "Chưa xác định";

  try {
    const date = new Date(dateTimeInput);
    if (isNaN(date.getTime())) {
      return "Thời gian không hợp lệ";
    }

    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  } catch (error) {
    console.error("Error formatting datetime with seconds:", error);
    return "Lỗi định dạng thời gian";
  }
};

/**
 * Format time range (start - end)
 * @param {string|Date} startTime - Start time
 * @param {string|Date} endTime - End time
 * @returns {string} Formatted time range
 */
export const formatTimeRange = (startTime, endTime) => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);

  if (start === "Chưa xác định" && end === "Chưa xác định") {
    return "Chưa xác định";
  }

  if (start === "Chưa xác định") {
    return `Đến ${end}`;
  }

  if (end === "Chưa xác định") {
    return `Từ ${start}`;
  }

  return `${start} - ${end}`;
};

/**
 * Format relative time (e.g., "2 giờ trước", "5 phút trước")
 * @param {string|Date} dateTimeInput - DateTime string or Date object
 * @returns {string} Formatted relative time
 */
export const formatRelativeTime = (dateTimeInput) => {
  if (!dateTimeInput) return "Chưa xác định";

  try {
    const date = new Date(dateTimeInput);
    const now = new Date();

    if (isNaN(date.getTime())) {
      return "Thời gian không hợp lệ";
    }

    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "Vừa xong";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return formatDateTime(dateTimeInput);
    }
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Lỗi định dạng thời gian";
  }
};

/**
 * Get current Vietnam time as ISO string
 * @returns {string} Current timestamp in Vietnam timezone
 */
export const getCurrentVietnamTime = () => {
  const now = new Date();
  // Create a properly formatted timestamp for Vietnam timezone
  const vietnamTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  return vietnamTime.toISOString();
};

/**
 * Get current Vietnam time as Date object
 * @returns {Date} Current date in Vietnam timezone
 */
export const getCurrentVietnamDate = () => {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
};

/**
 * Check if a date is today
 * @param {string|Date} dateInput - Date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateInput) => {
  if (!dateInput) return false;

  try {
    const date = new Date(dateInput);
    const today = new Date();

    return date.toDateString() === today.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Check if a date is tomorrow
 * @param {string|Date} dateInput - Date to check
 * @returns {boolean} True if the date is tomorrow
 */
export const isTomorrow = (dateInput) => {
  if (!dateInput) return false;

  try {
    const date = new Date(dateInput);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return date.toDateString() === tomorrow.toDateString();
  } catch (error) {
    return false;
  }
};

/**
 * Format date with relative context (Today, Tomorrow, or specific date)
 * @param {string|Date} dateInput - Date to format
 * @returns {string} Formatted date with context
 */
export const formatDateWithContext = (dateInput) => {
  if (!dateInput) return "Chưa xác định";

  if (isToday(dateInput)) {
    return "Hôm nay";
  } else if (isTomorrow(dateInput)) {
    return "Ngày mai";
  } else {
    return formatDate(dateInput);
  }
};

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return "Chưa xác định";

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
 * Parse time string and create Date object for today with that time
 * @param {string} timeString - Time string in HH:mm format
 * @returns {Date|null} Date object or null if invalid
 */
export const parseTimeToday = (timeString) => {
  if (!timeString) return null;

  try {
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  } catch (error) {
    console.error("Error parsing time:", error);
    return null;
  }
};

/**
 * Test function to verify time display accuracy
 * This function simulates what happens when user clicks "Gửi kế hoạch" at 20:35
 * @returns {object} Test results
 */
export const testTimeDisplay = () => {
  const timestamp = getCurrentVietnamTime();
  const formatted = formatDateTime(timestamp);
  const relative = formatRelativeTime(timestamp);

  console.log("=== Time Display Test ===");
  console.log("Current timestamp:", timestamp);
  console.log("Formatted display:", formatted);
  console.log("Relative display:", relative);
  console.log(
    "Expected format should show: dd/MM/yyyy 20:35 if clicked at 20:35"
  );

  return {
    timestamp,
    formatted,
    relative,
    isValidFormat: formatted.includes(":") && formatted.length > 10,
  };
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateTimeWithSeconds,
  formatTimeRange,
  formatRelativeTime,
  getCurrentVietnamTime,
  isToday,
  isTomorrow,
  formatDateWithContext,
  formatDuration,
  parseTimeToday,
};
