import sql from "@/app/api/utils/sql";

/**
 * "Collaborations Happening Now" - Social proof feed
 */

export async function GET(request) {
  try {
    const matches = await sql`
      SELECT 
        cm.*,
        c.title as collaboration_title,
        p1.name as creator_name,
        p1.username as creator_username,
        p1.profile_image_url as creator_image,
        p2.name as collaborator_name,
        p2.username as collaborator_username,
        p2.profile_image_url as collaborator_image
      FROM collaboration_matches cm
      JOIN collaborations c ON cm.collaboration_id = c.id
      JOIN profiles p1 ON cm.creator_id = p1.id
      JOIN profiles p2 ON cm.collaborator_id = p2.id
      WHERE cm.is_public = true
      ORDER BY cm.created_at DESC
      LIMIT 20
    `;

    return Response.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("[Active Collaborations API] error:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
