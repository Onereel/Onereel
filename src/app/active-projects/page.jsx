"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Briefcase,
  Loader,
  AlertCircle,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ACTIVE PROJECTS PAGE
 * Shows all workspaces where user is creator or editor
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function ActiveProjectsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/profiles/active-projects");
      const data = await response.json();

      if (!response.ok) {
        setError(response.status === 401 ? "auth" : "error");
        setLoading(false);
        return;
      }

      setProjects(data.projects || []);
      setError(null);
    } catch (err) {
      console.error("[Active Projects] Fetch error:", err);
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <Loader
            size={48}
            className="animate-spin text-purple-600 mx-auto mb-4"
          />
          <p className="text-[#667085]">Loading active projects...</p>
        </div>
      </div>
    );
  }

  if (error === "auth") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-orange-200 max-w-md text-center">
          <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#111418] mb-2">
            Sign In Required
          </h1>
          <p className="text-[#667085] mb-6">
            Please sign in to view your active projects.
          </p>
          <a
            href="/account/signin"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#111418] mb-2">
            Something Went Wrong
          </h1>
          <p className="text-[#667085] mb-6">Failed to load active projects.</p>
          <button
            onClick={fetchProjects}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Retry
          </button>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-600 p-3 rounded-xl">
              <Briefcase size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#111418]">
              Active Projects
            </h1>
          </div>
          <p className="text-[#667085] text-lg">
            {projects.length === 0
              ? "No active projects yet"
              : `Manage ${projects.length} ${projects.length === 1 ? "collaboration" : "collaborations"}`}
          </p>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#111418] mb-2">
              No Active Projects
            </h2>
            <p className="text-[#667085] mb-6">
              When you accept an applicant or get accepted for a collaboration,
              it will appear here.
            </p>
            <a
              href="/opportunity-hub"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
            >
              Browse Opportunities
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => {
              const statusBadge =
                STATUS_BADGES[project.status] || STATUS_BADGES.active;

              return (
                <div
                  key={project.workspace_id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-[#111418]">
                          {project.title}
                        </h3>
                        <span
                          className={`${statusBadge.color} px-3 py-1 rounded-full text-xs font-semibold`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-[#667085]">
                        {project.collab_type === "paid" &&
                          "💰 Paid Collaboration"}
                        {project.collab_type === "partnership" &&
                          "🤝 Partnership"}
                        {project.collab_type === "equity" && "📈 Equity Split"}
                        {project.collab_type === "passion" &&
                          "❤️ Passion Project"}
                        {project.collab_type === "brand_deal" &&
                          "🎯 Brand Deal"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Users size={18} className="text-purple-600" />
                      <span className="text-sm text-[#667085]">
                        {project.role === "creator"
                          ? "Working with"
                          : "Collaborating with"}
                        :
                      </span>
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            project.other_party_image ||
                            "/placeholder-avatar.png"
                          }
                          alt={project.other_party_name}
                          className="w-6 h-6 rounded-full border border-gray-200"
                        />
                        <span className="font-semibold text-[#111418]">
                          {project.other_party_name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#667085]">
                      <Clock size={16} />
                      Updated{" "}
                      {new Date(project.updated_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/workspace/${project.workspace_id}`}
                      className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      Open Workspace
                      <ArrowRight size={18} />
                    </a>
                    <span className="text-sm text-[#667085] bg-gray-100 px-4 py-3 rounded-xl font-semibold">
                      {project.role === "creator"
                        ? "You're the Creator"
                        : "You're the Editor"}
                    </span>
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
