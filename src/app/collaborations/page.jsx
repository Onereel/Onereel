"use client";

import useUser from "@/utils/useUser";
import GuidedFirstCollaboration from "@/components/GuidedFirstCollaboration";
import RecommendedForYou from "@/components/RecommendedForYou";
import SkillSelectorModal from "@/components/SkillSelectorModal";
import { HeroSection } from "@/components/CollaborationsPage/HeroSection";
import { ActiveProjectsSection } from "@/components/CollaborationsPage/ActiveProjectsSection";
import { AdvancedFilters } from "@/components/CollaborationsPage/AdvancedFilters";
import { OpportunityFeed } from "@/components/CollaborationsPage/OpportunityFeed";
import { Sidebar } from "@/components/CollaborationsPage/Sidebar";
import { MobilePostButton } from "@/components/CollaborationsPage/MobilePostButton";
import { useCollaborationsPage } from "@/hooks/useCollaborationsPage";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLABORATION NETWORK - PREMIUM CREATOR OPPORTUNITY FEED
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Psychology:
 * - "I might miss a big opportunity if I don't check this"
 * - "Serious creators are here"
 * - "This is where careers grow"
 *
 * NOT a gig marketplace. A creator network.
 */

export default function CollaborationsPage() {
  const { data: user } = useUser();

  const {
    collaborations,
    recommendations,
    activeMatches,
    activeProjects,
    loading,
    showGuidedFlow,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    showSkillSelector,
    setShowSkillSelector,
    handleSave,
    handleGuidedFlowComplete,
    handleExploreProjects,
    handleSkillsNeeded,
    handleSkillsSaved,
  } = useCollaborationsPage();

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
        onFiltersChange={setFilters}
        collaborationsCount={collaborations.length}
        activeMatchesCount={activeMatches.length}
        recommendedCollaboratorsCount={recommendations.collaborators.length}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8" id="feed">
        {/* ⭐ YOUR ACTIVE PROJECTS - NEW SECTION AT TOP */}
        {user && <ActiveProjectsSection activeProjects={activeProjects} />}

        {/* ⭐ RECOMMENDED FOR YOU - Lazy Loaded */}
        <RecommendedForYou onSkillsNeeded={handleSkillsNeeded} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advanced Filters Toggle */}
            <AdvancedFilters
              filters={filters}
              onFiltersChange={setFilters}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />

            {/* Opportunity Feed - Enhanced with skeleton loader */}
            <OpportunityFeed
              collaborations={collaborations}
              loading={loading}
              onSave={(collabId) => handleSave(collabId, user)}
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

      {/* Mobile Sticky Post Button */}
      <MobilePostButton />
    </div>
  );
}
