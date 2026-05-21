"use client";

import { useEffect } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * NOT VERIFIED PAGE - UNIVERSAL ACCESS MODE (DISABLED)
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This page is now a REDIRECT.
 * Platform verification is permanently disabled.
 *
 * All users are redirected to the dashboard.
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function NotVerifiedPage() {
  useEffect(() => {
    // UNIVERSAL ACCESS MODE: Redirect to dashboard
    window.location.href = "/dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-white/60">Redirecting...</p>
      </div>
    </div>
  );
}
