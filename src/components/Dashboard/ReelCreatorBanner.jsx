import { Film, Eye, Heart, Sparkles } from "lucide-react";

export function ReelCreatorBanner({ myReels }) {
  return (
    <div className="mb-6 bg-gradient-to-br from-[#1DA1F2]/10 via-[#0EA5E9]/10 to-[#06B6D4]/10 dark:from-[#1DA1F2]/20 dark:via-[#0EA5E9]/20 dark:to-[#06B6D4]/20 border-2 border-[#1DA1F2]/30 dark:border-[#1DA1F2]/50 rounded-2xl p-6 hover:border-[#1DA1F2]/50 dark:hover:border-[#1DA1F2]/70 transition-all shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1DA1F2] to-[#0EA5E9] flex items-center justify-center shadow-lg">
            <Film className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-extrabold text-[#111418] dark:text-white">
                One Reel Creator Studio
              </h3>
              <span className="px-2.5 py-1 bg-gradient-to-r from-[#1DA1F2] to-[#0EA5E9] text-white text-xs font-bold rounded-full shadow-md">
                AI-POWERED
              </span>
            </div>
            <p className="text-[#667085] dark:text-white/80 text-lg mb-3">
              Create cinematic reels in seconds using AI • No editing skills
              required
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1DA1F2]/20 flex items-center justify-center">
                  <Film className="w-4 h-4 text-[#1DA1F2]" />
                </div>
                <span className="text-[#111418] dark:text-white font-semibold">
                  {myReels.length} {myReels.length === 1 ? "Reel" : "Reels"}{" "}
                  Created
                </span>
              </div>
              {myReels.length > 0 && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-purple-500" />
                    </div>
                    <span className="text-[#111418] dark:text-white font-semibold">
                      {myReels.reduce((sum, r) => sum + (r.view_count || 0), 0)}{" "}
                      Views
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-[#111418] dark:text-white font-semibold">
                      {myReels.reduce((sum, r) => sum + (r.like_count || 0), 0)}{" "}
                      Likes
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <a
            href="/create-reel"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1DA1F2] to-[#0EA5E9] text-white font-bold rounded-xl hover:from-[#1a8cd8] hover:to-[#0284c7] transition-all shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Create Reel
          </a>
          <a
            href="/my-reels"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#121212] text-[#1DA1F2] border-2 border-[#1DA1F2] font-bold rounded-xl hover:bg-[#1DA1F2]/10 dark:hover:bg-[#1DA1F2]/10 transition-all"
          >
            <Film className="w-5 h-5" />
            My Reels
          </a>
        </div>
      </div>
    </div>
  );
}
