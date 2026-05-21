import { Star } from "lucide-react";

export function RequiredSkills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#111418] mb-3 flex items-center gap-2">
        <Star size={24} className="text-blue-600" />
        Required Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium border border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
