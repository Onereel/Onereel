import { useState, useEffect, useRef } from "react";
import {
  X,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
  Loader2,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * VIDEO RESULT MODAL — CINEMATIC REVEAL
 * ═══════════════════════════════════════════════════════════════════════
 *
 * STATE MACHINE:
 * 1. GENERATING → "Directing your reel..."
 * 2. RENDERING → "AI is producing your scenes..."
 * 3. FINALIZING → "Applying cinematic polish..."
 * 4. READY → Video player with controls
 *
 * POLLING:
 * - Checks Luma status every 5 seconds
 * - 90-second timeout failsafe
 * - Graceful error handling
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

const GENERATION_STATES = {
  GENERATING: {
    title: "Directing your reel...",
    subtitle: "Our AI is composing the perfect cinematic sequence",
    icon: "🎬",
    progress: 25,
  },
  RENDERING: {
    title: "AI is producing your scenes...",
    subtitle: "Crafting each frame with precision",
    icon: "🎨",
    progress: 60,
  },
  FINALIZING: {
    title: "Applying cinematic polish...",
    subtitle: "Adding the finishing touches",
    icon: "✨",
    progress: 85,
  },
  READY: {
    title: "Your cinematic reel is ready!",
    subtitle: "Experience your vision brought to life",
    icon: "🎉",
    progress: 100,
  },
  TIMEOUT: {
    title: "Your reel is taking longer than expected",
    subtitle: "We'll notify you when it's ready",
    icon: "⏱️",
    progress: 90,
  },
  ERROR: {
    title: "Generation encountered an issue",
    subtitle: "Don't worry, you can retry",
    icon: "⚠️",
    progress: 0,
  },
};

export function VideoResultModal({ reel, onClose, onRetry, user }) {
  const [state, setState] = useState("GENERATING");
  const [videoUrl, setVideoUrl] = useState(null);
  const [pollingCount, setPollingCount] = useState(0);
  const [error, setError] = useState(null);

  const pollingIntervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!reel) return;

    console.log("[Video Result] Modal opened with reel:", {
      id: reel.id,
      videoStatus: reel.video_status,
      videoJobId: reel.metadata?.videoJobId,
      videoUrl: reel.video_url,
    });

    // Check if video is already ready
    if (
      reel.video_status === "completed" &&
      reel.video_url &&
      isRealVideo(reel.video_url)
    ) {
      console.log("[Video Result] Video already completed!");
      setVideoUrl(reel.video_url);
      setState("READY");
      return;
    }

    // Check if video is unavailable
    if (reel.video_status === "unavailable") {
      setState("ERROR");
      setError("Video generation failed. The provider may be unavailable.");
      return;
    }

    // Video is processing - start state machine
    startStateMachine();
    startPolling();

    // 90-second timeout failsafe
    timeoutRef.current = setTimeout(() => {
      console.warn("[Video Result] ⏱️ 90-second timeout reached");
      setState("TIMEOUT");
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    }, 90000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [reel]);

  const isRealVideo = (url) => {
    if (!url) return false;
    return (
      url.includes(".mp4") ||
      url.includes("lumalabs") ||
      url.includes("luma") ||
      (!url.includes("placeholder") && !url.includes("data:image"))
    );
  };

  const startStateMachine = () => {
    // Visual progression while waiting
    setTimeout(() => setState("RENDERING"), 8000);
    setTimeout(() => setState("FINALIZING"), 20000);
  };

  const startPolling = () => {
    if (!reel.metadata?.videoJobId) {
      console.error("[Video Result] No video job ID found");
      setState("ERROR");
      setError("Invalid video job - missing job ID");
      return;
    }

    const jobId = reel.metadata.videoJobId;
    console.log("[Video Result] Starting polling for job:", jobId);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        setPollingCount((prev) => prev + 1);
        const elapsedTime = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );

        console.log(
          `[Video Result] Polling attempt ${pollingCount + 1} (${elapsedTime}s elapsed)...`,
        );

        const response = await fetch(
          `/api/integrations/luma/check-status?jobId=${jobId}`,
        );

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();

        console.log("[Video Result] Status response:", {
          status: data.status,
          luma_state: data.luma_state,
          video_url: data.video_url,
        });

        if (data.status === "completed" && data.video_url) {
          console.log("[Video Result] ✓ Video ready!", data.video_url);

          setVideoUrl(data.video_url);
          setState("READY");

          // Clear polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        } else if (data.status === "unavailable") {
          console.error("[Video Result] Video unavailable");
          setState("ERROR");
          setError(data.failure_reason || "Video generation failed");

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }
      } catch (pollError) {
        console.error("[Video Result] Polling error:", pollError);
        // Don't fail on single poll error, keep trying
      }
    }, 5000); // Poll every 5 seconds
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `${reel.title || "reel"}.mp4`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share && videoUrl) {
      navigator
        .share({
          title: reel.title,
          text: `Check out my AI-generated reel: ${reel.title}`,
          url: videoUrl,
        })
        .catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(videoUrl || window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!reel) return null;

  const currentState = GENERATION_STATES[state];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#121212] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentState.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-[#111418] dark:text-white">
                {currentState.title}
              </h2>
              <p className="text-sm text-[#667085] dark:text-white/60">
                {currentState.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#111418] dark:text-white/60 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Progress Bar */}
          {state !== "READY" && state !== "ERROR" && (
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-1000 ease-out"
                  style={{ width: `${currentState.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#667085] dark:text-white/60 mt-2 text-center">
                {currentState.progress}% complete
              </p>
            </div>
          )}

          {/* Loading State */}
          {state !== "READY" && state !== "ERROR" && state !== "TIMEOUT" && (
            <div className="aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 size={48} className="animate-spin mx-auto mb-4" />
                <p className="text-sm opacity-90">
                  Polling: {pollingCount} checks
                </p>
              </div>
            </div>
          )}

          {/* Ready State - Video Player */}
          {state === "READY" && videoUrl && (
            <div className="space-y-4">
              <div className="aspect-[9/16] max-w-sm mx-auto bg-black rounded-2xl overflow-hidden">
                <video
                  key={videoUrl}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  loop
                  playsInline
                  onError={(e) => {
                    console.error("Video playback failed:", videoUrl);
                    setState("ERROR");
                    setError("Video playback failed");
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download MP4
                </button>
                <button
                  onClick={handleShare}
                  className="bg-white dark:bg-[#1E1E1E] border-2 border-purple-600 text-purple-600 dark:text-purple-400 py-4 px-6 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Create Another CTA */}
              <button
                onClick={() => {
                  onClose();
                  window.location.reload();
                }}
                className="w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-[#111418] dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-[#252525] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Create Another Reel
              </button>

              {/* View My Reels Button (Authenticated Users) */}
              {user && (
                <a
                  href="/my-reels"
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                >
                  View My Reels
                </a>
              )}

              {/* Sign In CTA (Guests Only) */}
              {!user && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-900 dark:text-purple-300 mb-3">
                    Sign in to save your reels and unlock unlimited generation
                  </p>
                  <a
                    href="/account/signup"
                    className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Create Free Account
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Timeout State */}
          {state === "TIMEOUT" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⏱️</div>
              <p className="text-[#667085] dark:text-white/60 mb-4">
                Your reel is taking longer than expected. This can happen during
                high traffic.
              </p>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-6">
                Check back in a few minutes or try creating a new reel.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onRetry}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Try Again
                </button>
                {user && (
                  <a
                    href="/my-reels"
                    className="flex-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-[#111418] dark:text-white py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-[#252525] transition-all text-center"
                  >
                    View My Reels
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Error State */}
          {state === "ERROR" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-semibold mb-2">
                {error || "Something went wrong"}
              </p>
              <p className="text-sm text-[#667085] dark:text-white/60 mb-6">
                Don't worry - you can try generating again
              </p>
              <button
                onClick={onRetry}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw size={18} />
                Retry Generation
              </button>
            </div>
          )}

          {/* Reel Details */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
            <h3 className="font-bold text-[#111418] dark:text-white mb-2">
              {reel.title}
            </h3>
            {reel.description && (
              <p className="text-sm text-[#667085] dark:text-white/60 mb-3">
                {reel.description}
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                {reel.mood}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-3 py-1 rounded-full font-medium">
                {reel.camera_style}
              </span>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-3 py-1 rounded-full font-medium">
                {reel.visual_style}
              </span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-3 py-1 rounded-full font-medium">
                {reel.duration}s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
