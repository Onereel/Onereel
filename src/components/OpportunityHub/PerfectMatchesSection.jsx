import { Target, UserPlus, CheckCircle, Send } from "lucide-react";
import { COLLAB_TYPE_LABELS } from "./constants";

export function PerfectMatchesSection({
  user,
  perfectMatches,
  quickApplying,
  handleQuickApply,
}) {
  if (!user || perfectMatches.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-green-200 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-300 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-600 p-3 rounded-xl">
            <Target size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-[#111418]">
              ⭐ Matches Waiting For You
            </h2>
            <p className="text-green-700 font-semibold">
              These projects need your exact skills RIGHT NOW
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perfectMatches.slice(0, 4).map((match) => {
            const typeConfig = COLLAB_TYPE_LABELS[match.collab_type];
            const isQuickApplying = quickApplying === match.id;

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl p-6 border-2 border-green-300 hover:border-green-500 transition-all hover:shadow-lg group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <UserPlus size={24} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                        {match.match_score}% MATCH
                      </span>
                      {match.urgency_level === "urgent" && (
                        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                          🔥 URGENT
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#111418] mb-2 group-hover:text-green-600 transition-colors">
                      {match.title}
                    </h3>
                    <p className="text-sm text-[#667085] mb-3 line-clamp-2">
                      {match.vision}
                    </p>

                    {/* Matching Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {match.matching_skills?.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>

                    {/* Urgency Indicators */}
                    <div className="flex items-center gap-3 text-xs text-[#667085] mb-4">
                      {match.application_count > 0 && (
                        <span className="font-semibold">
                          {match.application_count} applied
                        </span>
                      )}
                      {match.estimated_timeline && (
                        <span>Starts: {match.estimated_timeline}</span>
                      )}
                    </div>

                    {/* Apply Now Button */}
                    <button
                      onClick={() => handleQuickApply(match.id, match.title)}
                      disabled={isQuickApplying || match.has_applied}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        match.has_applied
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : isQuickApplying
                            ? "bg-green-400 text-white"
                            : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                      }`}
                    >
                      {match.has_applied ? (
                        <>
                          <CheckCircle size={18} />
                          Applied
                        </>
                      ) : isQuickApplying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Applying...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Apply Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {perfectMatches.length > 4 && (
          <button
            onClick={() =>
              (window.location.href = "/collaborations?filter=perfect-match")
            }
            className="mt-6 w-full bg-white border-2 border-green-600 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
          >
            View All {perfectMatches.length} Perfect Matches →
          </button>
        )}
      </div>
    </div>
  );
}
