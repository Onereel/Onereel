"use client";

import { useEffect } from "react";
import useUser from "@/utils/useUser";
import GuidedFirstCollaboration from "@/components/GuidedFirstCollaboration";
import RecommendedForYou from "@/components/RecommendedForYou";
import SkillSelectorModal from "@/components/SkillSelectorModal";
import { useOpportunityHub } from "@/hooks/useOpportunityHub";
import { useInactivityDetection } from "@/hooks/useInactivityDetection";
import { HeroSection } from "@/components/OpportunityHub/HeroSection";
import { PerfectMatchesSection } from "@/components/OpportunityHub/PerfectMatchesSection";
import { FilterSection } from "@/components/OpportunityHub/FilterSection";
import { OpportunityFeed } from "@/components/OpportunityHub/OpportunityFeed";
import { Sidebar } from "@/components/OpportunityHub/Sidebar";
import { InactivityPrompt } from "@/components/OpportunityHub/InactivityPrompt";
import { MobilePostButton } from "@/components/OpportunityHub/MobilePostButton";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * OPPORTUNITY HUB - THE HEART OF ONE REEL
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This is the PRIMARY destination after authentication.
 * The goal: Make users feel like work is happening RIGHT NOW.
 *
 * Psychology:
 * - "People are collaborating RIGHT NOW"
 * - "I can join something immediately"
 * - "Work is happening here"
 *
 * Success Metric: User can join a collaboration within 10 seconds
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function OpportunityHub() {
  const { data: user } = useUser();

  const {
    collaborations,
    recommendations,
    activeMatches,
    loading,
    showGuidedFlow,
    perfectMatches,
    showInactivityPrompt,
    setShowInactivityPrompt,
    quickApplying,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    showSkillSelector,
    setShowSkillSelector,
    inactivityTimerRef,
    lastActivityRef,
    checkFirstTimeUser,
    seedMarketplace,
    fetchCollaborations,
    fetchRecommendations,
    fetchActiveMatches,
    fetchPerfectMatches,
    handleSave,
    handleQuickApply,
    handleGuidedFlowComplete,
    handleExploreProjects,
    handleSkillsNeeded,
    handleSkillsSaved,
  } = useOpportunityHub(user);

  useInactivityDetection(
    inactivityTimerRef,
    lastActivityRef,
    setShowInactivityPrompt,
  );

  useEffect(() => {
    checkFirstTimeUser();
    seedMarketplace();
    fetchCollaborations();
    fetchRecommendations();
    fetchActiveMatches();
    fetchPerfectMatches();
  }, []);

  useEffect(() => {
    fetchCollaborations();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      {/* Guided First Collaboration Flow */}
      {showGuidedFlow && (
        <GuidedFirstCollaboration
          onComplete={handleGuidedFlowComplete}
          onExplore={handleExploreProjects}
        />
      )}

      {/* Skill Selector Modal */}
      <SkillSelectorModal
        isOpen={showSkillSelector}
        onClose={() => setShowSkillSelector(false)}
        onSave={handleSkillsSaved}
      />

      {/* Enhanced Hero Section */}
      <HeroSection
        filters={filters}
        setFilters={setFilters}
        collaborationsCount={collaborations.length}
        activeMatchesCount={activeMatches.length}
        collaboratorsCount={recommendations.collaborators.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8" id="feed">
        {/* Perfect Matches Section */}
        <PerfectMatchesSection
          user={user}
          perfectMatches={perfectMatches}
          quickApplying={quickApplying}
          handleQuickApply={handleQuickApply}
        />

        {/* Recommended For You - Lazy Loaded */}
        <RecommendedForYou onSkillsNeeded={handleSkillsNeeded} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advanced Filters Toggle */}
            <FilterSection
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              filters={filters}
              setFilters={setFilters}
            />

            {/* Opportunity Feed */}
            <OpportunityFeed
              loading={loading}
              collaborations={collaborations}
              quickApplying={quickApplying}
              handleQuickApply={handleQuickApply}
              handleSave={handleSave}
            />
          </div>

          {/* Sidebar */}
          <Sidebar
            user={user}
            recommendations={recommendations}
            activeMatches={activeMatches}
          />
        </div>
      </div>

      {/* Inactivity Prompt */}
      <InactivityPrompt
        showInactivityPrompt={showInactivityPrompt}
        setShowInactivityPrompt={setShowInactivityPrompt}
        user={user}
        perfectMatches={perfectMatches}
      />

      {/* Mobile Sticky Post Button */}
      <MobilePostButton />
    </div>
  );
}
