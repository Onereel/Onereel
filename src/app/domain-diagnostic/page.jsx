"use client";

import { useState, useEffect } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DOMAIN DIAGNOSTIC PAGE
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This page performs a comprehensive check of the domain configuration
 * to identify why the app works on created.app but not on onereel.online
 *
 * It checks:
 * 1. Runtime request host vs AUTH_URL
 * 2. Cookie domain configuration
 * 3. Session persistence
 * 4. Environment variable mismatch
 *
 * Access: /domain-diagnostic
 * ═══════════════════════════════════════════════════════════════════════
 */
export default function DomainDiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState(null);
  const [sessionDebug, setSessionDebug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function runDiagnostic() {
      try {
        setLoading(true);
        setError(null);

        // Fetch runtime diagnostic
        const runtimeResponse = await fetch("/api/runtime-diagnostic", {
          credentials: "include",
        });

        if (!runtimeResponse.ok) {
          throw new Error(`Runtime check failed: ${runtimeResponse.status}`);
        }

        const runtimeData = await runtimeResponse.json();
        setDiagnostic(runtimeData);

        // Fetch session diagnostic
        const sessionResponse = await fetch("/api/auth/debug-session", {
          credentials: "include",
        });

        if (!sessionResponse.ok) {
          throw new Error(`Session check failed: ${sessionResponse.status}`);
        }

        const sessionData = await sessionResponse.json();
        setSessionDebug(sessionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    runDiagnostic();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div
            className="inline-block w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
            style={{
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <style jsx global>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p className="text-gray-600 text-lg">Running domain diagnostic...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-red-900 mb-3">
              Diagnostic Failed
            </h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { request, environment, validation, recommendations, status } =
    diagnostic || {};
  const { auth, cookies, diagnosis: sessionDiagnosis } = sessionDebug || {};

  // Determine overall health
  const isCritical = status === "CRITICAL_ISSUES";
  const hasErrors = status === "ERRORS_FOUND";
  const isHealthy = status === "HEALTHY";

  const statusColor = isCritical
    ? "bg-red-600"
    : hasErrors
      ? "bg-orange-500"
      : isHealthy
        ? "bg-green-600"
        : "bg-yellow-500";

  const statusText = isCritical
    ? "CRITICAL ISSUES DETECTED"
    : hasErrors
      ? "ERRORS FOUND"
      : isHealthy
        ? "HEALTHY"
        : "WARNINGS";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Domain Configuration Diagnostic
            </h1>
            <div
              className={`${statusColor} text-white px-6 py-3 rounded-xl font-bold text-sm`}
            >
              {statusText}
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Comprehensive check of domain and authentication configuration
          </p>
        </div>

        {/* Current Domain vs Expected Domain */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🌐 Domain Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Domain */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                CURRENT DOMAIN
              </h3>
              <div className="font-mono text-2xl font-bold text-blue-900 break-all">
                {request?.effectiveUrl || "Unknown"}
              </div>
              <p className="text-sm text-blue-700 mt-2">
                Where the app is currently running
              </p>
            </div>

            {/* Expected Domain (AUTH_URL) */}
            <div
              className={`${validation?.domainMismatch ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"} border-2 rounded-xl p-6`}
            >
              <h3
                className={`text-sm font-semibold ${validation?.domainMismatch ? "text-red-900" : "text-green-900"} mb-3`}
              >
                EXPECTED DOMAIN (AUTH_URL)
              </h3>
              <div
                className={`font-mono text-2xl font-bold ${validation?.domainMismatch ? "text-red-900" : "text-green-900"} break-all`}
              >
                {environment?.AUTH_URL || "NOT_SET"}
              </div>
              <p
                className={`text-sm ${validation?.domainMismatch ? "text-red-700" : "text-green-700"} mt-2`}
              >
                {validation?.domainMismatch
                  ? "❌ MISMATCH DETECTED"
                  : "✅ Matches current domain"}
              </p>
            </div>
          </div>

          {/* Mismatch Alert */}
          {validation?.domainMismatch && (
            <div className="mt-6 bg-red-100 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 text-4xl mr-4">⚠️</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-red-900 mb-2">
                    DOMAIN MISMATCH DETECTED
                  </h4>
                  <p className="text-red-800 mb-4">
                    This is the PRIMARY cause of authentication issues on custom
                    domains. The app is running on{" "}
                    <span className="font-mono font-bold">
                      {request?.effectiveUrl}
                    </span>{" "}
                    but AUTH_URL is set to{" "}
                    <span className="font-mono font-bold">
                      {environment?.AUTH_URL}
                    </span>
                    .
                  </p>
                  <div className="bg-red-200 rounded-lg p-4">
                    <p className="font-bold text-red-900 mb-2">
                      🔧 FIX REQUIRED:
                    </p>
                    <p className="text-red-900 font-mono text-sm">
                      AUTH_URL={request?.effectiveUrl}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📋 Recommendations
            </h2>

            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                const severityColors = {
                  CRITICAL: "bg-red-50 border-red-300 text-red-900",
                  ERROR: "bg-orange-50 border-orange-300 text-orange-900",
                  WARNING: "bg-yellow-50 border-yellow-300 text-yellow-900",
                };

                const severityEmoji = {
                  CRITICAL: "🚨",
                  ERROR: "❌",
                  WARNING: "⚠️",
                };

                return (
                  <div
                    key={idx}
                    className={`border-2 rounded-xl p-6 ${severityColors[rec.severity]}`}
                  >
                    <div className="flex items-start">
                      <div className="text-3xl mr-4">
                        {severityEmoji[rec.severity]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">{rec.issue}</h4>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/50">
                            {rec.severity}
                          </span>
                        </div>
                        <p className="mb-3 opacity-90">{rec.impact}</p>
                        <div className="bg-white/50 rounded-lg p-4 font-mono text-sm">
                          <p className="font-bold mb-1">Fix:</p>
                          <p>{rec.fix}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Session Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            🔐 Session Status
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Authentication Status
              </h3>
              <div
                className={`text-4xl font-bold ${auth?.user ? "text-green-600" : "text-red-600"}`}
              >
                {auth?.user ? "✅ Authenticated" : "❌ Not Authenticated"}
              </div>
              {auth?.user && (
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">User ID:</span>{" "}
                    <span className="font-mono">{auth.user.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>{" "}
                    <span className="font-mono">{auth.user.email}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">
                Cookie Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Total Cookies:</span>
                  <span className="font-bold">{cookies?.count || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Session Token:</span>
                  <span
                    className={`font-bold ${cookies?.hasSessionToken ? "text-green-600" : "text-red-600"}`}
                  >
                    {cookies?.hasSessionToken ? "✅ Found" : "❌ Missing"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Diagnosis:</span>
                  <span className="font-bold text-purple-600">
                    {sessionDiagnosis}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ⚙️ Environment Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">AUTH_URL:</span>
              <span
                className={`font-bold ${environment?.AUTH_URL === "NOT_SET" ? "text-red-600" : "text-gray-900"}`}
              >
                {environment?.AUTH_URL}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">NEXTAUTH_URL:</span>
              <span className="font-bold text-gray-900">
                {environment?.NEXTAUTH_URL}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">HTTPS Enabled:</span>
              <span
                className={`font-bold ${validation?.authUrlIsHttps ? "text-green-600" : "text-red-600"}`}
              >
                {validation?.authUrlIsHttps ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Onereel Domain:</span>
              <span
                className={`font-bold ${validation?.authUrlIsOnereel ? "text-green-600" : "text-red-600"}`}
              >
                {validation?.authUrlIsOnereel ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">AUTH_SECRET:</span>
              <span
                className={`font-bold ${environment?.AUTH_SECRET_EXISTS && environment?.AUTH_SECRET_LENGTH >= 32 ? "text-green-600" : "text-red-600"}`}
              >
                {environment?.AUTH_SECRET_EXISTS
                  ? `✅ Set (${environment.AUTH_SECRET_LENGTH} chars)`
                  : "❌ Not set"}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Database:</span>
              <span
                className={`font-bold ${environment?.DATABASE_URL_EXISTS ? "text-green-600" : "text-red-600"}`}
              >
                {environment?.DATABASE_URL_EXISTS
                  ? "✅ Connected"
                  : "❌ Not set"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Actions</h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                typeof window !== "undefined" && window.location.reload()
              }
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              🔄 Refresh Diagnostic
            </button>

            {!auth?.user && (
              <a
                href="/account/signin"
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                🔐 Sign In
              </a>
            )}

            {auth?.user && (
              <a
                href="/opportunity-hub"
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                ✅ Go to App
              </a>
            )}

            <a
              href="/debug-auth"
              className="px-8 py-4 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors"
            >
              🔍 Advanced Debug
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Diagnostic run at {diagnostic?.timestamp}</p>
          <p className="mt-2">
            For support, provide this diagnostic URL to the development team
          </p>
        </div>
      </div>
    </div>
  );
}
