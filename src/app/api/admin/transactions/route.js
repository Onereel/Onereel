import sql from "@/app/api/utils/sql";

// GET /api/admin/transactions - Get all transactions with details
export async function GET(request) {
  try {
    const transactions = await sql`
      SELECT 
        t.*,
        payer.name as payer_name,
        payer.x_username as payer_username,
        payee.name as payee_name,
        payee.x_username as payee_username,
        j.title as job_title,
        g.title as gig_title
      FROM transactions t
      JOIN profiles payer ON payer.id = t.payer_id
      JOIN profiles payee ON payee.id = t.payee_id
      LEFT JOIN jobs j ON j.id = t.job_id
      LEFT JOIN gigs g ON g.id = t.gig_id
      ORDER BY t.created_at DESC
    `;

    // Calculate total revenue
    const revenue = await sql`
      SELECT 
        SUM(platform_fee) as total_revenue,
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'released' THEN platform_fee ELSE 0 END) as released_revenue,
        SUM(CASE WHEN status = 'held' OR status = 'in_progress' THEN platform_fee ELSE 0 END) as pending_revenue
      FROM transactions
    `;

    return Response.json({
      success: true,
      transactions,
      stats: revenue[0],
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return Response.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
