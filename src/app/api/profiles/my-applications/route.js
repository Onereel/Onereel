import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * MY APPLICATIONS API
 * Get all applications submitted by current user
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  console.log("[My Applications API] GET: Fetching applications");

  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Get user's profile
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (!profile || profile.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;

    // Get all applications by this user with collaboration and creator details
    const applications = await sql`
      SELECT 
        ca.id as application_id,
        ca.status,
        ca.created_at,
        ca.message,
        c.id as collaboration_id,
        c.title,
        c.collab_type,
        c.status as collaboration_status,
        creator.name as creator_name,
        creator.username as creator_username,
        creator.profile_image_url as creator_image,
        w.id as workspace_id
      FROM collaboration_applications ca
      JOIN collaborations c ON ca.collaboration_id = c.id
      JOIN profiles creator ON c.creator_id = creator.id
      LEFT JOIN workspaces w ON ca.id = w.application_id
      WHERE ca.applicant_id = ${profileId}
      ORDER BY ca.created_at DESC
    `;

    console.log(
      "[My Applications API] GET: ✅ Found",
      applications.length,
      "applications",
    );

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("[My Applications API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
