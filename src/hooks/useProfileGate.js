"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";

/**
 * Profile Gate Hook - Ensures user has completed profile before taking action
 *
 * Usage:
 * const { checkProfileAndContinue, hasProfile, loading } = useProfileGate();
 *
 * onClick={() => checkProfileAndContinue('/collaborations/create', 'post a collaboration')}
 */
export function useProfileGate() {
  const { data: user, loading: userLoading } = useUser();
  const [hasProfile, setHasProfile] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Only check profile after user data is loaded
    if (!userLoading && user) {
      console.log("[ProfileGate] User loaded, checking profile...");
      checkProfile();
    } else if (!userLoading && !user) {
      console.log("[ProfileGate] No user found (not authenticated)");
      setHasProfile(false);
    }
  }, [user, userLoading]);

  async function checkProfile() {
    if (!user) {
      console.log("[ProfileGate] No user - cannot check profile");
      setHasProfile(false);
      return false;
    }

    try {
      setChecking(true);
      console.log("[ProfileGate] Fetching profile status for user:", user.id);

      const response = await fetch("/api/profiles/check", {
        credentials: "include",
      });
      const data = await response.json();

      console.log("[ProfileGate] Profile check result:", {
        exists: data.exists,
        needsSetup: data.needsSetup,
        username: data.profile?.username,
        onboarding_completed: data.profile?.onboarding_completed,
      });

      const profileExists = data.exists && data.profile?.onboarding_completed;
      setHasProfile(profileExists);
      return profileExists;
    } catch (error) {
      console.error("[ProfileGate] Error checking profile:", error);
      setHasProfile(false);
      return false;
    } finally {
      setChecking(false);
    }
  }

  /**
   * Check if profile exists, if not redirect to profile setup with return URL
   * @param {string} intendedDestination - Where to go after profile is created
   * @param {string} actionName - Human-readable action name for messaging
   * @returns {boolean} - true if can continue, false if redirected
   */
  async function checkProfileAndContinue(
    intendedDestination,
    actionName = "continue",
  ) {
    console.log("[ProfileGate] checkProfileAndContinue called:", {
      intendedDestination,
      actionName,
      hasUser: !!user,
      userLoading,
    });

    if (!user) {
      // Not logged in - redirect to login
      console.log("[ProfileGate] Not logged in, redirecting to signin");
      window.location.href = `/account/signin?callbackUrl=${encodeURIComponent(intendedDestination)}`;
      return false;
    }

    // Check if profile exists
    console.log("[ProfileGate] User authenticated, checking profile...");
    const profileExists = await checkProfile();

    if (!profileExists) {
      // No profile - redirect to profile setup with return URL
      console.log("[ProfileGate] Profile incomplete, redirecting to setup");
      window.location.href = `/profile/setup?returnTo=${encodeURIComponent(intendedDestination)}&action=${encodeURIComponent(actionName)}`;
      return false;
    }

    // Profile exists - can continue
    console.log("[ProfileGate] ✓ Profile complete, allowing action");
    return true;
  }

  return {
    hasProfile,
    loading: userLoading || checking,
    checkProfile,
    checkProfileAndContinue,
    user,
  };
}

export default useProfileGate;
