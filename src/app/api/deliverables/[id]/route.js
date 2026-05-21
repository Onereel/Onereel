import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DELIVERABLE API
 * Update deliverable status (review, request changes, approve)
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function PATCH(request, { params }) {
  console.log("[Deliverable API] PATCH: Updating deliverable status");

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

    if (
      !["submitted", "in_review", "changes_requested", "approved"].includes(
        status,
      )
    ) {
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

    // Get deliverable and verify workspace access
    const deliverable = await sql`
      SELECT 
        d.*,
        w.creator_id,
        w.editor_id
      FROM deliverables d
      JOIN workspaces w ON d.workspace_id = w.id
      WHERE d.id = ${id}
    `;

    if (!deliverable || deliverable.length === 0) {
      return Response.json(
        { success: false, error: "Deliverable not found" },
        { status: 404 },
      );
    }

    const d = deliverable[0];

    // Only creator can change status to in_review, changes_requested, or approved
    const creatorOnlyStatuses = ["in_review", "changes_requested", "approved"];
    if (creatorOnlyStatuses.includes(status) && d.creator_id !== profileId) {
      return Response.json(
        {
          success: false,
          error: "Only the creator can review or approve deliverables",
        },
        { status: 403 },
      );
    }

    // Verify user has access to workspace
    if (d.creator_id !== profileId && d.editor_id !== profileId) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 403 },
      );
    }

    // Update deliverable status
    const updated = await sql`
      UPDATE deliverables
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    // Log activity
    const activityType =
      status === "approved"
        ? "deliverable_approved"
        : status === "changes_requested"
          ? "revision_requested"
          : "deliverable_reviewed";

    await sql`
      INSERT INTO workspace_activity (
        workspace_id,
        actor_id,
        activity_type,
        metadata
      ) VALUES (
        ${d.workspace_id},
        ${profileId},
        ${activityType},
        ${JSON.stringify({ deliverable_id: id, status })}
      )
    `;

    console.log("[Deliverable API] PATCH: ✅ Status updated to:", status);

    return Response.json({
      success: true,
      deliverable: updated[0],
    });
  } catch (error) {
    console.error("[Deliverable API] PATCH error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
