import { useState, useEffect } from "react";
import { medicationService } from "../../../../utils/api/medication/medicationService";

export const useMedicationRequests = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    assigned: 0,
    completed: 0,
    rejected: 0,
    failed: 0,
    today: 0,
    total: 0,
  });

  // Load all stats
  const loadAllStats = async () => {
    try {
      const responses = await Promise.all([
        medicationService.getPendingMedicationRequests(),
        medicationService.getAssignedMedicationRequests(),
        medicationService.getCompletedMedicationRequests(),
        medicationService.getRejectedMedicationRequests(),
        medicationService.getFailedMedicationRequests(),
        medicationService.getAllMedicationRequests(),
      ]);

      const [pending, assigned, completed, rejected, failed, all] = responses;

      // Get today's requests
      const today = new Date().toISOString().split("T")[0];
      const todayRequests = all.success
        ? all.data.filter((req) => {
            if (!req.requestDate) return false;
            const reqDate = new Date(req.requestDate)
              .toISOString()
              .split("T")[0];
            return reqDate === today;
          })
        : [];

      setStats({
        pending: pending.success ? pending.data.length : 0,
        assigned: assigned.success ? assigned.data.length : 0,
        completed: completed.success ? completed.data.length : 0,
        rejected: rejected.success ? rejected.data.length : 0,
        failed: failed.success ? failed.data.length : 0,
        today: todayRequests.length,
        total: all.success ? all.data.length : 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadAllStats();
  }, []);

  return {
    loading,
    setLoading,
    stats,
    setStats,
    loadAllStats,
  };
};
