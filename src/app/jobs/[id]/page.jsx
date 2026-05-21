"use client";

import { useState, useEffect } from "react";
import { DollarSign, Calendar, ArrowLeft, Send } from "lucide-react";
import { useUser } from "@/utils/useUser";

export default function JobDetailPage({ params }) {
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [proposal, setProposal] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  async function fetchJob() {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }
      const data = await response.json();
      setJob(data.job);
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApply(e) {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to apply");
      return;
    }

    if (!proposal.trim()) {
      alert("Please write a proposal");
      return;
    }

    try {
      setApplying(true);

      // Get current user's profile
      const profileRes = await fetch(`/api/profiles?role=freelancer`);
      const profileData = await profileRes.json();
      const myProfile = profileData.profiles?.find(
        (p) => p.user_id === user.id,
      );

      if (!myProfile) {
        alert("Please complete your profile first");
        window.location.href = "/profile/setup";
        return;
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          applicant_id: myProfile.id,
          proposal: proposal.trim(),
          proposed_rate: proposedRate ? parseFloat(proposedRate) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to apply");
      }

      alert("Application submitted successfully!");
      setShowApplicationForm(false);
      setProposal("");
      setProposedRate("");
      fetchJob(); // Refresh to show new application
    } catch (error) {
      console.error("Error applying:", error);
      alert(error.message || "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">
            Loading job...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
            Job not found
          </h2>
          <a href="/jobs" className="text-[#1DA1F2] hover:underline">
            Back to jobs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <a
          href="/jobs"
          className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to jobs
        </a>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-semibold">
                  {job.status === "open" ? "🟢 Open" : "🔴 Closed"}
                </span>
                <div className="text-3xl font-bold text-[#1DA1F2]">
                  ${parseFloat(job.budget).toFixed(0)}
                </div>
              </div>

              <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-4">
                {job.title}
              </h1>

              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-lg">
                  {job.creator_name?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-semibold text-[#111418] dark:text-white">
                    {job.creator_name}
                  </div>
                  <div className="text-sm text-[#667085] dark:text-white/60">
                    @{job.creator_username} •{" "}
                    {job.creator_followers?.toLocaleString()} followers
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#111418] dark:text-white mb-3">
                  Job Description
                </h2>
                <p className="text-[#667085] dark:text-white/60 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.deadline && (
                <div className="flex items-center text-[#667085] dark:text-white/60 mb-6">
                  <Calendar size={18} className="mr-2" />
                  <span>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Application Form */}
              {job.status === "open" && !showApplicationForm && (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-4 rounded-full transition-colors"
                >
                  Apply for this Job
                </button>
              )}

              {showApplicationForm && (
                <form
                  onSubmit={handleApply}
                  className="border-t border-gray-200 dark:border-white/10 pt-6"
                >
                  <h3 className="text-xl font-bold text-[#111418] dark:text-white mb-4">
                    Submit Your Application
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Your Proposal *
                    </label>
                    <textarea
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      placeholder="Explain why you're the best fit for this job..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                      Your Rate (Optional)
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="number"
                        value={proposedRate}
                        onChange={(e) => setProposedRate(e.target.value)}
                        placeholder="Enter your proposed rate"
                        step="0.01"
                        min="0"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center"
                    >
                      {applying ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send size={18} className="mr-2" />
                          Submit Application
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="px-6 py-3 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar - Applications */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-6">
              <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-4">
                Applications ({applications.length})
              </h3>

              {applications.length === 0 ? (
                <p className="text-[#667085] dark:text-white/60 text-sm">
                  No applications yet. Be the first to apply!
                </p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="border-b border-gray-200 dark:border-white/10 pb-4 last:border-0"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold text-xs">
                          {app.applicant_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-[#111418] dark:text-white truncate">
                            {app.applicant_name}
                          </div>
                          <div className="text-xs text-[#667085] dark:text-white/60">
                            @{app.applicant_username}
                          </div>
                        </div>
                      </div>

                      {app.proposed_rate && (
                        <div className="text-sm text-[#1DA1F2] font-semibold mb-1">
                          Rate: ${parseFloat(app.proposed_rate).toFixed(0)}
                        </div>
                      )}

                      <p className="text-xs text-[#667085] dark:text-white/60 line-clamp-2">
                        {app.proposal}
                      </p>

                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : app.status === "accepted"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
