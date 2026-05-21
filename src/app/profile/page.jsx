"use client";

import { useEffect } from "react";

export default function ProfileRedirect() {
  useEffect(() => {
    window.location.href = "/create-reel";
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#667085] dark:text-white/60">
          Taking you to the reel generator...
        </p>
      </div>
    </div>
  );
}
