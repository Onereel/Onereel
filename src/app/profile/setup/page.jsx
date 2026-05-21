"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import useUser from "@/utils/useUser";

export default function ProfileSetupPage() {
  const { data: user, loading: userLoading } = useUser();
  // ✅ Start loading=false; only set true while fetching profile
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [returnTo, setReturnTo] = useState(null);
  const [actionName, setActionName] = useState(null);
  const fetchedRef = useRef(false);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: "",
    role: "both",
    skills: "",
    portfolio_links: "",
    hourly_rate: "",
    fixed_pricing: "",
  });

  const [portfolioLinkInput, setPortfolioLinkInput] = useState("");
  const [portfolioLinksArray, setPortfolioLinksArray] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReturnTo(params.get("returnTo"));
    setActionName(params.get("action"));
  }, []);

  useEffect(() => {
    // Only fetch once, and only when user is available
    if (user && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    setLoading(true);

    // ✅ Safety timeout — never spin forever
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    try {
      // ✅ Use /api/profiles/check instead of fetching ALL profiles
      const response = await fetch("/api/profiles/check", {
        credentials: "include",
      });

      if (!response.ok) {
        console.error("[ProfileSetup] Profile check failed:", response.status);
        return;
      }

      const data = await response.json();

      if (data.exists && data.profile) {
        const p = data.profile;
        setExistingProfile(p);
        setFormData({
          username: p.username || "",
          name: p.name || "",
          bio: p.bio || "",
          role: p.role || "both",
          skills: p.skills?.join(", ") || "",
          portfolio_links: p.portfolio_links?.join("\n") || "",
          hourly_rate: p.hourly_rate || "",
          fixed_pricing: p.fixed_pricing || "",
        });
        setPortfolioLinksArray(p.portfolio_links || []);
      } else {
        // No profile yet — pre-fill from user session
        setFormData((prev) => ({
          ...prev,
          name: user?.name || "",
          username: (user?.email || "")
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_"),
        }));
      }
    } catch (error) {
      console.error("[ProfileSetup] Error fetching profile:", error);
    } finally {
      clearTimeout(safetyTimer);
      setLoading(false);
    }
  }

  const addPortfolioLink = () => {
    if (portfolioLinkInput.trim() && portfolioLinksArray.length < 3) {
      setPortfolioLinksArray([
        ...portfolioLinksArray,
        portfolioLinkInput.trim(),
      ]);
      setPortfolioLinkInput("");
    }
  };

  const removePortfolioLink = (index) => {
    setPortfolioLinksArray(portfolioLinksArray.filter((_, i) => i !== index));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to create a profile");
      return;
    }

    if (!formData.username.trim() || !formData.name.trim()) {
      alert("Username and name are required");
      return;
    }

    try {
      setSaving(true);

      const skills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        user_id: user.id,
        username: formData.username.trim().toLowerCase().replace(/\s+/g, "_"),
        name: formData.name.trim(),
        bio: formData.bio.trim() || null,
        role: formData.role,
        skills: skills.length > 0 ? skills : null,
        portfolio_links:
          portfolioLinksArray.length > 0 ? portfolioLinksArray : null,
        hourly_rate: formData.hourly_rate
          ? parseFloat(formData.hourly_rate)
          : null,
        fixed_pricing: formData.fixed_pricing
          ? parseFloat(formData.fixed_pricing)
          : null,
      };

      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save profile");
      }

      setShowSuccess(true);

      setTimeout(() => {
        window.location.href = returnTo || "/opportunity-hub";
      }, 1500);
    } catch (error) {
      console.error("[ProfileSetup] Error saving profile:", error);
      alert(error.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // ✅ Show sign-in prompt if not authenticated and done loading
  if (!user && !userLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-4">
            Please sign in
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            You need to be signed in to create a profile
          </p>
          <a
            href="/account/signin"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-8 py-3 rounded-full"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // ✅ Only show spinner while auth OR profile is loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div
            className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
            style={{ animation: "spin 1s linear infinite" }}
          ></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">
            {userLoading ? "Checking session..." : "Loading your profile..."}
          </p>
        </div>
        <style
          jsx
          global
        >{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <CheckCircle
                size={48}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111418] dark:text-white mb-4">
            Profile Created! 🎉
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-2">
            {returnTo
              ? `Taking you back to ${actionName || "where you were"}...`
              : "Taking you to Opportunity Hub..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a
          href={returnTo || "/opportunity-hub"}
          className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {returnTo ? "Go Back" : "Back to Opportunity Hub"}
        </a>

        <div className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
          {actionName && returnTo && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-900 dark:text-purple-200">
                <strong>Before you can {actionName},</strong> please create your
                profile.
              </p>
            </div>
          )}

          <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
            {existingProfile ? "Update Your Profile" : "Create Your Profile"}
          </h1>
          <p className="text-[#667085] dark:text-white/60 mb-8">
            {existingProfile
              ? "Update your creator profile details"
              : "Set up your profile to use One Reel"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="your_username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <p className="text-xs text-[#667085] mt-1">
                Lowercase letters, numbers, and underscores only
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your full name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                I am a *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="both">Both Creator & Editor</option>
                <option value="creator">Creator (hire talent)</option>
                <option value="freelancer">Editor (offer services)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, skills: e.target.value }))
                }
                placeholder="Video Editing, Motion Graphics, Color Grading"
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                Portfolio Work
              </label>
              <p className="text-xs text-[#667085] dark:text-white/60 mb-3">
                Add up to 3 links to your best work (YouTube, Vimeo, TikTok,
                etc.)
              </p>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={portfolioLinkInput}
                  onChange={(e) => setPortfolioLinkInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPortfolioLink();
                    }
                  }}
                  placeholder="Paste a YouTube, Vimeo, or TikTok link"
                  disabled={portfolioLinksArray.length >= 3}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={addPortfolioLink}
                  disabled={
                    !portfolioLinkInput.trim() ||
                    portfolioLinksArray.length >= 3
                  }
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {portfolioLinksArray.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <ExternalLink
                        size={16}
                        className="text-purple-600 dark:text-purple-400 flex-shrink-0"
                      />
                      <span className="text-sm text-purple-800 dark:text-purple-200 truncate">
                        {link}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePortfolioLink(idx)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 ml-2 flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {portfolioLinksArray.length === 3 && (
                <p className="text-xs text-[#667085] dark:text-white/60 mt-2">
                  Maximum 3 portfolio links reached
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourly_rate: e.target.value,
                    }))
                  }
                  placeholder="50"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
                  Fixed Project Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.fixed_pricing}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fixed_pricing: e.target.value,
                    }))
                  }
                  placeholder="500"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-all flex items-center justify-center shadow-lg"
              >
                {saving ? (
                  <>
                    <div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      style={{ animation: "spin 1s linear infinite" }}
                    ></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    {existingProfile ? "Update Profile" : "Create Profile"}
                  </>
                )}
              </button>
              {existingProfile && (
                <a
                  href={returnTo || "/opportunity-hub"}
                  className="px-6 py-4 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-purple-600 hover:text-purple-600 font-semibold rounded-full transition-all text-center"
                >
                  Cancel
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
      <style
        jsx
        global
      >{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
