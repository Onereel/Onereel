import { auth } from "@/lib/safe-auth";
import sql from "@/app/api/utils/sql";

/**
 * Universal Hook Script Generator - STABILIZED ✅
 *
 * GUARANTEES:
 * - Always returns success: true with hooks (unless invalid input)
 * - AI provider failures are non-blocking
 * - Returns fallback template hooks when AI unavailable
 * - Guest mode fully supported
 * - Database errors return guest hooks
 */

export async function POST(request) {
  let session = null;
  let userProfile = null;
  let isGuest = true;
  let formData = null;

  const warnings = [];

  try {
    // ═══════════════════════════════════════════════════════
    // STEP 1: Parse and validate request
    // ═══════════════════════════════════════════════════════
    try {
      formData = await request.json();
    } catch (parseError) {
      return Response.json(
        {
          success: false,
          error: "Invalid request format",
          details: "Request body must be valid JSON",
        },
        { status: 400 },
      );
    }

    const { contentTopic, niche, targetEmotion, hookCount } = formData;

    if (!contentTopic || !niche) {
      return Response.json(
        {
          success: false,
          error: "Missing required fields",
          details: "Content topic and niche are required",
        },
        { status: 400 },
      );
    }

    const count = Math.min(hookCount || 10, 20);

    // ═══════════════════════════════════════════════════════
    // STEP 2: Check authentication (optional, never blocks)
    // ═══════════════════════════════════════════════════════
    try {
      session = await auth();
      isGuest = !session?.user;
    } catch (authError) {
      console.warn(
        "[Hook Script] Auth check failed, proceeding as guest:",
        authError.message,
      );
      isGuest = true;
    }

    console.log("[Hook Script] Starting generation:", {
      contentTopic,
      niche,
      targetEmotion,
      count,
      isGuest,
    });

    // ═══════════════════════════════════════════════════════
    // STEP 3: Find viral content patterns (OPTIONAL)
    // ═══════════════════════════════════════════════════════
    let viralExamples = [];
    try {
      const viralQuery = `viral ${niche} video content ${contentTopic} 2026`;
      const viralResponse = await fetch(
        `${process.env.APP_URL || "http://localhost:3000"}/integrations/google-search/search?q=${encodeURIComponent(viralQuery)}`,
        { method: "GET" },
      );

      if (viralResponse.ok) {
        const viralData = await viralResponse.json();
        viralExamples =
          viralData.items?.slice(0, 8).map((item) => ({
            title: item.title,
            snippet: item.snippet,
          })) || [];
        console.log("[Hook Script] ✓ Viral analysis completed");
      }
    } catch (viralError) {
      console.warn(
        "[Hook Script] ⚠ Viral analysis failed (non-blocking):",
        viralError.message,
      );
      warnings.push(`Viral trend analysis unavailable: ${viralError.message}`);
    }

    // ═══════════════════════════════════════════════════════
    // STEP 4: Generate AI-powered hooks (WITH FALLBACKS)
    // ═══════════════════════════════════════════════════════
    let hooks = [];
    let aiSucceeded = false;

    try {
      console.log(
        "[Hook Script] Attempting Claude AI hook generation via Anthropic API...",
      );

      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY not configured");
      }

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
                content: `You are an expert video hook writer for digital content creators.

Content Topic: ${contentTopic}
Niche: ${niche}
Target Emotion: ${targetEmotion || "curiosity"}

Viral Pattern Examples:
${viralExamples.map((ex, i) => `${i + 1}. ${ex.title}: ${ex.snippet}`).join("\n") || "No examples available"}

Generate ${count} different video hook variations (first 3-5 seconds of a video) that:
1. Stop scrolling IMMEDIATELY with pattern interrupts
2. Use proven engagement triggers (controversy, curiosity gaps, bold claims)
3. Match the language style of viral ${niche} content
4. Create FOMO or urgency
5. Are 5-15 words each
6. Use trending language patterns from 2026

Return ONLY a valid JSON array with this structure — no markdown, no explanation:
[
  {
    "hook": "the actual hook text",
    "pattern": "what makes it work (e.g., 'curiosity gap', 'bold claim', 'controversy')",
    "predictedEngagement": "high"
  }
]

predictedEngagement must be one of: "medium", "high", or "viral".`,
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
      // Anthropic response format: { content: [{ type: 'text', text: '...' }] }
      const rawContent = anthropicResult.content?.[0]?.text || "";
      console.log(
        "[Hook Script] Claude raw response length:",
        rawContent.length,
      );

      // Parse JSON — Claude may include markdown fences
      const jsonMatch = rawContent.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Claude did not return a JSON array");
      const parsedHooks = JSON.parse(jsonMatch[0]);
      hooks = Array.isArray(parsedHooks) ? parsedHooks : [];

      if (hooks.length === 0) {
        throw new Error("Claude returned empty hooks array");
      }

      aiSucceeded = true;
      console.log("[Hook Script] ✓ Claude AI hooks generated:", hooks.length);
    } catch (hookError) {
      console.warn(
        "[Hook Script] ⚠ Claude AI generation failed, using fallback hooks:",
        hookError.message,
      );

      // Generate fallback template hooks
      hooks = [
        {
          hook: `${contentTopic}: You won't believe what happens next`,
          pattern: "curiosity gap",
          predictedEngagement: "medium",
        },
        {
          hook: `Stop scrolling. This ${contentTopic} trick changes everything`,
          pattern: "pattern interrupt",
          predictedEngagement: "medium",
        },
        {
          hook: `${niche} creators don't want you to know this about ${contentTopic}`,
          pattern: "controversy",
          predictedEngagement: "medium",
        },
        {
          hook: `The ${contentTopic} secret that got me 1M views`,
          pattern: "social proof",
          predictedEngagement: "high",
        },
        {
          hook: `I tried ${contentTopic} for 30 days and...`,
          pattern: "curiosity gap",
          predictedEngagement: "medium",
        },
      ].slice(0, Math.min(count, 5));

      warnings.push(
        `AI hook generator unavailable - using template hooks: ${hookError.message}`,
      );
    }

    // ═══════════════════════════════════════════════════════
    // STEP 5: Determine outcome
    // ═══════════════════════════════════════════════════════
    const outcome =
      aiSucceeded && viralExamples.length > 0
        ? "SUCCESS"
        : hooks.length > 0
          ? "DEGRADED-SUCCESS"
          : "DEGRADED-SUCCESS";

    console.log(`[Hook Script] Outcome: ${outcome}`, {
      hooks: hooks.length,
      aiSucceeded,
      viralExamples: viralExamples.length,
    });

    // ═══════════════════════════════════════════════════════
    // STEP 6A: GUEST MODE - Return temporary hooks
    // ═══════════════════════════════════════════════════════
    if (isGuest) {
      console.log("[Hook Script] Guest mode - returning hooks");
      return Response.json({
        success: true,
        outcome,
        isGuest: true,
        hooks: hooks,
        viralReferences: viralExamples,
        savedCount: 0,
        warnings,
        message:
          outcome === "SUCCESS"
            ? "Guest hooks created! Sign in to save and unlock full features."
            : "Hooks created with limited AI. Sign in for full generation power.",
      });
    }

    // ═══════════════════════════════════════════════════════
    // STEP 6B: AUTHENTICATED MODE - Save to database
    // ═══════════════════════════════════════════════════════
    console.log("[Hook Script] Authenticated mode - saving to database");

    try {
      // Get or create profile
      const existingProfile = await sql`
        SELECT * FROM profiles WHERE user_id = ${session.user.id}
      `;

      if (existingProfile.length === 0) {
        const username = session.user.email
          ? session.user.email
              .split("@")[0]
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          : `user_${session.user.id.slice(0, 8)}`;

        const newProfile = await sql`
          INSERT INTO profiles (
            user_id, username, name, bio, role,
            onboarding_completed, subscription_tier
          ) VALUES (
            ${session.user.id}, ${username},
            ${session.user.name || "Creator"}, 'AI content creator', 'both',
            false, 'free'
          )
          RETURNING *
        `;

        userProfile = newProfile[0];
      } else {
        userProfile = existingProfile[0];
      }

      // Save hooks to database
      const savedHooks = [];
      for (const hookData of hooks) {
        const saved = await sql`
          INSERT INTO ai_hook_scripts (
            profile_id, content_topic, hook_text, variations, trend_references,
            engagement_score, metadata
          ) VALUES (
            ${userProfile.id}, ${contentTopic}, ${hookData.hook}, 
            ${hooks.map((h) => h.hook)}, ${viralExamples.map((v) => v.title)},
            ${hookData.predictedEngagement === "viral" ? 95 : hookData.predictedEngagement === "high" ? 85 : 70},
            ${JSON.stringify({ pattern: hookData.pattern, niche, targetEmotion, outcome, warnings })}
          )
          RETURNING *
        `;
        savedHooks.push(saved[0]);
      }

      // Track usage (non-blocking)
      try {
        const monthYear = new Date().toISOString().slice(0, 7);
        await sql`
          INSERT INTO ai_usage_analytics (profile_id, feature_type, month_year, usage_count)
          VALUES (${userProfile.id}, 'hook', ${monthYear}, 1)
          ON CONFLICT (profile_id, feature_type, month_year) 
          DO UPDATE SET usage_count = ai_usage_analytics.usage_count + 1
        `;
      } catch (analyticsError) {
        console.warn(
          "[Hook Script] Analytics tracking failed (non-blocking):",
          analyticsError.message,
        );
      }

      return Response.json({
        success: true,
        outcome,
        isGuest: false,
        hooks: hooks,
        viralReferences: viralExamples,
        savedCount: savedHooks.length,
        warnings,
      });
    } catch (dbError) {
      console.error("[Hook Script] Database error (non-blocking):", dbError);

      // Database failed - return hooks as guest
      warnings.push(`Database unavailable: ${dbError.message}`);

      return Response.json({
        success: true,
        outcome: "DEGRADED-SUCCESS",
        isGuest: true,
        hooks: hooks,
        viralReferences: viralExamples,
        savedCount: 0,
        warnings,
        message:
          "Hooks created but could not be saved. Your content is available for download.",
      });
    }
  } catch (unexpectedError) {
    console.error("[Hook Script] Unexpected error:", unexpectedError);

    // Emergency fallback: Return basic hooks if we have the topic
    if (formData?.contentTopic && formData?.niche) {
      warnings.push(`Unexpected error: ${unexpectedError.message}`);

      const fallbackHooks = [
        {
          hook: `${formData.contentTopic}: The truth nobody tells you`,
          pattern: "curiosity gap",
          predictedEngagement: "medium",
        },
        {
          hook: `This ${formData.niche} secret will blow your mind`,
          pattern: "bold claim",
          predictedEngagement: "medium",
        },
      ];

      return Response.json({
        success: true,
        outcome: "DEGRADED-SUCCESS",
        isGuest: true,
        hooks: fallbackHooks,
        viralReferences: [],
        savedCount: 0,
        warnings,
        message:
          "Hook generation encountered issues but we created basic hooks for you.",
      });
    }

    // Only hard fail if we have absolutely nothing
    return Response.json(
      {
        success: false,
        error: "Failed to process hook generation request",
        details: unexpectedError.message || "An unexpected error occurred",
        isGuest: isGuest,
      },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch user's hook script history
 */
export async function GET(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      return Response.json({
        success: true,
        hooks: [],
        isGuest: true,
      });
    }

    if (!session?.user) {
      return Response.json({
        success: true,
        hooks: [],
        isGuest: true,
      });
    }

    const profile = await sql`
      SELECT * FROM profiles WHERE user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({
        success: true,
        hooks: [],
        isGuest: false,
      });
    }

    const hooks = await sql`
      SELECT * FROM ai_hook_scripts
      WHERE profile_id = ${profile[0].id}
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return Response.json({
      success: true,
      hooks,
      isGuest: false,
    });
  } catch (error) {
    console.error("[Hook Script History] Error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch history",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH: Toggle favorite status
 */
export async function PATCH(request) {
  try {
    let session;
    try {
      session = await auth();
    } catch (authError) {
      console.error("[Hook Script AI] PATCH Auth error:", authError.message);
      return Response.json(
        { error: "Authentication service unavailable" },
        { status: 503 },
      );
    }

    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hookId, isFavorite } = await request.json();

    const updated = await sql`
      UPDATE ai_hook_scripts
      SET is_favorite = ${isFavorite}
      WHERE id = ${hookId}
      RETURNING *
    `;

    return Response.json({ success: true, hook: updated[0] });
  } catch (error) {
    console.error("[Hook Script AI] PATCH Error:", error);
    return Response.json({ error: "Failed to update hook" }, { status: 500 });
  }
}
