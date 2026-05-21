"use client";

import { useState, useEffect, useRef } from "react";
import useUser from "@/utils/useUser";
import {
  ArrowLeft,
  Trash2,
  Eye,
  Heart,
  LogIn,
  Loader2,
  Download,
  Share2,
  Check,
} from "lucide-react";

export default function MyReelsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const pollingIntervalRef = useRef(null);
  const isPollingActiveRef = useRef(false);
  const pollingInitCountRef = useRef(0);

  useEffect(() => {
    if (user) {
      fetchReels();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchReels();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (isPollingActiveRef.current) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      pollingInitCountRef.current += 1;
      if (pollingInitCountRef.current > 1) {
        console.warn(
          `[My Reels] ⚠️ POLLING REGRESSION: Initialized ${pollingInitCountRef.current} times`,
        );
        console.warn(
          "[My Reels] This should only happen once. Check dependencies!",
        );
      }
    }

    console.log("[My Reels] Initializing video polling service...");
    isPollingActiveRef.current = true;

    pollingIntervalRef.current = setInterval(async () => {
      setReels((currentReels) => {
        const processingReels = currentReels.filter(
          (reel) =>
            // Check all possible "processing" signals — DB column OR metadata field
            (reel.generation_status === "processing" ||
              reel.metadata?.videoStatus === "processing" ||
              reel.video_status === "processing") &&
            // Need a Luma job ID to poll
            (reel.metadata?.videoJobId || reel.video_job_id),
        );

        if (processingReels.length === 0) {
          return currentReels;
        }

        console.log(`[My Reels] Polling ${processingReels.length} video(s)...`);

        processingReels.forEach((reel) => {
          const jobId = reel.metadata?.videoJobId || reel.video_job_id;

          fetch("/api/reels/poll-luma-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reelId: reel.id, jobId }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (
                data.updated &&
                data.status === "completed" &&
                data.video_url
              ) {
                console.log(`[My Reels] ✓ Video completed: ${reel.id}`, {
                  videoUrl: data.video_url,
                });

                setReels((prevReels) => {
                  const targetReel = prevReels.find((r) => r.id === reel.id);

                  if (targetReel?.video_url === data.video_url) {
                    console.log(
                      `[My Reels] Skipping duplicate update for ${reel.id}`,
                    );
                    return prevReels;
                  }

                  console.log(
                    `[My Reels] Updating reel ${reel.id} with real video`,
                  );
                  return prevReels.map((r) =>
                    r.id === reel.id
                      ? {
                          ...r,
                          video_url: data.video_url,
                          generation_status: "completed",
                          generation_progress: 100,
                          metadata: {
                            ...r.metadata,
                            videoStatus: "completed",
                          },
                        }
                      : r,
                  );
                });
              } else if (data.status === "unavailable") {
                console.log(`[My Reels] Video unavailable: ${reel.id}`);

                setReels((prevReels) =>
                  prevReels.map((r) =>
                    r.id === reel.id
                      ? {
                          ...r,
                          metadata: {
                            ...r.metadata,
                            videoStatus: "unavailable",
                          },
                        }
                      : r,
                  ),
                );
              }
            })
            .catch((error) => {
              console.error(
                `[My Reels] Polling error for reel ${reel.id}:`,
                error,
              );
            });
        });

        return currentReels;
      });
    }, 10000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        isPollingActiveRef.current = false;
        pollingInitCountRef.current = 0;
        console.log("[My Reels] Polling stopped (cleanup)");
      }
    };
  }, [user]);

  const fetchReels = async () => {
    try {
      setLoading(true);

      // ✅ Use /api/profiles/check — returns current user's own profile directly.
      // The old approach fetched ALL profiles and scanned for user_id match,
      // which is slow and may miss the profile if it's not in the first page.
      const profileResponse = await fetch("/api/profiles/check");
      if (!profileResponse.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileResponse.json();
      const myProfile = profileData.profile;
      setProfile(myProfile);

      if (myProfile) {
        const response = await fetch(`/api/reels?profileId=${myProfile.id}`);
        if (!response.ok) throw new Error("Failed to fetch reels");
        const data = await response.json();
        setReels(data.reels || []);

        // ✅ Check BOTH generation_status (DB column) AND metadata.videoStatus
        const processing = (data.reels || []).filter(
          (r) =>
            r.generation_status === "processing" ||
            r.metadata?.videoStatus === "processing",
        );
        if (processing.length > 0) {
          console.log(
            `[My Reels] Found ${processing.length} processing video(s):`,
            processing.map((r) => ({
              id: r.id,
              generation_status: r.generation_status,
              jobId: r.metadata?.videoJobId,
            })),
          );
        }
      }
    } catch (error) {
      console.error("Error fetching reels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reelId) => {
    if (!confirm("Are you sure you want to delete this reel?")) return;

    try {
      const response = await fetch(`/api/reels/${reelId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete reel");

      setReels(reels.filter((r) => r.id !== reelId));
    } catch (error) {
      console.error("Error deleting reel:", error);
      alert("Failed to delete reel");
    }
  };

  const handleShare = (reel) => {
    const url = reel.video_url;
    if (!url) return;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedId(reel.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        // fallback
        const el = document.createElement("textarea");
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopiedId(reel.id);
        setTimeout(() => setCopiedId(null), 2000);
      });
  };

  const isCloudinaryUrl = (url) => url && url.includes("cloudinary.com");
  const isRealVideo = (url) => {
    if (!url) return false;
    return (
      url.includes(".mp4") ||
      url.includes("cloudinary.com") ||
      url.includes("lumalabs") ||
      url.includes("luma") ||
      (!url.includes("placeholder") && !url.includes("data:image"))
    );
  };

  if (!userLoading && !user) {
    return (
      <div className="min-h-screen bg-[#F8F9FB]">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#111418] mb-4">
              Sign in to View Your Reels
            </h2>
            <p className="text-[#667085] mb-8 text-lg">
              Access all your created content and manage your creative library.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/account/signin"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Sign In
              </a>
              <a
                href="/account/signup"
                className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1DA1F2] mx-auto"></div>
          <p className="mt-4 text-[#667085]">Loading your reels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 text-[#667085] hover:text-[#111418] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </a>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#111418]">My Reels</h1>
              <p className="text-[#667085] mt-1">
                {reels.length} {reels.length === 1 ? "reel" : "reels"} created
              </p>
            </div>
            <a
              href="/create-reel"
              className="bg-[#1DA1F2] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#1a8cd8] transition-colors"
            >
              Create New Reel
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {reels.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-[#111418] mb-2">
              No reels yet
            </h3>
            <p className="text-[#667085] mb-6">
              Create your first AI-generated reel to get started
            </p>
            <a
              href="/create-reel"
              className="inline-block bg-[#1DA1F2] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1a8cd8] transition-colors"
            >
              Create Reel
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reels.map((reel) => {
              const videoStatus = reel.metadata?.videoStatus || "completed";
              // ✅ Check DB column first, metadata as fallback
              const isProcessing =
                reel.generation_status === "processing" ||
                videoStatus === "processing";
              const isFailed =
                reel.generation_status === "failed" ||
                videoStatus === "unavailable";

              const displayUrl = reel.video_url || reel.thumbnail_url;
              const hasRealVideo =
                !isFailed &&
                !isProcessing &&
                isRealVideo(reel.video_url) &&
                !reel.video_url?.includes("placeholder");

              return (
                <div
                  key={reel.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[9/16] bg-gradient-to-br from-[#1DA1F2] to-[#1a8cd8]">
                    {hasRealVideo ? (
                      <video
                        key={displayUrl}
                        src={displayUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={(e) => {
                          console.error("Video failed to load:", displayUrl);
                          e.target.style.display = "none";
                        }}
                      />
                    ) : isFailed ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 gap-3">
                        <div className="text-4xl">⚠️</div>
                        <p className="text-white/60 text-sm text-center px-4">
                          Generation failed
                        </p>
                      </div>
                    ) : isProcessing ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                        <Loader2
                          size={36}
                          className="text-white animate-spin"
                        />
                        <p className="text-white/80 text-sm font-medium">
                          Rendering video...
                        </p>
                      </div>
                    ) : (
                      <img
                        src={displayUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/1024x1792/1a1a1a/8B5CF6?text=Preview+Unavailable";
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

                    {/* Status badge */}
                    {isProcessing && (
                      <div className="absolute top-3 right-3">
                        <div className="backdrop-blur-sm bg-amber-500/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5">
                          <Loader2 size={12} className="animate-spin" />
                          Rendering...
                        </div>
                      </div>
                    )}
                    {isFailed && (
                      <div className="absolute top-3 right-3">
                        <div className="backdrop-blur-sm bg-red-500/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                          ✗ Failed
                        </div>
                      </div>
                    )}
                    {hasRealVideo && (
                      <div className="absolute top-3 right-3">
                        <div className="backdrop-blur-sm bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                          ✓ Ready
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg mb-2">{reel.title}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye size={16} />
                          {reel.view_count || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart size={16} />
                          {reel.like_count || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {isProcessing && (
                      <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-xs text-amber-800 font-medium">
                          🎬 Video rendering in progress (2-5 min) — this page
                          auto-updates
                        </p>
                      </div>
                    )}
                    {isFailed && (
                      <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-xs text-red-800 font-medium">
                          ❌ Generation failed. Create a new reel to try again.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="bg-[#E8F5FE] text-[#1DA1F2] text-xs px-2 py-1 rounded-full font-medium">
                        {reel.mood}
                      </span>
                      <span className="bg-[#F3E8FF] text-[#9333EA] text-xs px-2 py-1 rounded-full font-medium">
                        {reel.camera_style}
                      </span>
                      <span className="bg-[#FEF3E8] text-[#F59E0B] text-xs px-2 py-1 rounded-full font-medium">
                        {reel.duration}s
                      </span>
                    </div>

                    {reel.description && (
                      <p className="text-sm text-[#667085] mb-3 line-clamp-2">
                        {reel.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      {isFailed ? (
                        <a
                          href="/create-reel"
                          className="flex-1 text-center py-2 rounded-lg font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                        >
                          Try Again
                        </a>
                      ) : (
                        <a
                          href={displayUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={
                            hasRealVideo ? `${reel.title}.mp4` : undefined
                          }
                          className={`flex-1 text-center py-2 rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-1.5 ${
                            isProcessing || !hasRealVideo
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-[#1DA1F2] text-white hover:bg-[#1a8cd8]"
                          }`}
                          onClick={(e) => {
                            if (isProcessing || !hasRealVideo)
                              e.preventDefault();
                          }}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Processing
                            </>
                          ) : hasRealVideo ? (
                            <>
                              <Download size={16} />
                              Download MP4
                            </>
                          ) : (
                            "No video"
                          )}
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(reel.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleShare(reel)}
                        disabled={!hasRealVideo}
                        title={
                          copiedId === reel.id ? "Copied!" : "Copy video URL"
                        }
                        className={`p-2 rounded-lg transition-colors ${
                          copiedId === reel.id
                            ? "bg-green-100 text-green-600"
                            : !hasRealVideo
                              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        {copiedId === reel.id ? (
                          <Check size={16} />
                        ) : (
                          <Share2 size={16} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-[#667085] mt-3">
                      Created {new Date(reel.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
