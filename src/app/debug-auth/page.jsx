"use client";

import { useState, useEffect } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AUTH DIAGNOSTIC PAGE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Use this page to diagnose authentication and session issues
 * Visit: /debug-auth
 *
 * This page shows:
 * - Environment configuration
 * - Cookie status
 * - Session status
 * - Profile status
 * - Recommended fixes
 * ═══════════════════════════════════════════════════════════════════════
 */
export default function DebugAuthPage() {
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/debug-session", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setDebugData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDebugInfo();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading diagnostics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">
            Error Loading Diagnostics
          </h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const { environment, cookies, auth, expectedCookieNames, diagnosis } =
    debugData || {};

  const getDiagnosisColor = () => {
    switch (diagnosis) {
      case "AUTHENTICATED":
        return "bg-green-50 border-green-200 text-green-900";
      case "COOKIE_EXISTS_BUT_NO_SESSION":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "SESSION_ERROR":
      case "NO_SESSION_NO_COOKIE":
        return "bg-red-50 border-red-200 text-red-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (!environment?.AUTH_URL || environment.AUTH_URL === "NOT_SET") {
      recommendations.push({
        severity: "critical",
        message: "AUTH_URL environment variable is not set",
        fix: "Set AUTH_URL=https://onereel.online in your environment variables",
      });
    } else if (!environment.AUTH_URL_INCLUDES_ONEREEL) {
      recommendations.push({
        severity: "warning",
        message: `AUTH_URL is set to "${environment.AUTH_URL}" but doesn't include "onereel.online"`,
        fix: "Update AUTH_URL to https://onereel.online",
      });
    }

    if (
      !environment?.AUTH_SECRET_EXISTS ||
      environment.AUTH_SECRET_LENGTH < 32
    ) {
      recommendations.push({
        severity: "critical",
        message: "AUTH_SECRET is missing or too short",
        fix: "Set a secure AUTH_SECRET with at least 32 characters",
      });
    }

    if (diagnosis === "COOKIE_EXISTS_BUT_NO_SESSION") {
      recommendations.push({
        severity: "error",
        message: "Session cookie exists but session lookup is failing",
        fix: "This may indicate a database connection issue or cookie domain mismatch. Check DATABASE_URL and AUTH_URL settings.",
      });
    }

    if (diagnosis === "NO_SESSION_NO_COOKIE" && cookies?.count > 0) {
      recommendations.push({
        severity: "warning",
        message: "Cookies are being set but session cookie is missing",
        fix:
          "Check that cookie names match expected format. Session cookie should be: " +
          expectedCookieNames?.sessionToken,
      });
    }

    if (diagnosis === "AUTHENTICATED" && auth?.user) {
      recommendations.push({
        severity: "success",
        message: "✅ Authentication is working correctly!",
        fix: "User is authenticated. Session and cookies are properly configured.",
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authentication Diagnostic Tool
          </h1>
          <p className="text-gray-600">
            Use this page to troubleshoot authentication and session issues
          </p>
        </div>

        {/* Diagnosis */}
        <div className={`rounded-xl p-6 border ${getDiagnosisColor()}`}>
          <h2 className="text-xl font-bold mb-2">Diagnosis: {diagnosis}</h2>
          {diagnosis === "AUTHENTICATED" && (
            <p>✅ User is successfully authenticated</p>
          )}
          {diagnosis === "COOKIE_EXISTS_BUT_NO_SESSION" && (
            <p>⚠️ Session cookie is set but session lookup is failing</p>
          )}
          {diagnosis === "SESSION_ERROR" && (
            <p>❌ Error occurred while checking session</p>
          )}
          {diagnosis === "NO_SESSION_NO_COOKIE" && (
            <p>❌ No session cookie found - user is not authenticated</p>
          )}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    rec.severity === "critical"
                      ? "bg-red-50 border-red-200"
                      : rec.severity === "error"
                        ? "bg-orange-50 border-orange-200"
                        : rec.severity === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-green-50 border-green-200"
                  }`}
                >
                  <p className="font-semibold mb-1">{rec.message}</p>
                  <p className="text-sm opacity-80">{rec.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environment */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Environment Configuration
          </h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">AUTH_URL</span>
              <span
                className={
                  environment?.AUTH_URL === "NOT_SET"
                    ? "text-red-600 font-bold"
                    : "text-gray-900"
                }
              >
                {environment?.AUTH_URL || "NOT_SET"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">HTTPS Enabled</span>
              <span className="text-gray-900">
                {environment?.AUTH_URL_STARTS_HTTPS ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">
                Domain Matches onereel.online
              </span>
              <span className="text-gray-900">
                {environment?.AUTH_URL_INCLUDES_ONEREEL ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">AUTH_SECRET</span>
              <span className="text-gray-900">
                {environment?.AUTH_SECRET_EXISTS
                  ? `✅ Set (${environment.AUTH_SECRET_LENGTH} chars)`
                  : "❌ Not set"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">NODE_ENV</span>
              <span className="text-gray-900">
                {environment?.NODE_ENV || "unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Cookie Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-gray-600">Total Cookies Found</span>
              <span className="text-2xl font-bold text-gray-900">
                {cookies?.count || 0}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Session Token Cookie</span>
                <span
                  className={
                    cookies?.hasSessionToken
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {cookies?.hasSessionToken ? "✅ Found" : "❌ Missing"}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                Expected name: {expectedCookieNames?.sessionToken}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">CSRF Token Cookie</span>
                <span
                  className={
                    cookies?.hasCsrfToken
                      ? "text-green-600 font-semibold"
                      : "text-gray-400"
                  }
                >
                  {cookies?.hasCsrfToken ? "✅ Found" : "Not found"}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                Expected name: {expectedCookieNames?.csrfToken}
              </div>
            </div>

            {cookies?.raw && (
              <details className="mt-4">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                  Show raw cookie header
                </summary>
                <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-x-auto">
                  {cookies.raw}
                </pre>
              </details>
            )}
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Authentication Status
          </h2>
          {auth?.user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                <span>✅</span>
                <span>User is authenticated</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm text-gray-900">
                    {auth.user.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{auth.user.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Name</span>
                  <span className="text-gray-900">
                    {auth.user.name || "Not set"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600 font-semibold text-lg">
                <span>❌</span>
                <span>Not authenticated</span>
              </div>
              {auth?.sessionError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-700">
                    Error: {auth.sessionError}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Refresh Diagnostics
            </button>
            {!auth?.user && (
              <a
                href="/account/signin"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Sign In
              </a>
            )}
            {auth?.user && (
              <a
                href="/opportunity-hub"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Go to App
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
