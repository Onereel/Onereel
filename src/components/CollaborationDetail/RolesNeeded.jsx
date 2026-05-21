import { Users } from "lucide-react";

export function RolesNeeded({ roles }) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[#111418] mb-3 flex items-center gap-2">
        <Users size={24} className="text-purple-600" />
        Roles Needed
      </h2>
      <div className="flex flex-wrap gap-2">
        {roles.map((role, idx) => (
          <span
            key={idx}
            className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-xl font-semibold border-2 border-purple-200"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  );
}
