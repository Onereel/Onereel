import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { checkRateLimit, checkMonthlyLimit } from "@/app/api/utils/rate-limit";

export async function POST(request) {
  try {
    // Auth check — graceful failure
    let session;
    try {
      session = await auth();
    } catch (authError) {
      console.error("[Trend Alert] Auth error:", authError.message);
      return Response.json(
        { error: "Authentication error. Please sign in again." },
        { status: 401 },
      );
    }

    if (!session?.user) {
      return Response.json(
        { error: "Please sign in to use Trend Alerts." },
        { status: 401 },
      );
    }

    // Get user profile
    const profile = await sql`
      SELECT id FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json(
        {
          error: "Profile not found. Please complete your profile setup first.",
        },
        { status: 404 },
      );
    }

    const profileId = profile[0].id;

    // Rate limiting: 50/day
    const rateLimit = await checkRateLimit(profileId, "trend");
    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: "Daily limit exceeded",
          limit: rateLimit.limit,
          resetAt: rateLimit.resetAt,
        },
        { status: 429 },
      );
    }

    // Monthly limit: 300/month
    const monthlyLimit = await checkMonthlyLimit(profileId, "trend");
    if (!monthlyLimit.allowed) {
      return Response.json(
        {
          error: "Monthly limit exceeded",
          used: monthlyLimit.usageCount,
          limit: monthlyLimit.limit,
        },
        { status: 429 },
      );
    }

    const { niche, keywords } = await request.json();

    if (!niche) {
      return Response.json({ error: "Niche is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "AI service not configured. Contact support." },
        { status: 500 },
      );
    }

    console.log("[Trend Alert] Analyzing trends for niche:", niche);

    // Call Claude directly to analyze trend patterns
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 4096,
          messages: [
            {
              role: "user",
              content: `You are an expert content trend analyst for digital creators in 2026.

Niche: ${niche}
Keywords: ${keywords?.join(", ") || "general"}

Analyze current trends in this niche and identify the TOP 5 trending topics with HIGH creation urgency. Think about what's moving fast on short-form video platforms right now.

For each trend, consider:
1. What's getting the most engagement right now in ${niche}
2. Content angles that aren't yet saturated
3. Why creators should act quickly
4. How long before this trend peaks

Return ONLY a valid JSON array with this exact structure, no markdown or explanation:
[
  {
    "topic": "Short punchy trend topic name",
    "velocityScore": 85,
    "priority": "urgent",
    "contentSuggestions": ["Specific content idea 1", "Specific content idea 2", "Specific content idea 3"],
    "reasoning": "Why this matters now and why creators should jump on it",
    "estimatedLifespan": "12-24 hours",
    "engagementPotential": "high"
  }
]

priority must be one of: "low", "medium", "high", "urgent"
engagementPotential must be one of: "low", "medium", "high", "viral"
Generate exactly 5 trends.`,
            },
          ],
        }),
      },
    );

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      throw new Error(
        `Anthropic API returned ${anthropicResponse.status}: ${errText}`,
      );
    }

    const anthropicResult = await anthropicResponse.json();
    const rawContent = anthropicResult.content?.[0]?.text || "";

    const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Claude did not return a valid JSON array");
    const trends = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(trends) || trends.length === 0) {
      throw new Error("Claude returned empty trends array");
    }

    console.log("[Trend Alert] ✓ Claude analyzed trends:", trends.length);

    // Save trend alerts to database
    const savedAlerts = [];
    for (const trend of trends) {
      const hoursMatch = trend.estimatedLifespan.match(/(\d+)/);
      const hours = hoursMatch ? parseInt(hoursMatch[0]) : 24;
      const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);

      const saved = await sql`
        INSERT INTO trend_alerts (
          niche, trend_topic, trend_velocity, engagement_metrics,
          content_suggestions, alert_priority, source_urls, expires_at
        ) VALUES (
          ${niche}, ${trend.topic}, ${trend.velocityScore},
          ${JSON.stringify({
            engagementPotential: trend.engagementPotential,
            reasoning: trend.reasoning,
            lifespan: trend.estimatedLifespan,
          })},
          ${trend.contentSuggestions}, ${trend.priority},
          ${[]}, ${expiresAt.toISOString()}
        )
        RETURNING *
      `;
      savedAlerts.push(saved[0]);
    }

    // Save user's trend subscription
    await sql`
      INSERT INTO user_trend_subscriptions (profile_id, niche, keywords)
      VALUES (${profileId}, ${niche}, ${keywords || []})
      ON CONFLICT (profile_id, niche) DO UPDATE
      SET keywords = ${keywords || []}, notification_enabled = true
    `;

    // Track usage
    const monthYear = new Date().toISOString().slice(0, 7);
    await sql`
      INSERT INTO ai_usage_analytics (profile_id, feature_type, month_year, usage_count)
      VALUES (${profileId}, 'trend', ${monthYear}, 1)
      ON CONFLICT (profile_id, feature_type, month_year)
      DO UPDATE SET usage_count = ai_usage_analytics.usage_count + 1
    `;

    // Notify for urgent trends
    const urgentTrends = trends.filter((t) => t.priority === "urgent");
    for (const urgentTrend of urgentTrends) {
      try {
        await sql`
          INSERT INTO notifications (
            user_id, profile_id, type, title, message, link
          ) VALUES (
            ${session.user.id}, ${profileId}, 'system',
            ${"🔥 Urgent Trend Alert!"},
            ${`${urgentTrend.topic} is trending now. Create content immediately: ${urgentTrend.contentSuggestions[0]}`},
            '/ai-studio/trends'
          )
        `;
      } catch (notifErr) {
        console.warn(
          "[Trend Alert] Failed to create notification:",
          notifErr.message,
        );
      }
    }

    return Response.json({
      success: true,
      trends,
      alertsCreated: savedAlerts.length,
      urgentAlerts: urgentTrends.length,
    });
  } catch (error) {
    console.error("[Trend Alert] Error:", error);
    return Response.json(
      { error: "Failed to analyze trends", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch active trend alerts
 */
export async function GET(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch {
      return Response.json({ error: "Authentication error" }, { status: 401 });
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const niche = searchParams.get("niche");
    const priority = searchParams.get("priority");

    let alerts;
    if (niche && priority) {
      alerts = await sql`
        SELECT * FROM trend_alerts
        WHERE is_active = true AND expires_at > NOW()
          AND niche = ${niche} AND alert_priority = ${priority}
        ORDER BY trend_velocity DESC, created_at DESC
        LIMIT 50
      `;
    } else if (niche) {
      alerts = await sql`
        SELECT * FROM trend_alerts
        WHERE is_active = true AND expires_at > NOW() AND niche = ${niche}
        ORDER BY trend_velocity DESC, created_at DESC
        LIMIT 50
      `;
    } else {
      alerts = await sql`
        SELECT * FROM trend_alerts
        WHERE is_active = true AND expires_at > NOW()
        ORDER BY trend_velocity DESC, created_at DESC
        LIMIT 100
      `;
    }

    return Response.json({ success: true, alerts });
  } catch (error) {
    console.error("[Trend Alert] GET Error:", error);
    return Response.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}

/**
 * DELETE: Dismiss a trend alert
 */
export async function DELETE(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch {
      return Response.json({ error: "Authentication error" }, { status: 401 });
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get("id");

    if (!alertId) {
      return Response.json({ error: "Alert ID required" }, { status: 400 });
    }

    await sql`UPDATE trend_alerts SET is_active = false WHERE id = ${alertId}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error("[Trend Alert] DELETE Error:", error);
    return Response.json({ error: "Failed to dismiss alert" }, { status: 500 });
  }
}
