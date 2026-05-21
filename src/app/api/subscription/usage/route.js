import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await sql`
      SELECT p.*, ru.reels_created_today, ru.reels_created_month
      FROM profiles p
      LEFT JOIN reel_usage ru ON p.id = ru.profile_id
      WHERE p.user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const userProfile = profile[0];

    return Response.json({
      success: true,
      tier: userProfile.subscription_tier,
      status: userProfile.subscription_status,
      usage: {
        today: userProfile.reels_created_today || 0,
        month: userProfile.reels_created_month || 0,
        dailyLimit: userProfile.subscription_tier === "free" ? 3 : null,
        monthlyLimit: userProfile.subscription_tier === "free" ? 10 : null,
      },
      subscription: {
        periodEnd: userProfile.subscription_period_end,
      },
    });
  } catch (error) {
    console.error("[Usage API] Error:", error);
    return Response.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
