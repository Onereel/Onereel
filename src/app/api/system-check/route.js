import { auth } from "@/auth";
import { getProfile } from "@/app/api/utils/profile-manager";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * SYSTEM CHECK - Complete auth, session, and profile diagnostic
 * ═══════════════════════════════════════════════════════════════════════
 *
 * This endpoint provides comprehensive debugging information about:
 * - Environment configuration
 * - Authentication session
 * - Profile status
 * - Database connectivity
 *
 * Use this to diagnose auth/profile issues
 * ═══════════════════════════════════════════════════════════════════════
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  const checks = {
    timestamp,
    environment: {
      AUTH_URL: process.env.AUTH_URL || "NOT_SET",
      NEXTAUTH_URL:
        process.env.NEXTAUTH_URL || "NOT_SET (OK if AUTH_URL is set)",
      NODE_ENV: process.env.NODE_ENV || "development",
      AUTH_SECRET_LENGTH: process.env.AUTH_SECRET?.length || 0,
      DATABASE_CONFIGURED: !!process.env.DATABASE_URL,
    },
    auth: {
      status: "checking",
      session: null,
      user: null,
      profile: null,
    },
    overall_status: "PENDING",
  };

  try {
    // Check auth session
    const session = await auth();

    if (session?.user) {
      checks.auth.status = "authenticated";
      checks.auth.session = {
        hasSession: true,
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      };
      checks.auth.user = session.user;

      // Check profile
      try {
        const profile = await getProfile(session.user.id);

        if (profile) {
          checks.auth.profile = {
            exists: true,
            id: profile.id,
            username: profile.username,
            name: profile.name,
            onboarding_completed: profile.onboarding_completed,
            has_required_fields: !!(profile.username && profile.name),
            is_complete: !!(
              profile.username &&
              profile.name &&
              profile.onboarding_completed
            ),
          };
        } else {
          checks.auth.profile = {
            exists: false,
            warning:
              "Profile not found - should be auto-created on next profile check",
          };
        }
      } catch (profileError) {
        checks.auth.profile = {
          exists: false,
          error: profileError.message,
        };
      }
    } else {
      checks.auth.status = "unauthenticated";
      checks.auth.session = { hasSession: false };
    }

    // Determine overall status
    if (
      checks.auth.status === "authenticated" &&
      checks.auth.profile?.is_complete
    ) {
      checks.overall_status = "HEALTHY";
    } else if (
      checks.auth.status === "authenticated" &&
      checks.auth.profile?.exists
    ) {
      checks.overall_status = "NEEDS_PROFILE_COMPLETION";
    } else if (checks.auth.status === "authenticated") {
      checks.overall_status = "NEEDS_PROFILE_CREATION";
    } else {
      checks.overall_status = "NOT_AUTHENTICATED";
    }

    return Response.json(checks, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    checks.auth.status = "error";
    checks.auth.error = error.message;
    checks.overall_status = "ERROR";

    return Response.json(checks, {
      status: 500,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  }
}

export const dynamic = "force-dynamic";
