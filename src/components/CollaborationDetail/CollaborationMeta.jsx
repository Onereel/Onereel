import { Eye, UserPlus, Bookmark } from "lucide-react";

export function CollaborationMeta({ collaboration }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[#667085] mb-6 pb-6 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Eye size={16} />
        <span>{collaboration.view_count} views</span>
      </div>
      <div className="flex items-center gap-2">
        <UserPlus size={16} />
        <span
          className={
            collaboration.application_count > 0
              ? "font-semibold text-green-600"
              : ""
          }
        >
          {collaboration.application_count} interested
        </span>
      </div>
      {collaboration.save_count > 0 && (
        <div className="flex items-center gap-2">
          <Bookmark size={16} />
          <span>{collaboration.save_count} saved</span>
        </div>
      )}
    </div>
  );
}
