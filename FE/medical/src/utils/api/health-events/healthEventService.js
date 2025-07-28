const API_BASE_URL = "https://localhost:7111/api";

// Get all health events
export const getAllHealthEvents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health events:", error);
    throw error;
  }
};

// Get health event by ID
export const getHealthEventById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health event:", error);
    throw error;
  }
};

// Create new health event
export const createHealthEvent = async (healthEventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthEventData),
    });

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;

      // First try to get the response as text (in case it's a plain string)
      const responseText = await response.text();

      if (responseText) {
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // If it's not JSON, use the response text directly
          errorMessage = responseText;
        }
      } else {
        // If no response body, use status text
        errorMessage =
          response.statusText || `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating health event:", error);
    throw error;
  }
};

// Update health event
export const updateHealthEvent = async (id, healthEventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...healthEventData,
        eventId: id,
      }),
    });

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;

      // First try to get the response as text (in case it's a plain string)
      const responseText = await response.text();

      if (responseText) {
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // If it's not JSON, use the response text directly
          errorMessage = responseText;
        }
      } else {
        // If no response body, use status text
        errorMessage =
          response.statusText || `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error("Error updating health event:", error);
    throw error;
  }
};

// Delete health event
export const deleteHealthEvent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? {} : await response.json();
  } catch (error) {
    console.error("Error deleting health event:", error);
    throw error;
  }
};

// Get health events by student code
export const getHealthEventsByStudentCode = async (studentCode) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/HealthEvent/student/${studentCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;

      // First try to get the response as text (in case it's a plain string)
      const responseText = await response.text();

      if (responseText) {
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // If it's not JSON, use the response text directly
          errorMessage = responseText;
        }
      } else {
        // If no response body, use status text
        errorMessage =
          response.statusText || `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health events by student code:", error);
    throw error;
  }
};

// Get health events by staff ID
export const getHealthEventsByStaffId = async (staffId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/HealthEvent/staff/${staffId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health events by staff ID:", error);
    throw error;
  }
};

// Get health events by date range
export const getHealthEventsByDateRange = async (startDate, endDate) => {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/HealthEvent/daterange?${params}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health events by date range:", error);
    throw error;
  }
};

// Get health events by nurse grade - only events for students in grades that the nurse manages
export const getHealthEventsByNurseGrade = async (staffId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/HealthEvent/nurse/${staffId}/grade`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching health events by nurse grade:", error);
    throw error;
  }
};

// Send notification to parent - Improved real notification system
export const sendNotificationToParent = async (notificationData) => {
  try {
    // Get current Vietnam time
    const getVietnamTime = () => {
      const now = new Date();
      const vietnamTime = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
      return vietnamTime.toISOString();
    };

    // Create a comprehensive notification object
    const notification = {
      id: `health-event-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      type: notificationData.type || "health_event",
      title: notificationData.title,
      message: notificationData.message,
      studentCode: notificationData.studentCode,
      eventDetails: notificationData.eventDetails,
      timestamp: notificationData.timestamp || getVietnamTime(),
      priority: notificationData.priority || "medium",
      isRead: false,
      status: "sent",
      createdBy: "nurse",
      targetRole: "parent",
    };

    // Store notification in localStorage for parent to see
    // In a real system, this would be sent to a notification service/database
    const existingNotifications = JSON.parse(
      localStorage.getItem("parentNotifications") || "[]"
    );

    // Add new notification to the beginning of the array
    existingNotifications.unshift(notification);

    // Keep only the last 50 notifications to prevent localStorage bloat
    if (existingNotifications.length > 50) {
      existingNotifications.splice(50);
    }

    localStorage.setItem(
      "parentNotifications",
      JSON.stringify(existingNotifications)
    );

    // Also store in a general notifications store for system-wide tracking
    const systemNotifications = JSON.parse(
      localStorage.getItem("systemNotifications") || "[]"
    );
    systemNotifications.unshift({
      ...notification,
      recipientType: "parent",
      studentCode: notificationData.studentCode,
    });

    // Keep only last 100 system notifications
    if (systemNotifications.length > 100) {
      systemNotifications.splice(100);
    }

    localStorage.setItem(
      "systemNotifications",
      JSON.stringify(systemNotifications)
    );

    // Simulate API call delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Thông báo đã được gửi đến phụ huynh thành công",
      notificationId: notification.id,
      timestamp: notification.timestamp,
    };
  } catch (error) {
    console.error("Error sending notification to parent:", error);

    // In case of error, still try to log the attempt
    const failedNotification = {
      id: `failed-${Date.now()}`,
      type: "health_event_failed",
      title: "Thông báo gửi thất bại",
      message: `Không thể gửi thông báo về sự cố y tế của học sinh ${notificationData.studentCode}`,
      studentCode: notificationData.studentCode,
      timestamp: new Date().toISOString(),
      status: "failed",
      error: error.message,
    };

    const failedNotifications = JSON.parse(
      localStorage.getItem("failedNotifications") || "[]"
    );
    failedNotifications.unshift(failedNotification);
    localStorage.setItem(
      "failedNotifications",
      JSON.stringify(failedNotifications)
    );

    throw error;
  }
};

// Create batch health events
export const createBatchHealthEvents = async (healthEventsData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/HealthEvent/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthEventsData),
    });

    if (!response.ok) {
      // Try to extract error message from response body
      let errorMessage = `HTTP error! status: ${response.status}`;

      // First try to get the response as text (in case it's a plain string)
      const responseText = await response.text();

      if (responseText) {
        try {
          // Try to parse as JSON first
          const errorData = JSON.parse(responseText);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } catch (parseError) {
          // If it's not JSON, use the response text directly
          errorMessage = responseText;
        }
      } else {
        // If no response body, use status text
        errorMessage =
          response.statusText || `HTTP error! status: ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating batch health events:", error);
    throw error;
  }
};

// Helper function to refresh health events data
export const refreshHealthEvents = async () => {
  try {
    const events = await getAllHealthEvents();
    return events.map(mapHealthEventFromAPI);
  } catch (error) {
    console.error("Error refreshing health events:", error);
    return [];
  }
};

// Helper function to map API data to frontend format
export const mapHealthEventFromAPI = (apiData) => {
  // Safe mapping with fallbacks
  const studentName = apiData.student
    ? `${apiData.student.firstName || ""} ${
        apiData.student.lastName || ""
      }`.trim()
    : "Unknown Student";

  const className = apiData.student?.className || "Unknown Class";

  const nurseName = apiData.staff
    ? `${apiData.staff.firstName || ""} ${apiData.staff.lastName || ""}`.trim()
    : "Unknown Nurse";

  const mappedEvent = {
    id: apiData.eventId,
    studentName: studentName,
    studentCode: apiData.studentCode || "Unknown Code",
    class: className,
    type: (apiData.eventType || "other").toLowerCase(),
    description: apiData.symptoms || apiData.assessment || "No description",
    time: apiData.eventDate,
    status: apiData.treatment ? "resolved" : "pending",
    actionTaken: apiData.treatment || "No action taken",
    hasMedications: (apiData.healthEventMedicines?.length || 0) > 0,
    hasMedicalSupplies: (apiData.healthEventMedicalSupplies?.length || 0) > 0,
    severity: determineSeverity(apiData),
    parentNotified: apiData.parentNotified || false,
    followUpRequired: apiData.followUpRequired || false,
    nurseName: nurseName,
    assessment: apiData.assessment,
    symptoms: apiData.symptoms,
    treatment: apiData.treatment,
    notes: apiData.notes,
    // Additional data for detailed view
    studentInfo: apiData.student,
    staffInfo: apiData.staff,
    medicines: apiData.healthEventMedicines,
    medicalSupplies: apiData.healthEventMedicalSupplies,
  };

  return mappedEvent;
};

// Helper function to determine severity based on event data
const determineSeverity = (apiData) => {
  const eventType = apiData.eventType?.toLowerCase();
  const hasMultipleMedications =
    (apiData.healthEventMedicines?.length || 0) > 1;
  const requiresFollowUp = apiData.followUpRequired;

  if (eventType === "chronic" || hasMultipleMedications || requiresFollowUp) {
    return "high";
  } else if (eventType === "injury" || eventType === "allergy") {
    return "medium";
  } else {
    return "low";
  }
};

// Helper function to map frontend data to API format
export const mapHealthEventToAPI = (frontendData) => {
  return {
    studentCode: frontendData.studentCode,
    staffId: frontendData.staffId, // Use staffId from frontendData (passed from AuthContext)
    eventType: frontendData.type || "illness",
    severity: frontendData.severity || "moderate", // Mức độ nghiêm trọng
    symptoms: frontendData.symptoms,
    assessment: frontendData.assessment,
    treatment: frontendData.treatment,
    parentNotified: frontendData.parentNotified || false,
    followUpRequired: frontendData.followUpRequired || false,
    notes: frontendData.notes,
    insufficientItems: frontendData.insufficientItems,
    insufficientItemsNote: frontendData.insufficientItemsNote,
    healthEventMedicines:
      frontendData.medications?.length > 0
        ? frontendData.medications
            .filter((med) => med.name && med.name.trim() !== "") // Only include medications with names
            .map((med) => ({
              medicineId: med.id, // Use the actual medicine ID
              medicineName: med.name, // Add medicine name for database storage
              dosage: med.dosage || "1 viên",
              time: med.time || "9:30", // Use correct field name "time"
            }))
        : [],
    healthEventMedicalSupplies:
      frontendData.medicalSupplies?.length > 0
        ? frontendData.medicalSupplies
            .filter((supply) => supply.name && supply.name.trim() !== "") // Only include supplies with names
            .map((supply) => ({
              medicalSupplyId: supply.id, // Use the actual supply ID
              medicalSupplyName: supply.name, // Add medical supply name for database storage
              quantity: supply.quantity || 1, // Use correct field name "quantity"
              time: supply.time || "9:30", // Use correct field name "time"
            }))
        : [],
  };
};

// Check if current nurse can create health event for a student
export const checkNurseGradePermission = async (studentCode) => {
  try {
    // Get student grade using the Student API endpoint
    const gradeResponse = await fetch(
      `${API_BASE_URL}/Student/grade/${studentCode}`
    );
    if (!gradeResponse.ok) {
      if (gradeResponse.status === 404) {
        return {
          success: false,
          error: "Không tìm thấy thông tin khối học của học sinh này",
          canCreate: false,
        };
      }
      throw new Error(`HTTP error! status: ${gradeResponse.status}`);
    }
    const gradeData = await gradeResponse.json();

    // Get current nurse's assigned grades
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.token;

    if (!token) {
      return {
        success: false,
        error: "Không tìm thấy token xác thực",
        canCreate: false,
      };
    }

    const assignedGradesResponse = await fetch(
      `${API_BASE_URL}/Staff/my-assigned-grades`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!assignedGradesResponse.ok) {
      throw new Error(`HTTP error! status: ${assignedGradesResponse.status}`);
    }

    const assignedGrades = await assignedGradesResponse.json();
    const studentGrade = gradeData.grade;
    const canCreate = assignedGrades.includes(studentGrade);

    return {
      success: true,
      studentGrade,
      assignedGrades,
      canCreate,
      error: canCreate
        ? null
        : `Nurse chỉ được tạo sự cố y tế cho học sinh thuộc khối mình phụ trách. Học sinh thuộc khối ${studentGrade}, nhưng bạn chỉ phụ trách khối: ${assignedGrades.join(
            ", "
          )}`,
    };
  } catch (error) {
    console.error("Error checking nurse grade permission:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra khi kiểm tra quyền tạo sự cố y tế",
      canCreate: false,
    };
  }
};

// Get critical medical incidents for a specific student
export const getCriticalIncidentsByStudent = async (studentCode) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/HealthEvent/student/${studentCode}/critical-incidents`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      message: data.message || "Lấy danh sách sự cố nghiêm trọng thành công",
    };
  } catch (error) {
    console.error("Error fetching critical incidents:", error);
    return {
      success: false,
      error: error.message,
      message: "Lỗi khi lấy danh sách sự cố nghiêm trọng",
    };
  }
};
