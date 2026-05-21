import sql from "@/app/api/utils/sql";

/**
 * GET: Public showcase reels (best performing, public only)
 */
export async function GET(request) {
  try {
    const reels = await sql`
      SELECT 
        r.id,
        r.title,
        r.description,
        r.thumbnail_url,
        r.mood,
        r.camera_style,
        r.visual_style,
        r.duration,
        r.view_count,
        r.like_count,
        r.created_at,
        p.name as creator_name,
        p.username
      FROM reels r
      INNER JOIN profiles p ON r.profile_id = p.id
      WHERE r.is_public = true
      AND r.generation_status = 'completed'
      AND r.has_watermark = false
      ORDER BY (r.view_count + r.like_count * 2) DESC
      LIMIT 30
    `;

    return Response.json({
      success: true,
      reels,
      count: reels.length,
    });
  } catch (error) {
    console.error("[Showcase] Error:", error);
    return Response.json(
      { error: "Failed to load showcase", details: error.message },
      { status: 500 },
    );
  }
}
