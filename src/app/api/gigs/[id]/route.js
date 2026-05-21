import sql from "@/app/api/utils/sql";

// GET /api/gigs/[id] - Get single gig
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const gigs = await sql`
      SELECT g.*, 
        p.name as freelancer_name,
        p.username as freelancer_username,
        p.profile_image_url as freelancer_image,
        p.rating as freelancer_rating,
        p.total_reviews as freelancer_reviews,
        p.follower_count as freelancer_followers,
        p.skills as freelancer_skills,
        p.bio as freelancer_bio
      FROM gigs g
      JOIN profiles p ON p.id = g.freelancer_id
      WHERE g.id = ${id}
    `;

    if (gigs.length === 0) {
      return Response.json(
        { success: false, error: "Gig not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, gig: gigs[0] });
  } catch (error) {
    console.error("Error fetching gig:", error);
    return Response.json(
      { success: false, error: "Failed to fetch gig" },
      { status: 500 },
    );
  }
}

// PATCH /api/gigs/[id] - Update gig
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      title,
      description,
      price,
      delivery_days,
      sample_urls,
      status,
      is_boosted,
    } = body;

    const updated = await sql`
      UPDATE gigs 
      SET 
        title = COALESCE(${title || null}, title),
        description = COALESCE(${description || null}, description),
        price = COALESCE(${price || null}, price),
        delivery_days = COALESCE(${delivery_days || null}, delivery_days),
        sample_urls = COALESCE(${sample_urls || null}, sample_urls),
        status = COALESCE(${status || null}, status),
        is_boosted = COALESCE(${is_boosted !== undefined ? is_boosted : null}, is_boosted),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return Response.json(
        { success: false, error: "Gig not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, gig: updated[0] });
  } catch (error) {
    console.error("Error updating gig:", error);
    return Response.json(
      { success: false, error: "Failed to update gig" },
      { status: 500 },
    );
  }
}
