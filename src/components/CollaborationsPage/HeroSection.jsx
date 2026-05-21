import { Search, Plus } from "lucide-react";

export function HeroSection({
  filters,
  onFiltersChange,
  collaborationsCount,
  activeMatchesCount,
  recommendedCollaboratorsCount,
}) {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
            Find Your Next Creative Partner
          </h1>
          <p className="text-2xl text-white/90 font-medium">
            Connect. Collaborate. Create.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-2">
            <div className="flex flex-col md:flex-row gap-2">
              {/* Search Input */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search size={24} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills, roles, or keywords..."
                  value={filters.search}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, search: e.target.value })
                  }
                  className="flex-1 bg-transparent text-[#111418] placeholder-gray-400 focus:outline-none text-lg"
                />
              </div>

              {/* Quick Filters */}
              <select
                value={filters.type}
                onChange={(e) =>
                  onFiltersChange({ ...filters, type: e.target.value })
                }
                className="px-4 py-3 bg-gray-50 text-[#111418] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              >
                <option value="">All Types</option>
                <option value="paid">Paid</option>
                <option value="partnership">Partnership</option>
                <option value="equity">Equity</option>
                <option value="passion">Passion Project</option>
                <option value="brand_deal">Brand Deal</option>
              </select>

              <select
                value={filters.style}
                onChange={(e) =>
                  onFiltersChange({ ...filters, style: e.target.value })
                }
                className="px-4 py-3 bg-gray-50 text-[#111418] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              >
                <option value="">Location</option>
                <option value="remote">Remote</option>
                <option value="local">Local</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="/collaborations/create"
            className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Plus size={24} />
            Post Collaboration
          </a>
          <button
            onClick={() => {
              document
                .getElementById("feed")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Search size={24} />
            Explore Creators
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold">
              {collaborationsCount}
            </div>
            <div className="text-sm text-white/80">Active Opportunities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold">
              {activeMatchesCount}
            </div>
            <div className="text-sm text-white/80">Teams Forming Now</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-3xl md:text-4xl font-bold">
              {recommendedCollaboratorsCount}
            </div>
            <div className="text-sm text-white/80">Creators Online</div>
          </div>
        </div>
      </div>
    </div>
  );
}
