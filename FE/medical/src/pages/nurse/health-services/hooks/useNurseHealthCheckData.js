import { useState, useEffect } from "react";
import { getMyHealthCheckSchedules } from "../../../../utils/api/healthCheck/healthCheckService.js";

export const useNurseHealthCheckData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthChecks, setHealthChecks] = useState([]);

  // Fetch health check schedules from API (filtered by nurse's assigned grades)
  const fetchHealthCheckSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Fetching nurse's health check schedules...");
      const schedules = await getMyHealthCheckSchedules(); // Use new endpoint with permission filtering
      console.log("✅ API Response:", schedules);

      // Check if schedules is an array
      if (!Array.isArray(schedules)) {
        console.error("❌ API response is not an array:", schedules);
        setError("Dữ liệu không đúng định dạng từ server");
        setHealthChecks([]);
        return;
      }

      console.log(`📊 Found ${schedules.length} health check schedules for this nurse`);

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
          createdBy: schedule.createdBy || schedule.CreatedBy, // Track who created this schedule
          confirmedDate: schedule.confirmedDate || schedule.ConfirmedDate,
          confirmedBy: schedule.confirmedBy || schedule.ConfirmedBy,
          
          // Consent fields
          consentStatus: schedule.consentStatus || schedule.ConsentStatus || "pending",
          consentDate: schedule.consentDate || schedule.ConsentDate,
          
          // Settings
          notifyParents: schedule.notifyParents !== false,
          autoAdvance: schedule.autoAdvance !== false,
          saveResults: schedule.saveResults !== false,
          generateReport: schedule.generateReport !== false,
          requireParentConfirmation: schedule.requireParentConfirmation !== false,
        };
      });

      setHealthChecks(transformedHealthChecks);
      console.log("✅ Transformed health checks:", transformedHealthChecks);
    } catch (error) {
      console.error("❌ Error fetching nurse's health check schedules:", error);
      if (error.response?.status === 403) {
        setError("Bạn không có quyền truy cập. Chỉ y tá mới có thể xem lịch khám của mình.");
      } else if (error.response?.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        setError("Không thể tải dữ liệu lịch khám. Vui lòng thử lại sau.");
      }
      setHealthChecks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchHealthCheckSchedules();
  }, []);

  // Filter functions based on nurse workflow - FIXED LOGIC
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
      
      // Chỉ dựa vào confirmStatus (trạng thái phê duyệt từ manager)
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      
      const isPending = confirmStatus === "chờ duyệt" || confirmStatus === "pending" || 
                       !confirmStatus || confirmStatus === "" || confirmStatus === "chưa xác định";
      console.log(`⚡ Is pending: ${isPending} (confirmStatus: ${confirmStatus})`);
      
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
      
      // Chỉ lịch đã được manager duyệt và chưa hoàn thành
      const isUpcoming = (confirmStatus === "đã duyệt" || confirmStatus === "approved") &&
                        (status !== "đã hoàn thành" && status !== "completed" && 
                         status !== "đã hủy" && status !== "cancelled");
      console.log(`⚡ Is upcoming: ${isUpcoming} (confirmStatus: ${confirmStatus}, status: ${status})`);
      
      return isUpcoming;
    });
    
    console.log("✅ Found upcoming health checks:", upcoming);
    return upcoming;
  };

  const getCompletedHealthChecks = () => {
    console.log("🔍 Filtering completed health checks from:", healthChecks);
    const completed = healthChecks.filter(hc => {
      const status = hc.status?.toLowerCase();
      
      // Chỉ dựa vào status chính
      const isCompleted = status === "đã hoàn thành" || status === "completed";
      console.log(`⚡ Is completed: ${isCompleted} (status: ${status})`);
      
      return isCompleted;
    });
    console.log("✅ Found completed health checks:", completed);
    return completed;
  };

  const getRejectedHealthChecks = () => {
    console.log("🔍 Filtering rejected health checks from:", healthChecks);
    const rejected = healthChecks.filter(hc => {
      const confirmStatus = hc.confirmStatus?.toLowerCase();
      
      // Chỉ dựa vào confirmStatus (trạng thái phê duyệt từ manager)
      const isRejected = confirmStatus === "đã từ chối" || confirmStatus === "rejected";
      console.log(`⚡ Is rejected: ${isRejected} (confirmStatus: ${confirmStatus})`);
      
      return isRejected;
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