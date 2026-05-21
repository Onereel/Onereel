import { useCallback } from "react";
import { signIn, signOut } from "@auth/create/react";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * STREAMLINED AUTH HOOK — EMAIL + GOOGLE ONLY
 * ═══════════════════════════════════════════════════════════════════════
 *
 * ❌ REMOVED: Twitter/X authentication (eliminated to reduce friction)
 * ❌ REMOVED: Facebook authentication (not needed)
 *
 * ✅ SUPPORTED:
 * - Email/Password (credentials)
 * - Google OAuth (recommended)
 *
 * GUARANTEES:
 * ✅ No automatic sign-in attempts on app load
 * ✅ Credential errors logged as warnings only
 * ✅ No automatic retries on failed sign-in
 * ✅ All sign-in calls wrapped in error handling
 * ✅ Frontend controls all navigation (redirect: false)
 * ═══════════════════════════════════════════════════════════════════════
 */

function useAuth() {
  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl")
      : null;

  const signInWithCredentials = useCallback(
    async (options) => {
      try {
        console.log("[useAuth] Attempting credentials sign-in...");

        // ✅ FORCE redirect: false - frontend controls navigation
        const result = await signIn("credentials-signin", {
          ...options,
          callbackUrl: callbackUrl ?? options.callbackUrl,
          redirect: false, // ✅ Never auto-redirect on credentials
        });

        // ✅ Check for credential errors (CredentialsSignin)
        if (result?.error) {
          console.warn("[useAuth] Credentials sign-in failed:", result.error);
          // Don't throw - return error to caller
          return { error: result.error };
        }

        console.log("[useAuth] ✓ Credentials sign-in successful");
        return result;
      } catch (error) {
        // ✅ Catch any unexpected errors from Auth.js
        console.warn("[useAuth] Sign-in error caught:", error.message || error);
        return { error: error.message || "Sign-in failed" };
      }
    },
    [callbackUrl],
  );

  const signUpWithCredentials = useCallback(
    async (options) => {
      try {
        console.log("[useAuth] Attempting credentials sign-up...");

        // ✅ FORCE redirect: false - frontend controls navigation
        const result = await signIn("credentials-signup", {
          ...options,
          callbackUrl: callbackUrl ?? options.callbackUrl,
          redirect: false, // ✅ Never auto-redirect on credentials
        });

        if (result?.error) {
          console.warn("[useAuth] Credentials sign-up failed:", result.error);
          return { error: result.error };
        }

        console.log("[useAuth] ✓ Credentials sign-up successful");
        return result;
      } catch (error) {
        console.warn("[useAuth] Sign-up error caught:", error.message || error);
        return { error: error.message || "Sign-up failed" };
      }
    },
    [callbackUrl],
  );

  const signInWithGoogle = useCallback(
    async (options) => {
      try {
        return await signIn("google", {
          ...options,
          callbackUrl: callbackUrl ?? options.callbackUrl,
        });
      } catch (error) {
        console.warn("[useAuth] Google sign-in error:", error.message);
        return { error: error.message || "Google sign-in failed" };
      }
    },
    [callbackUrl],
  );

  const safeSignOut = useCallback(async (options) => {
    try {
      console.log("[useAuth] Signing out...");
      await signOut(options);
      console.log("[useAuth] ✓ Sign-out successful");
    } catch (error) {
      console.warn("[useAuth] Sign-out error:", error.message);
      // Even if sign-out fails, treat as successful (fail-soft)
    }
  }, []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signOut: safeSignOut,
  };
}

export default useAuth;
