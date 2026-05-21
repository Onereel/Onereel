import { auth } from "@/lib/safe-auth";
import {
  getProfile,
  isProfileComplete,
  ensureProfile,
} from "@/app/api/utils/profile-manager";

/**
 * Check if current user has a completed profile
 * GET /api/profiles/check
 * Returns: { exists: boolean, profile: object | null, needsSetup: boolean }
 *
 * ✅ Auto-creates profile if missing (fallback protection)
 * ✅ Uses centralized profile management system
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({
        exists: false,
        profile: null,
        needsSetup: true,
        error: "Not authenticated",
      });
    }

    let profile = await getProfile(session.user.id);

    if (!profile) {
      try {
        profile = await ensureProfile(
          session.user.id,
          session.user.email,
          session.user.name,
        );
      } catch (error) {
        console.error("[Profile Check] Failed to auto-create profile:", error);
        return Response.json({
          exists: false,
          profile: null,
          needsSetup: true,
          error: "Profile creation failed",
        });
      }
    }

    const needsSetup = !isProfileComplete(profile);

    return Response.json({
      exists: true,
      profile: profile,
      needsSetup: needsSetup,
    });
  } catch (error) {
    console.error("[Profile Check] Error:", error);
    return Response.json(
      { exists: false, profile: null, needsSetup: true, error: error.message },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
