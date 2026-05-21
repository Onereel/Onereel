"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Loader2,
  Copy,
  Star,
  Check,
  Clock,
} from "lucide-react";

export default function HookScriptAIPage() {
  const { data: user, loading: userLoading } = useUser();
  const [niche, setNiche] = useState("");
  const [contentTopic, setContentTopic] = useState("");
  const [targetEmotion, setTargetEmotion] = useState("curiosity");
  const [hookCount, setHookCount] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [viralReferences, setViralReferences] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/ai/hook-script");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.hooks || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setHooks([]);
    setViralReferences([]);
    setRateLimitInfo(null);
    setIsGuest(false);

    try {
      const response = await fetch("/api/ai/hook-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, contentTopic, targetEmotion, hookCount }),
      });

      const data = await response.json();

      // Handle failure
      if (data.success === false) {
        throw new Error(
          data.error || data.details || "Failed to generate hooks",
        );
      }

      // Handle success
      if (data.success === true) {
        // Log warnings (informational only)
        if (data.warning) {
          console.warn("⚠️ Hooks generated with warning:", data.warning);
        }

        setHooks(data.hooks || []);
        setViralReferences(data.viralReferences || []);
        setRateLimitInfo(data.rateLimit);
        setIsGuest(data.isGuest || false);

        // Refresh history for logged-in users
        if (!data.isGuest && user) {
          fetchHistory();
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = async (hookId, currentState) => {
    try {
      await fetch("/api/ai/hook-script", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hookId, isFavorite: !currentState }),
      });
      fetchHistory();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const emotionOptions = [
    { value: "curiosity", label: "🤔 Curiosity" },
    { value: "controversy", label: "⚡ Controversy" },
    { value: "urgency", label: "⏰ Urgency" },
    { value: "shock", label: "😱 Shock" },
    { value: "excitement", label: "🎉 Excitement" },
  ];

  const getEngagementColor = (level) => {
    if (level === "viral") return "from-purple-500 to-pink-500";
    if (level === "high") return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-500";
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hook Script AI</h1>
              <p className="text-gray-400 mt-1">
                Viral video hooks from trending X language patterns
              </p>
            </div>
          </div>

          {/* Guest info banner */}
          {!user && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-400">
                <strong>Guest Mode:</strong> Try generating hooks for free!{" "}
                <a href="/account/signup" className="underline">
                  Sign up
                </a>{" "}
                to save your hooks and unlock full features.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Generate Viral Hooks
              </h2>

              {/* Rate Limit Info */}
              {rateLimitInfo && rateLimitInfo.remaining !== undefined && (
                <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {rateLimitInfo.remaining} generations remaining today
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Your Niche
                    </label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g., video editing"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Target Emotion
                    </label>
                    <select
                      value={targetEmotion}
                      onChange={(e) => setTargetEmotion(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {emotionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Content Topic
                  </label>
                  <input
                    type="text"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="e.g., color grading secrets"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Number of Hooks
                  </label>
                  <input
                    type="number"
                    value={hookCount}
                    onChange={(e) => setHookCount(parseInt(e.target.value))}
                    min="5"
                    max="20"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-semibold">
                      {error}
                    </p>
                    {rateLimitInfo?.resetAt && (
                      <p className="text-red-300 text-xs mt-2">
                        Resets at:{" "}
                        {new Date(rateLimitInfo.resetAt).toLocaleTimeString()}
                      </p>
                    )}
                    {rateLimitInfo?.limit && (
                      <p className="text-red-300 text-xs mt-1">
                        Daily limit: {rateLimitInfo.limit} hook generations
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing X Trends...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Hooks
                    </>
                  )}
                </button>
              </form>

              {/* Results */}
              {hooks.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Your Viral Hooks
                  </h3>
                  <div className="space-y-3">
                    {hooks.map((hook, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-white font-semibold mb-2 text-lg">
                              "{hook.hook}"
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span
                                className={`inline-block px-3 py-1 bg-gradient-to-r ${getEngagementColor(hook.predictedEngagement)} text-white text-xs font-bold rounded-full`}
                              >
                                {hook.predictedEngagement} engagement
                              </span>
                              <span className="text-xs text-gray-400">
                                {hook.pattern}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(hook.hook, index)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {copiedId === index ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Viral References */}
                  {viralReferences.length > 0 && (
                    <details className="mt-6">
                      <summary className="text-sm text-gray-400 cursor-pointer hover:text-white transition-colors">
                        View Viral Reference Posts ({viralReferences.length})
                      </summary>
                      <div className="mt-3 space-y-2">
                        {viralReferences.map((ref, i) => (
                          <div key={i} className="bg-black/30 p-3 rounded-lg">
                            <p className="text-xs text-white font-semibold">
                              {ref.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {ref.snippet}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Saved Hooks Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">Saved Hooks</h3>

              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">No hooks generated yet</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.slice(0, 20).map((hook) => (
                    <div
                      key={hook.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm text-white font-semibold line-clamp-2">
                          "{hook.hook_text}"
                        </p>
                        <button
                          onClick={() =>
                            toggleFavorite(hook.id, hook.is_favorite)
                          }
                          className="flex-shrink-0"
                        >
                          <Star
                            className={`w-4 h-4 ${hook.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {hook.content_topic}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              hook.hook_text,
                              `history-${hook.id}`,
                            )
                          }
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedId === `history-${hook.id}` ? (
                            <Check className="w-3 h-3 text-green-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
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
