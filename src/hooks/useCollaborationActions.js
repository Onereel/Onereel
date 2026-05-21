export function useCollaborationActions(
  collaborationId,
  user,
  setSaved,
  refetchCollaboration,
) {
  const handleSave = async () => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    try {
      const response = await fetch(
        `/api/collaborations/${collaborationId}/save`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setSaved(data.saved);
        refetchCollaboration();
      }
    } catch (error) {
      console.error("Error saving collaboration:", error);
    }
  };

  const handleShare = async (collaboration) => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: collaboration.title,
        text: collaboration.vision,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleApplyClick = async () => {
    if (!user) {
      window.location.href = "/account/signin";
      return;
    }

    try {
      const profileCheck = await fetch("/api/profiles/check");
      const profileData = await profileCheck.json();

      if (!profileData.exists || profileData.needsSetup) {
        window.location.href = `/profile/setup?returnTo=${encodeURIComponent(`/collaborations/${collaborationId}`)}&action=${encodeURIComponent("apply to this collaboration")}`;
        return false;
      }
    } catch (error) {
      console.error("Error checking profile:", error);
    }

    return true;
  };

  return {
    handleSave,
    handleShare,
    handleApplyClick,
  };
}
