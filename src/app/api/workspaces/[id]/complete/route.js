import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE COMPLETION API
 * Mark workspace as completed (creator only)
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function POST(request, { params }) {
  console.log("[Workspace Completion API] POST: Marking workspace complete");

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

    // Verify access to workspace and that user is creator
    const workspace = await sql`
      SELECT creator_id, editor_id, status FROM workspaces WHERE id = ${id}
    `;

    if (!workspace || workspace.length === 0) {
      return Response.json(
        { success: false, error: "Workspace not found" },
        { status: 404 },
      );
    }

    // Only creator can mark as completed
    if (workspace[0].creator_id !== profileId) {
      return Response.json(
        {
          success: false,
          error: "Only the creator can mark the project as completed",
        },
        { status: 403 },
      );
    }

    // Update workspace status to completed
    const updated = await sql`
      UPDATE workspaces
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP
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
        'completed',
        ${JSON.stringify({ completed_at: new Date().toISOString() })}
      )
    `;

    console.log("[Workspace Completion API] POST: ✅ Workspace completed");

    return Response.json({
      success: true,
      workspace: updated[0],
    });
  } catch (error) {
    console.error("[Workspace Completion API] POST error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
