import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * CHECK FIRST-TIME USER
 * Detect if user needs guided onboarding
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({
        success: true,
        isFirstTime: false, // Not logged in users don't get the flow
      });
    }

    // Get user's profile
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json({
        success: true,
        isFirstTime: false,
      });
    }

    const profileId = profile[0].id;

    // Check collaborations created
    const collabsCreated = await sql`
      SELECT COUNT(*) as count 
      FROM collaborations 
      WHERE creator_id = ${profileId}
    `;

    // Check applications submitted
    const appsSubmitted = await sql`
      SELECT COUNT(*) as count 
      FROM collaboration_applications 
      WHERE applicant_id = ${profileId}
    `;

    const hasCreated = parseInt(collabsCreated[0].count) > 0;
    const hasApplied = parseInt(appsSubmitted[0].count) > 0;

    const isFirstTime = !hasCreated && !hasApplied;

    return Response.json({
      success: true,
      isFirstTime,
      stats: {
        collaborationsCreated: parseInt(collabsCreated[0].count),
        applicationsSubmitted: parseInt(appsSubmitted[0].count),
      },
    });
  } catch (error) {
    console.error("[Check First Time] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
