"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Image,
  MessageSquare,
  BarChart3,
} from "lucide-react";

export default function AIStudioDashboard() {
  const { data: user, loading } = useUser();
  const [usageStats, setUsageStats] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/account/signin";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchUsageStats();
    }
  }, [user]);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch("/api/ai/usage-stats");
      if (response.ok) {
        const data = await response.json();
        setUsageStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    }
  };

  const features = [
    {
      name: "Thumbnail Generator",
      description: "AI-powered thumbnails based on trending visual patterns",
      icon: Image,
      color: "from-purple-500 to-pink-500",
      route: "/ai-studio/thumbnails",
      badge: "Live",
      stats: usageStats?.thumbnail || 0,
    },
    {
      name: "Hook Script AI",
      description: "Viral hooks from trending content language patterns",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
      route: "/ai-studio/hooks",
      badge: "Live",
      stats: usageStats?.hook || 0,
    },
    {
      name: "Trend Alerts",
      description: "Real-time trend monitoring with instant creative alerts",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      route: "/ai-studio/trends",
      badge: "Live",
      stats: usageStats?.trend || 0,
    },
    {
      name: "A/B Predictor",
      description: "Predict which creative will perform best",
      icon: BarChart3,
      color: "from-green-500 to-emerald-500",
      route: "/ai-studio/ab-test",
      badge: "Soon",
      disabled: true,
    },
    {
      name: "Auto-Caption",
      description: "Animated captions that emphasize key moments",
      icon: Sparkles,
      color: "from-yellow-500 to-orange-500",
      route: "/ai-studio/captions",
      badge: "Soon",
      disabled: true,
    },
    {
      name: "B-Roll Suggester",
      description: "Smart b-roll recommendations for your edits",
      icon: Zap,
      color: "from-indigo-500 to-purple-500",
      route: "/ai-studio/broll",
      badge: "Soon",
      disabled: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI Creative Studio
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Professional AI tools for creators. Generate faster, create better,
            stand out everywhere.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            if (feature.disabled) {
              return (
                <div
                  key={feature.name}
                  className="relative group text-left p-6 rounded-2xl border transition-all duration-300 bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`
                      text-xs font-bold px-2 py-1 rounded-full
                      ${
                        feature.badge === "Live"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }
                    `}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} 
                    flex items-center justify-center mb-4
                    ${!feature.disabled && "group-hover:scale-110 transition-transform"}
                  `}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  {!feature.disabled && feature.stats > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <BarChart3 className="w-3 h-3" />
                      <span>{feature.stats} generations this month</span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={feature.name}
                href={feature.route}
                className="relative group text-left p-6 rounded-2xl border transition-all duration-300 bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 cursor-pointer block"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`
                    text-xs font-bold px-2 py-1 rounded-full
                    ${
                      feature.badge === "Live"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }
                  `}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`
                  w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} 
                  flex items-center justify-center mb-4
                  ${!feature.disabled && "group-hover:scale-110 transition-transform"}
                `}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>

                {/* Stats */}
                {!feature.disabled && feature.stats > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BarChart3 className="w-3 h-3" />
                    <span>{feature.stats} generations this month</span>
                  </div>
                )}
              </a>
            );
          })}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">
            🚀 Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold mb-3">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">
                Generate Thumbnails
              </h3>
              <p className="text-gray-400 text-sm">
                Create scroll-stopping thumbnails based on trending visual
                patterns and engagement data.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold mb-3">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">
                Write Viral Hooks
              </h3>
              <p className="text-gray-400 text-sm">
                Get 10 variations of high-engagement hooks optimized for your
                content niche.
              </p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-sm font-bold mb-3">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">Monitor Trends</h3>
              <p className="text-gray-400 text-sm">
                Get alerted when trends spike so you can create content before
                saturation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
