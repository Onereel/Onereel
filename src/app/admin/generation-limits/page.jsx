"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function GenerationLimitsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [globalLimit, setGlobalLimit] = useState(3);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [customLimit, setCustomLimit] = useState("");

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, userLoading]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/generation-limits");

      if (!response.ok) {
        if (response.status === 403) {
          setMessage({ type: "error", text: "Admin access required" });
          setTimeout(() => (window.location.href = "/dashboard"), 2000);
          return;
        }
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);
      setGlobalLimit(data.settings.globalLimit);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalLimit = async () => {
    try {
      setUpdating(true);
      const response = await fetch("/api/admin/generation-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: parseInt(globalLimit) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update limit");
      }

      setMessage({ type: "success", text: data.message });
      fetchSettings();
    } catch (error) {
      console.error("Error updating global limit:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  const setUserOverride = async (profileId, limit) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/admin/generation-limits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          limit: limit === "" ? null : parseInt(limit),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set override");
      }

      setMessage({ type: "success", text: data.message });
      setSelectedProfile(null);
      setCustomLimit("");
      fetchSettings();
    } catch (error) {
      console.error("Error setting override:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin"
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Admin
          </a>
          <h1 className="text-3xl font-bold">Generation Limits</h1>
          <p className="text-gray-400 mt-2">
            Manage video generation limits for free tier users
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Global Limit Settings */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Global Free Tier Limit</h2>
          <p className="text-gray-400 text-sm mb-4">
            Set the default maximum number of videos free users can generate
          </p>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              value={globalLimit}
              onChange={(e) => setGlobalLimit(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg w-32"
              disabled={updating}
            />
            <button
              onClick={updateGlobalLimit}
              disabled={updating}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Global Limit"}
            </button>
          </div>

          {settings?.settings.globalLimitLastUpdated && (
            <p className="text-xs text-gray-500 mt-2">
              Last updated:{" "}
              {new Date(
                settings.settings.globalLimitLastUpdated,
              ).toLocaleString()}
            </p>
          )}
        </div>

        {/* Usage Statistics */}
        {settings?.statistics && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.statistics.map((stat) => (
                <div
                  key={stat.subscription_tier}
                  className="bg-white/5 p-4 rounded-lg"
                >
                  <div className="text-gray-400 text-sm mb-1">
                    {stat.subscription_tier === "free"
                      ? "Free Tier"
                      : "Pro Tier"}
                  </div>
                  <div className="text-2xl font-bold">{stat.user_count}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {stat.total_reels || 0} total reels •{" "}
                    {parseFloat(stat.avg_reels_per_user || 0).toFixed(1)}{" "}
                    avg/user
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Overrides */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            User-Specific Overrides
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Set custom generation limits for individual users (overrides global
            limit)
          </p>

          {settings?.userOverrides && settings.userOverrides.length > 0 ? (
            <div className="space-y-3 mb-6">
              {settings.userOverrides.map((override) => (
                <div
                  key={override.profileId}
                  className="bg-white/5 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{override.name}</div>
                    <div className="text-sm text-gray-400">
                      @{override.username} • {override.tier}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-purple-400 font-semibold">
                      {override.customLimit} videos
                    </div>
                    <button
                      onClick={() => setUserOverride(override.profileId, null)}
                      disabled={updating}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-6">
              No custom overrides set
            </p>
          )}

          {/* Add Override Form */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="font-medium mb-3">Add Custom Override</h3>
            <div className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="Profile ID"
                value={selectedProfile || ""}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                disabled={updating}
              />
              <input
                type="number"
                min="0"
                placeholder="Custom limit"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                disabled={updating}
              />
              <button
                onClick={() => setUserOverride(selectedProfile, customLimit)}
                disabled={updating || !selectedProfile || !customLimit}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
              >
                {updating ? "Setting..." : "Set Custom Limit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
