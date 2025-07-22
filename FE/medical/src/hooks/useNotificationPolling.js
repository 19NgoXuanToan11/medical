import { useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "../utils/api/notification/notificationService";

const useNotificationPolling = (parentId, pollingInterval = 10000) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isActiveRef = useRef(true);

  // Function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!parentId || !isActiveRef.current) return;

    try {
      setError(null);
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotificationsByParentId(parentId),
        notificationService.getUnreadCountByParentId(parentId),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
    }
  }, [parentId]);

  // Function to fetch only unread notifications (for polling)
  const fetchUnreadNotifications = useCallback(async () => {
    if (!parentId || !isActiveRef.current) return;

    try {
      setError(null);
      const [unreadNotifications, unreadCountData] = await Promise.all([
        notificationService.getUnreadNotificationsByParentId(parentId),
        notificationService.getUnreadCountByParentId(parentId),
      ]);

      // Update unread count
      setUnreadCount(unreadCountData);

      // If there are new unread notifications, refresh all notifications
      if (unreadNotifications.length > 0) {
        const allNotifications =
          await notificationService.getNotificationsByParentId(parentId);
        setNotifications(allNotifications);
      }
    } catch (err) {
      console.error("Error fetching unread notifications:", err);
      setError(err.message);
    }
  }, [parentId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true, status: "read" }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError(err.message);
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead(parentId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
          status: "read",
        }))
      );

      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      setError(err.message);
      return false;
    }
  }, [parentId]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      try {
        await notificationService.deleteNotification(notificationId);

        // Update local state
        const deletedNotification = notifications.find(
          (n) => n.notificationId === notificationId
        );
        setNotifications((prev) =>
          prev.filter(
            (notification) => notification.notificationId !== notificationId
          )
        );

        // Update unread count if deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        return true;
      } catch (err) {
        console.error("Error deleting notification:", err);
        setError(err.message);
        return false;
      }
    },
    [notifications]
  );

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current || !parentId) return;

    // Initial fetch
    setLoading(true);
    fetchNotifications().finally(() => setLoading(false));

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchUnreadNotifications();
    }, pollingInterval);
  }, [parentId, pollingInterval, fetchNotifications, fetchUnreadNotifications]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Refresh notifications manually
  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    await fetchNotifications();
    setLoading(false);
  }, [fetchNotifications]);

  // Effect to handle component mount/unmount and parentId changes
  useEffect(() => {
    isActiveRef.current = true;

    if (parentId) {
      startPolling();
    }

    return () => {
      isActiveRef.current = false;
      stopPolling();
    };
  }, [parentId, startPolling, stopPolling]);

  // Effect to handle visibility change (pause polling when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (parentId) {
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [parentId, startPolling, stopPolling]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    startPolling,
    stopPolling,
  };
};

export default useNotificationPolling;
