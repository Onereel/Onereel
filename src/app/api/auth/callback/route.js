import { auth } from "@/auth";
import {
  ensureProfile,
  isProfileComplete,
} from "@/app/api/utils/profile-manager";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ONE REEL OAUTH CALLBACK - CENTRALIZED PROFILE MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This endpoint runs AFTER OAuth completes successfully
 *
 * Flow:
 * 1. OAuth completes → session created
 * 2. Ensure profile exists (auto-create if needed via centralized manager)
 * 3. If profile incomplete → redirect to /profile/setup
 * 4. If profile complete → redirect to /opportunity-hub
 *
 * ✅ Uses centralized profile-manager utility
 * ✅ Guaranteed profile creation for all auth methods
 * ✅ Consistent profile structure across the app
 * ═══════════════════════════════════════════════════════════════════════
 */
export async function GET(request) {
  try {
    console.log("[OAuth Callback] ═══════════════════════════════════════");
    console.log("[OAuth Callback] Starting callback handler");

    // Get authenticated session
    const session = await auth();

    if (!session || !session.user) {
      console.error("[OAuth Callback] ❌ No session found");
      return Response.redirect(
        new URL("/account/signin?error=no_session", request.url),
      );
    }

    const user = session.user;
    console.log("[OAuth Callback] ✅ User authenticated:", user.id, user.email);

    // ✅ ENSURE PROFILE EXISTS (uses centralized manager)
    try {
      const profile = await ensureProfile(user.id, user.email, user.name, {
        image: user.image,
      });

      console.log("[OAuth Callback] Profile status:", {
        id: profile.id,
        username: profile.username,
        onboarding_completed: profile.onboarding_completed,
      });

      // Check if profile setup is complete
      if (!isProfileComplete(profile)) {
        console.log(
          "[OAuth Callback] Profile incomplete, redirecting to setup",
        );
        console.log("[OAuth Callback] ═══════════════════════════════════════");
        return Response.redirect(new URL("/profile/setup", request.url));
      }

      console.log(
        "[OAuth Callback] ✅ Profile complete, redirecting to Opportunity Hub",
      );
      console.log("[OAuth Callback] ═══════════════════════════════════════");
      return Response.redirect(new URL("/opportunity-hub", request.url));
    } catch (error) {
      console.error(
        "[OAuth Callback] ❌ Error managing profile:",
        error.message,
      );
      console.log("[OAuth Callback] ═══════════════════════════════════════");
      return Response.redirect(
        new URL("/account/signin?error=profile_creation_failed", request.url),
      );
    }
  } catch (error) {
    console.error("[OAuth Callback] ❌ Unexpected error:", error.message);
    console.error("[OAuth Callback] Stack:", error.stack);
    console.log("[OAuth Callback] ═══════════════════════════════════════");

    return Response.redirect(
      new URL(
        `/account/signin?error=callback_failed&details=${encodeURIComponent(error.message)}`,
        request.url,
      ),
    );
  }
}

export const dynamic = "force-dynamic";
