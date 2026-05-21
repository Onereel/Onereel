"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Sparkles,
} from "lucide-react";
import VerificationGate from "../../components/VerificationGate";

export default function MarketplacePage() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchGigs();
  }, [sortBy]);

  async function fetchGigs(isRefresh = false) {
    try {
      setError(null);
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const params = new URLSearchParams({ sortBy });
      const response = await fetch(`/api/gigs?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch gigs");
      }
      const data = await response.json();
      // Filter to only show verified creators
      const verifiedGigs = (data.gigs || []).filter(
        (gig) => gig.freelancer_verified === true,
      );
      setGigs(verifiedGigs);
    } catch (error) {
      console.error("Error fetching gigs:", error);
      setError("Failed to load gigs. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    fetchGigs(true);
  };

  async function seedSampleData() {
    try {
      setSeeding(true);
      const response = await fetch("/api/seed-data", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to seed data");
      }
      const data = await response.json();
      alert(data.message);
      // Refresh the gigs list
      fetchGigs(true);
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to seed sample data");
    } finally {
      setSeeding(false);
    }
  }

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    if (priceFilter === "low") {
      matchesPrice = parseFloat(gig.price) < 200;
    } else if (priceFilter === "medium") {
      matchesPrice =
        parseFloat(gig.price) >= 200 && parseFloat(gig.price) <= 500;
    } else if (priceFilter === "high") {
      matchesPrice = parseFloat(gig.price) > 500;
    }

    return matchesSearch && matchesPrice;
  });

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-[#667085] dark:text-white/60 text-lg">
            Loading marketplace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <VerificationGate>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0A0A0A]">
        {/* Header */}
        <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-[#111418] dark:text-white">
                  One Reel Marketplace
                </h1>
                <p className="text-[#667085] dark:text-white/60 mt-1">
                  Hire talent. Offer services. Get work done.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-6 py-3 min-h-[48px] bg-[#1DA1F2] hover:bg-[#1a8cd8] disabled:bg-[#1DA1F2]/50 text-white font-semibold rounded-full transition-colors"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
                <a
                  href="/dashboard"
                  className="px-6 py-3 min-h-[48px] flex items-center bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-full transition-colors"
                >
                  Dashboard
                </a>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search gigs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 min-h-[48px] border border-gray-300 dark:border-white/10 rounded-full bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
                />
              </div>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-6 py-3 min-h-[48px] border border-gray-300 dark:border-white/10 rounded-full bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              >
                <option value="all">All Prices</option>
                <option value="low">Under $200</option>
                <option value="medium">$200 - $500</option>
                <option value="high">Over $500</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 min-h-[48px] border border-gray-300 dark:border-white/10 rounded-full bg-white dark:bg-[#1E1E1E] text-[#111418] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
              >
                <option value="created_at">Latest</option>
                <option value="price">Price: Low to High</option>
                <option value="delivery_days">Fastest Delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gigs Grid */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {refreshing && (
            <div className="text-center mb-6">
              <p className="text-[#1DA1F2] font-semibold">Refreshing...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
              <p className="text-red-600 dark:text-red-400 font-semibold">
                {error}
              </p>
            </div>
          )}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#1DA1F2] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#667085] dark:text-white/60">
                Loading gigs...
              </p>
            </div>
          ) : filteredGigs.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-[#1DA1F2]/10 rounded-full flex items-center justify-center">
                  <Sparkles size={48} className="text-[#1DA1F2]" />
                </div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white mb-3">
                  {searchTerm || priceFilter !== "all"
                    ? "No gigs match your filters"
                    : "Opportunities are waiting to be created"}
                </h3>
                <p className="text-lg text-[#667085] dark:text-white/60 mb-6">
                  {searchTerm || priceFilter !== "all"
                    ? "Try adjusting your search or filters to see more results."
                    : "Be the first to post a gig and start connecting with talent!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="/gigs/create"
                    className="inline-flex items-center justify-center bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold px-6 py-3 rounded-full transition-colors"
                  >
                    Post a Gig
                  </a>
                  {gigs.length === 0 && (
                    <button
                      onClick={seedSampleData}
                      disabled={seeding}
                      className="inline-flex items-center justify-center border-2 border-[#1DA1F2] text-[#1DA1F2] hover:bg-[#1DA1F2]/10 font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-50"
                    >
                      {seeding ? "Loading..." : "Load Sample Gigs"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map((gig) => (
                <a
                  key={gig.id}
                  href={`/gigs/${gig.id}`}
                  className="bg-white dark:bg-[#121212] rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-white/10 hover:border-[#1DA1F2] dark:hover:border-[#1DA1F2] group"
                >
                  {/* Boosted Badge */}
                  {gig.is_boosted && (
                    <div className="bg-gradient-to-r from-[#FFD400] to-[#FFA000] px-4 py-2 text-center">
                      <span className="text-[#111418] font-bold text-sm">
                        ⭐ Boosted Gig
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Creator Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1DA1F2] to-[#0A66C2] flex items-center justify-center text-white font-bold">
                        {gig.freelancer_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#111418] dark:text-white truncate">
                          @{gig.freelancer_username}
                        </div>
                        <div className="flex items-center space-x-2">
                          {gig.freelancer_rating > 0 && (
                            <div className="flex items-center text-sm text-[#667085] dark:text-white/60">
                              <Star
                                size={14}
                                className="text-[#FFD400] fill-[#FFD400] mr-1"
                              />
                              {parseFloat(gig.freelancer_rating).toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gig Title */}
                    <h3 className="font-bold text-lg text-[#111418] dark:text-white mb-2 line-clamp-2 group-hover:text-[#1DA1F2] transition-colors">
                      {gig.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#667085] dark:text-white/60 mb-4 line-clamp-2">
                      {gig.description}
                    </p>

                    {/* Skills */}
                    {gig.freelancer_skills &&
                      gig.freelancer_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {gig.freelancer_skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Price & Delivery */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                      <div className="flex items-center text-[#667085] dark:text-white/60 text-sm">
                        <Clock size={16} className="mr-1" />
                        {gig.delivery_days} day
                        {gig.delivery_days !== 1 ? "s" : ""}
                      </div>
                      <div className="text-2xl font-bold text-[#1DA1F2]">
                        ${parseFloat(gig.price).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </VerificationGate>
  );
}
