import { useState, useEffect } from "react";

export function useCollaborationDetail(collaborationId) {
  const [collaboration, setCollaboration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [appliedAt, setAppliedAt] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState(null);
  const [acceptedEditorInfo, setAcceptedEditorInfo] = useState(null);

  const fetchCollaboration = async () => {
    console.log(
      "[useCollaborationDetail] Fetching collaboration:",
      collaborationId,
    );
    setLoading(true);
    setError(null);
    setErrorType(null);

    try {
      const response = await fetch(`/api/collaborations/${collaborationId}`);
      console.log("[useCollaborationDetail] Response status:", response.status);

      const data = await response.json();
      console.log("[useCollaborationDetail] Response data:", data);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(
            "[useCollaborationDetail] ❌ 404 - Collaboration not found",
          );
          setErrorType("notFound");
          setError("This collaboration does not exist or has been removed.");
        } else if (response.status >= 500) {
          console.error("[useCollaborationDetail] ❌ Server error");
          setErrorType("serverError");
          setError(
            "We couldn't load this collaboration right now. Please try again.",
          );
        } else {
          console.error(
            "[useCollaborationDetail] ❌ Unexpected error:",
            response.status,
          );
          setErrorType("serverError");
          setError(data.error || "Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (!data.success) {
        if (data.notFound) {
          console.log(
            "[useCollaborationDetail] ❌ Collaboration not found (from API)",
          );
          setErrorType("notFound");
          setError("This collaboration does not exist or has been removed.");
        } else if (data.serverError) {
          console.error("[useCollaborationDetail] ❌ Server error (from API)");
          setErrorType("serverError");
          setError(
            data.error ||
              "We couldn't load this collaboration right now. Please try again.",
          );
        } else {
          console.error("[useCollaborationDetail] ❌ Unknown error");
          setErrorType("serverError");
          setError(data.error || "Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (!data.collaboration) {
        console.error(
          "[useCollaborationDetail] ❌ No collaboration data in response",
        );
        setErrorType("serverError");
        setError("Invalid response from server. Please try again.");
        setLoading(false);
        return;
      }

      console.log(
        "[useCollaborationDetail] ✅ Collaboration loaded successfully:",
        data.collaboration.title,
      );
      console.log(
        "[useCollaborationDetail] Collaboration status:",
        data.collaboration.status,
      );
      console.log(
        "[useCollaborationDetail] Application count:",
        data.collaboration.application_count,
      );
      console.log(
        "[useCollaborationDetail] Creator ID:",
        data.collaboration.creator_id,
      );
      console.log(
        "[useCollaborationDetail] Current user profile ID:",
        data.currentProfileId,
      );
      console.log("[useCollaborationDetail] Is creator:", data.isCreator);
      console.log(
        "[useCollaborationDetail] Application status:",
        data.applicationStatus,
      );
      console.log("[useCollaborationDetail] Workspace ID:", data.workspaceId);
      console.log(
        "[useCollaborationDetail] Workspace info:",
        data.workspaceInfo,
      );
      console.log(
        "[useCollaborationDetail] Accepted editor:",
        data.acceptedEditorInfo,
      );

      setCollaboration(data.collaboration);
      setSaved(data.isSaved || false);
      setHasApplied(data.hasApplied || false);
      setApplicationStatus(data.applicationStatus || null);
      setApplicationId(data.applicationId || null);
      setWorkspaceId(data.workspaceId || null);
      setAppliedAt(data.appliedAt || null);
      setIsCreator(data.isCreator || false);
      setWorkspaceInfo(data.workspaceInfo || null);
      setAcceptedEditorInfo(data.acceptedEditorInfo || null);

      // Increment view count (fire and forget)
      fetch(`/api/collaborations/${collaborationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ incrementViews: true }),
      }).catch((err) => console.warn("Failed to increment view count:", err));
    } catch (error) {
      console.error("[useCollaborationDetail] ❌ Network error:", error);
      setErrorType("networkError");
      setError(
        "Could not connect to the server. Please check your internet connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaboration();
  }, [collaborationId]);

  return {
    collaboration,
    loading,
    error,
    errorType,
    saved,
    setSaved,
    hasApplied,
    setHasApplied,
    applicationStatus,
    applicationId,
    workspaceId,
    appliedAt,
    isCreator,
    workspaceInfo,
    acceptedEditorInfo,
    refetch: fetchCollaboration,
  };
}
