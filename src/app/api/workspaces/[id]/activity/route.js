import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE ACTIVITY API
 * Get activity feed for a workspace
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log(
    "[Workspace Activity API] GET: Fetching activity for workspace:",
    params.id,
  );

  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;

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

    // Verify access to workspace
    const workspace = await sql`
      SELECT creator_id, editor_id FROM workspaces WHERE id = ${id}
    `;

    if (!workspace || workspace.length === 0) {
      return Response.json(
        { success: false, error: "Workspace not found" },
        { status: 404 },
      );
    }

    if (
      workspace[0].creator_id !== profileId &&
      workspace[0].editor_id !== profileId
    ) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Get activity with actor details
    const activity = await sql`
      SELECT 
        a.*,
        p.name as actor_name,
        p.username as actor_username,
        p.profile_image_url as actor_image
      FROM workspace_activity a
      LEFT JOIN profiles p ON a.actor_id = p.id
      WHERE a.workspace_id = ${id}
      ORDER BY a.created_at DESC
      LIMIT 50
    `;

    return Response.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("[Workspace Activity API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
