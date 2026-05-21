"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { triggerNotificationRefresh } from "@/hooks/useNotifications";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Loader,
  Mail,
  Briefcase,
  MessageCircle,
  DollarSign,
  Star,
  Info,
  ArrowRight,
  Trash2,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * NOTIFICATIONS PAGE
 * Shows all notifications with mark as read functionality
 * ═══════════════════════════════════════════════════════════════════════
 */

const NOTIFICATION_ICONS = {
  application: Mail,
  hire: Briefcase,
  message: MessageCircle,
  payment: DollarSign,
  review: Star,
  system: Info,
};

export default function NotificationsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        );
        // 🔥 FIX: Trigger bell icon refresh
        triggerNotificationRefresh();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        // 🔥 FIX: Trigger bell icon refresh
        triggerNotificationRefresh();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#111418] mb-4">
            Sign In to View Notifications
          </h1>
          <a
            href="/account/signin"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <Loader
            size={48}
            className="animate-spin text-purple-600 mx-auto mb-4"
          />
          <p className="text-[#667085]">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Bell size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-[#111418]">
                Notifications
              </h1>
              <p className="text-[#667085] text-lg">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "You're all caught up!"}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "text-[#667085] hover:bg-gray-100"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === "unread"
                    ? "bg-purple-600 text-white"
                    : "text-[#667085] hover:bg-gray-100"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all ${
                  filter === "read"
                    ? "bg-purple-600 text-white"
                    : "text-[#667085] hover:bg-gray-100"
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl font-semibold hover:bg-green-200 transition-all"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <BellOff size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#111418] mb-2">
              {filter === "unread"
                ? "All caught up!"
                : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
            </h3>
            <p className="text-[#667085] mb-6">
              {filter === "unread"
                ? "You've read all your notifications"
                : filter === "read"
                  ? "Read notifications will appear here"
                  : "When you receive notifications, they'll appear here"}
            </p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
              >
                View All Notifications
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = NOTIFICATION_ICONS[notification.type] || Info;

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group relative bg-white rounded-xl p-5 border-2 transition-all cursor-pointer ${
                    notification.read
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-purple-200 bg-purple-50/30 hover:border-purple-300"
                  }`}
                >
                  {/* Unread Indicator */}
                  {!notification.read && (
                    <div className="absolute top-5 left-5 w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                  )}

                  <div
                    className={`flex items-start gap-4 ${!notification.read ? "ml-6" : ""}`}
                  >
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl ${
                        notification.type === "application"
                          ? "bg-blue-100"
                          : notification.type === "hire"
                            ? "bg-green-100"
                            : notification.type === "message"
                              ? "bg-purple-100"
                              : notification.type === "payment"
                                ? "bg-orange-100"
                                : notification.type === "review"
                                  ? "bg-yellow-100"
                                  : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          notification.type === "application"
                            ? "text-blue-600"
                            : notification.type === "hire"
                              ? "text-green-600"
                              : notification.type === "message"
                                ? "text-purple-600"
                                : notification.type === "payment"
                                  ? "text-orange-600"
                                  : notification.type === "review"
                                    ? "text-yellow-600"
                                    : "text-gray-600"
                        }
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3
                          className={`font-bold text-lg ${
                            notification.read
                              ? "text-[#667085]"
                              : "text-[#111418]"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {notification.link && (
                          <ArrowRight
                            size={20}
                            className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        )}
                      </div>

                      <p
                        className={`mb-2 ${
                          notification.read
                            ? "text-[#667085]"
                            : "text-[#111418]"
                        }`}
                      >
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-[#667085]">
                          {new Date(notification.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </span>

                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold"
                          >
                            <Check size={16} />
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
