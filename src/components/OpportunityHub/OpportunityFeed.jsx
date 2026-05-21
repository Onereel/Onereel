import {
  Users,
  CheckCircle,
  Send,
  Bookmark,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";
import { COLLAB_TYPE_LABELS } from "./constants";

// Helper function to check if collaboration is new (within last 24 hours)
function isNewCollaboration(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now - created) / (1000 * 60 * 60);
  return hoursDiff < 24;
}

export function OpportunityFeed({
  loading,
  collaborations,
  quickApplying,
  handleQuickApply,
  handleSave,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-[#111418] mb-2">
            Loading amazing opportunities...
          </h3>
          <p className="text-[#667085]">Creators are collaborating right now</p>
        </div>

        {/* Skeleton Cards */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                <div className="h-16 bg-gray-100 rounded"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-purple-100 rounded-lg w-24"></div>
                  <div className="h-6 bg-blue-100 rounded-lg w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (collaborations.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <Users size={48} className="mx-auto text-purple-300 mb-4" />
        <h3 className="text-2xl font-bold text-[#111418] mb-2">
          New collaborations are forming right now
        </h3>
        <p className="text-[#667085] mb-6 text-lg">
          Be one of the first to launch a project and connect with creators
        </p>
        <a
          href="/collaborations/create"
          className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          Launch First Project
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {collaborations.map((collab) => {
        const typeConfig = COLLAB_TYPE_LABELS[collab.collab_type];
        const TypeIcon = typeConfig?.icon;
        const isQuickApplying = quickApplying === collab.id;
        const isNew = isNewCollaboration(collab.created_at);

        return (
          <div
            key={collab.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-purple-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-2xl font-bold text-[#111418] group-hover:text-purple-600 transition-colors">
                    {collab.title}
                  </h3>

                  {/* 🔥 NEW BADGE */}
                  {isNew && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                      <Zap size={12} />
                      NEW
                    </span>
                  )}

                  {collab.is_verified && (
                    <CheckCircle size={20} className="text-blue-500" />
                  )}
                  {collab.is_featured && (
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                      FEATURED
                    </span>
                  )}
                  {collab.urgency_level === "urgent" && (
                    <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                      🔥 HIRING NOW
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-[#667085] mb-3">
                  <img
                    src={collab.creator_image || "/placeholder-avatar.png"}
                    alt={collab.creator_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">
                    @{collab.creator_username}
                  </span>
                  {collab.creator_verified && (
                    <CheckCircle size={14} className="text-blue-500" />
                  )}
                </div>

                <p className="text-[#667085] mb-4 line-clamp-2">
                  {collab.vision}
                </p>

                {/* 🔥 ENHANCED CATEGORY TAGS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {TypeIcon && (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-${typeConfig?.color}-50 text-${typeConfig?.color}-700 border border-${typeConfig?.color}-200`}
                    >
                      <TypeIcon size={16} />
                      {typeConfig?.label}
                    </span>
                  )}

                  {/* Industry Tag - YouTube, TikTok, etc */}
                  {collab.industry && (
                    <span className="bg-purple-50 text-purple-700 text-sm px-3 py-1.5 rounded-lg font-semibold border border-purple-200">
                      {collab.industry}
                    </span>
                  )}

                  {/* Niche Tag */}
                  {collab.niche && (
                    <span className="bg-blue-50 text-blue-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-blue-200">
                      {collab.niche}
                    </span>
                  )}

                  {collab.collab_style && (
                    <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-gray-200 flex items-center gap-1">
                      <MapPin size={14} />
                      {collab.collab_style}
                    </span>
                  )}

                  {collab.estimated_timeline && (
                    <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg font-medium border border-gray-200 flex items-center gap-1">
                      <Clock size={14} />
                      {collab.estimated_timeline}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {collab.roles_needed?.slice(0, 3).map((role, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-semibold"
                    >
                      {role}
                    </span>
                  ))}
                  {collab.roles_needed?.length > 3 && (
                    <span className="text-xs text-[#667085] px-2.5 py-1">
                      +{collab.roles_needed.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSave(collab.id)}
                className="text-gray-400 hover:text-purple-600 transition-colors"
              >
                <Bookmark size={24} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[#667085]">
                  {collab.view_count} views
                </span>
                {collab.application_count > 0 && (
                  <span className="text-green-600 font-semibold">
                    {collab.application_count} applied
                  </span>
                )}
                {collab.urgency_level === "urgent" && (
                  <div className="flex flex-col">
                    <span className="text-red-600 font-bold">
                      Team forming ⚡
                    </span>
                    <span className="text-xs text-[#667085]">
                      {collab.view_count} views
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickApply(collab.id, collab.title)}
                  disabled={isQuickApplying || collab.has_applied}
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    collab.has_applied
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : isQuickApplying
                        ? "bg-purple-400 text-white"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-md"
                  }`}
                >
                  {collab.has_applied ? (
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

                <a
                  href={`/collaborations/${collab.id}`}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                >
                  Details →
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
