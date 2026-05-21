/**
 * ═══════════════════════════════════════════════════════════════════════
 * RUNTIME DIAGNOSTIC ENDPOINT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This endpoint returns the ACTUAL runtime values for:
 * - Request host
 * - Request origin
 * - Request protocol
 * - Environment variables (AUTH_URL, NEXTAUTH_URL, etc.)
 * - Cookie configuration
 *
 * Use this to verify that the app is using the correct domain configuration
 * when deployed to the custom domain vs platform domain.
 *
 * Access: GET /api/runtime-diagnostic
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  const headers = request.headers;

  // ✅ Get all request headers
  const host = headers.get("host");
  const origin = headers.get("origin");
  const referer = headers.get("referer");
  const forwardedProto = headers.get("x-forwarded-proto");
  const forwardedHost = headers.get("x-forwarded-host");
  const forwardedFor = headers.get("x-forwarded-for");
  const userAgent = headers.get("user-agent");

  // ✅ Determine effective URL
  const effectiveProtocol = forwardedProto || "https";
  const effectiveHost = forwardedHost || host;
  const effectiveUrl = `${effectiveProtocol}://${effectiveHost}`;

  // ✅ Get environment variables
  const AUTH_URL = process.env.AUTH_URL || "NOT_SET";
  const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "NOT_SET";
  const AUTH_SECRET_EXISTS = !!process.env.AUTH_SECRET;
  const AUTH_SECRET_LENGTH = process.env.AUTH_SECRET?.length || 0;
  const DATABASE_URL_EXISTS = !!process.env.DATABASE_URL;
  const NODE_ENV = process.env.NODE_ENV;

  // ✅ Determine cookie configuration based on AUTH_URL
  const isHttps = AUTH_URL.startsWith("https");
  const isOnereelDomain = AUTH_URL.includes("onereel.online");

  const cookieConfig = {
    useSecureCookies: isHttps,
    sessionTokenName: isHttps
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    csrfTokenName: isHttps
      ? "__Host-next-auth.csrf-token"
      : "next-auth.csrf-token",
    callbackUrlName: isHttps
      ? "__Secure-next-auth.callback-url"
      : "next-auth.callback-url",
    domain: isOnereelDomain ? ".onereel.online" : undefined,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
  };

  // ✅ Check if there's a domain mismatch
  const domainMismatch =
    effectiveHost &&
    AUTH_URL !== "NOT_SET" &&
    !AUTH_URL.includes(effectiveHost) &&
    !effectiveHost.includes("localhost");

  // ✅ Build diagnostic report
  const diagnostic = {
    timestamp: new Date().toISOString(),

    // Request information
    request: {
      host,
      origin,
      referer,
      forwardedProto,
      forwardedHost,
      forwardedFor,
      effectiveUrl,
      userAgent: userAgent?.substring(0, 100) + "...",
    },

    // Environment configuration
    environment: {
      AUTH_URL,
      NEXTAUTH_URL,
      AUTH_SECRET_EXISTS,
      AUTH_SECRET_LENGTH,
      DATABASE_URL_EXISTS,
      NODE_ENV,
    },

    // Cookie configuration (derived from AUTH_URL)
    cookieConfig,

    // Domain validation
    validation: {
      authUrlSet: AUTH_URL !== "NOT_SET",
      authUrlIsHttps: isHttps,
      authUrlIsOnereel: isOnereelDomain,
      domainMismatch,
      mismatchDetails: domainMismatch
        ? {
            expected: AUTH_URL,
            actual: effectiveUrl,
            reason: "AUTH_URL does not match the current request host",
          }
        : null,
    },

    // Recommendations
    recommendations: [],
  };

  // ✅ Add recommendations based on findings
  if (AUTH_URL === "NOT_SET") {
    diagnostic.recommendations.push({
      severity: "CRITICAL",
      issue: "AUTH_URL environment variable is not set",
      fix: "Set AUTH_URL=https://onereel.online in your environment variables",
      impact: "Authentication will not work correctly",
    });
  }

  if (AUTH_URL !== "NOT_SET" && !isHttps) {
    diagnostic.recommendations.push({
      severity: "WARNING",
      issue: `AUTH_URL is set to "${AUTH_URL}" which is not HTTPS`,
      fix: "Update AUTH_URL to use https://",
      impact: "Cookies will not be secure",
    });
  }

  if (domainMismatch) {
    diagnostic.recommendations.push({
      severity: "ERROR",
      issue: `Domain mismatch: AUTH_URL is "${AUTH_URL}" but app is running on "${effectiveUrl}"`,
      fix: `Update AUTH_URL to match the deployment domain: ${effectiveUrl}`,
      impact:
        "Session cookies will not work correctly due to domain mismatch. Users will be redirected in a loop.",
    });
  }

  if (!isOnereelDomain && effectiveHost?.includes("onereel.online")) {
    diagnostic.recommendations.push({
      severity: "ERROR",
      issue: `App is running on onereel.online but AUTH_URL is "${AUTH_URL}"`,
      fix: "Update AUTH_URL=https://onereel.online",
      impact: "Authentication on custom domain will fail",
    });
  }

  if (!AUTH_SECRET_EXISTS || AUTH_SECRET_LENGTH < 32) {
    diagnostic.recommendations.push({
      severity: "CRITICAL",
      issue: "AUTH_SECRET is missing or too short",
      fix: "Set AUTH_SECRET to a secure random string of at least 32 characters",
      impact: "Session encryption is weak or missing",
    });
  }

  // ✅ Overall status
  diagnostic.status =
    diagnostic.recommendations.filter((r) => r.severity === "CRITICAL").length >
    0
      ? "CRITICAL_ISSUES"
      : diagnostic.recommendations.filter((r) => r.severity === "ERROR")
            .length > 0
        ? "ERRORS_FOUND"
        : diagnostic.recommendations.length > 0
          ? "WARNINGS_PRESENT"
          : "HEALTHY";

  console.log("[Runtime Diagnostic] ═══════════════════════════════════════");
  console.log("[Runtime Diagnostic] Status:", diagnostic.status);
  console.log("[Runtime Diagnostic] Effective URL:", effectiveUrl);
  console.log("[Runtime Diagnostic] AUTH_URL:", AUTH_URL);
  console.log("[Runtime Diagnostic] Domain Mismatch:", domainMismatch);
  console.log(
    "[Runtime Diagnostic] Recommendations:",
    diagnostic.recommendations.length,
  );
  console.log("[Runtime Diagnostic] ═══════════════════════════════════════");

  return Response.json(diagnostic, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

export const dynamic = "force-dynamic";
