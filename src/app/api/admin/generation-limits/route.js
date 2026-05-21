import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔒 ADMIN: GENERATION LIMITS MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Endpoints to manage video generation limits:
 * - GET: View current limits and settings
 * - POST: Update global free tier limit
 * - PUT: Set per-user limit overrides
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

/**
 * Check if user is admin
 */
async function isAdmin(userId) {
  const adminCheck = await sql`
    SELECT * FROM admin_users WHERE user_id = ${userId}
  `;
  return adminCheck.length > 0;
}

/**
 * GET: View current generation limits configuration
 */
export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    // Get global limit setting
    const globalLimit = await sql`
      SELECT * FROM platform_settings 
      WHERE setting_key = 'free_tier_generation_limit'
    `;

    // Get all user-specific overrides
    const userOverrides = await sql`
      SELECT 
        ps.setting_key,
        ps.setting_value,
        ps.updated_at,
        p.id as profile_id,
        p.name,
        p.x_username,
        p.subscription_tier
      FROM platform_settings ps
      LEFT JOIN profiles p ON ps.setting_key = 'user_limit_override_' || p.id
      WHERE ps.setting_key LIKE 'user_limit_override_%'
      ORDER BY ps.updated_at DESC
    `;

    // Get usage statistics
    const usageStats = await sql`
      SELECT 
        subscription_tier,
        COUNT(*) as user_count,
        SUM((SELECT COUNT(*) FROM reels WHERE profile_id = p.id)) as total_reels,
        AVG((SELECT COUNT(*) FROM reels WHERE profile_id = p.id)) as avg_reels_per_user
      FROM profiles p
      GROUP BY subscription_tier
    `;

    return Response.json({
      success: true,
      settings: {
        globalLimit:
          globalLimit.length > 0 ? parseInt(globalLimit[0].setting_value) : 3,
        globalLimitLastUpdated: globalLimit[0]?.updated_at || null,
      },
      userOverrides: userOverrides.map((override) => ({
        profileId: override.profile_id,
        name: override.name,
        username: override.x_username,
        tier: override.subscription_tier,
        customLimit: parseInt(override.setting_value),
        setAt: override.updated_at,
      })),
      statistics: usageStats,
    });
  } catch (error) {
    console.error("[Admin] Error fetching generation limits:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch generation limits",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * POST: Update global free tier generation limit
 */
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { limit } = body;

    if (!limit || limit < 0) {
      return Response.json(
        {
          success: false,
          error: "Invalid limit",
          details: "Limit must be a positive number",
        },
        { status: 400 },
      );
    }

    // Update or insert global limit
    await sql`
      INSERT INTO platform_settings (setting_key, setting_value, updated_at)
      VALUES ('free_tier_generation_limit', ${limit.toString()}, CURRENT_TIMESTAMP)
      ON CONFLICT (setting_key)
      DO UPDATE SET 
        setting_value = ${limit.toString()},
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log(
      `[Admin] Global generation limit updated to ${limit} by ${session.user.email}`,
    );

    return Response.json({
      success: true,
      message: `Global generation limit updated to ${limit}`,
      newLimit: limit,
      updatedBy: session.user.email,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Admin] Error updating global limit:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to update generation limit",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * PUT: Set per-user generation limit override
 */
export async function PUT(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const admin = await isAdmin(session.user.id);
    if (!admin) {
      return Response.json(
        { success: false, error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { profileId, limit } = body;

    if (!profileId) {
      return Response.json(
        { success: false, error: "Profile ID is required" },
        { status: 400 },
      );
    }

    // Verify profile exists
    const profile = await sql`
      SELECT * FROM profiles WHERE id = ${profileId}
    `;

    if (profile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    // If limit is null or undefined, remove the override
    if (limit === null || limit === undefined) {
      await sql`
        DELETE FROM platform_settings 
        WHERE setting_key = ${"user_limit_override_" + profileId}
      `;

      console.log(
        `[Admin] Removed limit override for profile ${profileId} by ${session.user.email}`,
      );

      return Response.json({
        success: true,
        message: `Limit override removed for ${profile[0].name}`,
        profileId,
        action: "removed",
      });
    }

    if (limit < 0) {
      return Response.json(
        {
          success: false,
          error: "Invalid limit",
          details: "Limit must be a positive number or null to remove override",
        },
        { status: 400 },
      );
    }

    // Set user-specific override
    await sql`
      INSERT INTO platform_settings (setting_key, setting_value, updated_at)
      VALUES (${"user_limit_override_" + profileId}, ${limit.toString()}, CURRENT_TIMESTAMP)
      ON CONFLICT (setting_key)
      DO UPDATE SET 
        setting_value = ${limit.toString()},
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log(
      `[Admin] Set limit override for profile ${profileId} to ${limit} by ${session.user.email}`,
    );

    return Response.json({
      success: true,
      message: `Custom limit of ${limit} set for ${profile[0].name}`,
      profileId,
      profileName: profile[0].name,
      newLimit: limit,
      updatedBy: session.user.email,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Admin] Error setting user limit override:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to set user limit override",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
