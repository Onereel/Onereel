export default function UsageStatsCard({ subscription, usageStats }) {
  if (!subscription || !usageStats) return null;

  // ✅ EARLY ACCESS MODE - Everyone has unlimited access
  const showingEarlyAccess = true;

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Video Generation</h3>
          <p className="text-sm text-gray-400">
            Early Access — All features unlocked
          </p>
        </div>
        <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full font-bold">
          ✨ Unlimited
        </span>
      </div>

      {/* Early Access Banner */}
      <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/30 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <div className="font-semibold text-white mb-1">
              Founding User Status
            </div>
            <div className="text-sm text-gray-300">
              You have unlimited access to all Pro features during Early Access.
              Help us build the marketplace!
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats - Show progress but no limits */}
      <div className="text-sm text-gray-400">
        <div className="flex items-center justify-between mb-2">
          <span>Videos created this month:</span>
          <span className="text-white font-semibold">
            {usageStats.totalReels || 0}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <span className="text-green-400 font-semibold">No limits 🚀</span>
        </div>
      </div>
    </div>
  );
}
