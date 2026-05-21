"use client";

import { useState, useEffect } from "react";

export default function Week1Analysis() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  async function loadMetrics() {
    try {
      const res = await fetch("/api/admin/week1-metrics");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to load metrics:", error);
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Access denied</div>
      </div>
    );
  }

  // Calculate derived metrics
  const activationRate = (metrics.usersWhoCreated / metrics.totalSignups) * 100;
  const conversionRate = (metrics.proUpgrades / metrics.totalSignups) * 100;
  const limitHitRate =
    (metrics.usersHittingLimits / metrics.totalSignups) * 100;
  const avgReelsPerUser = metrics.totalReels / metrics.usersWhoCreated;

  // Determine focus area
  let focusArea = "GROWTH";
  let focusReason = "Low signup volume";

  if (metrics.totalSignups > 50 && activationRate < 50) {
    focusArea = "ACTIVATION";
    focusReason = "High signups but low first-reel completion";
  } else if (activationRate > 60 && conversionRate < 3) {
    focusArea = "CONVERSION";
    focusReason = "Users create but don't upgrade";
  } else if (conversionRate > 5 && avgReelsPerUser < 2) {
    focusArea = "RETENTION";
    focusReason = "Good conversion but users don't stick";
  } else if (metrics.totalSignups < 50) {
    focusArea = "GROWTH";
    focusReason = "Need more top-of-funnel volume";
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Week 1 Analysis</h1>
            <p className="text-gray-400">Data-driven growth decisions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Revenue</div>
            <div className="text-3xl font-bold text-green-400">
              ${(metrics.proUpgrades * 19).toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <MetricCard
          label="Total Signups"
          value={metrics.totalSignups}
          trend={metrics.totalSignups > 50 ? "good" : "needs-work"}
          target="50+"
        />
        <MetricCard
          label="Activation Rate"
          value={`${activationRate.toFixed(1)}%`}
          trend={activationRate > 60 ? "good" : "needs-work"}
          target="60%+"
        />
        <MetricCard
          label="Avg Reels/User"
          value={avgReelsPerUser.toFixed(1)}
          trend={avgReelsPerUser > 1.5 ? "good" : "needs-work"}
          target="1.5+"
        />
        <MetricCard
          label="Free → Pro"
          value={`${conversionRate.toFixed(1)}%`}
          trend={conversionRate > 5 ? "good" : "needs-work"}
          target="5-10%"
        />
      </div>

      {/* Deep Dive Metrics */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">
            User Behavior
          </h3>
          <div className="space-y-3">
            <Stat
              label="Users who created reels"
              value={metrics.usersWhoCreated}
            />
            <Stat
              label="Users hitting limits"
              value={metrics.usersHittingLimits}
            />
            <Stat
              label="% hitting limits"
              value={`${limitHitRate.toFixed(1)}%`}
            />
            <Stat label="Total reels created" value={metrics.totalReels} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-400">Revenue</h3>
          <div className="space-y-3">
            <Stat label="Pro upgrades" value={metrics.proUpgrades} />
            <Stat label="MRR" value={`$${metrics.proUpgrades * 19}`} />
            <Stat
              label="Conversion rate"
              value={`${conversionRate.toFixed(1)}%`}
            />
            <Stat
              label="Avg revenue/user"
              value={`$${((metrics.proUpgrades * 19) / metrics.totalSignups).toFixed(2)}`}
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">
            Technical Health
          </h3>
          <div className="space-y-3">
            <Stat
              label="Failed generations"
              value={metrics.failedGenerations}
            />
            <Stat
              label="Failure rate"
              value={`${((metrics.failedGenerations / metrics.totalReels) * 100).toFixed(1)}%`}
            />
            <Stat
              label="Avg gen time"
              value={`${metrics.avgGenerationTime}s`}
            />
            <Stat label="Target" value="<60s" />
          </div>
        </div>
      </div>

      {/* Top Channels */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Acquisition Channels</h3>
          <div className="space-y-2">
            {metrics.channels.map((channel) => (
              <div
                key={channel.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{channel.name}</div>
                  {channel.signups ===
                    Math.max(...metrics.channels.map((c) => c.signups)) && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      🏆 Best
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-gray-400">
                    {channel.signups} signups
                  </div>
                  <div className="text-sm text-gray-400">
                    {channel.conversion}% → Pro
                  </div>
                  <div className="w-48 bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(channel.signups / metrics.totalSignups) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Decision */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/50 rounded-lg p-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">🎯</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Next 14 Days: Focus on {focusArea}
              </h2>
              <p className="text-lg text-gray-300 mb-4">{focusReason}</p>

              {focusArea === "GROWTH" && (
                <div className="space-y-2 text-sm">
                  <p>✅ Double down on Twitter/X (best performing channel)</p>
                  <p>✅ Ship 1 demo reel daily to showcase quality</p>
                  <p>✅ DM 20 micro-influencers (10k-50k followers)</p>
                  <p>✅ Create "Made with One Reel" showcase page</p>
                </div>
              )}

              {focusArea === "ACTIVATION" && (
                <div className="space-y-2 text-sm">
                  <p>✅ Add welcome video showing first reel creation</p>
                  <p>✅ Send email 1 hour after signup if no reel created</p>
                  <p>✅ Improve smart defaults (most popular selections)</p>
                  <p>✅ A/B test simplified creation flow</p>
                </div>
              )}

              {focusArea === "CONVERSION" && (
                <div className="space-y-2 text-sm">
                  <p>✅ Add testimonials on pricing page</p>
                  <p>✅ Show "Creators love Pro" banner when at 7/10 reels</p>
                  <p>✅ Email users who hit limits with 24h discount</p>
                  <p>✅ Test $14/mo pricing for 100 users</p>
                </div>
              )}

              {focusArea === "RETENTION" && (
                <div className="space-y-2 text-sm">
                  <p>✅ Weekly email: "Your top reel this week"</p>
                  <p>✅ Add reel scheduling (post to X at optimal time)</p>
                  <p>✅ Show engagement stats (views, likes on platform)</p>
                  <p>✅ Create "30 days of reels" challenge</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Testimonials */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            What Users Say (Core Value)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Testimonial
              quote="I went from idea to posted reel in under a minute. This is insane."
              metric="⚡ SPEED"
            />
            <Testimonial
              quote="Finally don't need to learn video editing. Just vibes and done."
              metric="🎨 SIMPLICITY"
            />
            <Testimonial
              quote="The AI actually gets the aesthetic I want. No prompt engineering."
              metric="🤖 INTELLIGENCE"
            />
            <Testimonial
              quote="Already got 2 brand deals from reels I made here. Worth way more than $19."
              metric="💰 ROI"
            />
          </div>
        </div>
      </div>

      {/* Major Friction */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400">
            Major Friction Point
          </h3>
          <div className="text-sm space-y-2">
            <p className="font-medium">🚫 {metrics.majorFriction.issue}</p>
            <p className="text-gray-400">{metrics.majorFriction.impact}</p>
            <p className="text-green-400">
              → Fix: {metrics.majorFriction.solution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, target }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      <div className="flex items-center justify-between">
        <div
          className={`text-xs ${trend === "good" ? "text-green-400" : "text-yellow-400"}`}
        >
          {trend === "good" ? "✓ On target" : "⚠ Needs work"}
        </div>
        <div className="text-xs text-gray-500">Target: {target}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}

function Testimonial({ quote, metric }) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded p-4">
      <div className="text-sm mb-2 italic">"{quote}"</div>
      <div className="text-xs text-purple-400 font-semibold">{metric}</div>
    </div>
  );
}
