import { useState, useEffect } from "react";
import { triggerNotificationRefresh } from "@/hooks/useNotifications";

export function useCollaborationApplications(
  collaborationId,
  collaboration,
  user,
) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchApplications = async () => {
    console.log("[useCollaborationApplications] Fetching applications...");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/collaborations/${collaborationId}/applications`,
      );
      console.log(
        "[useCollaborationApplications] Applications response status:",
        response.status,
      );

      const data = await response.json();
      console.log(
        "[useCollaborationApplications] Applications response data:",
        data,
      );

      if (!response.ok) {
        if (response.status === 401 || data.needsAuth) {
          console.log(
            "[useCollaborationApplications] ⚠️ Auth required for applications",
          );
          setError("authentication");
        } else if (response.status === 403 || data.unauthorized) {
          console.log(
            "[useCollaborationApplications] ⚠️ Unauthorized to view applications",
          );
          setError("unauthorized");
        } else {
          console.error(
            "[useCollaborationApplications] ❌ Failed to fetch applications",
          );
          setError("serverError");
        }
        setLoading(false);
        return;
      }

      if (data.success && data.applications) {
        console.log(
          "[useCollaborationApplications] ✅ Applications loaded:",
          data.applications.length,
        );
        setApplications(data.applications);
        setIsOwner(true);
      } else {
        console.error(
          "[useCollaborationApplications] ❌ Invalid applications response",
        );
        setError("serverError");
      }
    } catch (error) {
      console.error(
        "[useCollaborationApplications] ❌ Error fetching applications:",
        error,
      );
      setError("networkError");
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status) => {
    console.log(
      "[useCollaborationApplications] Updating application status:",
      applicationId,
      "→",
      status,
    );

    try {
      const response = await fetch(
        `/api/collaborations/${collaborationId}/applications`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId, status }),
        },
      );

      const data = await response.json();
      console.log("[useCollaborationApplications] Response data:", data);

      if (response.ok && data.success) {
        console.log(
          "[useCollaborationApplications] ✅ Application status updated",
        );

        // 🔥 FIX: Trigger notification refresh so bell icon updates immediately
        triggerNotificationRefresh();

        // Return data so component can handle workspace redirect
        fetchApplications();
        return data;
      } else {
        console.error(
          "[useCollaborationApplications] ❌ Failed to update application status",
        );
        alert(
          data.error ||
            "Failed to update application status. Please try again.",
        );
        return null;
      }
    } catch (error) {
      console.error(
        "[useCollaborationApplications] ❌ Error updating application:",
        error,
      );
      alert("An error occurred. Please try again.");
      return null;
    }
  };

  useEffect(() => {
    // Only fetch applications if we have collaboration data and user is logged in
    // The API will verify ownership and return 403 if not the owner
    if (collaboration && user && collaborationId) {
      console.log(
        "[useCollaborationApplications] Triggering applications fetch:",
        {
          collaborationId,
          hasUser: !!user,
          creatorId: collaboration.creator_id,
        },
      );
      fetchApplications();
    } else {
      console.log(
        "[useCollaborationApplications] Skipping applications fetch:",
        {
          hasCollaboration: !!collaboration,
          hasUser: !!user,
          collaborationId,
        },
      );
    }
  }, [collaboration, user, collaborationId]);

  return {
    applications,
    loading,
    error,
    isOwner,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
}
