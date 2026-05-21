"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { ArrowRight, Sparkles, Film, Zap } from "lucide-react";

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      checkProfile();
    } else if (!userLoading) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  const checkProfile = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      const myProfile = data.profiles?.find((p) => p.user_id === user.id);

      if (myProfile?.onboarding_completed) {
        window.location.href = "/create-reel";
        return;
      }

      setProfile(myProfile);

      // Pre-fill with existing data
      if (myProfile) {
        setFormData({
          name: myProfile.name || "",
          bio: myProfile.bio || "",
        });
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    window.location.href = "/create-reel";
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim() || user?.name || "Creator",
        bio: formData.bio.trim() || "Content creator",
        role: "both",
        skills: [],
        onboarding_completed: true,
      };

      const response = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      window.location.href = "/create-reel";
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#667085] dark:text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
            <Sparkles className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold text-[#111418] dark:text-white mb-4">
            Welcome to One Reel
          </h1>
          <p className="text-xl text-[#667085] dark:text-white/60 mb-6">
            Let's set up your profile so you can start creating
          </p>
          <button
            onClick={handleSkip}
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
          >
            Skip and start creating →
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-[#F8F9FB] dark:bg-[#121212] rounded-2xl">
            <Film className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-bold text-[#111418] dark:text-white mb-2">
              Cinematic Reels
            </h3>
            <p className="text-sm text-[#667085] dark:text-white/60">
              Generate professional video content in seconds
            </p>
          </div>
          <div className="text-center p-6 bg-[#F8F9FB] dark:bg-[#121212] rounded-2xl">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-bold text-[#111418] dark:text-white mb-2">
              AI Studio
            </h3>
            <p className="text-sm text-[#667085] dark:text-white/60">
              Thumbnails, hooks, and viral content ideas
            </p>
          </div>
          <div className="text-center p-6 bg-[#F8F9FB] dark:bg-[#121212] rounded-2xl">
            <Sparkles className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-[#111418] dark:text-white mb-2">
              Instant Downloads
            </h3>
            <p className="text-sm text-[#667085] dark:text-white/60">
              Clean files ready to use anywhere
            </p>
          </div>
        </div>

        {/* Quick Profile Setup */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#111418] dark:text-white mb-2">
              Quick Setup (Optional)
            </h2>
            <p className="text-[#667085] dark:text-white/60">
              This helps us personalize your experience
            </p>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
                className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[#111418] dark:text-white font-semibold mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl text-[#111418] dark:text-white placeholder-[#667085] dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleSkip}
              className="px-6 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#111418] dark:text-white font-semibold rounded-xl transition-colors"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all flex items-center justify-center min-h-[52px]"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to Generator
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Skip Link */}
        <div className="text-center mt-8">
          <button
            onClick={handleSkip}
            className="text-[#667085] dark:text-white/60 hover:text-purple-600 dark:hover:text-purple-400 font-semibold text-sm transition-colors"
          >
            I'll do this later, take me to the generator →
          </button>
        </div>
      </div>
    </div>
  );
}
