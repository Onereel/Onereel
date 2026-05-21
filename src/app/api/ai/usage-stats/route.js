import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * AI Usage Statistics
 * Returns monthly usage stats for all AI features
 */
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const monthYear = new Date().toISOString().slice(0, 7);

    const stats = await sql`
      SELECT feature_type, usage_count
      FROM ai_usage_analytics
      WHERE profile_id = ${profile[0].id}
      AND month_year = ${monthYear}
    `;

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.feature_type] = stat.usage_count;
      return acc;
    }, {});

    return Response.json({ success: true, stats: statsMap });
  } catch (error) {
    console.error("[Usage Stats] Error:", error);
    return Response.json(
      { error: "Failed to fetch usage stats" },
      { status: 500 },
    );
  }
}
