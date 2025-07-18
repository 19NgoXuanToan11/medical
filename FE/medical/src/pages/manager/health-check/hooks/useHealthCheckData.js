import { useState, useEffect } from "react";
import {
  getHealthCheckSchedules,
  updateHealthCheckSchedule,
} from "../../../../utils/api/healthCheck/healthCheckService.js";

export const useHealthCheckData = () => {
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [upcomingRequests, setUpcomingRequests] = useState([]);
  const [healthCheckPrograms, setHealthCheckPrograms] = useState([]);
  const [stats, setStats] = useState({
    totalHealthChecks: 0,
    completedToday: 0,
    scheduled: 0,
    pending: 0,
    completionRate: 0,
  });

  // Fetch health check schedules from API
  const fetchHealthCheckSchedules = async () => {
    setFetchingData(true);
    setError(null);
    try {
      const schedules = await getHealthCheckSchedules();

      // Transform API data to match component structure
      const transformedRequests = schedules.map((schedule) => ({
        id: schedule.formId,
        title: schedule.title || "Khám sức khỏe định kỳ",
        requestedBy: "Y tá", // Default since API doesn't have this field yet
        requestedById: `nurse_${schedule.formId}`,
        requestDate: schedule.createdDate
          ? new Date(schedule.createdDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        scheduledDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toISOString().split("T")[0]
          : "",
        scheduledTime: schedule.startTime
          ? schedule.startTime.substring(0, 5)
          : "08:00", // Convert TimeSpan to HH:mm
        targetGrades: schedule.grades || [],
        totalStudents: schedule.totalStudents || 0,
        location: schedule.location || "Phòng y tế trường",
        estimatedDuration: schedule.estimatedDuration || 60,
        description: schedule.description || "",
        justification:
          schedule.description || "Khám sức khỏe định kỳ theo quy định",
        checkItems: schedule.selectedStations
          ? JSON.parse(schedule.selectedStations)
          : [],
        urgencyLevel: schedule.confirmStatus === "pending" ? "high" : "normal",
        estimatedCost: schedule.totalStudents * 20000 || 0, // Estimate 20k per student
        equipmentNeeded: [], // Will be populated from selectedStations
        followUpRequired: schedule.requireParentConfirmation !== false,
        // Manager workflow: confirmStatus is what manager controls
        confirmStatus: schedule.confirmStatus || "pending",
        status: schedule.status || "scheduled", // Overall health check status
        equipmentStatus: schedule.equipmentStatus || "ready",
        requiresManagerReview: schedule.requiresManagerReview || false,
        equipmentReport: schedule.equipmentReport
          ? typeof schedule.equipmentReport === "string"
            ? JSON.parse(schedule.equipmentReport)
            : schedule.equipmentReport
          : null,
        // Map for table display
        name: schedule.title || "Khám sức khỏe định kỳ",
        type: "Định kỳ",
        startDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toLocaleDateString("vi-VN")
          : "",
        endDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toLocaleDateString("vi-VN")
          : "",
        targetStudents: schedule.totalStudents || 0,
        completedStudents: 0, // Will be updated based on results
        confirmedDate: schedule.confirmedDate || null,
      }));

      // Filter pending requests (those that need manager approval) - use confirmStatus
      const pending = transformedRequests.filter((req) => {
        const confirmStatus = req.confirmStatus?.toLowerCase();
        return confirmStatus === "pending";
      });

      // Filter upcoming requests (manager approved) - use confirmStatus
      const upcoming = transformedRequests.filter((req) => {
        const confirmStatus = req.confirmStatus?.toLowerCase();
        return confirmStatus === "approved";
      });

      setPendingRequests(pending);
      setUpcomingRequests(upcoming);
      setHealthCheckPrograms(transformedRequests); // For programs tab

      // Calculate stats based on manager workflow
      const newStats = {
        totalHealthChecks: transformedRequests.length,
        completedToday: transformedRequests.filter(
          (req) =>
            req.status === "completed" &&
            req.scheduledDate === new Date().toISOString().split("T")[0]
        ).length,
        scheduled: upcoming.length, // Manager approved
        pending: pending.length, // Manager pending review
        completionRate:
          transformedRequests.length > 0
            ? Math.round(
                (transformedRequests.filter(
                  (req) => req.confirmStatus?.toLowerCase() === "approved"
                ).length /
                  transformedRequests.length) *
                  100
              )
            : 0,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching health check schedules:", error);
      setError("Không thể tải dữ liệu khám sức khỏe. " + error.message);
    } finally {
      setFetchingData(false);
    }
  };

  // Update health check schedule
  const updateSchedule = async (requestId, updateData) => {
    try {
      await updateHealthCheckSchedule(requestId, updateData);
      await fetchHealthCheckSchedules(); // Refresh data
      return true;
    } catch (error) {
      console.error("Error updating health check schedule:", error);
      throw error;
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthCheckSchedules();
  }, []);

  return {
    fetchingData,
    error,
    pendingRequests,
    upcomingRequests,
    healthCheckPrograms,
    stats,
    fetchHealthCheckSchedules,
    updateSchedule,
  };
};
