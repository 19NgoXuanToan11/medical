import { useState, useEffect } from "react";
import { getHealthCheckSchedules } from "../../../../utils/api/healthCheck/healthCheckService.js";
import { getCurrentVietnamTime } from "../../../../utils/timeUtils";
import { staffService } from "../../../../utils/staff/staffService";

export const useNurseHealthCheckData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthChecks, setHealthChecks] = useState([]);
  const [nurseAssignment, setNurseAssignment] = useState(null);

  // Fetch nurse assignment information
  const fetchNurseAssignment = async () => {
    try {
      const response = await staffService.getMyAssignedGrades();
      if (response.success && response.data) {
        setNurseAssignment({
          assignedGrades: response.data,
          gradeNames: response.data.map(grade => `Khối ${grade}`).join(", ")
        });
      }
    } catch (error) {
      console.error("Error fetching nurse assignment:", error);
      // Don't set error for assignment, as it's not critical
    }
  };

  // Fetch health check schedules from API
  const fetchHealthCheckSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const schedules = await getHealthCheckSchedules();

      // Transform API data to match nurse component structure
      const transformedHealthChecks = schedules.map((schedule) => ({
        formId: schedule.formId,
        title: schedule.title || "Khám sức khỏe định kỳ",
        scheduledDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate).toISOString().split("T")[0]
          : "",
        startTime: schedule.startTime
          ? schedule.startTime.substring(0, 5)
          : "08:00", // Convert TimeSpan to HH:mm
        location: schedule.location || "Phòng y tế trường",
        totalStudents: schedule.totalStudents || 0,
        estimatedDuration: schedule.estimatedDuration || 60,
        description: schedule.description || "",

        // Parse JSON fields safely
        targetGrades:
          schedule.grades ||
          (schedule.gradeIds
            ? (() => {
                try {
                  return JSON.parse(schedule.gradeIds);
                } catch {
                  return [];
                }
              })()
            : []),

        checkItems: schedule.selectedStations
          ? (() => {
              try {
                return JSON.parse(schedule.selectedStations);
              } catch {
                return [];
              }
            })()
          : [],

        // Status fields - key difference from manager
        confirmStatus: schedule.confirmStatus || "pending", // Manager approval status
        status: schedule.status || "scheduled", // Overall health check status

        // Additional fields
        createdDate: schedule.createdDate || getCurrentVietnamTime(),
        confirmedDate: schedule.confirmedDate,
        confirmedBy: schedule.confirmedBy,
        consentStatus: schedule.consentStatus || "pending",
        rejectionReason: schedule.rejectionReason,

        // Settings
        notifyParents: schedule.notifyParents !== false,
        autoAdvance: schedule.autoAdvance !== false,
        saveResults: schedule.saveResults !== false,
        generateReport: schedule.generateReport !== false,
        requireParentConfirmation: schedule.requireParentConfirmation !== false,
      }));

      setHealthChecks(transformedHealthChecks);
    } catch (error) {
      console.error("Error fetching health check schedules:", error);
      setError("Không thể tải dữ liệu khám sức khỏe. " + error.message);
      setHealthChecks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthCheckSchedules();
    fetchNurseAssignment();
  }, []);

  // Filter functions based on nurse workflow
  const getPendingHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      return confirmStatus === "pending";
    });
  };

  const getUpcomingHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      return (
        confirmStatus === "approved" || hc.status?.toLowerCase() === "active"
      );
    });
  };

  const getCompletedHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const status = hc.status?.toLowerCase();
      return status === "completed";
    });
  };

  const getRejectedHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      return confirmStatus === "rejected";
    });
  };

  // Get ready health checks (approved but not yet active)
  const getReadyHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      const status = hc.status?.toLowerCase();
      return confirmStatus === "approved" && status === "scheduled";
    });
  };

  // Get active health checks (currently in progress)
  const getActiveHealthChecks = () => {
    return healthChecks.filter((hc) => {
      const status = hc.status?.toLowerCase();
      return status === "active";
    });
  };

  // Calculate total students across all health checks
  const getTotalStudents = () => {
    return healthChecks.reduce((total, hc) => total + (hc.totalStudents || 0), 0);
  };

  // Calculate stats
  const stats = {
    pending: getPendingHealthChecks().length,
    upcoming: getUpcomingHealthChecks().length,
    completed: getCompletedHealthChecks().length,
    rejected: getRejectedHealthChecks().length,
    ready: getReadyHealthChecks().length,
    active: getActiveHealthChecks().length,
    totalStudents: getTotalStudents(),
  };

  return {
    loading,
    error,
    healthChecks,
    stats,
    nurseAssignment,
    pendingHealthChecks: getPendingHealthChecks(),
    upcomingHealthChecks: getUpcomingHealthChecks(),
    completedHealthChecks: getCompletedHealthChecks(),
    rejectedHealthChecks: getRejectedHealthChecks(),
    readyHealthChecks: getReadyHealthChecks(),
    activeHealthChecks: getActiveHealthChecks(),
    fetchHealthCheckSchedules,
  };
};
