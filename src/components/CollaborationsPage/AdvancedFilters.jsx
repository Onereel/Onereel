import { Filter } from "lucide-react";

export function AdvancedFilters({
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 text-[#111418] font-semibold hover:text-purple-600 transition-colors"
      >
        <Filter size={20} />
        {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
      </button>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <input
            type="text"
            placeholder="Industry (e.g. Film, YouTube)"
            value={filters.industry}
            onChange={(e) =>
              onFiltersChange({ ...filters, industry: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Niche (e.g. Tech, Fashion)"
            value={filters.niche}
            onChange={(e) =>
              onFiltersChange({ ...filters, niche: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            type="text"
            placeholder="Required Skills"
            value={filters.skills}
            onChange={(e) =>
              onFiltersChange({ ...filters, skills: e.target.value })
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 sm:col-span-2"
          />
        </div>
      )}
    </div>
  );
}
