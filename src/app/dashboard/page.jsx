"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  Bell,
  ArrowRight,
  AlertCircle,
  Loader,
  Sparkles,
  Film,
  TrendingUp,
  Mail,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DASHBOARD - MARKETPLACE-FIRST DESIGN
 * Prioritizes active collaborations, matches, and notifications
 * AI tools appear BELOW marketplace activity
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [activeProjects, setActiveProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    activeProjects: 0,
    pendingApplications: 0,
    acceptedMatches: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      const [projectsRes, appsRes, notifsRes] = await Promise.all([
        fetch("/api/profiles/active-projects"),
        fetch("/api/profiles/my-applications"),
        fetch("/api/notifications"),
      ]);

      const projectsData = await projectsRes.json();
      const appsData = await appsRes.json();
      const notifsData = await notifsRes.json();

      if (projectsData.success) {
        setActiveProjects(projectsData.projects || []);
      }

      if (appsData.success) {
        setApplications(appsData.applications || []);
      }

      if (notifsData.success) {
        setNotifications(notifsData.notifications || []);
      }

      // Calculate stats
      const accepted = (appsData.applications || []).filter(
        (app) => app.status === "accepted",
      ).length;
      const pending = (appsData.applications || []).filter(
        (app) => app.status === "pending",
      ).length;
      const unread = (notifsData.notifications || []).filter(
        (notif) => !notif.read,
      ).length;

      setStats({
        activeProjects: (projectsData.projects || []).length,
        pendingApplications: pending,
        acceptedMatches: accepted,
        unreadNotifications: unread,
      });
    } catch (err) {
      console.error("[Dashboard] Fetch error:", err);
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#111418] mb-4">
            Sign In to Access Dashboard
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
          <p className="text-[#667085]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const STATUS_BADGES = {
    active: { color: "bg-blue-100 text-blue-700", label: "Active" },
    in_review: { color: "bg-yellow-100 text-yellow-700", label: "In Review" },
    completed: { color: "bg-green-100 text-green-700", label: "Completed" },
    cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#111418] mb-2">
            Welcome back, {user.name?.split(" ")[0] || "Creator"}! 👋
          </h1>
          <p className="text-[#667085] text-lg">
            Here's what's happening with your collaborations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Briefcase size={32} />
              <div className="text-3xl font-extrabold">
                {stats.activeProjects}
              </div>
            </div>
            <div className="font-semibold">Active Projects</div>
            <div className="text-white/80 text-sm">In progress</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={32} />
              <div className="text-3xl font-extrabold">
                {stats.acceptedMatches}
              </div>
            </div>
            <div className="font-semibold">Accepted Matches</div>
            <div className="text-white/80 text-sm">
              Successful collaborations
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Clock size={32} />
              <div className="text-3xl font-extrabold">
                {stats.pendingApplications}
              </div>
            </div>
            <div className="font-semibold">Pending Applications</div>
            <div className="text-white/80 text-sm">Awaiting response</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Bell size={32} />
              <div className="text-3xl font-extrabold">
                {stats.unreadNotifications}
              </div>
            </div>
            <div className="font-semibold">New Notifications</div>
            <div className="text-white/80 text-sm">Unread updates</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Projects Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-3 rounded-xl">
                    <Briefcase size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#111418]">
                      Active Projects
                    </h2>
                    <p className="text-[#667085] text-sm">
                      Your ongoing collaborations
                    </p>
                  </div>
                </div>
                {activeProjects.length > 0 && (
                  <a
                    href="/active-projects"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                  >
                    View All
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>

              {activeProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#111418] mb-2">
                    No Active Projects Yet
                  </h3>
                  <p className="text-[#667085] mb-6">
                    Apply to collaborations or accept applicants to get started
                  </p>
                  <a
                    href="/opportunity-hub"
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                  >
                    Browse Opportunities
                    <ArrowRight size={18} />
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProjects.slice(0, 3).map((project) => {
                    const statusBadge =
                      STATUS_BADGES[project.status] || STATUS_BADGES.active;

                    return (
                      <div
                        key={project.workspace_id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-[#111418]">
                                {project.title}
                              </h3>
                              <span
                                className={`${statusBadge.color} px-2 py-1 rounded-full text-xs font-semibold`}
                              >
                                {statusBadge.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#667085]">
                              <Users size={14} />
                              <span>
                                {project.role === "creator"
                                  ? "Working with"
                                  : "Collaborating with"}
                              </span>
                              <span className="font-semibold text-[#111418]">
                                {project.other_party_name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <a
                          href={`/workspace/${project.workspace_id}`}
                          className="flex items-center justify-center gap-2 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all"
                        >
                          Open Workspace
                          <ArrowRight size={18} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-3 rounded-xl">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#111418]">
                      Recent Applications
                    </h2>
                    <p className="text-[#667085] text-sm">
                      Your collaboration applications
                    </p>
                  </div>
                </div>
                {applications.length > 0 && (
                  <a
                    href="/my-applications"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                  >
                    View All
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 text-[#667085]">
                  <Mail size={48} className="text-gray-300 mx-auto mb-3" />
                  <p>No applications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-[#111418] mb-1">
                          {app.collaboration_title}
                        </div>
                        <div className="text-sm text-[#667085]">
                          Applied{" "}
                          {new Date(app.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "declined"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {app.status === "accepted"
                          ? "✅ Accepted"
                          : app.status === "declined"
                            ? "❌ Declined"
                            : "⏳ Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Bell size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">
                  Notifications
                </h2>
              </div>

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-[#667085] text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl ${
                        notif.read ? "bg-gray-50" : "bg-purple-50"
                      }`}
                    >
                      <div className="font-semibold text-[#111418] text-sm mb-1">
                        {notif.title}
                      </div>
                      <div className="text-xs text-[#667085]">
                        {notif.message}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <a
                  href="/notifications"
                  className="block text-center text-purple-600 hover:text-purple-700 font-semibold text-sm mt-4"
                >
                  View All Notifications
                </a>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <a
                  href="/opportunity-hub"
                  className="block bg-white/20 hover:bg-white/30 rounded-xl p-3 font-semibold transition-all text-center"
                >
                  🔍 Browse Opportunities
                </a>
                <a
                  href="/collaborations/create"
                  className="block bg-white/20 hover:bg-white/30 rounded-xl p-3 font-semibold transition-all text-center"
                >
                  ➕ Post Collaboration
                </a>
                <a
                  href="/active-projects"
                  className="block bg-white/20 hover:bg-white/30 rounded-xl p-3 font-semibold transition-all text-center"
                >
                  💼 My Projects
                </a>
              </div>
            </div>

            {/* AI Tools - BELOW marketplace */}
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">AI Studio</h2>
              </div>
              <p className="text-[#667085] text-sm mb-4">
                Create AI-powered reels and content
              </p>
              <a
                href="/create-reel"
                className="block text-center bg-purple-100 text-purple-600 py-2.5 rounded-xl font-semibold hover:bg-purple-200 transition-all"
              >
                Create Reel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
