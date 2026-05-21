import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE API
 * Get workspace details and update workspace status
 * Only accessible by creator and accepted editor
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log("[Workspace API] GET: Fetching workspace ID:", params.id);

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

    // Get workspace with collaboration and user details
    const workspace = await sql`
      SELECT 
        w.*,
        c.title as collaboration_title,
        c.vision as collaboration_vision,
        c.compensation_details,
        c.estimated_timeline,
        c.collab_type,
        creator.name as creator_name,
        creator.username as creator_username,
        creator.profile_image_url as creator_image,
        editor.name as editor_name,
        editor.username as editor_username,
        editor.profile_image_url as editor_image
      FROM workspaces w
      JOIN collaborations c ON w.collaboration_id = c.id
      JOIN profiles creator ON w.creator_id = creator.id
      JOIN profiles editor ON w.editor_id = editor.id
      WHERE w.id = ${id}
    `;

    if (!workspace || workspace.length === 0) {
      console.log("[Workspace API] GET: ❌ Workspace not found");
      return Response.json(
        { success: false, error: "Workspace not found" },
        { status: 404 },
      );
    }

    const ws = workspace[0];

    // Verify user has access (must be creator or editor)
    if (ws.creator_id !== profileId && ws.editor_id !== profileId) {
      console.warn("[Workspace API] GET: ⚠️ Unauthorized access attempt");
      return Response.json(
        { success: false, error: "You do not have access to this workspace" },
        { status: 403 },
      );
    }

    const isCreator = ws.creator_id === profileId;

    console.log(
      "[Workspace API] GET: ✅ Workspace loaded for",
      isCreator ? "creator" : "editor",
    );

    return Response.json({
      success: true,
      workspace: ws,
      isCreator,
      currentUserId: profileId,
    });
  } catch (error) {
    console.error("[Workspace API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

/**
 * PATCH - Update workspace status
 */
export async function PATCH(request, { params }) {
  console.log("[Workspace API] PATCH: Updating workspace status");

  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json(
        { success: false, error: "Status is required" },
        { status: 400 },
      );
    }

    if (!["active", "in_review", "completed", "cancelled"].includes(status)) {
      return Response.json(
        { success: false, error: "Invalid status" },
        { status: 400 },
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

    // Verify user has access
    const workspace = await sql`
      SELECT creator_id, editor_id, status as current_status
      FROM workspaces
      WHERE id = ${id}
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

    // Update workspace status
    const updated = await sql`
      UPDATE workspaces
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    // Log activity
    await sql`
      INSERT INTO workspace_activity (
        workspace_id,
        actor_id,
        activity_type,
        metadata
      ) VALUES (
        ${id},
        ${profileId},
        'status_changed',
        ${JSON.stringify({ from: workspace[0].current_status, to: status })}
      )
    `;

    console.log("[Workspace API] PATCH: ✅ Status updated to:", status);

    return Response.json({
      success: true,
      workspace: updated[0],
    });
  } catch (error) {
    console.error("[Workspace API] PATCH error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
