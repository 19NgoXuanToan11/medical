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
  const fetchHealthCheckSchedules = async (forceRefresh = false) => {
    setFetchingData(true);
    setError(null);
    
    if (forceRefresh) {
      console.log("🔄 FORCE REFRESH - Clearing cache and reloading data...");
      // Clear any cached data
      setPendingRequests([]);
      setUpcomingRequests([]);
      setHealthCheckPrograms([]);
    }
    
    try {
      const schedules = await getHealthCheckSchedules();

      // Transform API data to match component structure
      const transformedRequests = schedules.map((schedule) => ({
        id: (() => {
          const id = schedule.formId || schedule.id;
          if (id && typeof id !== 'object' && !Array.isArray(id) && typeof id !== 'function' && typeof id !== 'boolean' && typeof id !== 'number' && id !== undefined && id !== null && id !== '' && id.toString().trim() !== '' && !isNaN(id) && id !== Infinity && id !== -Infinity && id !== 0 && id !== -0 && id !== 1 && id !== -1) {
            return String(id);
          }
          return `schedule_${Math.random().toString(36).substr(2, 9)}`;
        })(),
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
        targetGrades: (() => {
          try {
            if (schedule.grades) {
              const parsed = typeof schedule.grades === 'string' 
                ? JSON.parse(schedule.grades) 
                : schedule.grades;
              return Array.isArray(parsed) ? parsed : [];
            }
            return [];
          } catch (error) {
            console.warn('Error parsing grades:', error);
            return [];
          }
        })(),
        totalStudents: schedule.totalStudents || 0,
        location: schedule.location || "Phòng y tế trường",
        estimatedDuration: schedule.estimatedDuration || 60,
        description: schedule.description || "",
        justification:
          schedule.description || "Khám sức khỏe định kỳ theo quy định",
        checkItems: (() => {
          try {
            if (schedule.selectedStations) {
              const parsed = typeof schedule.selectedStations === 'string' 
                ? JSON.parse(schedule.selectedStations) 
                : schedule.selectedStations;
              return Array.isArray(parsed) ? parsed : [];
            }
            return [];
          } catch (error) {
            console.warn('Error parsing selectedStations:', error);
            return [];
          }
        })(),
        urgencyLevel: schedule.confirmStatus && schedule.confirmStatus === "pending" ? "high" : "normal",
        estimatedCost: (schedule.totalStudents || 0) * 20000, // Estimate 20k per student
        equipmentNeeded: [], // Will be populated from selectedStations
        followUpRequired: schedule.requireParentConfirmation !== false,
        // Manager workflow: confirmStatus is what manager controls
        confirmStatus: schedule.confirmStatus || "pending",
        status: schedule.status || "scheduled", // Overall health check status
        equipmentStatus: schedule.equipmentStatus || "ready",
        requiresManagerReview: schedule.requiresManagerReview || false,
        equipmentReport: (() => {
          try {
            if (schedule.equipmentReport) {
              return typeof schedule.equipmentReport === "string"
                ? JSON.parse(schedule.equipmentReport)
                : schedule.equipmentReport;
            }
            return null;
          } catch (error) {
            console.warn('Error parsing equipmentReport:', error);
            return null;
          }
        })(),
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
        // Only show requests that manager has approved - STRICT FILTER
        console.log("Checking request:", req.id, "confirmStatus:", req.confirmStatus, "lowercase:", confirmStatus);
        
        // EXTRA STRICT: Only approved requests should appear in "Sắp tới" tab
        const isApproved = confirmStatus === "approved";
        if (!isApproved) {
          console.log("❌ FILTERING OUT request", req.id, "because confirmStatus is", req.confirmStatus, "not 'approved'");
        } else {
          console.log("✅ ALLOWING request", req.id, "because confirmStatus is", req.confirmStatus);
        }
        
        return isApproved;
      });

      console.log("DEBUG - All requests:", transformedRequests.map(r => ({
        id: r.id, 
        title: r.title, 
        confirmStatus: r.confirmStatus,
        status: r.status
      })));
      console.log("DEBUG - Pending requests:", pending.length, pending.map(p => ({id: p.id, confirmStatus: p.confirmStatus})));
      console.log("DEBUG - Upcoming requests (should only be approved):", upcoming.length, upcoming.map(u => ({id: u.id, confirmStatus: u.confirmStatus})));

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
