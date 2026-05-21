"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function SafetyControlsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/safety-controls");
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
        setStats(data.stats);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (setting, value) => {
    try {
      setUpdating(true);
      const response = await fetch("/api/admin/safety-controls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting, value }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        fetchSettings();
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setUpdating(false);
    }
  };

  const toggleKillSwitch = () => {
    if (settings.globalGenerationEnabled) {
      if (
        !confirm("🚨 This will DISABLE all video generation. Are you sure?")
      ) {
        return;
      }
    }
    updateSetting(
      "global_generation_enabled",
      !settings.globalGenerationEnabled,
    );
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/admin"
            className="text-gray-400 hover:text-white mb-4 inline-block"
          >
            ← Back to Admin
          </a>
          <h1 className="text-3xl font-bold">🚨 Safety Controls</h1>
          <p className="text-gray-400 mt-2">
            Emergency controls for platform safety
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

        {/* Stats */}
        {stats && (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Today's Generation Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold">
                  {stats.todayGenerations}
                </div>
                <div className="text-sm text-gray-400">
                  Videos Generated Today
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {stats.dailyCap}
                </div>
                <div className="text-sm text-gray-400">Daily Cap</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Usage</span>
                <span>
                  {Math.round((stats.todayGenerations / stats.dailyCap) * 100)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.todayGenerations / stats.dailyCap) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Kill Switch */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                🔴 Global Kill Switch
              </h2>
              <p className="text-gray-400 text-sm">
                {settings?.globalGenerationEnabled
                  ? "Video generation is ENABLED"
                  : "⚠️ Video generation is DISABLED - users cannot create videos"}
              </p>
            </div>
            <button
              onClick={toggleKillSwitch}
              disabled={updating}
              className={`px-6 py-2 rounded-lg font-bold transition-colors ${
                settings?.globalGenerationEnabled
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              } disabled:opacity-50`}
            >
              {settings?.globalGenerationEnabled ? "DISABLE ALL" : "ENABLE ALL"}
            </button>
          </div>
        </div>

        {/* Daily Cap Control */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Daily Generation Cap</h2>
          <p className="text-gray-400 text-sm mb-4">
            Maximum videos that can be generated per day across all users
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              value={settings?.dailyGenerationCap || 1000}
              onChange={(e) =>
                updateSetting("daily_generation_cap", parseInt(e.target.value))
              }
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg w-32"
              disabled={updating}
            />
            <span className="text-sm text-gray-400">videos per day</span>
          </div>
        </div>

        {/* Free Tier Limit */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Free Tier User Limit</h2>
          <p className="text-gray-400 text-sm mb-4">
            Maximum videos free tier users can create
          </p>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              value={settings?.freeTierLimit || 3}
              onChange={(e) =>
                updateSetting(
                  "free_tier_generation_limit",
                  parseInt(e.target.value),
                )
              }
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg w-32"
              disabled={updating}
            />
            <span className="text-sm text-gray-400">videos per user</span>
          </div>
        </div>
      </div>
    </div>
  );
}
