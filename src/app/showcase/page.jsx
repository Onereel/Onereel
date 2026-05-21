"use client";

import { useState, useEffect } from "react";

export default function ShowcasePage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShowcaseReels();
  }, []);

  async function loadShowcaseReels() {
    try {
      const res = await fetch("/api/showcase/reels");
      if (res.ok) {
        const data = await res.json();
        setReels(data.reels || []);
      }
    } catch (error) {
      console.error("Failed to load showcase:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Made with One Reel ✨
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Creators worldwide are making professional vertical reels in
            seconds. No editing. No prompts. Just vibes.
          </p>
          <a
            href="/account/signup"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Create Your Own Reel
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {reels.length}+
              </div>
              <div className="text-gray-400">Reels Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">
                &lt;60s
              </div>
              <div className="text-gray-400">Average Creation Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-gray-400">AI-Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl">Loading showcase...</div>
          </div>
        ) : reels.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">
              No showcase reels yet. Be the first!
            </div>
            <a
              href="/create-reel"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Create Now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-purple-500 transition cursor-pointer group"
                onClick={() => (window.location.href = `/reel/${reel.id}`)}
              >
                <div className="aspect-[9/16] bg-zinc-800 relative overflow-hidden">
                  <img
                    src={reel.thumbnail_url}
                    alt={reel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold mb-1">{reel.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span>{reel.mood}</span>
                      <span>•</span>
                      <span>{reel.duration}s</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>👁 {reel.view_count || 0}</span>
                      <span>❤️ {reel.like_count || 0}</span>
                    </div>
                    <div className="text-xs text-purple-400 font-semibold">
                      {reel.camera_style}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to create studio-quality reels?
          </h2>
          <p className="text-gray-400 mb-8">
            Join creators making professional content in seconds.
          </p>
          <a
            href="/account/signup"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
          >
            Get Started Free
          </a>
          <div className="mt-4 text-sm text-gray-500">
            3 free reels per day • No credit card required
          </div>
        </div>
      </div>
    </div>
  );
}
