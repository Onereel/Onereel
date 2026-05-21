"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  FileText,
  Loader,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MY APPLICATIONS PAGE
 * Shows all applications submitted by the current user
 * With status tracking and workspace access for accepted applications
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function MyApplicationsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/profiles/my-applications");
      const data = await response.json();

      if (!response.ok) {
        setError(response.status === 401 ? "auth" : "error");
        setLoading(false);
        return;
      }

      setApplications(data.applications || []);
      setError(null);
    } catch (err) {
      console.error("[My Applications] Fetch error:", err);
      setError("network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
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
          <p className="text-[#667085]">Loading applications...</p>
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
            Please sign in to view your applications.
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
          <p className="text-[#667085] mb-6">Failed to load applications.</p>
          <button
            onClick={fetchApplications}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const STATUS_CONFIG = {
    pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
      label: "Pending",
    },
    accepted: {
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      label: "Accepted",
    },
    declined: {
      icon: XCircle,
      color: "bg-red-100 text-red-700",
      label: "Declined",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-600 p-3 rounded-xl">
              <FileText size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#111418]">
              My Applications
            </h1>
          </div>
          <p className="text-[#667085] text-lg">
            {applications.length === 0
              ? "No applications submitted yet"
              : `Track ${applications.length} ${applications.length === 1 ? "application" : "applications"}`}
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <FileText size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#111418] mb-2">
              No Applications Yet
            </h2>
            <p className="text-[#667085] mb-6">
              Browse collaboration opportunities and apply to projects that
              interest you.
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
            {applications.map((app) => {
              const statusConfig =
                STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={app.application_id}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-[#111418]">
                          {app.title}
                        </h3>
                        <span
                          className={`${statusConfig.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-[#667085]">
                        {app.collab_type === "paid" && "💰 Paid Collaboration"}
                        {app.collab_type === "partnership" && "🤝 Partnership"}
                        {app.collab_type === "equity" && "📈 Equity Split"}
                        {app.collab_type === "passion" && "❤️ Passion Project"}
                        {app.collab_type === "brand_deal" && "🎯 Brand Deal"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={app.creator_image || "/placeholder-avatar.png"}
                      alt={app.creator_name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <div className="text-sm text-[#667085]">Posted by</div>
                      <div className="font-semibold text-[#111418]">
                        {app.creator_name}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="text-xs text-[#667085] font-semibold mb-1">
                      Your Message
                    </div>
                    <p className="text-sm text-[#111418] leading-relaxed">
                      {app.message || "No message provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.status === "accepted" && app.workspace_id ? (
                      <a
                        href={`/workspace/${app.workspace_id}`}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Open Workspace
                        <ArrowRight size={18} />
                      </a>
                    ) : (
                      <a
                        href={`/collaborations/${app.collaboration_id}`}
                        className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                      >
                        View Collaboration
                      </a>
                    )}
                    <span className="text-sm text-[#667085] bg-gray-100 px-4 py-3 rounded-xl">
                      Applied{" "}
                      {new Date(app.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
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
