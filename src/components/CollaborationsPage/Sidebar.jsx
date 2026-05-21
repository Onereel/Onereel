import { Sparkles, Users, CheckCircle, Flame } from "lucide-react";

export function Sidebar({ user, recommendations, activeMatches }) {
  return (
    <div className="space-y-6">
      {/* Recommended For You */}
      {user && recommendations.opportunities.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-purple-600" />
            <h3 className="font-bold text-lg text-[#111418]">
              Opportunities You Shouldn't Miss
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.opportunities.slice(0, 3).map((opp) => (
              <a
                key={opp.id}
                href={`/collaborations/${opp.id}`}
                className="block p-3 rounded-xl hover:bg-purple-50 transition-all border border-transparent hover:border-purple-200"
              >
                <div className="font-semibold text-[#111418] mb-1 line-clamp-1">
                  {opp.title}
                </div>
                <div className="text-xs text-[#667085]">
                  @{opp.creator_username}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Collaborators */}
      {recommendations.collaborators.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-blue-600" />
            <h3 className="font-bold text-lg text-[#111418]">
              Recommended Collaborators
            </h3>
          </div>

          <div className="space-y-3">
            {recommendations.collaborators.slice(0, 4).map((creator) => (
              <a
                key={creator.id}
                href={`/profile/${creator.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200"
              >
                <img
                  src={creator.profile_image_url || "/placeholder-avatar.png"}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#111418] truncate flex items-center gap-1">
                    {creator.name}
                    {creator.x_verified && (
                      <CheckCircle size={14} className="text-blue-500" />
                    )}
                  </div>
                  <div className="text-xs text-[#667085] truncate">
                    {creator.skills?.slice(0, 2).join(", ")}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Collaborations Happening Now */}
      {activeMatches.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={20} className="text-orange-500" />
            <h3 className="font-bold text-lg text-[#111418]">
              Teams Forming Now
            </h3>
          </div>

          <div className="space-y-3">
            {activeMatches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-purple-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={match.creator_image}
                    alt={match.creator_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">+</span>
                  <img
                    src={match.collaborator_image}
                    alt={match.collaborator_name}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
                <div className="text-sm text-[#667085]">
                  {match.project_name || match.collaboration_title}
                </div>
                <div className="text-xs text-[#8B5CF6] mt-1">
                  {new Date(match.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
