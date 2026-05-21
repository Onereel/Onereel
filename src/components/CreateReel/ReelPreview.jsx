import { Loader2, Play } from "lucide-react";

export function ReelPreview({ reel }) {
  const videoStatus = reel.video_status || "unknown";
  const thumbnailStatus = reel.thumbnail_status || "unknown";
  const videoUrl = reel.video_url;
  const thumbnailUrl = reel.thumbnail_url;

  let previewUrl = null;
  let statusMessage = "";
  let statusColor = "bg-green-500/80";
  let showPlayIcon = false;

  if (videoStatus === "completed" && videoUrl) {
    previewUrl = videoUrl;
    statusMessage = "✓ Video Generated";
    statusColor = "bg-green-500/80";
  } else if (videoStatus === "processing") {
    previewUrl =
      videoUrl ||
      thumbnailUrl ||
      `https://via.placeholder.com/1024x1792/1a1a1a/8B5CF6?text=${encodeURIComponent("Rendering...")}`;
    statusMessage = "⏳ Rendering Video...";
    statusColor = "bg-amber-500/80";
    showPlayIcon = true;
  } else if (videoStatus === "unavailable") {
    previewUrl =
      videoUrl ||
      thumbnailUrl ||
      `https://via.placeholder.com/1024x1792/1a1a1a/8B5CF6?text=${encodeURIComponent("Video Unavailable")}`;
    statusMessage = "📸 Preview Only";
    statusColor = "bg-blue-500/80";
  } else if (thumbnailStatus === "completed" && thumbnailUrl) {
    previewUrl = thumbnailUrl;
    statusMessage = "🖼️ Concept Preview";
    statusColor = "bg-purple-500/80";
  } else {
    previewUrl = `https://via.placeholder.com/1024x1792/1a1a1a/ffffff?text=${encodeURIComponent("Reel Created")}`;
    statusMessage = "✓ Configuration Saved";
    statusColor = "bg-gray-500/80";
  }

  return (
    <div className="mb-6 relative">
      <img
        src={previewUrl}
        alt={reel.title || "Generated reel"}
        className="w-full rounded-xl shadow-lg"
        onError={(e) => {
          console.error("Image failed to load:", previewUrl);
          e.target.src =
            "https://via.placeholder.com/1024x1792/1a1a1a/ffffff?text=Preview+Unavailable";
        }}
      />

      <div className="absolute top-3 right-3">
        <div
          className={`backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold ${statusColor}`}
        >
          {statusMessage}
        </div>
      </div>

      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/60 rounded-full p-6">
            {videoStatus === "processing" ? (
              <Loader2 size={48} className="text-white animate-spin" />
            ) : (
              <Play size={48} className="text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {videoStatus === "processing" && (
        <div className="absolute bottom-3 left-3 right-3">
          <div className="backdrop-blur-sm bg-black/60 text-white text-sm px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>
                Video rendering in progress... This may take a few minutes.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
