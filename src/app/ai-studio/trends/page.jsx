"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Loader2,
  X,
  Flame,
  Clock,
  Target,
} from "lucide-react";

export default function TrendAlertsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [niche, setNiche] = useState("");
  const [keywords, setKeywords] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [trends, setTrends] = useState([]);
  const [activeTrends, setActiveTrends] = useState([]);
  const [error, setError] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  useEffect(() => {
    if (user) {
      fetchActiveTrends();
    }
    // No redirect for guests - they can try the feature
  }, [user, filterPriority]);

  const fetchActiveTrends = async () => {
    try {
      const params = new URLSearchParams();
      if (filterPriority !== "all") params.append("priority", filterPriority);

      const response = await fetch(`/api/ai/trends?${params}`);
      if (response.ok) {
        const data = await response.json();
        setActiveTrends(data.alerts || []);
      }
    } catch (error) {
      console.error("Failed to fetch trends:", error);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setError(null);
    setTrends([]);
    setRateLimitInfo(null);

    try {
      const response = await fetch("/api/ai/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k),
        }),
      });

      // Handle rate limit errors
      if (response.status === 429) {
        const errorData = await response.json();
        setRateLimitInfo(errorData);
        throw new Error(errorData.error || "Rate limit exceeded");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze trends");
      }

      const data = await response.json();
      setTrends(data.trends || []);
      setRateLimitInfo(data.rateLimit);
      fetchActiveTrends();
    } catch (err) {
      setError(err.message);
      console.error("Analysis error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const dismissTrend = async (trendId) => {
    try {
      await fetch(`/api/ai/trends?id=${trendId}`, { method: "DELETE" });
      fetchActiveTrends();
    } catch (error) {
      console.error("Failed to dismiss trend:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "from-red-500 to-orange-500";
      case "high":
        return "from-orange-500 to-yellow-500";
      case "medium":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getPriorityIcon = (priority) => {
    if (priority === "urgent") return <Flame className="w-4 h-4" />;
    if (priority === "high") return <TrendingUp className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getVelocityColor = (velocity) => {
    if (velocity >= 80) return "text-red-400";
    if (velocity >= 60) return "text-orange-400";
    if (velocity >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <a
            href="/ai-studio"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to AI Studio
          </a>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Trend Alert Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Real-time X trend monitoring with "create now" alerts
              </p>
            </div>
          </div>

          {!user && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-400">
                <strong>Guest Mode:</strong> Try trend analysis for free! This
                feature provides sample trend insights.{" "}
                <a href="/account/signup" className="underline">
                  Sign up
                </a>{" "}
                to unlock live trend data and personalized alerts.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analyzer Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Analyze New Trends
          </h2>

          {/* Rate Limit Info */}
          {rateLimitInfo && rateLimitInfo.remaining !== undefined && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  {rateLimitInfo.remaining} trend analyses remaining today
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Your Niche
                </label>
                <input
                  type="text"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  placeholder="e.g., video editing, motion graphics"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., tutorial, tips, workflow"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm font-semibold">{error}</p>
                {rateLimitInfo?.resetAt && (
                  <p className="text-red-300 text-xs mt-2">
                    Resets at:{" "}
                    {new Date(rateLimitInfo.resetAt).toLocaleTimeString()}
                  </p>
                )}
                {rateLimitInfo?.limit && (
                  <p className="text-red-300 text-xs mt-1">
                    Daily limit: {rateLimitInfo.limit} trend analyses
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={analyzing}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing X Trends...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Trends
                </>
              )}
            </button>
          </form>

          {/* New Trends Results */}
          {trends.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">
                🔥 {trends.length} Trending Opportunities Found
              </h3>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${getPriorityColor(trend.priority)} text-white text-xs font-bold rounded-full`}
                        >
                          {getPriorityIcon(trend.priority)}
                          {trend.priority.toUpperCase()}
                        </span>
                        <span
                          className={`text-2xl font-bold ${getVelocityColor(trend.velocityScore)}`}
                        >
                          {Math.round(trend.velocityScore)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {trend.estimatedLifespan}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-white mb-2">
                      {trend.topic}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">
                      {trend.reasoning}
                    </p>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-300 uppercase">
                        Content Ideas:
                      </p>
                      {trend.contentSuggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 rounded-lg p-3"
                        >
                          <p className="text-sm text-white">
                            {i + 1}. {suggestion}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Engagement Potential:
                      </span>
                      <span className="text-xs font-semibold text-green-400">
                        {trend.engagementPotential}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Active Trends */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Active Trend Alerts
            </h2>
            <div className="flex gap-2">
              {["all", "urgent", "high", "medium"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilterPriority(priority)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filterPriority === priority
                      ? "bg-orange-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {priority === "all"
                    ? "All"
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTrends.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">No active trend alerts</p>
              <p className="text-sm text-gray-600 mt-2">
                Analyze trends above to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTrends.map((alert) => {
                const metrics =
                  typeof alert.engagement_metrics === "string"
                    ? JSON.parse(alert.engagement_metrics)
                    : alert.engagement_metrics;

                return (
                  <div
                    key={alert.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 relative group hover:border-orange-500/50 transition-colors"
                  >
                    <button
                      onClick={() => dismissTrend(alert.id)}
                      className="absolute top-4 right-4 p-1 bg-white/5 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>

                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getPriorityColor(alert.alert_priority)} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {Math.round(alert.trend_velocity)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">
                            {alert.trend_topic}
                          </h4>
                          <span
                            className={`px-2 py-1 bg-gradient-to-r ${getPriorityColor(alert.alert_priority)} text-white text-xs font-bold rounded-full`}
                          >
                            {alert.alert_priority}
                          </span>
                        </div>

                        <p className="text-sm text-gray-400 mb-3">
                          {metrics.reasoning}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {alert.content_suggestions
                            .slice(0, 3)
                            .map((suggestion, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white/10 text-white text-xs rounded-full"
                              >
                                💡 {suggestion.substring(0, 40)}
                                {suggestion.length > 40 ? "..." : ""}
                              </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{metrics.lifespan}</span>
                          </div>
                          <span>Niche: {alert.niche}</span>
                          <span>
                            Expires:{" "}
                            {new Date(alert.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
