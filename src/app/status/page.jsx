"use client";

import { useEffect, useState } from "react";

export default function StatusPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch deployment verification instead of just health
    fetch("/api/verify-deployment")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setHealth({ status: "error", error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-2xl font-semibold">
            Checking deployment status...
          </div>
        </div>
      </div>
    );
  }

  const isHealthy = health?.overall_status === "HEALTHY";
  const hasFixes = health?.required_fixes && health.required_fixes.length > 0;

  return (
    <div
      className={`min-h-screen ${isHealthy ? "bg-gradient-to-br from-green-900 via-blue-900 to-purple-900" : "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"} p-6`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="text-9xl mb-6">{isHealthy ? "✅" : "❌"}</div>
          <h1 className="text-6xl font-bold text-white mb-4">
            {isHealthy ? "Deployment Ready" : "Configuration Required"}
          </h1>
          <p className="text-2xl text-gray-200 mb-2">
            Status:{" "}
            <span
              className={`font-bold ${isHealthy ? "text-green-300" : "text-red-300"}`}
            >
              {health?.overall_status}
            </span>
          </p>
          <p className="text-lg text-gray-400">
            Last checked: {new Date(health?.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Current vs Expected Values */}
        {health?.current_values && health?.expected_values && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-4">🔍</span>
              Current vs Expected Configuration
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Values */}
              <div>
                <h3 className="text-xl font-bold text-red-300 mb-4">
                  ❌ Current Values
                </h3>
                <div className="space-y-3">
                  {Object.entries(health.current_values).map(([key, value]) => (
                    <div key={key} className="bg-black/30 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 font-mono mb-1">
                        {key}
                      </div>
                      <div className="text-white font-mono break-all">
                        {typeof value === "boolean"
                          ? value
                            ? "✅ Set"
                            : "❌ Not Set"
                          : value.toString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Values */}
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-4">
                  ✅ Expected Values
                </h3>
                <div className="space-y-3">
                  {Object.entries(health.expected_values).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="bg-black/30 p-4 rounded-lg border-2 border-green-500/50"
                      >
                        <div className="text-sm text-gray-400 font-mono mb-1">
                          {key}
                        </div>
                        <div className="text-green-300 font-mono break-all font-bold">
                          {value}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Required Fixes */}
        {hasFixes && (
          <div className="bg-red-500/20 backdrop-blur-lg border-4 border-red-500 rounded-2xl p-8 mb-8">
            <h2 className="text-4xl font-bold text-white mb-6 flex items-center">
              <span className="text-5xl mr-4">🚨</span>
              REQUIRED FIXES
            </h2>

            <div className="space-y-6">
              {health.required_fixes.map((fix, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 p-6 rounded-xl border border-red-500/50"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-red-300 mb-2">
                        {fix.variable}
                      </h3>
                      <p className="text-white text-lg mb-4">{fix.action}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2">
                            Current:
                          </div>
                          <div className="bg-red-900/50 p-3 rounded-lg">
                            <code className="text-red-300 font-mono">
                              {fix.current}
                            </code>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 mb-2">
                            Required:
                          </div>
                          <div className="bg-green-900/50 p-3 rounded-lg">
                            <code className="text-green-300 font-mono font-bold">
                              {fix.required}
                            </code>
                          </div>
                        </div>
                      </div>

                      {fix.suggestion && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">
                            Suggested Value:
                          </div>
                          <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-500/50 flex items-center gap-3">
                            <code className="text-purple-300 font-mono text-sm flex-1 break-all">
                              {fix.suggestion}
                            </code>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(fix.suggestion);
                                alert("Copied to clipboard!");
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0 font-semibold"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Copy All Config */}
            <div className="mt-8 bg-black/60 p-6 rounded-xl border border-purple-500/50">
              <h3 className="text-2xl font-bold text-purple-300 mb-4">
                📋 Complete Configuration
              </h3>
              <p className="text-gray-300 mb-4">
                Copy this entire configuration and set it in your Anything
                platform environment variables:
              </p>
              <div className="bg-gray-900 p-4 rounded-lg mb-4">
                <code className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                  {`AUTH_URL=https://onereel.online
AUTH_SECRET=8k9mP2nQ5rT8wX3yZ6aB4cD7fG1hJ4kL9mN2pQ5sT8vW3xY6zA9bC2dE5fH8jK1n`}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    "AUTH_URL=https://onereel.online\nAUTH_SECRET=8k9mP2nQ5rT8wX3yZ6aB4cD7fG1hJ4kL9mN2pQ5sT8vW3xY6zA9bC2dE5fH8jK1n",
                  );
                  alert(
                    "Configuration copied to clipboard!\n\nNext steps:\n1. Go to Anything platform settings\n2. Paste these environment variables\n3. Save and redeploy\n4. Return to this page to verify",
                  );
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-colors font-bold text-lg"
              >
                📋 Copy Complete Configuration
              </button>
            </div>
          </div>
        )}

        {/* Validation Checks */}
        {health?.checks && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
              <span className="text-4xl mr-4">✓</span>
              Validation Checks
            </h2>
            <div className="space-y-3">
              {Object.entries(health.checks).map(([name, check]) => (
                <div
                  key={name}
                  className={`p-4 rounded-lg border-2 ${check.status === "PASS" ? "bg-green-900/30 border-green-500/50" : check.status === "FAIL" ? "bg-red-900/30 border-red-500/50" : "bg-yellow-900/30 border-yellow-500/50"}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">
                      {check.status === "PASS"
                        ? "✅"
                        : check.status === "FAIL"
                          ? "❌"
                          : "⚠️"}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-white mb-1">
                        {name.toUpperCase()}
                      </div>
                      {check.message && (
                        <div
                          className={`text-sm ${check.status === "PASS" ? "text-green-300" : check.status === "FAIL" ? "text-red-300" : "text-yellow-300"}`}
                        >
                          {check.message}
                        </div>
                      )}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-lg font-bold ${check.status === "PASS" ? "bg-green-600" : check.status === "FAIL" ? "bg-red-600" : "bg-yellow-600"} text-white`}
                    >
                      {check.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="text-4xl mr-4">🎯</span>
            Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-colors text-lg font-semibold"
            >
              🔄 Refresh Status
            </button>
            <a
              href="/domain-diagnostic"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg transition-colors text-lg font-semibold text-center"
            >
              🔍 Domain Diagnostic
            </a>
            <a
              href="/account/signin"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg transition-colors text-lg font-semibold text-center"
            >
              🔐 Test Login
            </a>
            <a
              href="/"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg transition-colors text-lg font-semibold text-center"
            >
              🏠 Homepage
            </a>
          </div>
        </div>

        {/* Success Message */}
        {isHealthy && (
          <div className="mt-8 bg-green-500/20 backdrop-blur-lg border-4 border-green-500 rounded-2xl p-8 text-center">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              All Systems Operational!
            </h2>
            <p className="text-xl text-green-300 mb-6">
              Your deployment is correctly configured for onereel.online
            </p>
            <a
              href="/opportunity-hub"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg transition-colors text-xl font-bold"
            >
              🚀 Go to App
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
