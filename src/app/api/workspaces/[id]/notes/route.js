import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE NOTES API
 * Get and create notes for a workspace
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log(
    "[Workspace Notes API] GET: Fetching notes for workspace:",
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

    // Get notes with author details
    const notes = await sql`
      SELECT 
        n.*,
        p.name as author_name,
        p.username as author_username,
        p.profile_image_url as author_image
      FROM workspace_notes n
      JOIN profiles p ON n.author_id = p.id
      WHERE n.workspace_id = ${id}
      ORDER BY n.created_at DESC
    `;

    return Response.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("[Workspace Notes API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  console.log("[Workspace Notes API] POST: Creating note");

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
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return Response.json(
        { success: false, error: "Content is required" },
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

    // Create note
    const note = await sql`
      INSERT INTO workspace_notes (
        workspace_id,
        author_id,
        content
      ) VALUES (
        ${id},
        ${profileId},
        ${content}
      )
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
        'note_added',
        ${JSON.stringify({ note_id: note[0].id })}
      )
    `;

    console.log("[Workspace Notes API] POST: ✅ Note created");

    return Response.json({
      success: true,
      note: note[0],
    });
  } catch (error) {
    console.error("[Workspace Notes API] POST error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
