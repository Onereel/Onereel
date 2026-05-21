"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  ArrowLeft,
  Upload,
  Plus,
  X as XIcon,
  DollarSign,
  Clock,
  Sparkles,
} from "lucide-react";

export default function CreateGigPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    delivery_days: "",
    sample_urls: [],
  });

  const [newUrl, setNewUrl] = useState("");

  const categories = [
    "Video Editing",
    "Animation",
    "Graphic Design",
    "Content Writing",
    "Social Media Management",
    "Thumbnail Design",
    "Sound Design",
    "Motion Graphics",
    "Other",
  ];

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        window.location.href = "/account/signin";
      } else {
        fetchProfile();
      }
    }
  }, [user, userLoading]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      const myProfile = data.profiles?.find((p) => p.user_id === user.id);

      if (!myProfile || !myProfile.onboarding_completed) {
        window.location.href = "/onboarding";
        return;
      }

      if (myProfile.role === "creator") {
        setError(
          "Only freelancers can create gigs. Update your profile to change your role.",
        );
        setProfile(myProfile);
        setLoading(false);
        return;
      }

      setProfile(myProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const addSampleUrl = () => {
    if (newUrl.trim() && formData.sample_urls.length < 5) {
      setFormData({
        ...formData,
        sample_urls: [...formData.sample_urls, newUrl.trim()],
      });
      setNewUrl("");
    }
  };

  const removeSampleUrl = (index) => {
    setFormData({
      ...formData,
      sample_urls: formData.sample_urls.filter((_, i) => i !== index),
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please add a title");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please add a description");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }
    if (!formData.delivery_days || parseInt(formData.delivery_days) <= 0) {
      setError("Please enter valid delivery days");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          price: parseFloat(formData.price),
          delivery_days: parseInt(formData.delivery_days),
          sample_urls: formData.sample_urls,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create gig");
      }

      const data = await response.json();
      window.location.href = `/gigs/${data.gig.id}`;
    } catch (error) {
      console.error("Error creating gig:", error);
      setError(error.message || "Failed to create gig. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  if (profile.role === "creator") {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#111418] dark:text-white mb-2">
            Can't Create Gigs
          </h2>
          <p className="text-[#667085] dark:text-white/60 mb-6">
            Only freelancers can create gigs. Update your profile role to start
            offering services.
          </p>
          <div className="flex gap-3">
            <a
              href="/profile/setup"
              className="flex-1 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-xl transition-colors"
            >
              Update Profile
            </a>
            <a
              href="/dashboard"
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-[#111418] dark:text-white font-semibold rounded-xl transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <a
          href="/dashboard"
          className="inline-flex items-center text-[#667085] dark:text-white/60 hover:text-[#1DA1F2] mb-8"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to dashboard
        </a>

        <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
              Create a Gig
            </h1>
            <p className="text-[#667085] dark:text-white/60">
              Showcase your services to creators worldwide
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                Gig Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="I will edit your viral short-form videos"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              />
              <p className="text-xs text-[#667085] dark:text-white/40 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe what you'll deliver, your process, and what makes your service unique..."
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              />
              <p className="text-xs text-[#667085] dark:text-white/40 mt-1">
                {formData.description.length}/2000 characters
              </p>
            </div>

            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Price (USD) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="299"
                  min="5"
                  step="1"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
              </div>
              <div>
                <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Delivery Time (days) *
                </label>
                <input
                  type="number"
                  value={formData.delivery_days}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery_days: e.target.value })
                  }
                  placeholder="3"
                  min="1"
                  max="90"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                <Upload size={16} className="inline mr-1" />
                Portfolio Links (optional, up to 5)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSampleUrl();
                    }
                  }}
                  placeholder="https://youtube.com/shorts/..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
                <button
                  type="button"
                  onClick={addSampleUrl}
                  disabled={formData.sample_urls.length >= 5}
                  className="px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-300 dark:disabled:bg-white/10 text-white font-semibold rounded-xl transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-1" />
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.sample_urls.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] rounded-xl"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1DA1F2] hover:underline text-sm truncate flex-1"
                    >
                      {url}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeSampleUrl(i)}
                      className="ml-3 text-red-500 hover:text-red-600"
                    >
                      <XIcon size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
              <a
                href="/dashboard"
                className="px-6 py-3 border-2 border-gray-300 dark:border-white/10 text-[#667085] dark:text-white/60 hover:border-[#1DA1F2] hover:text-[#1DA1F2] font-semibold rounded-xl transition-colors"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors min-h-[52px] flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-2" />
                    Publish Gig
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
