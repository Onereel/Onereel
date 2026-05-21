import { auth } from "@/auth";

/**
 * COMPREHENSIVE SESSION DEBUG ENDPOINT
 * Use this to diagnose auth/session/cookie issues
 *
 * GET /api/auth/debug-session
 */
export async function GET(request) {
  const timestamp = new Date().toISOString();

  console.log("[Debug Session] ═══════════════════════════════════════");
  console.log("[Debug Session] Request received at:", timestamp);
  console.log("[Debug Session] Request URL:", request.url);

  // Get cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean);

  console.log("[Debug Session] Cookie header:", cookieHeader.substring(0, 200));
  console.log("[Debug Session] Number of cookies:", cookies.length);

  // Try to get session
  let session = null;
  let sessionError = null;

  try {
    session = await auth();
    console.log(
      "[Debug Session] Session result:",
      session
        ? {
            hasUser: !!session.user,
            userId: session.user?.id,
            userEmail: session.user?.email,
          }
        : "NO SESSION",
    );
  } catch (error) {
    sessionError = error.message;
    console.error("[Debug Session] Session error:", error);
  }

  console.log("[Debug Session] ═══════════════════════════════════════");

  const debugInfo = {
    timestamp,
    request: {
      url: request.url,
      method: request.method,
      host: request.headers.get("host"),
      origin: request.headers.get("origin"),
      referer: request.headers.get("referer"),
    },
    environment: {
      AUTH_URL: process.env.AUTH_URL || "NOT_SET",
      AUTH_URL_STARTS_HTTPS: process.env.AUTH_URL?.startsWith("https") || false,
      AUTH_URL_INCLUDES_ONEREEL:
        process.env.AUTH_URL?.includes("onereel.online") || false,
      NODE_ENV: process.env.NODE_ENV,
      AUTH_SECRET_EXISTS: !!process.env.AUTH_SECRET,
      AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length || 0,
    },
    cookies: {
      raw:
        cookieHeader.substring(0, 500) +
        (cookieHeader.length > 500 ? "..." : ""),
      count: cookies.length,
      hasSessionToken: cookieHeader.includes("session-token"),
      hasCallbackUrl: cookieHeader.includes("callback-url"),
      hasCsrfToken: cookieHeader.includes("csrf-token"),
    },
    auth: {
      sessionExists: !!session,
      sessionError: sessionError,
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
          }
        : null,
    },
    expectedCookieNames: {
      sessionToken: process.env.AUTH_URL?.startsWith("https")
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      callbackUrl: process.env.AUTH_URL?.startsWith("https")
        ? "__Secure-next-auth.callback-url"
        : "next-auth.callback-url",
      csrfToken: process.env.AUTH_URL?.startsWith("https")
        ? "__Host-next-auth.csrf-token"
        : "next-auth.csrf-token",
    },
    diagnosis: sessionError
      ? "SESSION_ERROR"
      : session?.user
        ? "AUTHENTICATED"
        : cookieHeader.includes("session-token")
          ? "COOKIE_EXISTS_BUT_NO_SESSION"
          : "NO_SESSION_NO_COOKIE",
  };

  return Response.json(debugInfo, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

export const dynamic = "force-dynamic";
