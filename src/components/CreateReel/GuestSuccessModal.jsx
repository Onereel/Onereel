import { CheckCircle, Loader2, Info } from "lucide-react";
import { ReelPreview } from "./ReelPreview";

export function GuestSuccessModal({
  reel,
  outcome,
  warnings,
  user,
  freeTrialMessage,
  onClose,
}) {
  if (!reel) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            {reel.video_status === "completed" ? (
              <CheckCircle size={32} className="text-white" />
            ) : reel.video_status === "processing" ? (
              <Loader2 size={32} className="text-white animate-spin" />
            ) : (
              <Info size={32} className="text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-[#111418] mb-2">
            {reel.video_status === "completed"
              ? "🎉 Reel Created Successfully!"
              : reel.video_status === "processing"
                ? "⏳ Reel Rendering..."
                : "✓ Reel Created"}
          </h3>
          <p className="text-[#667085]">
            {user
              ? reel.video_status === "processing"
                ? "Your video is rendering in the background"
                : "Your reel has been generated"
              : "Try signing up to save your work and unlock full features"}
          </p>

          {/* ✅ FREE TRIAL MESSAGE */}
          {!user && freeTrialMessage && (
            <p className="mt-2 text-purple-600 font-semibold">
              {freeTrialMessage}
            </p>
          )}
        </div>

        {reel.video_status === "processing" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Loader2
                size={20}
                className="text-amber-600 flex-shrink-0 mt-0.5 animate-spin"
              />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Video Rendering in Progress
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Your video is being generated. This typically takes 2-5
                  minutes.
                  {!user &&
                    " Sign up to track progress and receive notifications."}
                </p>
              </div>
            </div>
          </div>
        )}

        {reel.video_status === "unavailable" && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Video Provider Temporarily Unavailable
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Your reel configuration has been saved with a preview image.
                  Video generation will retry automatically.
                </p>
              </div>
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              ℹ️ Generation Notes:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              {warnings.map((warning, i) => (
                <li key={i}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        <ReelPreview reel={reel} />

        <div className="mb-6 bg-[#F8F9FB] rounded-xl p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#667085]">Title:</span>
              <span className="font-semibold text-[#111418]">{reel.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Mood:</span>
              <span className="font-semibold text-[#111418] capitalize">
                {reel.mood}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Style:</span>
              <span className="font-semibold text-[#111418] capitalize">
                {reel.visual_style}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Duration:</span>
              <span className="font-semibold text-[#111418]">
                {reel.duration}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Video Status:</span>
              <span
                className={`font-semibold ${
                  reel.video_status === "completed"
                    ? "text-green-600"
                    : reel.video_status === "processing"
                      ? "text-amber-600"
                      : "text-gray-600"
                }`}
              >
                {reel.video_status || "unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#667085]">Outcome:</span>
              <span
                className={`font-semibold ${
                  outcome === "SUCCESS" ? "text-green-600" : "text-amber-600"
                }`}
              >
                {outcome}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={reel.video_url || reel.thumbnail_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#F8F9FB] text-[#111418] py-3 rounded-xl font-semibold text-center hover:bg-[#E5E7EB] transition-colors border border-[#E5E7EB]"
          >
            View Full Size
          </a>

          {user ? (
            <button
              onClick={onClose}
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold text-center hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Another
            </button>
          ) : (
            <a
              href="/account/signup"
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold text-center hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Create Free Account to Save
            </a>
          )}

          <button
            onClick={onClose}
            className="block w-full bg-[#F8F9FB] text-[#667085] py-3 rounded-xl font-semibold hover:bg-[#E5E7EB] transition-colors"
          >
            {user ? "Close" : "Create Another (Guest)"}
          </button>
        </div>
      </div>
    </div>
  );
}
