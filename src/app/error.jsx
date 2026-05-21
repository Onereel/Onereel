"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("[Global Error Handler]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Application Error
        </h2>
        <p className="text-gray-400 mb-6">
          Something went wrong while loading this page. Our team has been
          notified.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-black/50 rounded-lg p-4 mb-6 text-left overflow-auto max-h-48">
            <pre className="text-xs text-red-400 whitespace-pre-wrap">
              {error?.message || error?.toString() || "Unknown error"}
            </pre>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 px-6 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-colors flex items-center justify-center"
          >
            Go Home
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="/api/health"
              target="_blank"
              className="text-[#1DA1F2] hover:underline"
            >
              Check system status
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
