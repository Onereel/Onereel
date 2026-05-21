import sql from "@/app/api/utils/sql";

// GET /api/gigs - List all gigs with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const freelancerId = searchParams.get("freelancerId");
    const sortBy = searchParams.get("sortBy") || "created_at";

    let query = `
      SELECT g.*, 
        p.name as freelancer_name,
        p.username as freelancer_username,
        p.profile_image_url as freelancer_image,
        p.rating as freelancer_rating,
        p.skills as freelancer_skills
      FROM gigs g
      JOIN profiles p ON p.id = g.freelancer_id
      WHERE g.status = $1
    `;
    const values = [status];
    let paramCount = 1;

    if (minPrice) {
      paramCount++;
      query += ` AND g.price >= $${paramCount}`;
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND g.price <= $${paramCount}`;
      values.push(parseFloat(maxPrice));
    }

    if (freelancerId) {
      paramCount++;
      query += ` AND g.freelancer_id = $${paramCount}`;
      values.push(parseInt(freelancerId));
    }

    // Add sorting
    const validSortFields = ["created_at", "price", "delivery_days"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "created_at";
    const sortOrder = sortBy === "price" ? "ASC" : "DESC";
    query += ` ORDER BY g.is_boosted DESC, g.${sortField} ${sortOrder}`;

    const gigs = await sql(query, values);
    return Response.json({ success: true, gigs });
  } catch (error) {
    console.error("Error fetching gigs:", error);
    return Response.json(
      { success: false, error: "Failed to fetch gigs" },
      { status: 500 },
    );
  }
}

// POST /api/gigs - Create a new gig
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      freelancer_id,
      title,
      description,
      price,
      delivery_days,
      sample_urls,
    } = body;

    // Validate required fields
    if (!freelancer_id || !title || !description || !price || !delivery_days) {
      return Response.json(
        {
          success: false,
          error:
            "Missing required fields: freelancer_id, title, description, price, delivery_days",
        },
        { status: 400 },
      );
    }

    // Verify freelancer profile exists and is verified
    const freelancer =
      await sql`SELECT * FROM profiles WHERE id = ${freelancer_id}`;
    if (freelancer.length === 0) {
      return Response.json(
        { success: false, error: "Freelancer profile not found" },
        { status: 404 },
      );
    }

    if (!freelancer[0].verified_creator) {
      return Response.json(
        {
          success: false,
          error: "Only verified users can create gigs",
        },
        { status: 403 },
      );
    }

    const created = await sql`
      INSERT INTO gigs (
        freelancer_id, title, description, price, delivery_days, sample_urls
      ) VALUES (
        ${freelancer_id}, ${title}, ${description}, ${price}, 
        ${delivery_days}, ${sample_urls || []}
      )
      RETURNING *
    `;

    return Response.json({ success: true, gig: created[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating gig:", error);
    return Response.json(
      { success: false, error: "Failed to create gig" },
      { status: 500 },
    );
  }
}
