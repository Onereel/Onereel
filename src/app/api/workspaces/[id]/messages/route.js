import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE MESSAGES API
 * Get and send messages in workspace
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log("[Workspace Messages API] GET: Fetching messages");

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

    // Get all messages for this workspace
    const messages = await sql`
      SELECT 
        m.*,
        p.name as author_name,
        p.username as author_username,
        p.profile_image_url as author_image
      FROM workspace_messages m
      JOIN profiles p ON m.author_id = p.id
      WHERE m.workspace_id = ${id}
      ORDER BY m.created_at ASC
    `;

    console.log(
      "[Workspace Messages API] GET: ✅ Found",
      messages.length,
      "messages",
    );

    return Response.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("[Workspace Messages API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST - Send new message
 */
export async function POST(request, { params }) {
  console.log("[Workspace Messages API] POST: Sending message");

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
    const { message } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { success: false, error: "Message is required" },
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

    // Create message
    const newMessage = await sql`
      INSERT INTO workspace_messages (
        workspace_id,
        author_id,
        message
      ) VALUES (
        ${id},
        ${profileId},
        ${message.trim()}
      )
      RETURNING *
    `;

    console.log("[Workspace Messages API] POST: ✅ Message sent");

    // 🔔 NOTIFY the other person in the workspace
    try {
      const recipientId =
        workspace[0].creator_id === profileId
          ? workspace[0].editor_id
          : workspace[0].creator_id;

      // Get collab title for the notification
      const ws = await sql`
        SELECT c.title FROM workspaces w
        JOIN collaborations c ON c.id = w.collaboration_id
        WHERE w.id = ${id}
      `;
      const collabTitle = ws[0]?.title || "your collaboration";

      const recipientUser = await sql`
        SELECT user_id FROM profiles WHERE id = ${recipientId}
      `;

      if (recipientUser && recipientUser.length > 0) {
        await sql`
          INSERT INTO notifications (
            user_id, profile_id, type, title, message, link, read
          ) VALUES (
            ${recipientUser[0].user_id},
            ${recipientId},
            'message',
            'New Message',
            ${`You have a new message in the "${collabTitle}" workspace`},
            ${`/workspace/${id}`},
            false
          )
        `;
        console.log(
          "[Workspace Messages API] POST: ✅ Notification sent to recipient",
        );
      }
    } catch (notifErr) {
      console.warn(
        "[Workspace Messages API] POST: ⚠️ Notification failed (non-blocking):",
        notifErr.message,
      );
    }

    return Response.json({
      success: true,
      message: newMessage[0],
    });
  } catch (error) {
    console.error("[Workspace Messages API] POST error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
