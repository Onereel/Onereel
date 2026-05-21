import sql from "@/app/api/utils/sql";
import { auth } from "@/lib/safe-auth";

// GET /api/admin/analytics - Get platform analytics
export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await sql`
      SELECT id FROM admin_users WHERE user_id = ${session.user.id} LIMIT 1
    `;

    if (isAdmin.length === 0) {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    // Get revenue analytics
    const revenueStats = await sql`
      SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(platform_fee), 0) as total_revenue,
        COALESCE(AVG(amount), 0) as avg_transaction_value
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      AND status IN ('completed', 'released', 'held', 'in_progress')
    `;

    // Revenue by day for charts
    const dailyRevenue = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transaction_count,
        COALESCE(SUM(amount), 0) as volume,
        COALESCE(SUM(platform_fee), 0) as revenue
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      AND status IN ('completed', 'released', 'held', 'in_progress')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    // Transaction status breakdown
    const statusBreakdown = await sql`
      SELECT 
        status,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY status
    `;

    // Top performers (freelancers by revenue)
    const topFreelancers = await sql`
      SELECT 
        p.id,
        p.name,
        p.x_username,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0) as total_earned,
        COALESCE(AVG(t.amount), 0) as avg_transaction
      FROM transactions t
      JOIN profiles p ON t.payee_id = p.id
      WHERE t.created_at >= NOW() - INTERVAL '${period} days'
      AND t.status IN ('completed', 'released', 'held', 'in_progress')
      GROUP BY p.id, p.name, p.x_username
      ORDER BY total_earned DESC
      LIMIT 10
    `;

    // Platform growth metrics
    const growthMetrics = await sql`
      SELECT 
        (SELECT COUNT(*) FROM profiles WHERE created_at >= NOW() - INTERVAL '${period} days') as new_users,
        (SELECT COUNT(*) FROM gigs WHERE created_at >= NOW() - INTERVAL '${period} days') as new_gigs,
        (SELECT COUNT(*) FROM jobs WHERE created_at >= NOW() - INTERVAL '${period} days') as new_jobs,
        (SELECT COUNT(*) FROM applications WHERE created_at >= NOW() - INTERVAL '${period} days') as new_applications
    `;

    // Gig vs Job breakdown
    const typeBreakdown = await sql`
      SELECT 
        CASE WHEN gig_id IS NOT NULL THEN 'gig' ELSE 'job' END as type,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_volume,
        COALESCE(SUM(platform_fee), 0) as total_revenue
      FROM transactions
      WHERE created_at >= NOW() - INTERVAL '${period} days'
      AND status IN ('completed', 'released', 'held', 'in_progress')
      GROUP BY CASE WHEN gig_id IS NOT NULL THEN 'gig' ELSE 'job' END
    `;

    return Response.json({
      period: `${period} days`,
      revenue: revenueStats[0],
      dailyRevenue,
      statusBreakdown,
      topFreelancers,
      growth: growthMetrics[0],
      typeBreakdown,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return Response.json(
      { error: "Failed to fetch analytics", details: error.message },
      { status: 500 },
    );
  }
}
