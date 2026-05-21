import { CheckCircle } from "lucide-react";

export function CollaborationBadges({ collaboration, typeConfig, TypeIcon }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2 ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
      >
        <TypeIcon size={18} />
        {typeConfig.label}
      </span>

      {collaboration.status === "filled" && (
        <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm px-4 py-2 rounded-xl font-bold">
          ✅ MATCHED
        </span>
      )}

      {collaboration.is_featured && (
        <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm px-4 py-2 rounded-xl font-bold">
          ⭐ FEATURED
        </span>
      )}

      {collaboration.is_verified && (
        <span className="bg-blue-50 text-blue-700 text-sm px-4 py-2 rounded-xl font-semibold border-2 border-blue-200 flex items-center gap-1">
          <CheckCircle size={16} />
          Verified
        </span>
      )}

      {collaboration.urgency_level === "urgent" && (
        <span className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-xl font-bold border-2 border-red-200">
          🔥 URGENT
        </span>
      )}
    </div>
  );
}
