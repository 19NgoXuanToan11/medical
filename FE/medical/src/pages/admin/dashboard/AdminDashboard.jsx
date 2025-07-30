import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiActivity,
  FiCalendar,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiBell,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    pendingMedications: 0,
    scheduledHealthChecks: 0,
    upcomingVaccinations: 0,
    totalMedicationDispensed: 0,
    healthEventsToday: 0,
    completedHealthChecks: 0,
    allergyAlerts: 0,
    medicationAdherence: 0,
  });

  const [dateRange, setDateRange] = useState("week");
  const [loading, setLoading] = useState(true);

  // Mock data - in a real application, this would come from an API
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1248,
        activeStudents: 895,
        pendingMedications: 32,
        scheduledHealthChecks: 3,
        upcomingVaccinations: 2,
        totalMedicationDispensed: 512,
        healthEventsToday: 8,
        completedHealthChecks: 42,
        allergyAlerts: 15,
        medicationAdherence: 94,
        healthVisitsByCategory: {
          "Sốt/Cảm/Cúm": 32,
          "Đau đầu": 18,
          "Đau bụng": 15,
          "Chấn thương": 12,
          "Dị ứng": 8,
          Khác: 15,
        },
        medicationsByType: {
          "Kháng sinh": 28,
          "Giảm đau": 35,
          "Hạ sốt": 42,
          Vitamin: 22,
          "Thuốc dị ứng": 18,
          Khác: 10,
        },
      });
      setLoading(false);
    }, 1000);
  }, [dateRange]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In a real app, this would fetch new data based on the selected range
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 dark:border-primary-400"></div>
          <p className="ml-2 text-neutral-500 dark:text-neutral-400">
            Đang tải dữ liệu...
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-8 transition-colors duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
                Tổng quan hệ thống
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Phân tích tổng hợp dữ liệu y tế trường học
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
