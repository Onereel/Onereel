import {
  CheckCircle,
  Star,
  Send,
  Clock,
  XCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";

export function CreatorCard({
  collaboration,
  isOwner,
  hasApplied,
  applicationStatus,
  workspaceId,
  applicationsCount,
  onApply,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-24">
      <div className="text-sm text-[#667085] mb-3">Posted by</div>

      <a
        href={`/profile/${collaboration.creator_id}`}
        className="flex items-center gap-3 mb-4 group"
      >
        <img
          src={collaboration.creator_image || "/placeholder-avatar.png"}
          alt={collaboration.creator_name}
          className="w-12 h-12 rounded-full border-2 border-gray-200 group-hover:border-purple-600 transition-all"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[#111418] group-hover:text-purple-600 transition-colors flex items-center gap-1">
            {collaboration.creator_name}
            {collaboration.creator_verified && (
              <CheckCircle size={16} className="text-blue-500" />
            )}
          </div>
          <div className="text-sm text-[#667085]">
            @{collaboration.creator_username}
          </div>
        </div>
      </a>

      {collaboration.creator_rating > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="font-semibold text-[#111418]">
              {collaboration.creator_rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[#667085]">
            ({collaboration.creator_total_reviews} reviews)
          </span>
        </div>
      )}

      {/* CTA Buttons */}
      {!isOwner ? (
        <div className="space-y-3">
          {!hasApplied ? (
            // Not applied yet - show Apply button
            <button
              onClick={onApply}
              disabled={collaboration.status === "filled"}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                collaboration.status === "filled"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              }`}
            >
              {collaboration.status === "filled" ? (
                <>
                  <CheckCircle size={20} />
                  Position Filled
                </>
              ) : (
                <>
                  <Send size={20} />
                  Apply Now
                </>
              )}
            </button>
          ) : applicationStatus === "pending" ? (
            // Applied and pending
            <div className="w-full bg-yellow-50 border-2 border-yellow-500 text-yellow-700 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              <Clock size={20} />
              Application Sent
            </div>
          ) : applicationStatus === "accepted" && workspaceId ? (
            // Accepted - show success state and workspace button
            <>
              <div className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Application Accepted!
              </div>
              <a
                href={`/workspace/${workspaceId}`}
                className="w-full block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
              >
                <Briefcase size={20} />
                Open Workspace
                <ArrowRight size={18} />
              </a>
            </>
          ) : applicationStatus === "declined" ? (
            // Declined
            <div className="w-full bg-red-50 border-2 border-red-500 text-red-700 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              <XCircle size={20} />
              Application Declined
            </div>
          ) : (
            // Fallback - generic application sent
            <div className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              Application Sent
            </div>
          )}

          {collaboration.status !== "filled" && (
            <a
              href={`/profile/${collaboration.creator_id}`}
              className="w-full block text-center bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              View Creator Profile
            </a>
          )}
        </div>
      ) : (
        // Creator view
        <div className="space-y-3">
          {workspaceId ? (
            // Creator has accepted someone - show workspace link
            <>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <div className="text-green-700 font-semibold mb-1 flex items-center justify-center gap-2">
                  <CheckCircle size={18} />
                  Collaboration Active
                </div>
                <div className="text-sm text-green-600">Editor accepted</div>
              </div>
              <a
                href={`/workspace/${workspaceId}`}
                className="w-full block bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
              >
                <Briefcase size={20} />
                Open Workspace
                <ArrowRight size={18} />
              </a>
            </>
          ) : (
            // Creator hasn't accepted anyone yet
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
              <div className="text-purple-700 font-semibold mb-1">
                This is your collaboration
              </div>
              <div className="text-sm text-purple-600">
                {applicationsCount}{" "}
                {applicationsCount === 1 ? "applicant" : "applicants"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
