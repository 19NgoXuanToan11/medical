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
      throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error(`HTTP error! status: ${response.status}`);
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

// Send notification to parent
export const sendNotificationToParent = async (notificationData) => {
  try {
    // Mock notification API - replace with real endpoint
    console.log("Sending notification to parent:", notificationData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In real implementation, this would be:
    // const response = await fetch(`${API_BASE_URL}/Notification/parent`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(notificationData),
    // });

    return { success: true, message: "Notification sent successfully" };
  } catch (error) {
    console.error("Error sending notification to parent:", error);
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
  return {
    id: apiData.eventId,
    studentName: apiData.student
      ? `${apiData.student.firstName} ${apiData.student.lastName}`
      : "Unknown",
    studentCode: apiData.studentCode,
    class: apiData.student?.className || "Unknown",
    type: apiData.eventType?.toLowerCase() || "other",
    description: apiData.symptoms || apiData.assessment || "No description",
    time: apiData.eventDate,
    status: apiData.treatment ? "resolved" : "pending",
    actionTaken: apiData.treatment || "No action taken",
    hasMedications: (apiData.healthEventMedicines?.length || 0) > 0,
    hasMedicalSupplies: (apiData.healthEventMedicalSupplies?.length || 0) > 0,
    severity: determineSeverity(apiData),
    parentNotified: apiData.parentNotified || false,
    followUpRequired: apiData.followUpRequired || false,
    nurseName: apiData.staff
      ? `${apiData.staff.firstName} ${apiData.staff.lastName}`
      : "Unknown",
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
    symptoms: frontendData.symptoms,
    assessment: frontendData.assessment,
    treatment: frontendData.treatment,
    parentNotified: frontendData.parentNotified || false,
    followUpRequired: frontendData.followUpRequired || false,
    notes: frontendData.notes,
    healthEventMedicines:
      frontendData.medications?.length > 0
        ? frontendData.medications
            .filter((med) => med.name && med.name.trim() !== "") // Only include medications with names
            .map((med) => ({
              medicineId: med.id, // Use the actual medicine ID
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
              quantity: supply.quantity || 1, // Use correct field name "quantity"
              time: supply.time || "9:30", // Use correct field name "time"
            }))
        : [],
  };
};
