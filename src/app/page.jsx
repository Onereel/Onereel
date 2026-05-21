// ✅ STATIC SERVER COMPONENT — no "use client", no hooks, no API calls
// Interactive bits live in HomeInteractions.jsx as client islands.

import {
  Play,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle,
  Star,
  Code,
  Video,
  Palette,
  Users,
} from "lucide-react";
import {
  HomeMobileMenu,
  HomeScrollButton,
  AuthRedirect,
} from "@/components/HomeInteractions";

export const dynamic = "force-static";

// ─── Platform logo SVG components ────────────────────────────────────────────
function YouTubeLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="#FF0000" />
      <path
        d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
        fill="#FF0000"
      />
      <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="white" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="#010101" />
      <path
        d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"
        fill="white"
      />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="url(#igGrad)" />
      <defs>
        <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="50%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
      />
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="16.5" cy="7.5" r="1" fill="white" />
    </svg>
  );
}

function TwitchLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="#9146FF" />
      <path
        d="M5 3L3 7v13h5v3h3l3-3h4l5-5V3H5zm15 12l-3 3h-4l-3 3v-3H5V5h15v10z"
        fill="white"
      />
      <rect x="10" y="7" width="2" height="5" rx="1" fill="white" />
      <rect x="14" y="7" width="2" height="5" rx="1" fill="white" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z"
        fill="white"
      />
    </svg>
  );
}

function TwitterXLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
    >
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="white"
      />
    </svg>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const platformLogos = [
  {
    id: "youtube",
    label: "YouTube",
    component: YouTubeLogo,
    color: "#FF0000",
    glow: "rgba(255,0,0,0.35)",
  },
  {
    id: "tiktok",
    label: "TikTok",
    component: TikTokLogo,
    color: "#010101",
    glow: "rgba(105,201,208,0.35)",
  },
  {
    id: "instagram",
    label: "Instagram",
    component: InstagramLogo,
    color: "#DD2A7B",
    glow: "rgba(221,42,123,0.35)",
  },
  {
    id: "twitch",
    label: "Twitch",
    component: TwitchLogo,
    color: "#9146FF",
    glow: "rgba(145,70,255,0.35)",
  },
  {
    id: "facebook",
    label: "Facebook",
    component: FacebookLogo,
    color: "#1877F2",
    glow: "rgba(24,119,242,0.35)",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    component: TwitterXLogo,
    color: "#000000",
    glow: "rgba(255,255,255,0.2)",
  },
];

const stats = [
  { value: "500+", label: "Creators & Editors" },
  { value: "10x", label: "Faster Hiring" },
  { value: "AI-Powered", label: "Content Tools" },
  { value: "Free", label: "To Get Started" },
];

const testimonials = [
  {
    quote:
      "Found an amazing editor for my gaming channel in two days. The collaboration workspace is seamless.",
    name: "Alex R.",
    role: "YouTube Creator",
    avatar: "AR",
  },
  {
    quote:
      "The AI hook generator alone saves me hours every week. My average view duration went up 40%.",
    name: "Maya S.",
    role: "Content Creator",
    avatar: "MS",
  },
  {
    quote:
      "Best platform for finding quality work in my niche. Got three long-term clients in my first month.",
    name: "Jordan K.",
    role: "Video Editor",
    avatar: "JK",
  },
];

const creatorBenefits = [
  { icon: "🎯", text: "Post a collab brief & get matched with top editors" },
  { icon: "⚡", text: "AI-generated viral hooks in seconds" },
  { icon: "🖼️", text: "Thumbnail concepts that drive 3x more clicks" },
  { icon: "📊", text: "Trend alerts before they peak" },
];

const editorBenefits = [
  { icon: "💼", text: "Browse exclusive creator opportunities daily" },
  { icon: "🤝", text: "Build a verified portfolio with real projects" },
  { icon: "💰", text: "Transparent rates & secure payments" },
  { icon: "🔗", text: "Real-time workspace with revision tools" },
];

// ─── Hook sample data ─────────────────────────────────────────────────────────
const hookSamples = [
  "I grew my channel from 0 to 100K in 6 months — here's the exact system I used (nobody talks about step 3)",
  "Stop editing your videos like this. The top 1% of creators do this instead...",
  "The YouTube algorithm changed everything this week. Here's what you need to know right now.",
];

// ─── Thumbnail sample data ────────────────────────────────────────────────────
const thumbnailConcepts = [
  {
    title: "Bold Split-Screen",
    desc: "Before/after layout with high contrast text. Use red accent on left, clean white on right.",
    badge: "🔥 Viral Formula",
    badgeColor: "#EF4444",
  },
  {
    title: "Emotion Close-Up",
    desc: "Creator face fills 70% of frame with shocked expression. Bold yellow text overlay at top.",
    badge: "⚡ High CTR",
    badgeColor: "#F59E0B",
  },
  {
    title: "Minimal Data Card",
    desc: "Dark background, glowing stat '10x growth' centered. Subtle gradient from purple to blue.",
    badge: "✨ Pro Style",
    badgeColor: "#8B5CF6",
  },
];

export default function HomePage() {
  return (
    <div
      style={{ backgroundColor: "#080812", color: "#FFFFFF" }}
      className="min-h-screen font-roboto overflow-x-hidden"
    >
      {/* ─── CSS ANIMATIONS ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(2deg); }
          50% { transform: translateY(-22px) rotate(-2deg); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(-8px) rotate(1deg); }
          50% { transform: translateY(10px) rotate(-3deg); }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(5px) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes float5 {
          0%, 100% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(-1deg); }
        }
        @keyframes float6 {
          0%, 100% { transform: translateY(-5px) rotate(-2deg); }
          50% { transform: translateY(12px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        .animated-gradient-text {
          background: linear-gradient(270deg, #A78BFA, #7C3AED, #EC4899, #C084FC, #A78BFA);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 5s ease infinite;
        }
        .logo-float-1 { animation: float1 7s ease-in-out infinite; }
        .logo-float-2 { animation: float2 8s ease-in-out infinite 0.5s; }
        .logo-float-3 { animation: float3 6.5s ease-in-out infinite 1s; }
        .logo-float-4 { animation: float4 9s ease-in-out infinite 1.5s; }
        .logo-float-5 { animation: float5 7.5s ease-in-out infinite 0.8s; }
        .logo-float-6 { animation: float6 8.5s ease-in-out infinite 0.3s; }
        .slide-up { animation: slideUp 0.8s ease forwards; }
        .glow-pulse { animation: pulseGlow 3s ease-in-out infinite; }
        .hook-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .thumbnail-card:hover { transform: translateY(-4px); transition: transform 0.3s ease; }
        .cta-btn:hover { transform: scale(1.04); }
        .cta-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      {/* ─── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav
        style={{
          backgroundColor: "rgba(8, 8, 18, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          <a href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
              }}
            >
              <Play className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              One Reel
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "/pricing" },
              { label: "Showcase", href: "/showcase" },
              { label: "AI Studio", href: "/ai-studio" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) => (e.target.style.color = "white")}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.55)")
                }
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/account/signin"
              className="text-sm font-semibold px-4 py-2 transition-colors rounded-lg"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Log In
            </a>
            <a
              href="/account/signup"
              className="cta-btn text-sm font-bold text-white px-5 py-2.5 rounded-xl"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}
            >
              Start Free
            </a>
          </div>

          <HomeMobileMenu />
        </div>
      </nav>

      <AuthRedirect />

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden"
        id="hero"
      >
        {/* Deep background orbs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="glow-pulse"
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "900px",
              height: "600px",
              background:
                "radial-gradient(ellipse at center, rgba(124,58,237,0.14) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "10%",
              width: "400px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "8%",
              width: "350px",
              height: "350px",
              background:
                "radial-gradient(circle, rgba(192,132,252,0.09) 0%, transparent 70%)",
            }}
          />
          {/* Grid pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* ── Floating Platform Logos ── */}
        {/* LEFT COLUMN */}
        <div
          className="logo-float-1 hidden md:flex"
          style={{
            position: "absolute",
            left: "6%",
            top: "28%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(255,0,0,0.45))",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,0,0,0.25)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <YouTubeLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            YouTube
          </span>
        </div>

        <div
          className="logo-float-3 hidden md:flex"
          style={{
            position: "absolute",
            left: "9%",
            top: "58%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(221,42,123,0.45))",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(221,42,123,0.25)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InstagramLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            Instagram
          </span>
        </div>

        <div
          className="logo-float-5 hidden lg:flex"
          style={{
            position: "absolute",
            left: "2%",
            top: "72%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(24,119,242,0.45))",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(24,119,242,0.25)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FacebookLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            Facebook
          </span>
        </div>

        {/* RIGHT COLUMN */}
        <div
          className="logo-float-2 hidden md:flex"
          style={{
            position: "absolute",
            right: "6%",
            top: "28%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(105,201,208,0.45))",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TikTokLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            TikTok
          </span>
        </div>

        <div
          className="logo-float-4 hidden md:flex"
          style={{
            position: "absolute",
            right: "9%",
            top: "58%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(145,70,255,0.5))",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(145,70,255,0.3)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TwitchLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            Twitch
          </span>
        </div>

        <div
          className="logo-float-6 hidden lg:flex"
          style={{
            position: "absolute",
            right: "2%",
            top: "72%",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            filter: "drop-shadow(0 0 16px rgba(255,255,255,0.2))",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TwitterXLogo />
          </div>
          <span
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: 600,
            }}
          >
            Twitter / X
          </span>
        </div>

        {/* ── MOBILE platform logos row ── */}
        <div className="flex md:hidden items-center justify-center gap-3 mb-8 flex-wrap">
          {platformLogos.map((p) => (
            <div
              key={p.id}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: `drop-shadow(0 0 8px ${p.glow})`,
              }}
            >
              <p.component />
            </div>
          ))}
        </div>

        {/* ── Hero content ── */}
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
            style={{
              border: "1px solid rgba(124,58,237,0.45)",
              backgroundColor: "rgba(124,58,237,0.1)",
              color: "#C084FC",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            The #1 Platform for Video Creators & Editors
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            Create Content For <br className="hidden sm:block" />
            <span className="animated-gradient-text">Every Platform</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.52)" }}
          >
            Connect with top video editors, generate viral hooks, create
            thumbnail concepts, and collaborate in real time — one platform for
            every creator.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/account/signup"
              className="cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                boxShadow:
                  "0 0 35px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/account/signup?role=editor"
              className="cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base"
              style={{
                border: "1px solid rgba(124,58,237,0.4)",
                backgroundColor: "rgba(124,58,237,0.08)",
                color: "#C084FC",
              }}
            >
              <Users className="w-5 h-5" />
              Join as Editor
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            {[
              "No credit card required",
              "Free plan available",
              "Join 500+ creators",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: "#8B5CF6" }} />
                <span
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <HomeScrollButton />
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          backgroundColor: "rgba(124,58,237,0.05)",
        }}
        className="py-10"
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-extrabold mb-1 animated-gradient-text">
                {stat.value}
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOOK GENERATOR SECTION ─────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{
                  border: "1px solid rgba(124,58,237,0.4)",
                  backgroundColor: "rgba(124,58,237,0.1)",
                  color: "#A78BFA",
                }}
              >
                <Zap className="w-3 h-3" />
                AI HOOK GENERATOR
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                10 Viral Hooks.{" "}
                <span className="animated-gradient-text">10 Seconds.</span>
              </h2>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.52)" }}
              >
                Our Claude AI-powered hook generator analyzes millions of viral
                videos to craft opening lines that stop the scroll, spike
                curiosity, and maximize watch time — tailored to your exact
                niche.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Trained on viral content patterns",
                  "Niche-specific language & tone",
                  "10 hook variations per generation",
                  "One-click copy to clipboard",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
                    >
                      <CheckCircle
                        className="w-3 h-3"
                        style={{ color: "#A78BFA" }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/ai-studio/hooks"
                className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.35)",
                }}
              >
                Try Hook Generator Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Right: Hook preview card */}
            <div
              className="rounded-2xl p-6 relative"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(124,58,237,0.2)",
                boxShadow: "0 0 60px rgba(124,58,237,0.08)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-3 mb-5 pb-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                  }}
                >
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    AI Hook Generator
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Powered by Claude AI
                  </div>
                </div>
                <div
                  className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: "rgba(124,58,237,0.2)",
                    color: "#A78BFA",
                  }}
                >
                  3/3 Generated
                </div>
              </div>

              {/* Input mock */}
              <div
                className="rounded-xl px-4 py-3 mb-5 text-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Topic: "How I grew my YouTube channel 10x in 90 days"
              </div>

              {/* Hooks */}
              <div className="space-y-3">
                {hookSamples.map((hook, i) => (
                  <div
                    key={i}
                    className="hook-card rounded-xl p-4 cursor-pointer"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "rgba(124,58,237,0.12)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        i === 0
                          ? "1px solid rgba(124,58,237,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold"
                        style={{
                          backgroundColor:
                            i === 0
                              ? "rgba(124,58,237,0.4)"
                              : "rgba(255,255,255,0.08)",
                          color: i === 0 ? "#C084FC" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{
                          color:
                            i === 0
                              ? "rgba(255,255,255,0.9)"
                              : "rgba(255,255,255,0.55)",
                        }}
                      >
                        {hook}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Glow */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "200px",
                  height: "40px",
                  background:
                    "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── THUMBNAIL SECTION ──────────────────────────────────────────── */}
      <section
        className="py-24 px-6"
        style={{
          backgroundColor: "rgba(124,58,237,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Thumbnail concepts preview */}
            <div className="order-2 md:order-1">
              <div className="space-y-4">
                {thumbnailConcepts.map((concept, i) => (
                  <div
                    key={i}
                    className="thumbnail-card rounded-2xl p-5 cursor-pointer"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-bold text-white text-sm">
                        {concept.title}
                      </h4>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `${concept.badgeColor}22`,
                          color: concept.badgeColor,
                        }}
                      >
                        {concept.badge}
                      </span>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      {concept.desc}
                    </p>
                  </div>
                ))}

                {/* Generate button mock */}
                <div
                  className="rounded-2xl p-4 flex items-center justify-center gap-3"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(79,70,229,0.15) 100%)",
                    border: "1px dashed rgba(124,58,237,0.4)",
                  }}
                >
                  <Palette className="w-5 h-5" style={{ color: "#A78BFA" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#C084FC" }}
                  >
                    + Generate 3 more concepts
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="order-1 md:order-2">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
                style={{
                  border: "1px solid rgba(192,132,252,0.4)",
                  backgroundColor: "rgba(192,132,252,0.08)",
                  color: "#C084FC",
                }}
              >
                <Palette className="w-3 h-3" />
                THUMBNAIL GENERATOR
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight"
                style={{ letterSpacing: "-0.02em" }}
              >
                Thumbnails That Drive{" "}
                <span className="animated-gradient-text">3x More Clicks</span>
              </h2>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.52)" }}
              >
                Get complete visual direction — composition, color palettes,
                typography, and mood — generated specifically for your niche and
                video topic. No design experience needed.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Full visual composition direction",
                  "Color palette & contrast guides",
                  "Typography placement tips",
                  "Niche-optimized CTR formulas",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(192,132,252,0.15)" }}
                    >
                      <CheckCircle
                        className="w-3 h-3"
                        style={{ color: "#C084FC" }}
                      />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="/ai-studio/thumbnails"
                className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                style={{
                  border: "1px solid rgba(192,132,252,0.4)",
                  backgroundColor: "rgba(192,132,252,0.08)",
                  color: "#C084FC",
                }}
              >
                Try Thumbnail Generator
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOR CREATORS & EDITORS SECTION ────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
              style={{
                border: "1px solid rgba(124,58,237,0.35)",
                backgroundColor: "rgba(124,58,237,0.08)",
                color: "#A78BFA",
              }}
            >
              <Users className="w-3 h-3" />
              BUILT FOR BOTH SIDES
            </div>
            <h2
              className="text-3xl md:text-5xl font-extrabold"
              style={{ letterSpacing: "-0.02em" }}
            >
              One Platform.{" "}
              <span className="animated-gradient-text">Two Superpowers.</span>
            </h2>
          </div>

          {/* Two columns */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* For Creators */}
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(79,70,229,0.08) 100%)",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                  style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
                >
                  🎬
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  For Creators
                </h3>
                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Build better content, faster. Find the editor who gets your
                  vision and use AI to supercharge every upload.
                </p>
                <ul className="space-y-3 mb-8">
                  {creatorBenefits.map((benefit) => (
                    <li key={benefit.text} className="flex items-center gap-3">
                      <span className="text-lg">{benefit.icon}</span>
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/account/signup?role=creator"
                  className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                    boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                  }}
                >
                  Join as Creator
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* For Editors */}
            <div
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(192,132,252,0.1) 0%, rgba(124,58,237,0.06) 100%)",
                border: "1px solid rgba(192,132,252,0.2)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-2xl"
                  style={{ backgroundColor: "rgba(192,132,252,0.15)" }}
                >
                  ✂️
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">
                  For Editors
                </h3>
                <p
                  className="mb-6 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Showcase your skills, land clients who value your craft, and
                  build a sustainable income doing work you love.
                </p>
                <ul className="space-y-3 mb-8">
                  {editorBenefits.map((benefit) => (
                    <li key={benefit.text} className="flex items-center gap-3">
                      <span className="text-lg">{benefit.icon}</span>
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/account/signup?role=editor"
                  className="cta-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                  style={{
                    border: "1px solid rgba(192,132,252,0.4)",
                    backgroundColor: "rgba(192,132,252,0.08)",
                    color: "#C084FC",
                  }}
                >
                  Join as Editor
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ───────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{
          backgroundColor: "rgba(124,58,237,0.03)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="w-5 h-5"
                style={{ color: "#FBBF24" }}
                fill="#FBBF24"
              />
            ))}
          </div>
          <h2
            className="text-2xl md:text-4xl font-extrabold mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Join{" "}
            <span className="animated-gradient-text">
              500+ creators and editors
            </span>{" "}
            already on One Reel
          </h2>
          <p
            className="mb-12 max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Across YouTube, TikTok, Instagram, Twitch and more — creators and
            editors are growing together on One Reel.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-1 mb-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-3 h-3"
                      style={{ color: "#FBBF24" }}
                      fill="#FBBF24"
                    />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
                      color: "white",
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(79,70,229,0.14) 100%)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          {/* Inner glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.25) 0%, transparent 65%)",
            }}
          />
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
              style={{
                border: "1px solid rgba(192,132,252,0.4)",
                backgroundColor: "rgba(192,132,252,0.08)",
                color: "#C084FC",
              }}
            >
              <TrendingUp className="w-3 h-3" />
              Ready to grow?
            </div>
            <h2
              className="text-3xl md:text-5xl font-extrabold mb-4 text-white"
              style={{ letterSpacing: "-0.02em" }}
            >
              Start creating for{" "}
              <span className="animated-gradient-text">every platform</span>{" "}
              today
            </h2>
            <p
              className="mb-10 max-w-xl mx-auto"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Join One Reel free — connect with your first collaborator,
              generate viral hooks, and grow your channel in under 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/account/signup"
                className="cta-btn inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                  boxShadow: "0 0 35px rgba(124,58,237,0.5)",
                }}
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/account/signup?role=editor"
                className="cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base"
                style={{
                  border: "1px solid rgba(192,132,252,0.4)",
                  backgroundColor: "rgba(192,132,252,0.06)",
                  color: "#C084FC",
                }}
              >
                <Users className="w-5 h-5" />
                Join as Editor
              </a>
            </div>
            <p
              className="mt-5 text-xs"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              No credit card required · Free plan available · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="py-12 px-6"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <a href="/" className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                  }}
                >
                  <Play className="w-4 h-4 text-white" fill="white" />
                </div>
                <span className="text-xl font-bold text-white">One Reel</span>
              </a>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                The AI-powered platform where video creators and editors
                connect, collaborate, and grow across every platform.
              </p>
              {/* Platform logos mini row */}
              <div className="flex items-center gap-2">
                {platformLogos.map((p) => (
                  <div
                    key={p.id}
                    title={p.label}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "7px",
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: "18px", height: "18px" }}>
                      <p.component />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">
                  Platform
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Showcase", href: "/showcase" },
                    { label: "Pricing", href: "/pricing" },
                    { label: "AI Studio", href: "/ai-studio" },
                    { label: "Marketplace", href: "/marketplace" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={(e) => (e.target.style.color = "white")}
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(255,255,255,0.4)")
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">
                  Account
                </h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Sign Up Free", href: "/account/signup" },
                    { label: "Log In", href: "/account/signin" },
                    { label: "Dashboard", href: "/dashboard" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={(e) => (e.target.style.color = "white")}
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(255,255,255,0.4)")
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                    { label: "Content Policy", href: "/content-policy" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      onMouseEnter={(e) => (e.target.style.color = "white")}
                      onMouseLeave={(e) =>
                        (e.target.style.color = "rgba(255,255,255,0.4)")
                      }
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
              © 2026 One Reel. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
              Made for creators, by creators. 🎬
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
