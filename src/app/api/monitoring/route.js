import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * Production monitoring endpoint
 * GET /api/monitoring - Check system health and alerts
 */
export async function GET(request) {
  try {
    const session = await auth();

    // Only allow admin access
    const isAdmin = session?.user?.id
      ? await checkAdmin(session.user.id)
      : false;

    if (!isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();
    const hourAgo = new Date(now.getTime() - 3600000);
    const dayAgo = new Date(now.getTime() - 86400000);

    // Critical alerts
    const alerts = [];

    // 1. Failed generations (last hour)
    const failedGenerations = await sql`
      SELECT COUNT(*) as count FROM reels
      WHERE generation_status = 'failed'
      AND created_at > ${hourAgo.toISOString()}
    `;
    const failedCount = parseInt(failedGenerations[0]?.count || 0);
    if (failedCount > 5) {
      alerts.push({
        severity: "high",
        type: "generation_failures",
        message: `${failedCount} failed generations in last hour`,
        threshold: 5,
      });
    }

    // 2. High-cost users (this month)
    const monthYear = now.toISOString().slice(0, 7);
    const highCostUsers = await sql`
      SELECT 
        p.id,
        p.name,
        p.subscription_tier,
        SUM(a.usage_count) as total_usage
      FROM ai_usage_analytics a
      JOIN profiles p ON p.id = a.profile_id
      WHERE a.month_year = ${monthYear}
      AND p.subscription_tier = 'free'
      GROUP BY p.id, p.name, p.subscription_tier
      HAVING SUM(a.usage_count) > 50
      ORDER BY total_usage DESC
      LIMIT 10
    `;
    if (highCostUsers.length > 0) {
      alerts.push({
        severity: "medium",
        type: "high_usage_free_users",
        message: `${highCostUsers.length} free users with >50 generations this month`,
        users: highCostUsers.map((u) => ({
          id: u.id,
          name: u.name,
          usage: u.total_usage,
        })),
      });
    }

    // 3. Payment state mismatches
    const paymentMismatches = await sql`
      SELECT COUNT(*) as count FROM profiles
      WHERE subscription_tier = 'pro'
      AND subscription_status != 'active'
    `;
    const mismatchCount = parseInt(paymentMismatches[0]?.count || 0);
    if (mismatchCount > 0) {
      alerts.push({
        severity: "high",
        type: "payment_state_mismatch",
        message: `${mismatchCount} Pro users with inactive subscription status`,
        count: mismatchCount,
      });
    }

    // 4. Abuse detection (rapid generation)
    const suspiciousActivity = await sql`
      SELECT 
        profile_id,
        COUNT(*) as hourly_count,
        p.name,
        p.subscription_tier
      FROM reels r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.created_at > ${hourAgo.toISOString()}
      GROUP BY profile_id, p.name, p.subscription_tier
      HAVING COUNT(*) > 15
      ORDER BY hourly_count DESC
    `;
    if (suspiciousActivity.length > 0) {
      alerts.push({
        severity: "high",
        type: "suspicious_activity",
        message: `${suspiciousActivity.length} users with >15 generations in last hour`,
        users: suspiciousActivity.map((u) => ({
          id: u.profile_id,
          name: u.name,
          tier: u.subscription_tier,
          hourlyCount: u.hourly_count,
        })),
      });
    }

    // System metrics (last 24h)
    const metrics = await sql`
      SELECT
        COUNT(DISTINCT CASE WHEN r.created_at > ${dayAgo.toISOString()} THEN r.profile_id END) as active_users_24h,
        COUNT(CASE WHEN r.created_at > ${dayAgo.toISOString()} THEN 1 END) as reels_24h,
        COUNT(CASE WHEN r.created_at > ${dayAgo.toISOString()} AND r.generation_status = 'failed' THEN 1 END) as failed_24h,
        COUNT(CASE WHEN r.created_at > ${dayAgo.toISOString()} AND r.generation_status = 'completed' THEN 1 END) as completed_24h
      FROM reels r
    `;

    const subscriptionMetrics = await sql`
      SELECT
        subscription_tier,
        subscription_status,
        COUNT(*) as count
      FROM profiles
      GROUP BY subscription_tier, subscription_status
    `;

    return Response.json({
      timestamp: now.toISOString(),
      status: alerts.length === 0 ? "healthy" : "alerts",
      alerts,
      metrics: {
        last24h: metrics[0],
        subscriptions: subscriptionMetrics,
      },
    });
  } catch (error) {
    console.error("[Monitoring] Error:", error);
    return Response.json(
      {
        error: "Monitoring check failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

async function checkAdmin(userId) {
  try {
    const result = await sql`
      SELECT 1 FROM admin_users WHERE user_id = ${userId}
    `;
    return result.length > 0;
  } catch {
    return false;
  }
}
