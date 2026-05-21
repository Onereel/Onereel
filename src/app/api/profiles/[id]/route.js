import sql from "@/app/api/utils/sql";

// GET /api/profiles/[id] - Get single profile
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const profiles = await sql`
      SELECT p.*, 
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(DISTINCT r.id) as review_count
      FROM profiles p
      LEFT JOIN reviews r ON r.reviewee_id = p.id
      WHERE p.id = ${id}
      GROUP BY p.id
    `;

    if (profiles.length === 0) {
      return Response.json(
        { success: false, error: "Profile not found" },
        { status: 404 },
      );
    }

    // Get recent reviews
    const reviews = await sql`
      SELECT r.*, 
        pr.name as reviewer_name,
        pr.username as reviewer_username,
        pr.profile_image_url as reviewer_image
      FROM reviews r
      JOIN profiles pr ON pr.id = r.reviewer_id
      WHERE r.reviewee_id = ${id}
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    return Response.json({
      success: true,
      profile: profiles[0],
      reviews,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
