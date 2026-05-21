import { CheckCircle, Star, Briefcase, ArrowRight, Award } from "lucide-react";

export function AcceptedEditorSection({ acceptedEditor, workspaceId }) {
  if (!acceptedEditor) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-600 p-3 rounded-xl">
          <CheckCircle size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#111418]">
            ✅ Editor Accepted!
          </h2>
          <p className="text-[#667085]">Your collaboration is now active</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-green-200 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={acceptedEditor.image || "/placeholder-avatar.png"}
            alt={acceptedEditor.name}
            className="w-20 h-20 rounded-full border-4 border-green-200"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <a
                href={`/profile/${acceptedEditor.id}`}
                className="text-2xl font-bold text-[#111418] hover:text-purple-600 transition-colors"
              >
                {acceptedEditor.name}
              </a>
              {acceptedEditor.verified && (
                <CheckCircle size={20} className="text-blue-500" />
              )}
            </div>
            <a
              href={`/profile/${acceptedEditor.id}`}
              className="text-[#667085] hover:text-purple-600 transition-colors"
            >
              @{acceptedEditor.username}
            </a>

            {acceptedEditor.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <span className="font-semibold text-[#111418]">
                    {acceptedEditor.rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-[#667085]">
                  ({acceptedEditor.total_reviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        {acceptedEditor.bio && (
          <div className="mb-4">
            <p className="text-[#667085] leading-relaxed">
              {acceptedEditor.bio}
            </p>
          </div>
        )}

        {acceptedEditor.skills && acceptedEditor.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {acceptedEditor.skills.slice(0, 6).map((skill, idx) => (
              <span
                key={idx}
                className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-lg font-semibold border border-purple-200"
              >
                {skill}
              </span>
            ))}
            {acceptedEditor.skills.length > 6 && (
              <span className="text-xs text-[#667085] px-3 py-1.5">
                +{acceptedEditor.skills.length - 6} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <a
          href={`/workspace/${workspaceId}`}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <Briefcase size={20} />
          Open Workspace
          <ArrowRight size={20} />
        </a>
        <a
          href={`/profile/${acceptedEditor.id}`}
          className="bg-white border-2 border-green-600 text-green-600 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2"
        >
          <Award size={20} />
          View Editor Profile
        </a>
      </div>

      <div className="mt-4 bg-green-100 border border-green-300 rounded-xl p-4 text-center">
        <p className="text-sm text-green-800 font-semibold">
          💡 Use the workspace to share files, communicate, and track progress
        </p>
      </div>
    </div>
  );
}
