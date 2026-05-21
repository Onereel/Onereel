"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

export function MobilePostButton() {
  const [checking, setChecking] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    if (checking) return;
    setChecking(true);

    try {
      // Check if user has profile
      const response = await fetch("/api/profiles/check");
      const data = await response.json();

      if (!data.exists || data.needsSetup) {
        // Redirect to profile setup
        window.location.href = `/profile/setup?returnTo=${encodeURIComponent("/collaborations/create")}&action=${encodeURIComponent("post a collaboration")}`;
      } else {
        // Has profile, go to create page
        window.location.href = "/collaborations/create";
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      // Proceed anyway if check fails
      window.location.href = "/collaborations/create";
    } finally {
      setChecking(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={checking}
      className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all z-40 flex items-center justify-center disabled:opacity-50"
    >
      <Plus size={28} strokeWidth={3} />
    </button>
  );
}
