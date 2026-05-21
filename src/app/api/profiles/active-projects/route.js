import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ACTIVE PROJECTS API
 * Get all active workspaces for current user (as creator or editor)
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request) {
  console.log("[Active Projects API] GET: Fetching active projects");

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

    // Get all workspaces where user is creator or editor
    const projects = await sql`
      SELECT 
        w.id as workspace_id,
        w.status,
        w.created_at,
        w.updated_at,
        c.title,
        c.collab_type,
        CASE 
          WHEN w.creator_id = ${profileId} THEN 'creator'
          ELSE 'editor'
        END as role,
        CASE 
          WHEN w.creator_id = ${profileId} THEN editor.name
          ELSE creator.name
        END as other_party_name,
        CASE 
          WHEN w.creator_id = ${profileId} THEN editor.username
          ELSE creator.username
        END as other_party_username,
        CASE 
          WHEN w.creator_id = ${profileId} THEN editor.profile_image_url
          ELSE creator.profile_image_url
        END as other_party_image
      FROM workspaces w
      JOIN collaborations c ON w.collaboration_id = c.id
      JOIN profiles creator ON w.creator_id = creator.id
      JOIN profiles editor ON w.editor_id = editor.id
      WHERE w.creator_id = ${profileId} OR w.editor_id = ${profileId}
      ORDER BY w.updated_at DESC
    `;

    console.log(
      "[Active Projects API] GET: ✅ Found",
      projects.length,
      "projects",
    );

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("[Active Projects API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
