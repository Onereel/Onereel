import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🚨 ADMIN SAFETY CONTROLS
 * ═══════════════════════════════════════════════════════════════════════
 * Emergency controls for platform safety
 */

async function isAdmin(userId) {
  const adminCheck = await sql`
    SELECT * FROM admin_users WHERE user_id = ${userId}
  `;
  return adminCheck.length > 0;
}

/**
 * GET: Get current safety settings
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

    // Get all safety settings
    const settings = await sql`
      SELECT * FROM platform_settings 
      WHERE setting_key IN (
        'global_generation_enabled',
        'daily_generation_cap',
        'beta_mode_enabled',
        'free_tier_generation_limit'
      )
    `;

    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.setting_key] = s.setting_value;
    });

    // Get today's generation count
    const today = new Date().toISOString().split("T")[0];
    const todayCount = await sql`
      SELECT COUNT(*) as count 
      FROM reels 
      WHERE DATE(created_at) = ${today}
    `;

    return Response.json({
      success: true,
      settings: {
        globalGenerationEnabled:
          settingsMap.global_generation_enabled === "true",
        dailyGenerationCap: parseInt(
          settingsMap.daily_generation_cap || "1000",
        ),
        betaModeEnabled: settingsMap.beta_mode_enabled === "true",
        freeTierLimit: parseInt(settingsMap.free_tier_generation_limit || "3"),
      },
      stats: {
        todayGenerations: parseInt(todayCount[0].count),
        dailyCap: parseInt(settingsMap.daily_generation_cap || "1000"),
      },
    });
  } catch (error) {
    console.error("[Admin] Error fetching safety controls:", error);
    return Response.json(
      { success: false, error: "Failed to fetch safety controls" },
      { status: 500 },
    );
  }
}

/**
 * POST: Update safety settings
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
    const { setting, value } = body;

    const validSettings = [
      "global_generation_enabled",
      "daily_generation_cap",
      "beta_mode_enabled",
      "free_tier_generation_limit",
    ];

    if (!validSettings.includes(setting)) {
      return Response.json(
        { success: false, error: "Invalid setting" },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO platform_settings (setting_key, setting_value, updated_at)
      VALUES (${setting}, ${value.toString()}, CURRENT_TIMESTAMP)
      ON CONFLICT (setting_key)
      DO UPDATE SET 
        setting_value = ${value.toString()},
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log(
      `[Admin] Safety control updated: ${setting} = ${value} by ${session.user.email}`,
    );

    // Log critical changes
    if (setting === "global_generation_enabled" && value === "false") {
      console.warn(
        `🚨 CRITICAL: Video generation globally disabled by ${session.user.email}`,
      );
    }

    return Response.json({
      success: true,
      message: `Setting updated: ${setting}`,
      setting,
      value,
      updatedBy: session.user.email,
    });
  } catch (error) {
    console.error("[Admin] Error updating safety control:", error);
    return Response.json(
      { success: false, error: "Failed to update safety control" },
      { status: 500 },
    );
  }
}
