import sql from "@/app/api/utils/sql";

// GET /api/admin/users - Get all users with stats
export async function GET(request) {
  try {
    const users = await sql`
      SELECT 
        p.*,
        COUNT(DISTINCT CASE WHEN j.creator_id = p.id THEN j.id END) as jobs_posted,
        COUNT(DISTINCT CASE WHEN g.freelancer_id = p.id THEN g.id END) as gigs_created,
        COUNT(DISTINCT CASE WHEN t.payer_id = p.id THEN t.id END) as transactions_as_payer,
        COUNT(DISTINCT CASE WHEN t.payee_id = p.id THEN t.id END) as transactions_as_payee,
        COALESCE(SUM(CASE WHEN t.payee_id = p.id AND t.status = 'released' THEN t.amount - t.platform_fee END), 0) as total_earned
      FROM profiles p
      LEFT JOIN jobs j ON j.creator_id = p.id
      LEFT JOIN gigs g ON g.freelancer_id = p.id
      LEFT JOIN transactions t ON t.payer_id = p.id OR t.payee_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;

    return Response.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
