import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * 🔐 BETA ACCESS WHITELIST
 * ═══════════════════════════════════════════════════════════════════════
 * Manage beta access whitelist
 */

async function isAdmin(userId) {
  const adminCheck = await sql`
    SELECT * FROM admin_users WHERE user_id = ${userId}
  `;
  return adminCheck.length > 0;
}

/**
 * GET: List all whitelisted emails
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

    const whitelist = await sql`
      SELECT * FROM beta_whitelist 
      ORDER BY invited_at DESC
    `;

    const betaSettings = await sql`
      SELECT setting_value FROM platform_settings 
      WHERE setting_key = 'beta_mode_enabled'
    `;

    return Response.json({
      success: true,
      betaModeEnabled:
        betaSettings.length > 0
          ? betaSettings[0].setting_value === "true"
          : false,
      whitelist: whitelist.map((entry) => ({
        id: entry.id,
        email: entry.email,
        invitedBy: entry.invited_by,
        invitedAt: entry.invited_at,
        used: entry.used,
        usedAt: entry.used_at,
      })),
      stats: {
        total: whitelist.length,
        used: whitelist.filter((e) => e.used).length,
        pending: whitelist.filter((e) => !e.used).length,
      },
    });
  } catch (error) {
    console.error("[Beta] Error fetching whitelist:", error);
    return Response.json(
      { success: false, error: "Failed to fetch whitelist" },
      { status: 500 },
    );
  }
}

/**
 * POST: Add email to whitelist
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
    const { email, emails } = body;

    // Support single email or bulk emails
    const emailList = emails || [email];

    if (!emailList || emailList.length === 0) {
      return Response.json(
        { success: false, error: "Email(s) required" },
        { status: 400 },
      );
    }

    const results = [];

    for (const emailAddr of emailList) {
      try {
        await sql`
          INSERT INTO beta_whitelist (email, invited_by)
          VALUES (${emailAddr.toLowerCase()}, ${session.user.email})
          ON CONFLICT (email) DO NOTHING
        `;
        results.push({ email: emailAddr, success: true });
      } catch (err) {
        results.push({ email: emailAddr, success: false, error: err.message });
      }
    }

    console.log(
      `[Beta] ${results.filter((r) => r.success).length} emails whitelisted by ${session.user.email}`,
    );

    return Response.json({
      success: true,
      message: `${results.filter((r) => r.success).length} email(s) whitelisted`,
      results,
    });
  } catch (error) {
    console.error("[Beta] Error adding to whitelist:", error);
    return Response.json(
      { success: false, error: "Failed to add to whitelist" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Remove email from whitelist
 */
export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        { success: false, error: "Email required" },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM beta_whitelist 
      WHERE email = ${email.toLowerCase()}
    `;

    console.log(`[Beta] Email removed from whitelist: ${email}`);

    return Response.json({
      success: true,
      message: `Email removed from whitelist`,
    });
  } catch (error) {
    console.error("[Beta] Error removing from whitelist:", error);
    return Response.json(
      { success: false, error: "Failed to remove from whitelist" },
      { status: 500 },
    );
  }
}

/**
 * PUT: Toggle beta mode
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
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return Response.json(
        { success: false, error: "enabled must be boolean" },
        { status: 400 },
      );
    }

    await sql`
      INSERT INTO platform_settings (setting_key, setting_value, updated_at)
      VALUES ('beta_mode_enabled', ${enabled.toString()}, CURRENT_TIMESTAMP)
      ON CONFLICT (setting_key)
      DO UPDATE SET 
        setting_value = ${enabled.toString()},
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log(
      `[Beta] Beta mode ${enabled ? "enabled" : "disabled"} by ${session.user.email}`,
    );

    return Response.json({
      success: true,
      message: `Beta mode ${enabled ? "enabled" : "disabled"}`,
      betaModeEnabled: enabled,
    });
  } catch (error) {
    console.error("[Beta] Error toggling beta mode:", error);
    return Response.json(
      { success: false, error: "Failed to toggle beta mode" },
      { status: 500 },
    );
  }
}
