import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateWithContext,
  formatDuration,
  formatRelativeTime
} from "../../../utils/timeUtils";

const MedicationReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    // Simulate API call to fetch medication reminders
    setLoading(true);

    setTimeout(() => {
      const currentTime = new Date();
      const mockReminders = [
        {
          id: 1,
          studentName: "Nguyễn Văn An",
          class: "3A",
          medication: "Paracetamol",
          dosage: "1 viên",
          schedule: new Date(currentTime.getTime() + 30 * 60000).toISOString(), // 30 minutes from now
          medicationId: 1,
          completed: false,
        },
        {
          id: 2,
          studentName: "Trần Thị Bình",
          class: "2B",
          medication: "Cetirizine",
          dosage: "5ml",
          schedule: new Date(currentTime.getTime() + 60 * 60000).toISOString(), // 1 hour from now
          medicationId: 2,
          completed: false,
        },
        {
          id: 3,
          studentName: "Lê Minh Cường",
          class: "5C",
          medication: "Ventolin",
          dosage: "2 nhát xịt",
          schedule: new Date(currentTime.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
          medicationId: 3,
          completed: true,
        },
        {
          id: 4,
          studentName: "Vũ Thị Dung",
          class: "4A",
          medication: "Vitamin C",
          dosage: "1 viên",
          schedule: new Date(currentTime.getTime() + 120 * 60000).toISOString(), // 2 hours from now
          medicationId: 5,
          completed: false,
        },
        {
          id: 5,
          studentName: "Hoàng Văn Em",
          class: "1B",
          medication: "Cough Syrup",
          dosage: "10ml",
          schedule: new Date(currentTime.getTime() + 180 * 60000).toISOString(), // 3 hours from now
          medicationId: 6,
          completed: false,
        },
      ];

      setReminders(mockReminders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMarkCompleted = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
  };

  const formatReminderTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Calculate time difference in minutes
    const diffMinutes = Math.floor((date - now) / (1000 * 60));

    if (diffMinutes < 0) {
      return `${Math.abs(diffMinutes)} phút trước`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} phút nữa`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const mins = diffMinutes % 60;
      return `${hours} giờ ${mins > 0 ? `${mins} phút` : ""} nữa`;
    }
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  // Filter reminders to show only today's
  const todayReminders = reminders.filter((reminder) =>
    isToday(reminder.schedule)
  );

  // Sort reminders by schedule time (ascending)
  const sortedReminders = [...todayReminders].sort(
    (a, b) => new Date(a.schedule) - new Date(b.schedule)
  );

  // Separate pending and completed reminders
  const pendingReminders = sortedReminders.filter(
    (reminder) => !reminder.completed
  );
  const completedReminders = sortedReminders.filter(
    (reminder) => reminder.completed
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 flex items-center">
          <FiBell className="mr-2 text-primary-500" /> Lịch cấp thuốc hôm nay
        </h2>
        <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
          <FiCalendar className="mr-1" />{" "}
          {formatDate(new Date())}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : todayReminders.length === 0 ? (
        <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
          <FiClock className="h-12 w-12 mx-auto mb-2 text-neutral-400" />
          <p>Không có lịch cấp thuốc nào hôm nay</p>
        </div>
      ) : (
        <div>
          {pendingReminders.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                Đang chờ ({pendingReminders.length})
              </h3>
              <div className="space-y-3">
                {pendingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-md p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-neutral-800 dark:text-neutral-200">
                        {reminder.studentName} - Lớp {reminder.class}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {reminder.medication} - {reminder.dosage}
                      </div>
                      <div className="text-xs text-primary-600 dark:text-primary-400 flex items-center mt-1">
                        <FiClock className="mr-1" />{" "}
                        {formatReminderTime(reminder.schedule)}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMarkCompleted(reminder.id)}
                        className="bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 p-2 rounded-full"
                        title="Đánh dấu hoàn thành"
                      >
                        <FiCheckCircle className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/nurse/medication/${reminder.medicationId}`}
                        className="bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 p-2 rounded-full"
                        title="Xem chi tiết"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedReminders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                Đã hoàn thành ({completedReminders.length})
              </h3>
              <div className="space-y-3">
                {completedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md p-3 flex justify-between items-center opacity-75"
                  >
                    <div>
                      <div className="font-medium text-neutral-800 dark:text-neutral-200 line-through">
                        {reminder.studentName} - Lớp {reminder.class}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {reminder.medication} - {reminder.dosage}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center mt-1">
                        <FiClock className="mr-1" />{" "}
                        {formatReminderTime(reminder.schedule)}
                      </div>
                    </div>
                    <div>
                      <Link
                        to={`/nurse/medication/${reminder.medicationId}`}
                        className="bg-neutral-100 dark:bg-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-500 text-neutral-600 dark:text-neutral-300 p-2 rounded-full"
                        title="Xem chi tiết"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700 text-center">
        <Link
          to="/nurse/medication"
          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 text-sm font-medium"
        >
          Xem tất cả yêu cầu thuốc
        </Link>
      </div>
    </div>
  );
};

export default MedicationReminders;
