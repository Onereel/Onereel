import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORKSPACE LINKS API
 * Get and create links for a workspace
 * ═══════════════════════════════════════════════════════════════════════
 */

export async function GET(request, { params }) {
  console.log(
    "[Workspace Links API] GET: Fetching links for workspace:",
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

    // Get links with author details
    const links = await sql`
      SELECT 
        l.*,
        p.name as author_name,
        p.username as author_username,
        p.profile_image_url as author_image
      FROM workspace_links l
      JOIN profiles p ON l.author_id = p.id
      WHERE l.workspace_id = ${id}
      ORDER BY l.created_at DESC
    `;

    return Response.json({
      success: true,
      links,
    });
  } catch (error) {
    console.error("[Workspace Links API] GET error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  console.log("[Workspace Links API] POST: Creating link");

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
    const { label, url } = body;

    if (!label || !url) {
      return Response.json(
        { success: false, error: "Label and URL are required" },
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

    // Create link
    const link = await sql`
      INSERT INTO workspace_links (
        workspace_id,
        author_id,
        label,
        url
      ) VALUES (
        ${id},
        ${profileId},
        ${label},
        ${url}
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
        'link_added',
        ${JSON.stringify({ link_id: link[0].id, label, url })}
      )
    `;

    console.log("[Workspace Links API] POST: ✅ Link created");

    return Response.json({
      success: true,
      link: link[0],
    });
  } catch (error) {
    console.error("[Workspace Links API] POST error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
