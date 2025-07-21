import { useState, useEffect } from "react";
import { getHealthCheckSchedules } from "../../../../utils/api/healthCheck/healthCheckService.js";

export const useNurseHealthCheckData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthChecks, setHealthChecks] = useState([]);

  // Fetch health check schedules from API
  const fetchHealthCheckSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching health check schedules...");
      const schedules = await getHealthCheckSchedules();
      console.log("✅ API Response:", schedules);

      // Check if schedules is an array
      if (!Array.isArray(schedules)) {
        console.error("❌ API response is not an array:", schedules);
        setError("Dữ liệu không đúng định dạng từ server");
        setHealthChecks([]);
        return;
      }

      console.log(`📊 Found ${schedules.length} health check schedules`);

      // Transform API data to match nurse component structure
      const transformedHealthChecks = schedules.map((schedule) => {
        console.log("🔄 Transforming schedule:", schedule);
        return {
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
          targetGrades: schedule.grades || 
            (schedule.gradeIds ? (() => {
              try {
                return JSON.parse(schedule.gradeIds);
              } catch {
                return [];
              }
            })() : []),
          
          checkItems: schedule.selectedStations ? (() => {
            try {
              return JSON.parse(schedule.selectedStations);
            } catch {
              return [];
            }
          })() : [],

          // Status fields - key difference from manager
          confirmStatus: schedule.confirmStatus || schedule.ConfirmStatus || "pending", // Manager approval status
          status: schedule.status || schedule.Status || "scheduled", // Overall health check status
          
          // Additional fields
          createdDate: schedule.createdDate || schedule.CreatedDate || new Date().toISOString(),
          confirmedDate: schedule.confirmedDate || schedule.ConfirmedDate,
          confirmedBy: schedule.confirmedBy || schedule.ConfirmedBy,
          consentStatus: schedule.consentStatus || schedule.ConsentStatus || "pending",
          rejectionReason: schedule.rejectionReason || schedule.RejectionReason,
          
          // Settings
          notifyParents: schedule.notifyParents !== false,
          autoAdvance: schedule.autoAdvance !== false,
          saveResults: schedule.saveResults !== false,
          generateReport: schedule.generateReport !== false,
          requireParentConfirmation: schedule.requireParentConfirmation !== false,
        };
      });

      console.log("✅ Transformed health checks:", transformedHealthChecks);
      setHealthChecks(transformedHealthChecks);
    } catch (error) {
      console.error("❌ Error fetching health check schedules:", error);
      
      // More detailed error handling
      let errorMessage = "Không thể tải dữ liệu khám sức khỏe.";
      
      if (error.message.includes("Network Error") || error.message.includes("ERR_NETWORK")) {
        errorMessage += " Lỗi kết nối mạng - vui lòng kiểm tra kết nối internet và backend server.";
      } else if (error.message.includes("404")) {
        errorMessage += " API endpoint không tồn tại - vui lòng kiểm tra backend server.";
      } else if (error.message.includes("500")) {
        errorMessage += " Lỗi server nội bộ - vui lòng kiểm tra backend logs.";
      } else if (error.message.includes("CORS")) {
        errorMessage += " Lỗi CORS - vui lòng kiểm tra cấu hình backend.";
      } else {
        errorMessage += ` Chi tiết: ${error.message}`;
      }
      
      setError(errorMessage);
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
    console.log("🔍 Filtering pending health checks from:", healthChecks);
    const pending = healthChecks.filter(hc => {
      console.log("📋 Checking health check:", {
        formId: hc.formId,
        title: hc.title,
        status: hc.status,
        confirmStatus: hc.confirmStatus,
        consentStatus: hc.consentStatus
      });
      
      // Check both confirmStatus and status fields for pending
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      const status = hc.status?.toLowerCase();
      const consentStatus = hc.consentStatus?.toLowerCase();
      
      const isPending = confirmStatus === "pending" || status === "pending" || consentStatus === "pending";
      console.log(`⚡ Is pending: ${isPending} (confirmStatus: ${confirmStatus}, status: ${status}, consentStatus: ${consentStatus})`);
      
      return isPending;
    });
    
    console.log("✅ Found pending health checks:", pending);
    return pending;
  };

  const getUpcomingHealthChecks = () => {
    console.log("🔍 Filtering upcoming health checks from:", healthChecks);
    const upcoming = healthChecks.filter(hc => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      const status = hc.status?.toLowerCase();
      const consentStatus = hc.consentStatus?.toLowerCase();
      
      const isUpcoming = confirmStatus === "approved" || status === "approved" || status === "active" || consentStatus === "approved";
      console.log(`⚡ Is upcoming: ${isUpcoming} (confirmStatus: ${confirmStatus}, status: ${status}, consentStatus: ${consentStatus})`);
      
      return isUpcoming;
    });
    
    console.log("✅ Found upcoming health checks:", upcoming);
    return upcoming;
  };

  const getCompletedHealthChecks = () => {
    const completed = healthChecks.filter(hc => {
      const status = hc.status?.toLowerCase();
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      const consentStatus = hc.consentStatus?.toLowerCase();
      
      return status === "completed" || confirmStatus === "completed" || consentStatus === "completed";
    });
    console.log("✅ Found completed health checks:", completed);
    return completed;
  };

  const getRejectedHealthChecks = () => {
    const rejected = healthChecks.filter(hc => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      const status = hc.status?.toLowerCase();
      const consentStatus = hc.consentStatus?.toLowerCase();
      
      return confirmStatus === "rejected" || status === "rejected" || consentStatus === "rejected";
    });
    console.log("✅ Found rejected health checks:", rejected);
    return rejected;
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