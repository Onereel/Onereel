import sql from "@/app/api/utils/sql";

// GET /api/reviews - Get reviews
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const revieweeId = searchParams.get("revieweeId");
    const reviewerId = searchParams.get("reviewerId");

    let query = `
      SELECT r.*, 
        reviewer.name as reviewer_name,
        reviewer.username as reviewer_username,
        reviewer.profile_image_url as reviewer_image,
        reviewee.name as reviewee_name,
        reviewee.username as reviewee_username
      FROM reviews r
      JOIN profiles reviewer ON reviewer.id = r.reviewer_id
      JOIN profiles reviewee ON reviewee.id = r.reviewee_id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (revieweeId) {
      paramCount++;
      query += ` AND r.reviewee_id = $${paramCount}`;
      values.push(parseInt(revieweeId));
    }

    if (reviewerId) {
      paramCount++;
      query += ` AND r.reviewer_id = $${paramCount}`;
      values.push(parseInt(reviewerId));
    }

    query += " ORDER BY r.created_at DESC";

    const reviews = await sql(query, values);
    return Response.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create review
export async function POST(request) {
  try {
    const body = await request.json();
    const { transaction_id, reviewer_id, reviewee_id, rating, comment } = body;

    if (!transaction_id || !reviewer_id || !reviewee_id || !rating) {
      return Response.json(
        {
          success: false,
          error:
            "Missing required fields: transaction_id, reviewer_id, reviewee_id, rating",
        },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        {
          success: false,
          error: "Rating must be between 1 and 5",
        },
        { status: 400 },
      );
    }

    // Check if transaction is completed
    const transactions = await sql`
      SELECT * FROM transactions WHERE id = ${transaction_id}
    `;

    if (transactions.length === 0) {
      return Response.json(
        { success: false, error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (
      transactions[0].status !== "completed" &&
      transactions[0].status !== "released"
    ) {
      return Response.json(
        {
          success: false,
          error: "Can only review completed transactions",
        },
        { status: 400 },
      );
    }

    // Check if already reviewed
    const existing = await sql`
      SELECT * FROM reviews 
      WHERE transaction_id = ${transaction_id} AND reviewer_id = ${reviewer_id}
    `;

    if (existing.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Already reviewed this transaction",
        },
        { status: 400 },
      );
    }

    // Create review
    const created = await sql`
      INSERT INTO reviews (transaction_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (${transaction_id}, ${reviewer_id}, ${reviewee_id}, ${rating}, ${comment || null})
      RETURNING *
    `;

    // Update reviewee's rating
    const avgRating = await sql`
      SELECT AVG(rating)::numeric(3,2) as avg_rating, COUNT(*) as total
      FROM reviews
      WHERE reviewee_id = ${reviewee_id}
    `;

    if (avgRating.length > 0) {
      await sql`
        UPDATE profiles
        SET rating = ${avgRating[0].avg_rating},
            total_reviews = ${avgRating[0].total}
        WHERE id = ${reviewee_id}
      `;
    }

    return Response.json(
      { success: true, review: created[0] },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return Response.json(
      { success: false, error: "Failed to create review" },
      { status: 500 },
    );
  }
}
