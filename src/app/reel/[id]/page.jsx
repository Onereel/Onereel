"use client";

import { useState, useEffect, useRef } from "react";
import {
  Heart,
  Eye,
  Download,
  Share2,
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from "lucide-react";

export default function ReelViewerPage({ params }) {
  const [reel, setReel] = useState(null);
  const [allReels, setAllReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    fetchReel();
  }, [params.id]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [muted, isPlaying]);

  async function fetchReel() {
    try {
      const res = await fetch(`/api/reels/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setReel(data.reel);

        // Fetch all reels for swipe navigation
        const allRes = await fetch("/api/reels");
        if (allRes.ok) {
          const allData = await allRes.json();
          const reels = allData.reels || [];
          setAllReels(reels);
          const idx = reels.findIndex((r) => r.id === data.reel.id);
          if (idx >= 0) setCurrentIndex(idx);
        }
      }
    } catch (error) {
      console.error("Error fetching reel:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike() {
    if (!reel) return;
    try {
      const action = liked ? "unlike" : "like";
      const res = await fetch(`/api/reels/${reel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setLiked(!liked);
        setReel((prev) => ({
          ...prev,
          like_count: liked ? prev.like_count - 1 : prev.like_count + 1,
        }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  function handleDownload() {
    if (!reel?.video_url) return;
    const link = document.createElement("a");
    link.href = reel.video_url;
    link.download = `${reel.title.replace(/[^a-z0-9]/gi, "-")}.png`;
    link.click();
  }

  function handleShare() {
    if (navigator.share && reel) {
      navigator
        .share({
          title: reel.title,
          text: `Check out this AI-generated reel: ${reel.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  }

  function navigateReel(direction) {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < allReels.length) {
      window.location.href = `/reel/${allReels[newIndex].id}`;
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") navigateReel(-1);
      if (e.key === "ArrowDown") navigateReel(1);
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.key === "m") setMuted((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, allReels]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading reel...</p>
        </div>
      </div>
    );
  }

  if (!reel) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Reel not found</h2>
          <a href="/my-reels" className="text-[#1DA1F2] hover:underline">
            Back to My Reels
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Mobile-first vertical reel viewer */}
      <div className="relative h-full w-full max-w-[500px] mx-auto">
        {/* Video Container */}
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          <img
            src={reel.video_url}
            alt={reel.title}
            className="w-full h-full object-cover"
          />

          {/* Watermark (if present) */}
          {reel.has_watermark && (
            <a
              href="/"
              className="absolute bottom-24 left-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-white text-sm font-semibold hover:bg-black/80 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Made with One Reel
            </a>
          )}

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="w-10 h-10 text-black ml-1" fill="black" />
              </div>
            </div>
          )}
        </div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={() => setMuted((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-4">
          {/* Creator Avatar */}
          <a
            href={`/profile/${reel.profile_id}`}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {reel.name?.charAt(0) || "U"}
          </a>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className="flex flex-col items-center gap-1 text-white"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <Heart
                size={24}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
            </div>
            <span className="text-xs font-semibold">
              {reel.like_count || 0}
            </span>
          </button>

          {/* View Count */}
          <div className="flex flex-col items-center gap-1 text-white">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Eye size={24} />
            </div>
            <span className="text-xs font-semibold">
              {reel.view_count || 0}
            </span>
          </div>

          {/* Download */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Download size={24} />
          </button>

          {/* Share */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <Share2 size={24} />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <a
            href={`/profile/${reel.profile_id}`}
            className="text-white font-bold text-lg mb-1 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            @{reel.x_username || "creator"}
          </a>
          <h2 className="text-white font-bold text-xl mb-2">{reel.title}</h2>
          {reel.description && (
            <p className="text-white/90 text-sm mb-3">{reel.description}</p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {reel.mood}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {reel.camera_style}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {reel.visual_style}
            </span>
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {reel.duration}s
            </span>
          </div>
        </div>

        {/* Swipe Navigation Hints */}
        {currentIndex > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none">
            <div className="text-white/40 text-sm font-semibold">
              ↑ Previous
            </div>
          </div>
        )}
        {currentIndex < allReels.length - 1 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[40%] pointer-events-none">
            <div className="text-white/40 text-sm font-semibold">↓ Next</div>
          </div>
        )}
      </div>
    </div>
  );
}
