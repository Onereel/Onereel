"use client";

import { useState } from "react";
import { Download, Share2, Copy, Check, Sparkles, Zap } from "lucide-react";

export default function DemoReelOutput() {
  const [copied, setCopied] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);

  const reelUrl =
    "https://raw.createusercontent.com/c84011f0-1eee-4ca1-8c4d-90a7a07818b7/";
  const caption = "Sometimes you have to let go to rise.";
  const hashtags = "#creator #cinematic #ai";
  const fullCaption = `${caption}\n\n${hashtags}`;

  function handleDownload() {
    const link = document.createElement("a");
    link.href = reelUrl;
    link.download = "one-reel-cinematic.png";
    link.click();
  }

  function handleCopyCaption() {
    navigator.clipboard.writeText(fullCaption);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "My One Reel",
          text: caption,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile-first vertical layout */}
      <div className="max-w-[500px] mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-black via-black/95 to-transparent p-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-2xl font-bold">
              Your Reel is Ready 🎬
            </h1>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check size={16} />
              <span>Generated</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Cinematic. Clean. Ready to download.
          </p>
        </div>

        {/* The Reel - Fullscreen Vertical Preview */}
        <div className="relative bg-black">
          <div className="aspect-[9/16] relative overflow-hidden">
            <img
              src={reelUrl}
              alt="Cinematic reel"
              className="w-full h-full object-cover"
            />

            {/* First 1.5s Indicator */}
            <div className="absolute top-4 left-4 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-semibold">
                ✓ Scroll-stopping
              </span>
            </div>
          </div>
        </div>

        {/* Package - Caption + Hashtags */}
        <div className="bg-gradient-to-b from-zinc-900 to-black p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">
                Ready-to-Post Caption
              </h3>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 text-purple-400 text-xs hover:text-purple-300 transition-colors"
              >
                {captionCopied ? <Check size={14} /> : <Copy size={14} />}
                {captionCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="bg-black/50 border border-zinc-800 rounded-lg p-4">
              <p className="text-white text-base mb-3 leading-relaxed">
                {caption}
              </p>
              <p className="text-purple-400 text-sm">{hashtags}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download size={18} />
              <span>Download</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-zinc-800 text-white font-semibold py-3 rounded-lg hover:bg-zinc-700 transition-colors border border-zinc-700"
            >
              <Share2 size={18} />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Reel Stats */}
        <div className="bg-black border-t border-zinc-900 p-6">
          <h3 className="text-white font-semibold mb-4 text-sm">
            Why This Works
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-white font-semibold text-sm mb-1">60s</div>
              <div className="text-gray-400 text-xs">Total creation time</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-white font-semibold text-sm mb-1">
                Premium
              </div>
              <div className="text-gray-400 text-xs">Cinematic quality</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-white font-semibold text-sm mb-1">
                Optimized
              </div>
              <div className="text-gray-400 text-xs">For engagement</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-white font-semibold text-sm mb-1">9:16</div>
              <div className="text-gray-400 text-xs">Perfect vertical</div>
            </div>
          </div>
        </div>

        {/* Next Action - Create Another */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-t border-purple-500/20 p-6">
          <div className="text-center mb-4">
            <h3 className="text-white font-bold text-lg mb-2">What's Next?</h3>
            <p className="text-gray-300 text-sm">
              You've created 1 reel today. 2 more before hitting limits.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/create-reel"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/50"
            >
              <Sparkles size={20} />
              <span>Create Another Reel</span>
            </a>

            <a
              href="/pricing"
              className="flex items-center justify-center gap-2 bg-black border-2 border-purple-500/50 text-white font-semibold py-3 rounded-lg hover:bg-purple-950/30 transition-all"
            >
              <Zap size={18} />
              <span>Upgrade to Pro - Unlimited Reels</span>
            </a>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-black p-6 border-t border-zinc-900">
          <div className="text-center">
            <div className="text-gray-500 text-xs mb-3">
              Join creators already scaling
            </div>
            <div className="flex items-center justify-center gap-6 text-white/60">
              <div className="text-center">
                <div className="font-bold text-lg">1,247</div>
                <div className="text-xs">Reels created</div>
              </div>
              <div className="w-px h-10 bg-zinc-800"></div>
              <div className="text-center">
                <div className="font-bold text-lg">4.8★</div>
                <div className="text-xs">Avg rating</div>
              </div>
              <div className="w-px h-10 bg-zinc-800"></div>
              <div className="text-center">
                <div className="font-bold text-lg">82%</div>
                <div className="text-xs">Share rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Testimonial */}
        <div className="bg-zinc-950 p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">
                  Sarah Chen
                </div>
                <div className="text-gray-400 text-xs">
                  @sarahcreates · 47k followers
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm italic leading-relaxed">
              "I went from idea to posted reel in under a minute. Got 120k views
              and 2 brand inquiries from that one reel. This is insane."
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="text-yellow-400 text-xs">★★★★★</div>
              <div className="text-gray-500 text-xs">Posted 3 hours ago</div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-black p-6 text-center border-t border-zinc-900">
          <p className="text-gray-500 text-xs mb-4">
            Share your reel and tag us @onereelai for a chance to be featured
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/"
              className="text-gray-400 text-xs hover:text-white transition-colors"
            >
              Home
            </a>
            <span className="text-gray-700">·</span>
            <a
              href="/showcase"
              className="text-gray-400 text-xs hover:text-white transition-colors"
            >
              Showcase
            </a>
            <span className="text-gray-700">·</span>
            <a
              href="/pricing"
              className="text-gray-400 text-xs hover:text-white transition-colors"
            >
              Pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
