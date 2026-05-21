/**
 * Rate Limiting & Usage Control
 *
 * Protects AI endpoints from abuse and controls costs
 */

import sql from "./sql";

// Rate limits per feature (requests per day)
const RATE_LIMITS = {
  thumbnail: 20, // DALL-E is expensive
  hook: 30, // Claude text generation
  trend: 50, // Search + analysis
};

// Monthly usage limits (for free tier / before monetization)
const MONTHLY_LIMITS = {
  thumbnail: 100,
  hook: 200,
  trend: 300,
};

// Cost limits per tier (USD/month) - prevent runaway AI costs
const COST_LIMITS = {
  free: 5.0, // $5/month max AI spend
  pro: 100.0, // $100/month max AI spend
};

// AI generation costs (estimated)
const AI_COSTS = {
  thumbnail: 0.04, // DALL-E 3 HD
  hook: 0.01, // Claude
  trend: 0.02, // GPT-4 + search
  reel: 0.08, // Video generation (placeholder for Runway/Pika)
};

/**
 * Check if user has exceeded rate limit
 * Returns: { allowed: boolean, remaining: number, resetAt: Date }
 */
export async function checkRateLimit(profileId, featureType) {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const limit = RATE_LIMITS[featureType] || 10;

    // Count today's usage
    const result = await sql`
      SELECT COUNT(*) as count FROM (
        SELECT created_at FROM ai_thumbnail_generations 
        WHERE profile_id = ${profileId} 
        AND DATE(created_at) = ${today}
        UNION ALL
        SELECT created_at FROM ai_hook_scripts 
        WHERE profile_id = ${profileId} 
        AND DATE(created_at) = ${today}
        UNION ALL
        SELECT created_at FROM trend_alerts 
        WHERE profile_id = ${profileId} 
        AND DATE(created_at) = ${today}
      ) AS combined_usage
    `;

    const count = parseInt(result[0]?.count || 0);
    const remaining = Math.max(0, limit - count);
    const allowed = count < limit;

    // Reset at midnight
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      allowed,
      remaining,
      resetAt: tomorrow,
      limit,
    };
  } catch (error) {
    console.error("[Rate Limit] Check failed:", error);
    // Fail open (allow request) to prevent blocking users on errors
    return { allowed: true, remaining: 999, resetAt: new Date(), limit: 999 };
  }
}

/**
 * Check monthly usage limits
 */
export async function checkMonthlyLimit(profileId, featureType) {
  try {
    const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
    const limit = MONTHLY_LIMITS[featureType] || 50;

    const result = await sql`
      SELECT usage_count FROM ai_usage_analytics
      WHERE profile_id = ${profileId}
      AND feature_type = ${featureType}
      AND month_year = ${monthYear}
    `;

    const usageCount = parseInt(result[0]?.usage_count || 0);
    const remaining = Math.max(0, limit - usageCount);
    const allowed = usageCount < limit;

    return {
      allowed,
      remaining,
      usageCount,
      limit,
    };
  } catch (error) {
    console.error("[Monthly Limit] Check failed:", error);
    return { allowed: true, remaining: 999, usageCount: 0, limit: 999 };
  }
}

/**
 * Verify X blue-check status from profile
 * UPDATED: Universal access - no platform verification required
 */
export async function verifyBlueCheck(userId) {
  // Everyone is verified by default - platform-agnostic access
  return {
    verified: true,
    reason: "Universal access enabled",
  };
}

/**
 * Track AI generation costs and enforce limits
 */
export async function checkCostLimit(profileId, featureType, tier = "free") {
  try {
    const monthYear = new Date().toISOString().slice(0, 7);
    const estimatedCost = AI_COSTS[featureType] || 0.05;

    // Get current month's total cost
    const result = await sql`
      SELECT 
        SUM(usage_count * CASE 
          WHEN feature_type = 'thumbnail' THEN ${AI_COSTS.thumbnail}
          WHEN feature_type = 'hook' THEN ${AI_COSTS.hook}
          WHEN feature_type = 'trend' THEN ${AI_COSTS.trend}
          WHEN feature_type = 'reel' THEN ${AI_COSTS.reel}
          ELSE 0.05
        END) as total_cost
      FROM ai_usage_analytics
      WHERE profile_id = ${profileId}
      AND month_year = ${monthYear}
    `;

    const currentCost = parseFloat(result[0]?.total_cost || 0);
    const newTotal = currentCost + estimatedCost;
    const limit = COST_LIMITS[tier] || COST_LIMITS.free;

    if (newTotal > limit) {
      console.error(
        `[COST ALERT] Profile ${profileId} exceeded ${tier} limit: $${newTotal.toFixed(2)} / $${limit}`,
      );
      return {
        allowed: false,
        currentCost,
        estimatedCost,
        limit,
        reason: `Monthly AI cost limit reached ($${limit})`,
      };
    }

    return {
      allowed: true,
      currentCost,
      estimatedCost,
      remaining: limit - newTotal,
      limit,
    };
  } catch (error) {
    console.error("[Cost Limit] Check failed:", error);
    return { allowed: true, currentCost: 0, limit: 999 };
  }
}

/**
 * Detect suspicious patterns (abuse prevention)
 */
export async function detectAbuse(profileId) {
  try {
    const hourAgo = new Date(Date.now() - 3600000).toISOString();

    // Check for rapid-fire generation attempts
    const recentActivity = await sql`
      SELECT COUNT(*) as count FROM reels
      WHERE profile_id = ${profileId}
      AND created_at > ${hourAgo}
    `;

    const hourlyCount = parseInt(recentActivity[0]?.count || 0);

    // Flag if >15 generations in 1 hour (even for Pro)
    if (hourlyCount > 15) {
      console.warn(
        `[ABUSE ALERT] Profile ${profileId} created ${hourlyCount} reels in 1 hour`,
      );
      return {
        suspicious: true,
        reason: "Excessive generation rate",
        hourlyCount,
      };
    }

    return { suspicious: false, hourlyCount };
  } catch (error) {
    console.error("[Abuse Detection] Failed:", error);
    return { suspicious: false };
  }
}
