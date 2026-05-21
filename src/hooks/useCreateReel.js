import { useState, useEffect, useRef } from "react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * FREE TRIAL LOGIC — 3 FREE REELS FOR GUESTS
 * ═══════════════════════════════════════════════════════════════════════
 *
 * RULES:
 * - Guests can generate 3 reels before signup required
 * - Counter stored in localStorage
 * - After 3rd reel, show upgrade modal
 * - Authenticated users bypass this limit
 *
 * ❌ REMOVED: Premature redirects to /my-reels
 * ✅ ADDED: VideoResultModal shows in-page, handles polling
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

function getGuestReelCount() {
  if (typeof window === "undefined") return 0;
  try {
    const count = localStorage.getItem("guestReelCount");
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

function incrementGuestReelCount() {
  if (typeof window === "undefined") return;
  try {
    const current = getGuestReelCount();
    localStorage.setItem("guestReelCount", (current + 1).toString());
  } catch (err) {
    console.warn("[Free Trial] Failed to update count:", err);
  }
}

function resetGuestReelCount() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("guestReelCount");
  } catch (err) {
    console.warn("[Free Trial] Failed to reset count:", err);
  }
}

export function useCreateReel(user) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [usage, setUsage] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [generatedReel, setGeneratedReel] = useState(null); // ✅ RENAMED: Used by VideoResultModal
  const [guestReelsRemaining, setGuestReelsRemaining] = useState(3);
  const [freeTrialMessage, setFreeTrialMessage] = useState(null);

  const generationTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mood: "energetic",
    cameraStyle: "smooth tracking",
    visualStyle: "neon cyberpunk",
    duration: 30,
  });

  // Track guest reel count
  useEffect(() => {
    if (!user) {
      const count = getGuestReelCount();
      const remaining = Math.max(0, 3 - count);
      setGuestReelsRemaining(remaining);

      console.log("[Free Trial] Guest status:", {
        reelsCreated: count,
        remaining,
      });
    } else {
      // Reset count when user signs in
      resetGuestReelCount();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  async function fetchUsage() {
    try {
      const res = await fetch("/api/subscription/usage");
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ FREE TRIAL CHECK: Block guests after 3 reels
    if (!user) {
      const count = getGuestReelCount();
      if (count >= 3) {
        console.log("[Free Trial] Limit reached, showing upgrade modal");
        setError("Create a free account to continue generating reels!");
        setShowUpgradePrompt(true);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setGeneratedReel(null);
    setFreeTrialMessage(null);

    // ⏱️ TIMEOUT PROTECTION: 15 second max (only for initial request)
    generationTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.warn("[Create Reel] ⚠️ Initial request timeout (15s)");
        setError(
          "Generation request is taking longer than expected. Please try again.",
        );
        setLoading(false);
      }
    }, 15000);

    try {
      console.log("[Create Reel] Submitting generation request:", formData);

      const response = await fetch("/api/reels/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ CRITICAL: Send session cookies
        body: JSON.stringify(formData),
      });

      // Clear timeout on response
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }

      const data = await response.json();

      console.log("[Create Reel] API Response:", {
        success: data.success,
        outcome: data.outcome,
        isGuest: data.isGuest,
        hasReel: !!data.reel,
        videoStatus: data.reel?.video_status,
        videoJobId: data.reel?.metadata?.videoJobId,
      });

      if (data.success === false) {
        if (data.upgradeRequired) {
          setShowUpgradePrompt(true);
          setError(data.message || "Upgrade required to continue");
          setLoading(false);
          return;
        }
        throw new Error(
          data.error || data.details || data.message || "Failed to create reel",
        );
      }

      if (data.success === true) {
        if (!data.reel) {
          console.error("Success response missing reel object:", data);
          throw new Error(
            "Reel creation completed but no content was returned",
          );
        }

        console.log("[Create Reel] ✓ Reel created successfully!");

        // Handle guest generation
        if (data.isGuest) {
          // ✅ INCREMENT FREE TRIAL COUNTER
          incrementGuestReelCount();
          const newCount = getGuestReelCount();
          const remaining = 3 - newCount;

          setGuestReelsRemaining(remaining);

          if (remaining > 0) {
            setFreeTrialMessage(
              `${remaining} free reel${remaining === 1 ? "" : "s"} remaining`,
            );
          } else {
            setFreeTrialMessage(
              "This was your last free reel! Sign up to continue.",
            );
          }

          console.log("[Free Trial] Count updated:", {
            created: newCount,
            remaining,
          });
        }

        // ✅ CRITICAL: Show VideoResultModal instead of redirecting
        // The modal handles all polling and displays the video when ready
        setGeneratedReel(data.reel);
        setSuccess(true);
        setLoading(false);

        return;
      }

      console.error("Unexpected response format:", data);
      throw new Error("Unexpected response from server");
    } catch (err) {
      console.error("Error creating reel:", err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);

      // Clear timeout on error
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    }
  };

  const retryGeneration = () => {
    setError(null);
    setLoading(false);
    setSuccess(false);
    setGeneratedReel(null);
  };

  return {
    loading,
    error,
    success,
    usage,
    showUpgradePrompt,
    generatedReel, // ✅ Used by VideoResultModal
    formData,
    guestReelsRemaining,
    freeTrialMessage,
    setFormData,
    setShowUpgradePrompt,
    setGeneratedReel,
    handleSubmit,
    retryGeneration,
  };
}
