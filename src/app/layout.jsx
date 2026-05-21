import Providers from "@/components/Providers";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import ConditionalFooter from "@/components/ConditionalFooter";
import { Suspense } from "react";

export const metadata = {
  title: "One Reel - Where Talent Meets Opportunity",
  description:
    "Join creative professionals building the future. Find opportunities, showcase your work, collaborate with teams, and grow your career on One Reel.",
  keywords:
    "creative marketplace, talent network, collaboration platform, freelance opportunities, creative professionals, portfolio showcase, team collaboration, gig marketplace",
  openGraph: {
    title: "One Reel - Where Talent Meets Opportunity",
    description:
      "The platform where creative professionals collaborate, get hired, and build their careers through proven work.",
    type: "website",
    siteName: "One Reel",
  },
  robots: { index: true, follow: true },
};

// Shown if the entire provider stack crashes — must have ZERO external deps
function RootFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0F1A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎬</div>
        <h1
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          One Reel
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
          Something went wrong loading the app. Please try refreshing.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#7C3AED",
            color: "#fff",
            borderRadius: 12,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Refresh Page
        </a>
      </div>
    </div>
  );
}

function NavFallback() {
  return (
    <nav
      style={{
        background: "#0F0F1A",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <a
        href="/"
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          textDecoration: "none",
        }}
      >
        One Reel
      </a>
      <a
        href="/account/signin"
        style={{ color: "#A78BFA", fontSize: 14, textDecoration: "none" }}
      >
        Sign In
      </a>
    </nav>
  );
}

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning prevents minor server/client attr mismatches
    // (e.g. browser extensions adding class/data attrs) from causing full-page blanks
    <div
      className="font-roboto min-h-screen flex flex-col"
      suppressHydrationWarning
    >
      {/* ✅ OUTER boundary — catches Providers/QueryClient crashes */}
      <ErrorBoundary fallback={<RootFallback />}>
        <Providers>
          {/* Navigation gets its own Suspense + ErrorBoundary — can NEVER blank the page */}
          <ErrorBoundary fallback={<NavFallback />}>
            <Suspense fallback={<NavFallback />}>
              <Navigation />
            </Suspense>
          </ErrorBoundary>

          {/* Main content boundary */}
          <ErrorBoundary>
            <main className="flex-1">{children}</main>
          </ErrorBoundary>

          {/* Footer gets its own boundary */}
          <ErrorBoundary fallback={null}>
            <ConditionalFooter />
          </ErrorBoundary>
        </Providers>
      </ErrorBoundary>
    </div>
  );
}
