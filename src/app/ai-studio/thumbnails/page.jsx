"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import {
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  Loader2,
  Palette,
  Layout,
  Zap,
  Star,
  Download,
} from "lucide-react";

export default function ThumbnailGeneratorPage() {
  const { data: user, loading: userLoading } = useUser();
  const [niche, setNiche] = useState("");
  const [contentTopic, setContentTopic] = useState("");
  const [style, setStyle] = useState("bold, eye-catching");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/ai/thumbnail-generator");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.generations || []);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setResult(null);
    setIsGuest(false);

    try {
      const response = await fetch("/api/ai/thumbnail-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, contentTopic, style }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || data.details || "Failed to generate concept",
        );
      }

      setResult(data);
      setIsGuest(data.isGuest || false);

      if (!data.isGuest && user) {
        fetchHistory();
      }
    } catch (err) {
      setError(err.message);
      console.error("Generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyText = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const getCTRColor = (ctr) => {
    if (ctr === "viral") return "text-purple-400 bg-purple-500/20";
    if (ctr === "high") return "text-green-400 bg-green-500/20";
    if (ctr === "medium") return "text-yellow-400 bg-yellow-500/20";
    return "text-gray-400 bg-gray-500/20";
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Thumbnail Concept Generator
              </h1>
              <p className="text-gray-400 mt-1">
                Claude AI designs the concept · Cloudinary renders the real
                image
              </p>
            </div>
          </div>

          {!user && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-400">
                <strong>Guest Mode:</strong> Try for free!{" "}
                <a href="/account/signup" className="underline">
                  Sign up
                </a>{" "}
                to save your concepts.
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
                Generate Thumbnail Concept
              </h2>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Your Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g., video editing, motion graphics, animation"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Content Topic
                  </label>
                  <input
                    type="text"
                    value={contentTopic}
                    onChange={(e) => setContentTopic(e.target.value)}
                    placeholder="e.g., premiere pro tutorial, after effects tips"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Visual Style (Optional)
                  </label>
                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="e.g., bold, minimal, cinematic, neon"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                    <p className="text-red-400 text-sm font-semibold">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Claude is designing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Concept
                    </>
                  )}
                </button>
              </form>

              {/* Concept Result */}
              {result && result.concept && (
                <div className="mt-8 pt-8 border-t border-white/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Your Thumbnail
                    </h3>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${getCTRColor(result.concept.estimatedCTR)}`}
                    >
                      {result.concept.estimatedCTR?.toUpperCase()} CTR
                    </span>
                  </div>

                  {/* REAL IMAGE from Cloudinary */}
                  {result.imageUrl ? (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <img
                        src={result.imageUrl}
                        alt="Generated thumbnail"
                        className="w-full"
                      />
                      <div className="p-4 flex gap-3 flex-wrap">
                        <a
                          href={result.imageUrl}
                          download={`thumbnail-${niche}-${Date.now()}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[140px] text-center py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Image
                        </a>
                        <button
                          onClick={() => copyText(result.imageUrl, "imageUrl")}
                          className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-2 font-semibold"
                        >
                          {copiedField === "imageUrl" ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          {copiedField === "imageUrl" ? "Copied!" : "Copy URL"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-6 text-center">
                      <ImageIcon className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        Image preview unavailable
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Cloudinary credentials not configured
                      </p>
                    </div>
                  )}

                  {/* Headline */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">
                          Headline Text
                        </p>
                        <p className="text-2xl font-black text-white">
                          {result.concept.headline}
                        </p>
                        {result.concept.subheadline && (
                          <p className="text-sm text-gray-300 mt-1">
                            {result.concept.subheadline}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          copyText(result.concept.headline, "headline")
                        }
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copiedField === "headline" ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Color Scheme */}
                  {result.concept.colorScheme && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="w-4 h-4 text-purple-400" />
                        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                          Color Scheme
                        </p>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        {Object.entries(result.concept.colorScheme).map(
                          ([name, hex]) => (
                            <div key={name} className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-lg border border-white/20"
                                style={{ backgroundColor: hex }}
                              />
                              <div>
                                <p className="text-xs text-gray-400 capitalize">
                                  {name}
                                </p>
                                <p className="text-xs text-white font-mono">
                                  {hex}
                                </p>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Layout */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layout className="w-4 h-4 text-blue-400" />
                      <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        Layout
                      </p>
                    </div>
                    <p className="text-sm text-white">
                      {result.concept.layout}
                    </p>
                  </div>

                  {/* Visual Elements */}
                  {result.concept.visualElements && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                        Visual Elements
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.concept.visualElements.map((el, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emotional Trigger */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                        Emotional Trigger
                      </p>
                    </div>
                    <p className="text-sm text-white">
                      {result.concept.emotionalTrigger}
                    </p>
                  </div>

                  {/* Design Tips */}
                  {result.concept.designTips && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-amber-400" />
                        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                          Design Tips
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {result.concept.designTips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-white"
                          >
                            <span className="text-amber-400 mt-0.5 flex-shrink-0">
                              •
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Recent Concepts
              </h3>

              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No concepts generated yet
                </p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((gen) => {
                    const concept = gen.metadata?.concept;
                    const hasImage =
                      gen.image_url && gen.image_url.includes("cloudinary.com");
                    return (
                      <div
                        key={gen.id}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors"
                      >
                        {hasImage && (
                          <img
                            src={gen.image_url}
                            alt={concept?.headline || gen.niche}
                            className="w-full aspect-video object-cover"
                          />
                        )}
                        <div className="p-3">
                          <p className="text-sm text-white font-bold truncate">
                            {concept?.headline || gen.niche}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 truncate">
                            {gen.niche}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(gen.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
