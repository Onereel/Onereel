"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Sparkles,
  Users,
  DollarSign,
  TrendingUp,
  Zap,
  MapPin,
  Clock,
  Target,
  Link as LinkIcon,
  Plus,
  X,
  CheckCircle,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * POST COLLABORATION OPPORTUNITY
 * Frictionless, guided creation flow with profile gate
 * ═══════════════════════════════════════════════════════════════════════
 */

const COLLAB_TYPES = [
  {
    value: "paid",
    label: "Paid Project",
    icon: DollarSign,
    desc: "Budget allocated",
  },
  {
    value: "partnership",
    label: "Partnership",
    icon: Users,
    desc: "Equal collaboration",
  },
  {
    value: "passion",
    label: "Passion Project",
    icon: Sparkles,
    desc: "Portfolio building",
  },
];

const COMMON_ROLES = [
  "Director",
  "Editor",
  "Cinematographer",
  "Motion Designer",
  "Sound Designer",
  "Scriptwriter",
  "Producer",
  "Camera Operator",
  "Colorist",
  "VFX Artist",
  "Thumbnail Designer",
  "Social Media Manager",
  "Voice Actor",
];

const COMMON_SKILLS = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Final Cut Pro",
  "Photoshop",
  "Illustrator",
  "Blender",
  "Cinema 4D",
  "Logic Pro",
  "Copywriting",
  "SEO",
  "Analytics",
  "Project Management",
];

const INDUSTRIES = [
  "Film & Video",
  "YouTube",
  "TikTok",
  "Instagram",
  "Brand Content",
  "Music Video",
  "Documentary",
  "Commercial",
  "Podcast",
  "Animation",
];

export default function CreateCollaborationPage() {
  const { data: user, loading: userLoading } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    vision: "",
    referenceUrls: [],
    collabType: "",
    compensationDetails: "",
    rolesNeeded: [],
    requiredSkills: [],
    estimatedTimeline: "",
    collabStyle: "",
    location: "",
    industry: "",
    niche: "",
    urgencyLevel: "normal",
  });

  const [newReference, setNewReference] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Calculate progress
  const calculateProgress = () => {
    let completed = 0;
    const total = 5;

    // Step 1: Project Vision (title and vision required)
    if (formData.title && formData.vision) completed++;

    // Step 2: Compensation
    if (formData.collabType) completed++;

    // Step 3: Roles & Skills
    if (formData.rolesNeeded.length > 0 && formData.requiredSkills.length > 0)
      completed++;

    // Step 4: Timeline & Location (optional but counts as step)
    if (formData.estimatedTimeline || formData.collabStyle) completed++;

    // Step 5: Industry & Niche (optional but counts as step)
    if (formData.industry || formData.niche) completed++;

    return { completed, total, percentage: (completed / total) * 100 };
  };

  const progress = calculateProgress();

  // Check if user has completed profile
  useEffect(() => {
    async function checkProfile() {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      try {
        const response = await fetch("/api/profiles/check");
        const data = await response.json();

        if (!data.exists || data.needsSetup) {
          // Redirect to profile setup with return URL
          window.location.href = `/profile/setup?returnTo=${encodeURIComponent("/collaborations/create")}&action=${encodeURIComponent("post a collaboration")}`;
          return;
        }

        setCheckingProfile(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        setCheckingProfile(false);
      }
    }

    if (!userLoading) {
      checkProfile();
    }
  }, [user, userLoading]);

  const addReference = () => {
    if (newReference.trim() && formData.referenceUrls.length < 5) {
      setFormData({
        ...formData,
        referenceUrls: [...formData.referenceUrls, newReference.trim()],
      });
      setNewReference("");
    }
  };

  const removeReference = (index) => {
    setFormData({
      ...formData,
      referenceUrls: formData.referenceUrls.filter((_, i) => i !== index),
    });
  };

  const addRole = (role) => {
    if (
      role &&
      !formData.rolesNeeded.includes(role) &&
      formData.rolesNeeded.length < 8
    ) {
      setFormData({
        ...formData,
        rolesNeeded: [...formData.rolesNeeded, role],
      });
      setNewRole("");
    }
  };

  const removeRole = (role) => {
    setFormData({
      ...formData,
      rolesNeeded: formData.rolesNeeded.filter((r) => r !== role),
    });
  };

  const addSkill = (skill) => {
    if (
      skill &&
      !formData.requiredSkills.includes(skill) &&
      formData.requiredSkills.length < 12
    ) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    if (formData.rolesNeeded.length === 0) {
      setError("Please add at least one role needed");
      return;
    }

    if (formData.requiredSkills.length === 0) {
      setError("Please add at least one required skill");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("[Create Collaboration] Submitting form...", {
      title: formData.title,
      collabType: formData.collabType,
      rolesCount: formData.rolesNeeded.length,
      skillsCount: formData.requiredSkills.length,
    });

    try {
      const response = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("[Create Collaboration] Response status:", response.status);

      const data = await response.json();
      console.log("[Create Collaboration] Response data:", data);

      if (!response.ok) {
        console.error("[Create Collaboration] ❌ Server error:", data.error);
        throw new Error(data.error || "Failed to create collaboration");
      }

      if (!data.success) {
        console.error("[Create Collaboration] ❌ Request failed:", data.error);
        throw new Error(data.error || "Failed to create collaboration");
      }

      if (!data.collaboration || !data.collaboration.id) {
        console.error(
          "[Create Collaboration] ❌ No collaboration ID returned:",
          data,
        );
        throw new Error("Server did not return a valid collaboration ID");
      }

      console.log(
        "[Create Collaboration] ✅ Success! Collaboration ID:",
        data.collaboration.id,
      );
      console.log(
        "[Create Collaboration] Redirecting to:",
        `/collaborations/${data.collaboration.id}`,
      );

      setSuccess(true);

      // Wait for success animation, then redirect
      setTimeout(() => {
        window.location.href = `/collaborations/${data.collaboration.id}`;
      }, 1500);
    } catch (err) {
      console.error("[Create Collaboration] ❌ Error:", err);
      setError(
        err.message ||
          "We couldn't publish your collaboration. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
            style={{
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p className="text-[#667085]">Loading...</p>
        </div>
        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 text-center">
          <Users size={48} className="mx-auto text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold text-[#111418] mb-2">
            Sign in to Post
          </h2>
          <p className="text-[#667085] mb-6">
            Create an account to post collaboration opportunities
          </p>
          <a
            href="/account/signin"
            className="block bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200 text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-[#111418] mb-2">
            Opportunity Posted!
          </h2>
          <p className="text-[#667085] mb-6">
            Your collaboration is now live. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#111418] mb-3">
            Post Collaboration Opportunity
          </h1>
          <p className="text-lg text-[#667085]">
            Describe your vision clearly to attract the right creators
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#667085]">
              Step {progress.completed} of {progress.total}
            </span>
            <span className="text-sm font-semibold text-purple-600">
              {progress.percentage.toFixed(0)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Vision */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target size={24} className="text-purple-600" />
              <h2 className="text-xl font-bold text-[#111418]">
                Project Vision
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Documentary Series on Climate Tech Startups"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Describe Your Vision *
                </label>
                <textarea
                  value={formData.vision}
                  onChange={(e) =>
                    setFormData({ ...formData, vision: e.target.value })
                  }
                  placeholder="What are you trying to create? What's the story, style, and impact you're aiming for?"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                  required
                />
                <p className="text-xs text-[#667085] mt-1">
                  Tip: Be specific about the creative direction and expected
                  outcome
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Reference Links (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newReference}
                    onChange={(e) => setNewReference(e.target.value)}
                    placeholder="https://example.com/inspiration"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={addReference}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.referenceUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                    >
                      <LinkIcon size={14} />
                      <span className="truncate max-w-[200px]">{url}</span>
                      <button
                        type="button"
                        onClick={() => removeReference(idx)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collaboration Type */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={24} className="text-green-600" />
              <h2 className="text-xl font-bold text-[#111418]">Compensation</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {COLLAB_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.collabType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, collabType: type.value })
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <Icon
                      size={24}
                      className={
                        isSelected ? "text-purple-600" : "text-gray-400"
                      }
                    />
                    <div className="mt-2 font-semibold text-[#111418]">
                      {type.label}
                    </div>
                    <div className="text-xs text-[#667085]">{type.desc}</div>
                  </button>
                );
              })}
            </div>

            {formData.collabType && (
              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Compensation Details
                </label>
                <input
                  type="text"
                  value={formData.compensationDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      compensationDetails: e.target.value,
                    })
                  }
                  placeholder={
                    formData.collabType === "paid"
                      ? "e.g., $500-1000 per video"
                      : formData.collabType === "equity"
                        ? "e.g., 5% equity"
                        : "Describe the compensation"
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            )}
          </div>

          {/* Roles & Skills */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Users size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-[#111418]">
                Roles & Skills Needed
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Roles Needed * ({formData.rolesNeeded.length}/8)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addRole(newRole))
                    }
                    placeholder="Type a role or select below"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => addRole(newRole)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => addRole(role)}
                      disabled={formData.rolesNeeded.includes(role)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-100 hover:text-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {role}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.rolesNeeded.map((role) => (
                    <div
                      key={role}
                      className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-semibold"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => removeRole(role)}
                        className="text-white hover:text-purple-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Required Skills * ({formData.requiredSkills.length}/12)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addSkill(newSkill))
                    }
                    placeholder="Type a skill or select below"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill(newSkill)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={formData.requiredSkills.includes(skill)}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 font-semibold"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-white hover:text-blue-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline & Location */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-[#111418]">
                Timeline & Location
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Estimated Timeline
                </label>
                <input
                  type="text"
                  value={formData.estimatedTimeline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedTimeline: e.target.value,
                    })
                  }
                  placeholder="e.g., 2 weeks, 1 month, ongoing"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Collaboration Style
                </label>
                <select
                  value={formData.collabStyle}
                  onChange={(e) =>
                    setFormData({ ...formData, collabStyle: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select style</option>
                  <option value="remote">Remote</option>
                  <option value="local">Local</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {(formData.collabStyle === "local" ||
                formData.collabStyle === "hybrid") && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111418] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="e.g., Los Angeles, CA"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Industry & Niche */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Target size={24} className="text-pink-600" />
              <h2 className="text-xl font-bold text-[#111418]">
                Industry & Niche
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111418] mb-2">
                  Niche
                </label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) =>
                    setFormData({ ...formData, niche: e.target.value })
                  }
                  placeholder="e.g., Tech Reviews, Fashion, Gaming"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              loading ||
              !formData.title ||
              !formData.vision ||
              !formData.collabType ||
              formData.rolesNeeded.length === 0 ||
              formData.requiredSkills.length === 0
            }
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  style={{
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Posting...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Post Collaboration
              </>
            )}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
