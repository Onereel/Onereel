import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔐 BETA ACCESS CHECK
 * ═══════════════════════════════════════════════════════════════════════
 * Check if email is whitelisted for beta access
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json(
        { success: false, error: "Email required" },
        { status: 400 },
      );
    }

    // Check if beta mode is enabled
    const betaSettings = await sql`
      SELECT setting_value FROM platform_settings 
      WHERE setting_key = 'beta_mode_enabled'
    `;

    const betaModeEnabled =
      betaSettings.length > 0
        ? betaSettings[0].setting_value === "true"
        : false;

    // If beta mode is disabled, everyone has access
    if (!betaModeEnabled) {
      return Response.json({
        success: true,
        hasAccess: true,
        betaModeEnabled: false,
      });
    }

    // Check if email is whitelisted
    const whitelist = await sql`
      SELECT * FROM beta_whitelist 
      WHERE email = ${email.toLowerCase()}
    `;

    const hasAccess = whitelist.length > 0;

    return Response.json({
      success: true,
      hasAccess,
      betaModeEnabled: true,
      whitelisted: hasAccess,
    });
  } catch (error) {
    console.error("[Beta] Error checking access:", error);
    return Response.json(
      { success: false, error: "Failed to check beta access" },
      { status: 500 },
    );
  }
}
