import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";

/**
 * Hook to manage notifications and unread count
 * Provides refresh function that can be called from anywhere
 */
export function useNotifications() {
  const { data: user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();

      if (data.success) {
        const unread = (data.notifications || []).filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // Silently fail — notification count is non-critical
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Setup event listener for notification refresh
  useEffect(() => {
    const handleRefresh = () => fetchUnreadCount();
    if (typeof window !== "undefined") {
      window.addEventListener("refreshNotifications", handleRefresh);
      return () =>
        window.removeEventListener("refreshNotifications", handleRefresh);
    }
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    refresh: fetchUnreadCount,
  };
}

/**
 * Trigger notification refresh across the app
 * Call this after any action that creates a notification
 */
export function triggerNotificationRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("refreshNotifications"));
  }
}
