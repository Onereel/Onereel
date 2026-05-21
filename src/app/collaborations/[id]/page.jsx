"use client";

import { useState } from "react";
import useUser from "@/utils/useUser";
import { Sparkles } from "lucide-react";
import { COLLAB_TYPE_CONFIG } from "@/components/CollaborationDetail/constants";
import { LoadingState } from "@/components/CollaborationDetail/LoadingState";
import { ErrorState } from "@/components/CollaborationDetail/ErrorState";
import { HeaderActions } from "@/components/CollaborationDetail/HeaderActions";
import { CollaborationBadges } from "@/components/CollaborationDetail/CollaborationBadges";
import { CollaborationMeta } from "@/components/CollaborationDetail/CollaborationMeta";
import { KeyDetailsGrid } from "@/components/CollaborationDetail/KeyDetailsGrid";
import { RolesNeeded } from "@/components/CollaborationDetail/RolesNeeded";
import { RequiredSkills } from "@/components/CollaborationDetail/RequiredSkills";
import { ReferenceLinks } from "@/components/CollaborationDetail/ReferenceLinks";
import { ApplicationsSection } from "@/components/CollaborationDetail/ApplicationsSection";
import { AcceptedEditorSection } from "@/components/CollaborationDetail/AcceptedEditorSection";
import { AIMatchScore } from "@/components/CollaborationDetail/AIMatchScore";
import { CreatorCard } from "@/components/CollaborationDetail/CreatorCard";
import { ApplyModal } from "@/components/CollaborationDetail/ApplyModal";
import { useCollaborationDetail } from "@/hooks/useCollaborationDetail";
import { useCollaborationApplications } from "@/hooks/useCollaborationApplications";
import { useCollaborationActions } from "@/hooks/useCollaborationActions";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * COLLABORATION DETAIL PAGE
 * Full opportunity view with instant application flow
 * Improved error handling: loading, auth error, network error, not found
 * Creator applications management section
 * Shows accepted editor and workspace for creators
 * ═══════════════════════════════════════════════════════════════════════
 */

export default function CollaborationDetailPage({ params }) {
  const { data: user } = useUser();
  const [showApplyModal, setShowApplyModal] = useState(false);

  const {
    collaboration,
    loading,
    error,
    errorType,
    saved,
    setSaved,
    hasApplied,
    setHasApplied,
    applicationStatus,
    workspaceId,
    isCreator,
    workspaceInfo,
    acceptedEditorInfo,
    refetch: refetchCollaboration,
  } = useCollaborationDetail(params.id);

  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    isOwner,
    updateApplicationStatus,
    refetch: refetchApplications,
  } = useCollaborationApplications(params.id, collaboration, user);

  const { handleSave, handleShare, handleApplyClick } = useCollaborationActions(
    params.id,
    user,
    setSaved,
    refetchCollaboration,
  );

  // Wrap updateApplicationStatus to handle workspace redirect
  const handleUpdateApplicationStatus = async (applicationId, status) => {
    const result = await updateApplicationStatus(applicationId, status);

    // If accepting and workspace was created, redirect to workspace
    if (result && status === "accepted" && result.workspaceId) {
      console.log(
        "[CollaborationDetail] Redirecting to workspace:",
        result.workspaceId,
      );
      if (typeof window !== "undefined") {
        window.location.href = `/workspace/${result.workspaceId}`;
      }
    }
  };

  const onApplyClick = async () => {
    const canApply = await handleApplyClick();
    if (canApply) {
      setShowApplyModal(true);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        errorType={errorType}
        onRetry={refetchCollaboration}
      />
    );
  }

  if (!collaboration) {
    return (
      <ErrorState
        error="This opportunity may have been removed or doesn't exist"
        errorType="notFound"
        onRetry={refetchCollaboration}
      />
    );
  }

  const typeConfig = COLLAB_TYPE_CONFIG[collaboration.collab_type];
  const TypeIcon = typeConfig?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] via-white to-[#F8F9FB]">
      {/* Header Actions */}
      <HeaderActions
        saved={saved}
        onSave={handleSave}
        onShare={() => handleShare(collaboration)}
      />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              {/* Badges */}
              <CollaborationBadges
                collaboration={collaboration}
                typeConfig={typeConfig}
                TypeIcon={TypeIcon}
              />

              {/* Title */}
              <h1 className="text-4xl font-extrabold text-[#111418] mb-6 leading-tight">
                {collaboration.title}
              </h1>

              {/* Meta Info */}
              <CollaborationMeta collaboration={collaboration} />

              {/* Vision */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#111418] mb-3">
                  Project Vision
                </h2>
                <p className="text-[#667085] leading-relaxed whitespace-pre-wrap">
                  {collaboration.vision}
                </p>
              </div>

              {/* Key Details Grid */}
              <KeyDetailsGrid collaboration={collaboration} />

              {/* Roles Needed */}
              <RolesNeeded roles={collaboration.roles_needed} />

              {/* Required Skills */}
              <RequiredSkills skills={collaboration.required_skills} />

              {/* Reference Links */}
              <ReferenceLinks urls={collaboration.reference_urls} />
            </div>

            {/* ACCEPTED EDITOR SECTION - Only for creator when workspace exists */}
            {isCreator && acceptedEditorInfo && workspaceId && (
              <AcceptedEditorSection
                acceptedEditor={acceptedEditorInfo}
                workspaceId={workspaceId}
              />
            )}

            {/* APPLICATIONS SECTION - Only for owner when no one accepted yet */}
            {isOwner && !workspaceId && (
              <ApplicationsSection
                applications={applications}
                loading={applicationsLoading}
                error={applicationsError}
                onUpdateStatus={handleUpdateApplicationStatus}
                onRetry={refetchApplications}
              />
            )}

            {/* AI Match Score */}
            {user && !isOwner && <AIMatchScore />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Creator Card */}
            <CreatorCard
              collaboration={collaboration}
              isOwner={isOwner}
              hasApplied={hasApplied}
              applicationStatus={applicationStatus}
              workspaceId={workspaceId}
              applicationsCount={applications.length}
              onApply={onApplyClick}
            />
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          collaborationId={params.id}
          collaborationTitle={collaboration.title}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setHasApplied(true);
            refetchCollaboration();
          }}
        />
      )}
    </div>
  );
}
