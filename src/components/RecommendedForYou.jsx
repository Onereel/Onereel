"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  MapPin,
  CheckCircle,
  ChevronRight,
  Star,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * RECOMMENDED FOR YOU
 * High-intelligence personalized opportunity radar
 * ═══════════════════════════════════════════════════════════════════════
 */

const MICROCOPY_ROTATION = [
  { text: "Handpicked based on your skills", icon: Sparkles },
  { text: "Creators like you applied here", icon: TrendingUp },
  { text: "High response projects", icon: Zap },
  { text: "Teams forming fast", icon: Clock },
];

const MATCH_BADGE_CONFIG = {
  perfect_match: {
    label: "Perfect Match",
    color: "from-emerald-500 to-green-500",
    glow: "shadow-emerald-500/50",
  },
  strong_match: {
    label: "Strong Match",
    color: "from-blue-500 to-purple-500",
    glow: "shadow-blue-500/50",
  },
  good_match: {
    label: "Good Match",
    color: "from-purple-500 to-pink-500",
    glow: "shadow-purple-500/50",
  },
  trending: {
    label: "Trending",
    color: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/50",
  },
  trending_fallback: {
    label: "Popular",
    color: "from-gray-500 to-gray-600",
    glow: "shadow-gray-500/50",
  },
};

export default function RecommendedForYou({ onSkillsNeeded }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMicrocopy, setCurrentMicrocopy] = useState(0);
  const [recommendationQuality, setRecommendationQuality] =
    useState("medium_confidence");
  const [userHasSkills, setUserHasSkills] = useState(true);

  useEffect(() => {
    fetchRecommendations();

    // Rotate microcopy every 4 seconds
    const interval = setInterval(() => {
      setCurrentMicrocopy((prev) => (prev + 1) % MICROCOPY_ROTATION.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/collaborations/recommendations");
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.opportunities || []);
        setRecommendationQuality(
          data.recommendationQuality || "medium_confidence",
        );
        setUserHasSkills(data.userHasSkills !== false);

        // Trigger skills modal if user has no skills
        if (data.userHasSkills === false && onSkillsNeeded) {
          setTimeout(() => {
            onSkillsNeeded();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-8 border border-purple-200 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-xl">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#111418]">
                ⭐ Recommended For You
              </h2>
              <p className="text-sm text-[#667085]">
                Finding your perfect opportunities...
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-100 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-purple-100 rounded-lg w-24"></div>
                <div className="h-6 bg-blue-100 rounded-lg w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const MicrocopyIcon = MICROCOPY_ROTATION[currentMicrocopy].icon;

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl mb-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2.5 rounded-xl shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-[#111418] flex items-center gap-2">
                ⭐ Recommended For You
              </h2>
              <div className="flex items-center gap-2 text-sm text-[#667085] mt-1">
                <MicrocopyIcon size={14} className="text-purple-600" />
                <span className="transition-all duration-300">
                  {MICROCOPY_ROTATION[currentMicrocopy].text}
                </span>
              </div>
            </div>
          </div>

          {/* Quality Indicator */}
          {recommendationQuality === "high_confidence" && (
            <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200">
              <Star size={16} />
              <span className="font-semibold text-sm">Highly Personalized</span>
            </div>
          )}
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {recommendations.map((collab) => {
            const badgeConfig =
              MATCH_BADGE_CONFIG[collab.match_reason] ||
              MATCH_BADGE_CONFIG.good_match;

            return (
              <a
                key={collab.id}
                href={`/collaborations/${collab.id}`}
                className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border-2 border-transparent hover:border-purple-300 transition-all hover:shadow-2xl group relative"
              >
                {/* Recommended Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <div
                    className={`bg-gradient-to-r ${badgeConfig.color} text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg ${badgeConfig.glow} flex items-center gap-1.5`}
                  >
                    <CheckCircle size={14} />
                    {badgeConfig.label}
                  </div>
                </div>

                {/* Match Score (if high) */}
                {collab.match_score >= 50 && (
                  <div className="absolute top-4 left-4 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-lg font-bold">
                    {collab.match_score}% Match
                  </div>
                )}

                {/* Content */}
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-[#111418] mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {collab.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-[#667085] mb-3">
                    <img
                      src={collab.creator_image || "/placeholder-avatar.png"}
                      alt={collab.creator_name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium">
                      @{collab.creator_username}
                    </span>
                    {collab.creator_verified && (
                      <CheckCircle size={14} className="text-blue-500" />
                    )}
                  </div>

                  <p className="text-[#667085] text-sm mb-4 line-clamp-3">
                    {collab.vision}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {collab.industry && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-lg font-semibold">
                        {collab.industry}
                      </span>
                    )}
                    {collab.collab_style && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
                        <MapPin size={12} />
                        {collab.collab_style}
                      </span>
                    )}
                    {collab.urgency_level === "urgent" && (
                      <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 animate-pulse">
                        <Zap size={12} />
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Roles */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {collab.roles_needed?.slice(0, 3).map((role, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 text-xs px-2 py-1 rounded-full font-medium border border-purple-200"
                      >
                        {role}
                      </span>
                    ))}
                    {collab.roles_needed?.length > 3 && (
                      <span className="text-xs text-[#667085] px-2 py-1">
                        +{collab.roles_needed.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                    View Details
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </div>
              </a>
            );
          })}

          {/* See All Card */}
          <a
            href="#feed"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("feed")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-300 hover:border-purple-500 transition-all group cursor-pointer"
          >
            <ChevronRight
              size={48}
              className="text-purple-600 mb-4 group-hover:translate-x-2 transition-transform"
            />
            <h3 className="text-xl font-bold text-purple-700 mb-2">
              See All Opportunities
            </h3>
            <p className="text-purple-600 text-sm">
              Explore the full feed below
            </p>
          </a>
        </div>

        {/* Scroll Hint */}
        <div className="text-center text-sm text-[#667085] mt-4 flex items-center justify-center gap-2">
          <ChevronRight size={16} />
          <span>Scroll to see more recommendations</span>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
