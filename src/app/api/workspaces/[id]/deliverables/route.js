import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE DELIVERABLES API
 * Get and create deliverables for workspace
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log("[Workspace Deliverables API] GET: Fetching deliverables");

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

    // Get all deliverables for this workspace
    const deliverables = await sql`
      SELECT 
        d.*,
        p.name as author_name,
        p.username as author_username,
        p.profile_image_url as author_image
      FROM deliverables d
      JOIN profiles p ON d.author_id = p.id
      WHERE d.workspace_id = ${id}
      ORDER BY d.created_at DESC
    `;

    console.log(
      "[Workspace Deliverables API] GET: ✅ Found",
      deliverables.length,
      "deliverables",
    );

    return Response.json({
      success: true,
      deliverables,
    });
  } catch (error) {
    console.error("[Workspace Deliverables API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST - Create new deliverable
 */
export async function POST(request, { params }) {
  console.log("[Workspace Deliverables API] POST: Creating deliverable");

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
    const { title, description, fileUrl } = body;

    if (!title || !fileUrl) {
      return Response.json(
        { success: false, error: "Title and file URL are required" },
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

    // Get current revision number for this workspace
    const latestDeliverable = await sql`
      SELECT MAX(revision_number) as max_revision
      FROM deliverables
      WHERE workspace_id = ${id}
    `;

    const revisionNumber = (latestDeliverable[0]?.max_revision || 0) + 1;

    // Create deliverable
    const deliverable = await sql`
      INSERT INTO deliverables (
        workspace_id,
        author_id,
        title,
        description,
        file_url,
        revision_number,
        status
      ) VALUES (
        ${id},
        ${profileId},
        ${title},
        ${description || ""},
        ${fileUrl},
        ${revisionNumber},
        'submitted'
      )
      RETURNING *
    `;

    // Log activity (non-blocking — valid types: created, status_changed, note_added, link_added, completed)
    try {
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
          ${JSON.stringify({ event: "deliverable_submitted", title, revision: revisionNumber })}
        )
      `;
    } catch (activityErr) {
      console.warn(
        "[Workspace Deliverables API] POST: ⚠️ Activity log failed (non-blocking):",
        activityErr.message,
      );
    }

    console.log(
      "[Workspace Deliverables API] POST: ✅ Deliverable created - Revision",
      revisionNumber,
    );

    // 🔔 NOTIFY the creator that a deliverable was submitted
    try {
      const submitterProfile = await sql`
        SELECT name FROM profiles WHERE id = ${profileId}
      `;
      const submitterName = submitterProfile[0]?.name || "The editor";

      // Notify the creator (not the one who submitted)
      const notifyId =
        workspace[0].editor_id === profileId
          ? workspace[0].creator_id
          : workspace[0].editor_id;

      const notifyUser = await sql`
        SELECT user_id FROM profiles WHERE id = ${notifyId}
      `;

      if (notifyUser && notifyUser.length > 0) {
        await sql`
          INSERT INTO notifications (
            user_id, profile_id, type, title, message, link, read
          ) VALUES (
            ${notifyUser[0].user_id},
            ${notifyId},
            'message',
            'New Deliverable Submitted',
            ${`${submitterName} submitted a deliverable for review: "${title}"`},
            ${`/workspace/${id}`},
            false
          )
        `;
        console.log(
          "[Workspace Deliverables API] POST: ✅ Notification sent to reviewer",
        );
      }
    } catch (notifErr) {
      console.warn(
        "[Workspace Deliverables API] POST: ⚠️ Notification failed (non-blocking):",
        notifErr.message,
      );
    }

    return Response.json({
      success: true,
      deliverable: deliverable[0],
    });
  } catch (error) {
    console.error("[Workspace Deliverables API] POST error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
