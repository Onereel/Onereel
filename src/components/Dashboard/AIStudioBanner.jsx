import { Sparkles } from "lucide-react";

export function AIStudioBanner() {
  return (
    <a
      href="/ai-studio"
      className="block mb-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-orange-500/20 border-2 border-purple-500/30 dark:border-purple-500/50 rounded-2xl p-6 hover:border-purple-500/50 dark:hover:border-purple-500/70 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-[#111418] dark:text-white">
                AI Studio
              </h3>
              <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                NEW
              </span>
            </div>
            <p className="text-[#667085] dark:text-white/60">
              Generate viral thumbnails, hooks, and track X trends with AI • 3
              powerful tools now live
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
          Launch AI Studio
          <Sparkles className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
}
