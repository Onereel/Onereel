import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * GET: Fetch a specific reel
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const reel = await sql`
      SELECT r.*, p.name, p.username, p.profile_image_url
      FROM reels r
      JOIN profiles p ON r.profile_id = p.id
      WHERE r.id = ${id}
    `;

    if (reel.length === 0) {
      return Response.json({ error: "Reel not found" }, { status: 404 });
    }

    // Increment view count
    await sql`
      UPDATE reels SET view_count = view_count + 1 WHERE id = ${id}
    `;

    return Response.json({ success: true, reel: reel[0] });
  } catch (error) {
    console.error("[Reels API] GET Error:", error);
    return Response.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}

/**
 * DELETE: Remove a reel
 */
export async function DELETE(request, { params }) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get user profile
    const profile = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify ownership
    const reel = await sql`
      SELECT * FROM reels WHERE id = ${id} AND profile_id = ${profile[0].id}
    `;

    if (reel.length === 0) {
      return Response.json(
        { error: "Reel not found or unauthorized" },
        { status: 404 },
      );
    }

    // Delete reel
    await sql`DELETE FROM reels WHERE id = ${id}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Reels API] DELETE Error:", error);
    return Response.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}

/**
 * PATCH: Update reel metadata (like count, etc)
 */
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { action } = await request.json();

    if (action === "like") {
      await sql`
        UPDATE reels SET like_count = like_count + 1 WHERE id = ${id}
      `;
    } else if (action === "unlike") {
      await sql`
        UPDATE reels SET like_count = GREATEST(like_count - 1, 0) WHERE id = ${id}
      `;
    }

    const updated = await sql`SELECT * FROM reels WHERE id = ${id}`;

    return Response.json({ success: true, reel: updated[0] });
  } catch (error) {
    console.error("[Reels API] PATCH Error:", error);
    return Response.json({ error: "Failed to update reel" }, { status: 500 });
  }
}
