import { useState, useEffect } from "react";
import { requestResultService } from "../../../../utils/api/medication/requestResultService";
import { getAdministrationStats } from "../utils/requestResultUtils";

export const useRequestResults = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    administered: 0,
    pending: 0,
    failed: 0,
    reRequests: 0,
    today: 0,
    thisWeek: 0,
  });

  // Load all request results
  const loadAllResults = async () => {
    setLoading(true);
    try {
      const response = await requestResultService.getAllRequestResults();
      if (response.success) {
        setResults(response.data);
        const calculatedStats = getAdministrationStats(response.data);
        setStats(calculatedStats);
      } else {
        console.error("Error loading request results:", response.message);
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading request results:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Load pending administrations
  const loadPendingAdministrations = async () => {
    setLoading(true);
    try {
      const response = await requestResultService.getPendingAdministrations();
      if (response.success) {
        setResults(response.data);
      } else {
        console.error(
          "Error loading pending administrations:",
          response.message
        );
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading pending administrations:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Load completed administrations
  const loadCompletedAdministrations = async () => {
    setLoading(true);
    try {
      const response = await requestResultService.getCompletedAdministrations();
      if (response.success) {
        setResults(response.data);
      } else {
        console.error(
          "Error loading completed administrations:",
          response.message
        );
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading completed administrations:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Load failed administrations
  const loadFailedAdministrations = async () => {
    setLoading(true);
    try {
      const response = await requestResultService.getFailedAdministrations();
      if (response.success) {
        setResults(response.data);
      } else {
        console.error(
          "Error loading failed administrations:",
          response.message
        );
        setResults([]);
      }
    } catch (error) {
      console.error("Error loading failed administrations:", error);
      setResults([]);
    }
    setLoading(false);
  };

  // Mark medication as administered
  const markAsAdministered = async (resultId, administrationData = {}) => {
    try {
      const response = await requestResultService.markAsAdministered(
        resultId,
        administrationData
      );
      if (response.success) {
        // Reload data and stats
        await loadAllResults();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error marking as administered:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra khi ghi nhận cấp thuốc",
      };
    }
  };

  // Mark administration as failed
  const markAsFailed = async (resultId, failureData = {}) => {
    try {
      const response = await requestResultService.markAsFailed(
        resultId,
        failureData
      );
      if (response.success) {
        // Reload data and stats
        await loadAllResults();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error marking as failed:", error);
      return { success: false, message: "Có lỗi xảy ra khi ghi nhận thất bại" };
    }
  };

  // Create re-request
  const createReRequest = async (originalResultId, reRequestData = {}) => {
    try {
      const response = await requestResultService.createReRequest(
        originalResultId,
        reRequestData
      );
      if (response.success) {
        // Reload data and stats
        await loadAllResults();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error creating re-request:", error);
      return { success: false, message: "Có lỗi xảy ra khi tạo yêu cầu lại" };
    }
  };

  // Update request result
  const updateRequestResult = async (resultId, updateData) => {
    try {
      const response = await requestResultService.updateRequestResult(
        resultId,
        updateData
      );
      if (response.success) {
        // Reload data and stats
        await loadAllResults();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error updating request result:", error);
      return { success: false, message: "Có lỗi xảy ra khi cập nhật kết quả" };
    }
  };

  // Get request result by ID
  const getRequestResultById = async (resultId) => {
    try {
      const response = await requestResultService.getRequestResultById(
        resultId
      );
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error getting request result by ID:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra khi lấy thông tin kết quả",
      };
    }
  };

  // Get request results by student
  const getRequestResultsByStudent = async (studentCode) => {
    try {
      const response = await requestResultService.getRequestResultsByStudent(
        studentCode
      );
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Error getting request results by student:", error);
      return {
        success: false,
        message: "Có lỗi xảy ra khi lấy danh sách kết quả của học sinh",
      };
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await loadAllResults();
  };

  // Load initial data
  useEffect(() => {
    loadAllResults();
  }, []);

  return {
    // State
    loading,
    setLoading,
    results,
    setResults,
    stats,
    setStats,

    // Methods
    loadAllResults,
    loadPendingAdministrations,
    loadCompletedAdministrations,
    loadFailedAdministrations,
    markAsAdministered,
    markAsFailed,
    createReRequest,
    updateRequestResult,
    getRequestResultById,
    getRequestResultsByStudent,
    refreshData,
  };
};
