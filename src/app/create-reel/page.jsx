"use client";

import useUser from "@/utils/useUser";
import { Sparkles, AlertCircle, RefreshCw, Crown } from "lucide-react";
import { useCreateReel } from "@/hooks/useCreateReel";
import {
  MOODS,
  VISUAL_STYLES,
  DURATIONS,
} from "@/components/CreateReel/constants";
import { VideoResultModal } from "@/components/CreateReel/VideoResultModal";
import { PageHeader } from "@/components/CreateReel/PageHeader";
import { FormField } from "@/components/CreateReel/FormField";
import { OptionGrid } from "@/components/CreateReel/OptionGrid";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CREATE REEL PAGE — EARLY ACCESS MODE (FREE FOR ALL)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * EARLY ACCESS MODEL:
 * - Unlimited reels for everyone (no limits)
 * - No upgrade prompts
 * - No paywalls
 * - Founding user messaging
 *
 * ASYNC VIDEO FLOW:
 * 1. User clicks "Generate Reel"
 * 2. Backend submits job to Luma → Returns immediately with job_id
 * 3. VideoResultModal opens with state machine
 * 4. Modal polls Luma status every 5 seconds
 * 5. 90-second timeout failsafe
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function CreateReelPage() {
  const { data: user } = useUser();

  const {
    loading,
    error,
    success,
    usage,
    generatedReel,
    formData,
    setFormData,
    setGeneratedReel,
    handleSubmit,
    retryGeneration,
  } = useCreateReel(user);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      {/* ✅ VideoResultModal with polling & state machine */}
      <VideoResultModal
        reel={generatedReel}
        onClose={() => setGeneratedReel(null)}
        onRetry={() => {
          setGeneratedReel(null);
          retryGeneration();
        }}
        user={user}
      />

      <PageHeader user={user} usage={usage} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ✨ EARLY ACCESS BANNER (Replaces upgrade prompts) */}
        <div className="mb-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-6 py-5 rounded-2xl">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown size={24} className="text-yellow-300" />
            <h2 className="text-2xl font-extrabold">
              Early Access — Unlimited Creation
            </h2>
            <Crown size={24} className="text-yellow-300" />
          </div>
          <p className="text-center text-white/90 font-medium">
            {user
              ? "You're a Founding User — Create without limits!"
              : "Try unlimited creation for free — No signup required"}
          </p>
        </div>

        {/* Headline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-[#111418] dark:text-white mb-3">
            Create a cinematic reel in seconds
          </h1>
          <p className="text-lg text-[#667085] dark:text-white/60">
            Choose your mood, style, and duration — we'll handle the rest
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
              Content Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Morning Coffee Ritual, Urban Dreams, Summer Memories"
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#111418] dark:text-white"
              required
            />
          </div>

          {/* Optional Description */}
          <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-gray-200 dark:border-white/10">
            <label className="block text-sm font-semibold text-[#111418] dark:text-white mb-2">
              Describe your reel idea... (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add details about the story, atmosphere, or key moments..."
              rows={3}
              className="w-full px-4 py-3 bg-[#F8F9FB] dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-[#111418] dark:text-white resize-none"
            />
          </div>

          {/* Mood */}
          <FormField label="Select Mood *">
            <OptionGrid
              options={MOODS}
              selectedValue={formData.mood}
              onSelect={(value) => setFormData({ ...formData, mood: value })}
            />
          </FormField>

          {/* Style */}
          <FormField label="Select Style *">
            <OptionGrid
              options={VISUAL_STYLES}
              selectedValue={formData.visualStyle}
              onSelect={(value) =>
                setFormData({ ...formData, visualStyle: value })
              }
            />
          </FormField>

          {/* Duration */}
          <FormField label="Duration *">
            <OptionGrid
              options={DURATIONS}
              selectedValue={formData.duration}
              onSelect={(value) =>
                setFormData({ ...formData, duration: value })
              }
              columns={3}
            />
          </FormField>

          {/* Error State with Retry */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={retryGeneration}
                className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:underline"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-5 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"></div>
                Submitting to AI director...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate Reel — Free During Early Access
              </>
            )}
          </button>

          {/* Guest CTA - Soft Encouragement */}
          {!user && (
            <div className="text-center bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold mb-2">
                💡 Want to save your reels and collaborate with others?
              </p>
              <a
                href="/account/signup"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold underline"
              >
                Create a free account
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
