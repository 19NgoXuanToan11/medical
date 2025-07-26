import { useState, useEffect } from "react";
import { getHealthCheckSchedules } from "../../../../utils/api/healthCheck/healthCheckService.js";
import { getCurrentVietnamTime } from "../../../../utils/timeUtils";

export const useNurseHealthCheckData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthChecks, setHealthChecks] = useState([]);

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

  // Calculate stats
  const stats = {
    pending: getPendingHealthChecks().length,
    upcoming: getUpcomingHealthChecks().length,
    completed: getCompletedHealthChecks().length,
    rejected: getRejectedHealthChecks().length,
  };

  return {
    loading,
    error,
    healthChecks,
    stats,
    pendingHealthChecks: getPendingHealthChecks(),
    upcomingHealthChecks: getUpcomingHealthChecks(),
    completedHealthChecks: getCompletedHealthChecks(),
    rejectedHealthChecks: getRejectedHealthChecks(),
    fetchHealthCheckSchedules,
  };
};
