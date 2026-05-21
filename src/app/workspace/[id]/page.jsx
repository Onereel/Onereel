"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Users,
  Briefcase,
  Clock,
  Activity,
  FileText,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Loader,
  Send,
  ExternalLink,
  ArrowLeft,
  Upload,
  MessageCircle,
  Package,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE PAGE
 * Private collaboration room for creator and accepted editor
 * Manages notes, links, deliverables, messages, status, and activity
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function WorkspacePage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const [workspace, setWorkspace] = useState(null);
  const [notes, setNotes] = useState([]);
  const [links, setLinks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  // Form states
  const [newNote, setNewNote] = useState("");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newDeliverableTitle, setNewDeliverableTitle] = useState("");
  const [newDeliverableDescription, setNewDeliverableDescription] =
    useState("");
  const [newDeliverableUrl, setNewDeliverableUrl] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError("unauthorized");
        } else if (response.status === 404) {
          setError("notFound");
        } else {
          setError("serverError");
        }
        setLoading(false);
        return;
      }

      setWorkspace(data.workspace);
      setIsCreator(data.isCreator);
      setError(null);
    } catch (err) {
      console.error("[Workspace] Fetch error:", err);
      setError("networkError");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}/notes`);
      const data = await response.json();
      if (data.success) {
        setNotes(data.notes);
      }
    } catch (err) {
      console.error("[Workspace] Fetch notes error:", err);
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}/links`);
      const data = await response.json();
      if (data.success) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error("[Workspace] Fetch links error:", err);
    }
  };

  const fetchDeliverables = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}/deliverables`);
      const data = await response.json();
      if (data.success) {
        setDeliverables(data.deliverables);
      }
    } catch (err) {
      console.error("[Workspace] Fetch deliverables error:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}/messages`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("[Workspace] Fetch messages error:", err);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}/activity`);
      const data = await response.json();
      if (data.success) {
        setActivity(data.activity);
      }
    } catch (err) {
      console.error("[Workspace] Fetch activity error:", err);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(`/api/workspaces/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setWorkspace(data.workspace);
        fetchActivity();
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("[Workspace] Update status error:", err);
      alert("Failed to update status");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/workspaces/${params.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });

      const data = await response.json();
      if (data.success) {
        setNewNote("");
        fetchNotes();
        fetchActivity();
      } else {
        alert(data.error || "Failed to add note");
      }
    } catch (err) {
      console.error("[Workspace] Add note error:", err);
      alert("Failed to add note");
    } finally {
      setSubmitting(false);
    }
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/workspaces/${params.id}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLinkLabel, url: newLinkUrl }),
      });

      const data = await response.json();
      if (data.success) {
        setNewLinkLabel("");
        setNewLinkUrl("");
        fetchLinks();
        fetchActivity();
      } else {
        alert(data.error || "Failed to add link");
      }
    } catch (err) {
      console.error("[Workspace] Add link error:", err);
      alert("Failed to add link");
    } finally {
      setSubmitting(false);
    }
  };

  const addDeliverable = async (e) => {
    e.preventDefault();
    if (!newDeliverableTitle.trim() || !newDeliverableUrl.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/workspaces/${params.id}/deliverables`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newDeliverableTitle,
            description: newDeliverableDescription,
            fileUrl: newDeliverableUrl,
          }),
        },
      );

      const data = await response.json();
      if (data.success) {
        setNewDeliverableTitle("");
        setNewDeliverableDescription("");
        setNewDeliverableUrl("");
        fetchDeliverables();
        fetchActivity();
      } else {
        alert(data.error || "Failed to submit deliverable");
      }
    } catch (err) {
      console.error("[Workspace] Add deliverable error:", err);
      alert("Failed to submit deliverable");
    } finally {
      setSubmitting(false);
    }
  };

  const updateDeliverableStatus = async (deliverableId, status) => {
    try {
      const response = await fetch(`/api/deliverables/${deliverableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        fetchDeliverables();
        fetchActivity();
      } else {
        alert(data.error || "Failed to update deliverable");
      }
    } catch (err) {
      console.error("[Workspace] Update deliverable error:", err);
      alert("Failed to update deliverable");
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/workspaces/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage("");
        fetchMessages();
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error("[Workspace] Send message error:", err);
      alert("Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const completeProject = async () => {
    if (
      !confirm("Mark this project as completed? This action cannot be undone.")
    )
      return;

    try {
      const response = await fetch(`/api/workspaces/${params.id}/complete`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        setWorkspace(data.workspace);
        fetchActivity();
        alert("🎉 Project marked as completed!");
      } else {
        alert(data.error || "Failed to complete project");
      }
    } catch (err) {
      console.error("[Workspace] Complete project error:", err);
      alert("Failed to complete project");
    }
  };

  useEffect(() => {
    if (user && params.id) {
      fetchWorkspace();
      fetchNotes();
      fetchLinks();
      fetchDeliverables();
      fetchMessages();
      fetchActivity();
    }
  }, [user, params.id]);

  // Loading state
  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="text-purple-600 mx-auto mb-4" />
          <p className="text-[#667085]">Loading workspace...</p>
          <style jsx global>{`
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
            .animate-spin-custom {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error states
  if (error === "unauthorized") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-red-200 max-w-md text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#111418] mb-2">
            Access Denied
          </h1>
          <p className="text-[#667085] mb-6">
            You do not have permission to access this workspace.
          </p>
          <a
            href="/opportunity-hub"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Back to Opportunities
          </a>
        </div>
      </div>
    );
  }

  if (error === "notFound") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md text-center">
          <AlertCircle size={64} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#111418] mb-2">
            Workspace Not Found
          </h1>
          <p className="text-[#667085] mb-6">
            This workspace doesn't exist or has been removed.
          </p>
          <a
            href="/opportunity-hub"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Back to Opportunities
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-md text-center">
          <AlertCircle size={64} className="text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#111418] mb-2">
            Something Went Wrong
          </h1>
          <p className="text-[#667085] mb-6">
            Failed to load workspace. Please try again.
          </p>
          <button
            onClick={fetchWorkspace}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  const STATUS_BADGES = {
    active: { color: "bg-blue-100 text-blue-700", label: "Active" },
    in_review: { color: "bg-yellow-100 text-yellow-700", label: "In Review" },
    completed: { color: "bg-green-100 text-green-700", label: "Completed" },
    cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
  };

  const DELIVERABLE_STATUS_CONFIG = {
    submitted: {
      color: "bg-blue-100 text-blue-700",
      label: "Submitted",
      icon: Upload,
    },
    in_review: {
      color: "bg-yellow-100 text-yellow-700",
      label: "In Review",
      icon: Clock,
    },
    changes_requested: {
      color: "bg-orange-100 text-orange-700",
      label: "Changes Requested",
      icon: RefreshCw,
    },
    approved: {
      color: "bg-green-100 text-green-700",
      label: "Approved",
      icon: Check,
    },
  };

  const currentStatus = STATUS_BADGES[workspace.status] || STATUS_BADGES.active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <a
          href="/active-projects"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Active Projects
        </a>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-[#111418] mb-2">
                {workspace.collaboration_title}
              </h1>
              <p className="text-[#667085]">
                {workspace.collab_type === "paid" && "💰 Paid Collaboration"}
                {workspace.collab_type === "partnership" && "🤝 Partnership"}
                {workspace.collab_type === "equity" && "📈 Equity Split"}
                {workspace.collab_type === "passion" && "❤️ Passion Project"}
                {workspace.collab_type === "brand_deal" && "🎯 Brand Deal"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`${currentStatus.color} px-4 py-2 rounded-full font-semibold text-sm`}
              >
                {currentStatus.label}
              </span>
              {isCreator && workspace.status !== "completed" && (
                <button
                  onClick={completeProject}
                  className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img
                src={workspace.creator_image || "/placeholder-avatar.png"}
                alt={workspace.creator_name}
                className="w-12 h-12 rounded-full border-2 border-purple-200"
              />
              <div>
                <div className="text-sm text-[#667085]">Creator</div>
                <div className="font-bold text-[#111418]">
                  {workspace.creator_name}
                </div>
                <div className="text-sm text-purple-600">
                  @{workspace.creator_username}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={workspace.editor_image || "/placeholder-avatar.png"}
                alt={workspace.editor_name}
                className="w-12 h-12 rounded-full border-2 border-blue-200"
              />
              <div>
                <div className="text-sm text-[#667085]">Editor</div>
                <div className="font-bold text-[#111418]">
                  {workspace.editor_name}
                </div>
                <div className="text-sm text-blue-600">
                  @{workspace.editor_username}
                </div>
              </div>
            </div>
          </div>

          {/* Project Vision */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-[#111418] mb-2">Project Vision</h3>
            <p className="text-[#667085] leading-relaxed whitespace-pre-wrap">
              {workspace.collaboration_vision}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workspace.compensation_details && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-xs text-green-600 font-semibold mb-1">
                  Compensation
                </div>
                <div className="text-sm text-[#111418]">
                  {workspace.compensation_details}
                </div>
              </div>
            )}
            {workspace.estimated_timeline && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  Timeline
                </div>
                <div className="text-sm text-[#111418]">
                  {workspace.estimated_timeline}
                </div>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-600 font-semibold mb-1">
                Started
              </div>
              <div className="text-sm text-[#111418]">
                {new Date(workspace.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Activity size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">
                  Project Status
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => updateStatus("active")}
                  disabled={workspace.status === "active"}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    workspace.status === "active"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => updateStatus("in_review")}
                  disabled={workspace.status === "in_review"}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    workspace.status === "in_review"
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  In Review
                </button>
                <button
                  onClick={() => updateStatus("completed")}
                  disabled={workspace.status === "completed"}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    workspace.status === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Deliverables Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Package size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">
                  Deliverables
                </h2>
              </div>

              {/* Submit Deliverable Form */}
              <form
                onSubmit={addDeliverable}
                className="mb-6 space-y-3 bg-purple-50 rounded-xl p-4"
              >
                <input
                  type="text"
                  value={newDeliverableTitle}
                  onChange={(e) => setNewDeliverableTitle(e.target.value)}
                  placeholder="Deliverable title (e.g. 'Final Edit v1', 'Rough Cut')"
                  className="w-full border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500"
                />
                <textarea
                  value={newDeliverableDescription}
                  onChange={(e) => setNewDeliverableDescription(e.target.value)}
                  placeholder="Description or notes (optional)"
                  className="w-full border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500 resize-none"
                  rows={2}
                />
                <input
                  type="url"
                  value={newDeliverableUrl}
                  onChange={(e) => setNewDeliverableUrl(e.target.value)}
                  placeholder="File URL (Google Drive, Dropbox, YouTube, Loom, etc.)"
                  className="w-full border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !newDeliverableTitle.trim() ||
                    !newDeliverableUrl.trim()
                  }
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Upload size={18} />
                  Submit Deliverable
                </button>
              </form>

              {/* Deliverables List */}
              <div className="space-y-3">
                {deliverables.length === 0 ? (
                  <div className="text-center py-8 text-[#667085]">
                    No deliverables submitted yet
                  </div>
                ) : (
                  deliverables.map((deliverable) => {
                    const statusConfig =
                      DELIVERABLE_STATUS_CONFIG[deliverable.status];
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={deliverable.id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#111418]">
                                {deliverable.title}
                              </h3>
                              <span className="text-xs text-[#667085]">
                                Revision #{deliverable.revision_number}
                              </span>
                            </div>
                            <div className="text-sm text-[#667085]">
                              Submitted by {deliverable.author_name} on{" "}
                              {new Date(
                                deliverable.created_at,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </div>
                            {deliverable.description && (
                              <p className="text-sm text-[#667085] mt-2">
                                {deliverable.description}
                              </p>
                            )}
                          </div>
                          <span
                            className={`${statusConfig.color} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 whitespace-nowrap`}
                          >
                            <StatusIcon size={14} />
                            {statusConfig.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={deliverable.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                          >
                            <ExternalLink size={16} />
                            View File
                          </a>

                          {/* Creator Actions */}
                          {isCreator && deliverable.status === "submitted" && (
                            <>
                              <button
                                onClick={() =>
                                  updateDeliverableStatus(
                                    deliverable.id,
                                    "in_review",
                                  )
                                }
                                className="bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-700 transition-all"
                              >
                                Mark In Review
                              </button>
                              <button
                                onClick={() =>
                                  updateDeliverableStatus(
                                    deliverable.id,
                                    "changes_requested",
                                  )
                                }
                                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all flex items-center gap-1"
                              >
                                <RefreshCw size={16} />
                                Request Changes
                              </button>
                              <button
                                onClick={() =>
                                  updateDeliverableStatus(
                                    deliverable.id,
                                    "approved",
                                  )
                                }
                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1"
                              >
                                <Check size={16} />
                                Approve
                              </button>
                            </>
                          )}

                          {isCreator && deliverable.status === "in_review" && (
                            <>
                              <button
                                onClick={() =>
                                  updateDeliverableStatus(
                                    deliverable.id,
                                    "changes_requested",
                                  )
                                }
                                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all flex items-center gap-1"
                              >
                                <RefreshCw size={16} />
                                Request Changes
                              </button>
                              <button
                                onClick={() =>
                                  updateDeliverableStatus(
                                    deliverable.id,
                                    "approved",
                                  )
                                }
                                className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1"
                              >
                                <Check size={16} />
                                Approve
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">Messages</h2>
              </div>

              {/* Messages List */}
              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-[#667085]">
                    No messages yet. Start the conversation.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <img
                        src={msg.author_image || "/placeholder-avatar.png"}
                        alt={msg.author_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-[#111418]">
                            {msg.author_name}
                          </span>
                          <span className="text-xs text-[#667085]">
                            {new Date(msg.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-[#111418] text-sm leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Form */}
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={submitting || !newMessage.trim()}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>

            {/* Shared Notes */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">
                  Notes & Instructions
                </h2>
              </div>

              <form onSubmit={addNote} className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note, requirement, or instruction..."
                  className="w-full border border-gray-300 rounded-xl p-4 text-[#111418] focus:outline-none focus:border-purple-500 resize-none mb-3"
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={submitting || !newNote.trim()}
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  Post Note
                </button>
              </form>

              <div className="space-y-3">
                {notes.length === 0 ? (
                  <div className="text-center py-8 text-[#667085]">
                    No notes yet. Add the first note to get started.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={note.author_image || "/placeholder-avatar.png"}
                          alt={note.author_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-[#111418]">
                            {note.author_name}
                          </div>
                          <div className="text-xs text-[#667085]">
                            {new Date(note.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#111418] leading-relaxed whitespace-pre-wrap pl-11">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Shared Links */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <LinkIcon size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">
                  Files & Links
                </h2>
              </div>

              <form onSubmit={addLink} className="mb-6 space-y-3">
                <input
                  type="text"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="Link label (e.g. 'Draft Video', 'Brand Assets')"
                  className="w-full border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-[#111418] focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={
                    submitting || !newLinkLabel.trim() || !newLinkUrl.trim()
                  }
                  className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <LinkIcon size={18} />
                  Add Link
                </button>
              </form>

              <div className="space-y-2">
                {links.length === 0 ? (
                  <div className="text-center py-8 text-[#667085]">
                    No links yet. Add links to Google Drive, Dropbox, YouTube,
                    etc.
                  </div>
                ) : (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <LinkIcon size={20} className="text-purple-600" />
                        <div>
                          <div className="font-semibold text-[#111418]">
                            {link.label}
                          </div>
                          <div className="text-xs text-[#667085]">
                            Added by {link.author_name} on{" "}
                            {new Date(link.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <ExternalLink
                        size={18}
                        className="text-purple-600 group-hover:text-purple-700"
                      />
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-[#111418]">Activity</h2>
              </div>

              <div className="space-y-3">
                {activity.length === 0 ? (
                  <div className="text-center py-4 text-[#667085] text-sm">
                    No activity yet
                  </div>
                ) : (
                  activity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className="bg-purple-100 p-1.5 rounded-full mt-0.5">
                        <CheckCircle size={12} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[#111418]">
                          {item.activity_type === "created" &&
                            "Workspace created"}
                          {item.activity_type === "status_changed" &&
                            `Status changed to ${item.metadata?.to || "updated"}`}
                          {item.activity_type === "note_added" && "Note added"}
                          {item.activity_type === "link_added" && "Link added"}
                          {item.activity_type === "deliverable_submitted" &&
                            "Deliverable submitted"}
                          {item.activity_type === "deliverable_reviewed" &&
                            "Deliverable reviewed"}
                          {item.activity_type === "deliverable_approved" &&
                            "Deliverable approved"}
                          {item.activity_type === "revision_requested" &&
                            "Changes requested"}
                          {item.activity_type === "completed" &&
                            "Project completed"}
                        </div>
                        <div className="text-xs text-[#667085]">
                          {item.actor_name || "System"} •{" "}
                          {new Date(item.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
