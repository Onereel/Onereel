import {
  CheckCircle,
  Star,
  MessageCircle,
  Clock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export function ApplicationCard({ application, onUpdateStatus }) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-all">
      {/* Applicant Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={application.applicant_image || "/placeholder-avatar.png"}
            alt={application.applicant_name}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#111418]">
                {application.applicant_name}
              </span>
              {application.applicant_verified && (
                <CheckCircle size={16} className="text-blue-500" />
              )}
            </div>
            <div className="text-sm text-[#667085]">
              @{application.applicant_username}
            </div>
            {application.applicant_rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                <Star size={12} fill="currentColor" />
                <span className="text-[#111418] font-semibold">
                  {application.applicant_rating.toFixed(1)}
                </span>
                <span className="text-[#667085]">
                  ({application.applicant_reviews})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {application.status === "accepted" && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              Accepted
            </span>
          )}
          {application.status === "declined" && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
              Declined
            </span>
          )}
          {application.status === "pending" && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={16} className="text-purple-600" />
          <span className="text-sm font-semibold text-[#111418]">
            Application Message
          </span>
        </div>
        <p className="text-[#667085] text-sm leading-relaxed pl-6">
          {application.message}
        </p>
      </div>

      {/* Availability */}
      {application.availability && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-[#111418]">
              Availability
            </span>
          </div>
          <p className="text-[#667085] text-sm pl-6">
            {application.availability}
          </p>
        </div>
      )}

      {/* Portfolio */}
      {application.portfolio_highlights &&
        application.portfolio_highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-[#111418]">
                Portfolio
              </span>
            </div>
            <div className="space-y-1 pl-6">
              {application.portfolio_highlights.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-purple-600 hover:text-purple-700"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

      {/* Skills */}
      {application.applicant_skills &&
        application.applicant_skills.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-semibold text-[#111418] mb-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {application.applicant_skills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Actions */}
      {application.status === "pending" && (
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={() => onUpdateStatus(application.id, "accepted")}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <ThumbsUp size={18} />
            Accept
          </button>
          <button
            onClick={() => onUpdateStatus(application.id, "declined")}
            className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <ThumbsDown size={18} />
            Decline
          </button>
          <a
            href={`/profile/${application.applicant_id}`}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            View Profile
          </a>
        </div>
      )}

      {/* Applied Date */}
      <div className="text-xs text-[#667085] mt-3 pt-3 border-t border-gray-100">
        Applied{" "}
        {new Date(application.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    </div>
  );
}
