"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

// ✅ Tiny client island — handles the ONLY two interactive things on the homepage:
// 1. Mobile hamburger menu toggle
// 2. "See the Platform" smooth scroll button
// Everything else on the homepage is pure static HTML.

export function HomeScrollButton() {
  const handleScroll = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleScroll}
      aria-label="Scroll to features"
      style={{
        background: "none",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "50%",
        width: "44px",
        height: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "rgba(255,255,255,0.4)",
        animation: "bounceChevron 2s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes bounceChevron {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(5px); opacity: 0.8; }
        }
      `}</style>
      <ChevronDown className="w-5 h-5" />
    </button>
  );
}

export function HomeMobileMenu() {
  const [open, setOpen] = useState(false);

  // Close on route change / ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Hamburger button (mobile only) */}
      <button
        className="md:hidden p-2 text-white/70 hover:text-white"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="md:hidden absolute top-full left-0 right-0 px-6 py-4 flex flex-col gap-4 z-50"
          style={{
            backgroundColor: "#0F0F1A",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <a
            href="#features"
            onClick={() => {
              setOpen(false);
              setTimeout(() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
            className="text-white/70 hover:text-white font-medium py-2"
          >
            Features
          </a>
          <a
            href="/pricing"
            className="text-white/70 hover:text-white font-medium py-2"
          >
            Pricing
          </a>
          <a
            href="/showcase"
            className="text-white/70 hover:text-white font-medium py-2"
          >
            Showcase
          </a>
          <a
            href="/ai-studio"
            className="text-white/70 hover:text-white font-medium py-2"
          >
            AI Studio
          </a>
          <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
            <a
              href="/account/signin"
              className="text-center py-3 rounded-xl text-white/80 border border-white/20 font-semibold"
            >
              Log In
            </a>
            <a
              href="/account/signup"
              className="text-center py-3 rounded-xl text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
              }}
            >
              Sign Up Free
            </a>
          </div>
        </div>
      )}
    </>
  );
}

// Auth redirect — runs after page is visible, non-blocking
export function AuthRedirect() {
  useEffect(() => {
    fetch("/api/profiles/check")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.exists) window.location.href = "/opportunity-hub";
      })
      .catch(() => {});
  }, []);
  return null; // renders nothing
}
