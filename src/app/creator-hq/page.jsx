"use client";

import { useState, useEffect, useRef } from "react";
import useUser from "@/utils/useUser";
import RecommendedForYou from "@/components/RecommendedForYou";
import SkillSelectorModal from "@/components/SkillSelectorModal";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target,
  Award,
  Clock,
  Send,
  MapPin,
  DollarSign,
  Plus,
  Search,
  Briefcase,
} from "lucide-react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CREATOR HQ
 * The Emotional Center of One Reel
 * Where Creators Build The Future Together
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Psychology:
 * - Speed = trust
 * - Activity = credibility
 * - Personalization = magic
 * - Momentum = retention
 *
 * This is NOT a dashboard. This is a creative opportunity radar.
 */

const COLLAB_TYPE_CONFIG = {
  paid: { label: "Paid Project", icon: DollarSign, color: "green" },
  partnership: { label: "Partnership", icon: Users, color: "purple" },
  equity: { label: "Equity Share", icon: TrendingUp, color: "blue" },
  passion: { label: "Passion Project", icon: Sparkles, color: "pink" },
  brand_deal: { label: "Brand Deal", icon: Zap, color: "orange" },
};

export default function CreatorHQPage() {
  const { data: user, loading } = useUser();

  const [liveOpportunities, setLiveOpportunities] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [creatorMomentum, setCreatorMomentum] = useState(null);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  const liveStripRef = useRef(null);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);

  useEffect(() => {
    fetchLiveOpportunities();
    fetchTrendingProjects();
    fetchCreatorMomentum();

    // Auto-refresh live opportunities every 25 seconds
    const interval = setInterval(() => {
      fetchLiveOpportunities();
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll live opportunities
  useEffect(() => {
    if (autoScrollPaused || !liveStripRef.current) return;

    const scrollInterval = setInterval(() => {
      if (liveStripRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = liveStripRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          liveStripRef.current.scrollLeft = 0;
        } else {
          liveStripRef.current.scrollLeft += 1;
        }
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [autoScrollPaused]);

  const fetchLiveOpportunities = async () => {
    try {
      const response = await fetch("/api/collaborations/active");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.success) {
        setLiveOpportunities(data.matches || []);
      }
    } catch (error) {
      console.error("Error fetching live opportunities:", error);
    }
  };

  const fetchTrendingProjects = async () => {
    try {
      const response = await fetch(
        "/api/collaborations?sortBy=trending&limit=6",
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.success) {
        setTrendingProjects(data.collaborations || []);
      }
    } catch (error) {
      console.error("Error fetching trending projects:", error);
    }
  };

  const fetchCreatorMomentum = async () => {
    if (!user) return;

    try {
      // Fetch user's profile and stats
      const response = await fetch("/api/profiles");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.success && data.profiles?.length > 0) {
        const profile = data.profiles.find((p) => p.user_id === user.id);

        if (profile) {
          setCreatorMomentum({
            applicationsSent: 0, // Will be populated from applications API
            activeCollabs: 0, // Will be populated from matches API
            profileStrength: calculateProfileStrength(profile),
            responseRate: 0, // Placeholder for future
          });
        }
      }
    } catch (error) {
      console.error("Error fetching creator momentum:", error);
    }
  };

  const calculateProfileStrength = (profile) => {
    let strength = 0;

    if (profile.bio) strength += 20;
    if (profile.skills && profile.skills.length > 0) strength += 30;
    if (profile.portfolio_links && profile.portfolio_links.length > 0)
      strength += 20;
    if (profile.profile_image_url) strength += 15;
    if (profile.hourly_rate || profile.fixed_pricing) strength += 15;

    return Math.min(100, strength);
  };

  const handleQuickApply = async (collabId) => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    window.location.href = `/collaborations/${collabId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-3xl font-bold mb-2">Loading Creator HQ...</h2>
          <p className="text-xl opacity-90">Preparing your opportunities</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/account/signin";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F3F4F6]">
      {/* Skills Modal */}
      {showSkillsModal && (
        <SkillSelectorModal onClose={() => setShowSkillsModal(false)} />
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CINEMATIC HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-sm mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              Your Creative Command Center
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Where Creators Build
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 text-transparent bg-clip-text">
                The Future Together
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Discover collaborators.
              <br />
              Launch projects.
              <br />
              Generate content.
              <br />
              Scale your creative career.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="/collaborations/create"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
              >
                <Plus size={24} />
                Start a Collaboration
              </a>
              <a
                href="/collaborations"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
              >
                <Search size={24} />
                Explore Opportunities
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">
                  {liveOpportunities.length}
                </div>
                <div className="text-sm text-white/80">Teams Forming</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">
                  {trendingProjects.length}
                </div>
                <div className="text-sm text-white/80">Trending Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">Live</div>
                <div className="text-sm text-white/80">Opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Main Feed */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Opportunities Strip */}
            {liveOpportunities.length > 0 && (
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 border-2 border-orange-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame size={24} className="text-orange-600" />
                    <h2 className="text-2xl font-extrabold text-[#111418]">
                      🔥 Teams Forming Now
                    </h2>
                    <span className="ml-auto text-sm text-orange-600 font-semibold">
                      Live
                    </span>
                  </div>

                  <div
                    ref={liveStripRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    onMouseEnter={() => setAutoScrollPaused(true)}
                    onMouseLeave={() => setAutoScrollPaused(false)}
                  >
                    {liveOpportunities.map((match) => (
                      <div
                        key={match.id}
                        className="flex-shrink-0 w-72 bg-white rounded-xl p-4 border border-orange-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <img
                            src={
                              match.creator_image || "/placeholder-avatar.png"
                            }
                            alt={match.creator_name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm font-medium">+</span>
                          <img
                            src={
                              match.collaborator_image ||
                              "/placeholder-avatar.png"
                            }
                            alt={match.collaborator_name}
                            className="w-8 h-8 rounded-full"
                          />
                        </div>
                        <div className="font-bold text-[#111418] mb-1 line-clamp-1">
                          {match.project_name || match.collaboration_title}
                        </div>
                        <div className="text-xs text-[#667085] flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(match.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recommended For You */}
            <RecommendedForYou
              onSkillsNeeded={() => setShowSkillsModal(true)}
            />

            {/* Trending Projects */}
            {trendingProjects.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={24} className="text-blue-600" />
                  <h2 className="text-2xl font-extrabold text-[#111418]">
                    📈 Trending Across One Reel
                  </h2>
                </div>

                <div className="space-y-4">
                  {trendingProjects.map((project) => {
                    const typeConfig = COLLAB_TYPE_CONFIG[project.collab_type];
                    const TypeIcon = typeConfig?.icon || Sparkles;

                    return (
                      <div
                        key={project.id}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => handleQuickApply(project.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#111418] mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                              {project.title}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-[#667085] mb-3">
                              <img
                                src={
                                  project.creator_image ||
                                  "/placeholder-avatar.png"
                                }
                                alt={project.creator_name}
                                className="w-5 h-5 rounded-full"
                              />
                              <span className="font-medium">
                                @{project.creator_username}
                              </span>
                              {project.creator_verified && (
                                <CheckCircle
                                  size={14}
                                  className="text-blue-500"
                                />
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-${typeConfig?.color}-100 text-${typeConfig?.color}-700 border border-${typeConfig?.color}-200`}
                              >
                                <TypeIcon size={14} />
                                {typeConfig?.label}
                              </span>

                              {project.industry && (
                                <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-lg font-semibold border border-purple-200">
                                  {project.industry}
                                </span>
                              )}

                              {project.urgency_level === "urgent" && (
                                <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-lg font-semibold border border-red-200 flex items-center gap-1">
                                  <Zap size={12} />
                                  Urgent
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-[#667085]">
                              <span className="flex items-center gap-1">
                                <Users size={14} />
                                {project.application_count || 0} interested
                              </span>
                              <span>•</span>
                              <span>{project.view_count || 0} views</span>
                            </div>
                          </div>

                          <button
                            className="ml-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickApply(project.id);
                            }}
                          >
                            Apply Now
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 text-center">
                  <a
                    href="/collaborations"
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors inline-flex items-center gap-2"
                  >
                    View All Opportunities
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Creator Momentum Panel */}
          <div className="space-y-6">
            {/* Creator Momentum Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 text-white shadow-xl sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Award size={24} className="text-yellow-300" />
                <h3 className="text-2xl font-bold">Your Momentum</h3>
              </div>

              {creatorMomentum ? (
                <div className="space-y-4">
                  {/* Profile Strength */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Profile Strength
                      </span>
                      <span className="text-2xl font-bold">
                        {creatorMomentum.profileStrength}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-yellow-300 h-2 rounded-full transition-all"
                        style={{
                          width: `${creatorMomentum.profileStrength}%`,
                        }}
                      ></div>
                    </div>
                    {creatorMomentum.profileStrength < 100 && (
                      <a
                        href="/profile/setup"
                        className="text-xs text-yellow-200 hover:text-yellow-100 mt-2 inline-block"
                      >
                        Complete your profile →
                      </a>
                    )}
                  </div>

                  {/* Applications Sent */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Send size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {creatorMomentum.applicationsSent}
                        </div>
                        <div className="text-sm text-white/80">
                          Applications Sent
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Collaborations */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {creatorMomentum.activeCollabs}
                        </div>
                        <div className="text-sm text-white/80">
                          Active Projects
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Rate (Placeholder) */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Target size={20} />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {creatorMomentum.responseRate}%
                        </div>
                        <div className="text-sm text-white/80">
                          Response Rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 size={48} className="mx-auto text-white/50 mb-3" />
                  <p className="text-white/80">Loading your stats...</p>
                </div>
              )}

              {/* CTA */}
              <a
                href="/dashboard"
                className="mt-6 block bg-white text-purple-600 text-center px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
              >
                View Full Dashboard
              </a>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#111418] mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <a
                  href="/collaborations/create"
                  className="block bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 px-4 py-3 rounded-xl font-semibold hover:from-purple-100 hover:to-blue-100 transition-all border border-purple-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Post Collaboration
                </a>

                <a
                  href="/marketplace"
                  className="block bg-gradient-to-r from-green-50 to-teal-50 text-green-700 px-4 py-3 rounded-xl font-semibold hover:from-green-100 hover:to-teal-100 transition-all border border-green-200 flex items-center gap-2"
                >
                  <Briefcase size={20} />
                  Browse Marketplace
                </a>

                <a
                  href="/create-reel"
                  className="block bg-gradient-to-r from-orange-50 to-pink-50 text-orange-700 px-4 py-3 rounded-xl font-semibold hover:from-orange-100 hover:to-pink-100 transition-all border border-orange-200 flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  Generate Content
                </a>

                <a
                  href="/ai-studio"
                  className="block bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-3 rounded-xl font-semibold hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200 flex items-center gap-2"
                >
                  <Zap size={20} />
                  AI Studio
                </a>
              </div>
            </div>
          </div>
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
