import { DollarSign, Clock, MapPin, Briefcase } from "lucide-react";

export function KeyDetailsGrid({ collaboration }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {collaboration.compensation_details && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-1">
            <DollarSign size={18} />
            Compensation
          </div>
          <div className="text-[#111418] font-medium">
            {collaboration.compensation_details}
          </div>
        </div>
      )}

      {collaboration.estimated_timeline && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
            <Clock size={18} />
            Timeline
          </div>
          <div className="text-[#111418] font-medium">
            {collaboration.estimated_timeline}
          </div>
        </div>
      )}

      {collaboration.collab_style && (
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 font-semibold mb-1">
            <MapPin size={18} />
            Work Style
          </div>
          <div className="text-[#111418] font-medium capitalize">
            {collaboration.collab_style}
            {collaboration.location && ` - ${collaboration.location}`}
          </div>
        </div>
      )}

      {collaboration.industry && (
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700 font-semibold mb-1">
            <Briefcase size={18} />
            Industry
          </div>
          <div className="text-[#111418] font-medium">
            {collaboration.industry}
            {collaboration.niche && ` • ${collaboration.niche}`}
          </div>
        </div>
      )}
    </div>
  );
}
